import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ── Upload limit constants ───────────────────────────────────────────
  let COOLDOWN_NANOS : Int = 30_000_000_000;
  let DAY_NANOS : Int = 86_400_000_000_000;
  let RAPID_WINDOW_NANOS : Int = 300_000_000_000;
  let TEMP_BLOCK_NANOS : Int = 3_600_000_000_000;

  public type CreatorTier = {
    #new_user;
    #active;
    #verified;
  };

  public type CreatorStats = {
    tier : CreatorTier;
    totalUploads : Nat;
    dailyCount : Nat;
    dailyLimit : Nat;
    lastUploadTime : Time.Time;
  };

  public type UserProfile = {
    displayName : Text;
    username : Text;
    bio : Text;
    avatarBlobId : Text;
  };

  public type CaptionTrack = {
    language : Text;
    captionLabel : Text;
    vtt : Text;
  };

  // ── Engagement types ────────────────────────────────────────────────
  public type Comment = {
    id : Text;
    userId : Text;
    username : Text;
    avatarBlobId : Text;
    text : Text;
    timestamp : Time.Time;
  };

  public type VideoEngagement = {
    viewCount : Nat;
    likeCount : Nat;
    dislikeCount : Nat;
    userReaction : Text; // "like" | "dislike" | "none"
    isLiked : Bool;
    comments : [Comment];
  };

  // Internal stored type
  type VideoData = {
    id : Text;
    title : Text;
    description : Text;
    creatorId : Text;
    creatorName : Text;
    qualityLevel : Text;
    videoBlob : Storage.ExternalBlob;
    thumbnailBlob : Storage.ExternalBlob;
    views : Nat;
    uploadTime : Time.Time;
    status : Text;
    captionVtt : Text;
  };

  // Public type returned by all queries
  public type Video = {
    id : Text;
    title : Text;
    description : Text;
    creatorId : Text;
    creatorName : Text;
    qualityLevel : Text;
    videoBlob : Storage.ExternalBlob;
    thumbnailBlob : Storage.ExternalBlob;
    views : Nat;
    uploadTime : Time.Time;
    status : Text;
    captionVtt : Text;
    scheduledPublishTime : ?Time.Time;
  };

  public type VideoView = {
    videoId : Text;
    timestamp : Time.Time;
  };

  public type UserSettings = {
    language : Text;
    darkMode : Bool;
  };

  public type UploadLimits = {
    dailyCount : Nat;
    dailyResetTime : Time.Time;
    lastUploadTime : Time.Time;
    totalStorageBytes : Nat;
    tempBlockUntil : Time.Time;
    totalUploads : Nat;
  };

  public type UploadPermission = {
    allowed : Bool;
    reason : Text;
    dailyCount : Nat;
    dailyLimit : Nat;
    cooldownRemaining : Nat;
    storageUsedBytes : Nat;
    tempBlockRemaining : Nat;
  };

  // ── STABLE persistent maps (survive canister upgrades) ──────────────
  stable var creatorTiers = Map.empty<Principal, CreatorTier>();
  stable var profiles = Map.empty<Principal, UserProfile>();
  stable var videos = Map.empty<Text, VideoData>();
  stable var videoSchedules = Map.empty<Text, Time.Time>();
  stable var captionTracks = Map.empty<Text, [CaptionTrack]>();
  stable var userSettings = Map.empty<Principal, UserSettings>();
  stable var watchHistory = Map.empty<Principal, [VideoView]>();
  stable var uploadLimits = Map.empty<Principal, UploadLimits>();
  stable var subscriptions = Map.empty<Principal, [Principal]>();

  // ── Engagement stable maps ─────────────────────────────────────────
  // videoId -> list of userIds (Text) who have viewed
  stable var videoViewers = Map.empty<Text, [Text]>();
  // videoId -> list of userIds (Text) who liked
  stable var videoLikes = Map.empty<Text, [Text]>();
  // videoId -> list of userIds (Text) who disliked
  stable var videoDislikes = Map.empty<Text, [Text]>();
  // videoId -> list of comments
  stable var videoComments = Map.empty<Text, [Comment]>();

  // Merge VideoData + scheduled time into public Video type
  func toVideo(data : VideoData) : Video {
    {
      id = data.id;
      title = data.title;
      description = data.description;
      creatorId = data.creatorId;
      creatorName = data.creatorName;
      qualityLevel = data.qualityLevel;
      videoBlob = data.videoBlob;
      thumbnailBlob = data.thumbnailBlob;
      views = data.views;
      uploadTime = data.uploadTime;
      status = data.status;
      captionVtt = data.captionVtt;
      scheduledPublishTime = videoSchedules.get(data.id);
    };
  };

  func isVideoPublic(data : VideoData) : Bool {
    let now = Time.now();
    switch (videoSchedules.get(data.id)) {
      case (null) { data.status == "ready" };
      case (?t) { now >= t };
    };
  };

  // ── Creator tier ───────────────────────────────────────────────────

  public query ({ caller }) func getCreatorTier(user : Principal) : async CreatorTier {
    switch (creatorTiers.get(user)) {
      case (?tier) { tier };
      case (null) { #new_user };
    };
  };

  public query ({ caller }) func getCreatorStats() : async CreatorStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access creator stats");
    };
    let tier = switch (creatorTiers.get(caller)) {
      case (?t) { t };
      case (null) { #new_user };
    };
    let limits = getOrDefaultLimits(caller);
    let now = Time.now();
    let dailyCount = if (now - limits.dailyResetTime > DAY_NANOS) { 0 } else { limits.dailyCount };
    { tier; totalUploads = limits.totalUploads; dailyCount; dailyLimit = getDailyLimit(caller); lastUploadTime = limits.lastUploadTime };
  };

  public shared ({ caller }) func verifyCreator(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can verify creators");
    };
    creatorTiers.add(user, #verified);
  };

  // ── Upload limits ───────────────────────────────────────────────────

  func getOrDefaultLimits(user : Principal) : UploadLimits {
    switch (uploadLimits.get(user)) {
      case (?l) { l };
      case (null) {
        { dailyCount = 0; dailyResetTime = Time.now(); lastUploadTime = 0; totalStorageBytes = 0; tempBlockUntil = 0; totalUploads = 0 };
      };
    };
  };

  public query ({ caller }) func checkUploadPermission() : async UploadPermission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    computePermission(caller);
  };

  public query ({ caller }) func getUploadStats() : async UploadPermission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    computePermission(caller);
  };

  public shared ({ caller }) func addStorageUsage(bytes : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    let limits = getOrDefaultLimits(caller);
    uploadLimits.add(caller, { limits with totalStorageBytes = limits.totalStorageBytes + bytes });
  };

  func computePermission(user : Principal) : UploadPermission {
    let now = Time.now();
    var limits = getOrDefaultLimits(user);
    if (now - limits.dailyResetTime > DAY_NANOS) {
      limits := { limits with dailyCount = 0; dailyResetTime = now };
    };
    if (limits.tempBlockUntil > now) {
      let remaining = Int.abs(limits.tempBlockUntil - now) / 1_000_000_000;
      return { allowed = false; reason = "Uploads temporarily blocked. Try again in " # remaining.toText() # " seconds."; dailyCount = limits.dailyCount; dailyLimit = getDailyLimit(user); cooldownRemaining = 0; storageUsedBytes = limits.totalStorageBytes; tempBlockRemaining = remaining };
    };
    let dailyLimit = getDailyLimit(user);
    if (limits.dailyCount >= dailyLimit) {
      return { allowed = false; reason = "Daily upload limit reached."; dailyCount = limits.dailyCount; dailyLimit; cooldownRemaining = 0; storageUsedBytes = limits.totalStorageBytes; tempBlockRemaining = 0 };
    };
    if (limits.lastUploadTime > 0) {
      let elapsed = now - limits.lastUploadTime;
      if (elapsed < COOLDOWN_NANOS) {
        let remaining = Int.abs(COOLDOWN_NANOS - elapsed) / 1_000_000_000;
        return { allowed = false; reason = "Please wait " # remaining.toText() # " seconds before uploading again."; dailyCount = limits.dailyCount; dailyLimit; cooldownRemaining = remaining; storageUsedBytes = limits.totalStorageBytes; tempBlockRemaining = 0 };
      };
    };
    { allowed = true; reason = ""; dailyCount = limits.dailyCount; dailyLimit; cooldownRemaining = 0; storageUsedBytes = limits.totalStorageBytes; tempBlockRemaining = 0 };
  };

  func getDailyLimit(user : Principal) : Nat {
    switch (creatorTiers.get(user)) {
      case (null) { 5 };
      case (?tier) { switch (tier) { case (#new_user) { 5 }; case (#active) { 15 }; case (#verified) { 30 } } };
    };
  };

  func recordUploadInternal(user : Principal, videoId : Text) {
    let now = Time.now();
    var limits = getOrDefaultLimits(user);
    if (now - limits.dailyResetTime > DAY_NANOS) {
      limits := { limits with dailyCount = 0; dailyResetTime = now };
    };
    let newDailyCount = limits.dailyCount + 1;
    let newTotalUploads = limits.totalUploads + 1;
    let rapidThreshold = switch (creatorTiers.get(user)) {
      case (?tier) { switch (tier) { case (#new_user) { 3 }; case (#active) { 6 }; case (#verified) { 10 } } };
      case (null) { 3 };
    };
    var newTempBlockUntil = limits.tempBlockUntil;
    if (newDailyCount >= rapidThreshold) {
      let windowElapsed = now - limits.dailyResetTime;
      if (windowElapsed < RAPID_WINDOW_NANOS) { newTempBlockUntil := now + TEMP_BLOCK_NANOS };
    };
    uploadLimits.add(user, { limits with dailyCount = newDailyCount; lastUploadTime = now; tempBlockUntil = newTempBlockUntil; totalUploads = newTotalUploads });
    let currentTier = switch (creatorTiers.get(user)) { case (?t) { t }; case (null) { #new_user } };
    if (currentTier == #new_user and newTotalUploads >= 7) { creatorTiers.add(user, #active) };
  };

  // ── User Profile ───────────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized") };
    profiles.get(user);
  };

  public query func getPublicProfile(creatorId : Principal) : async ?UserProfile {
    profiles.get(creatorId);
  };

  public type ProfileEntry = {
    principalId : Text;
    profile : UserProfile;
  };

  public query func listAllProfiles() : async [ProfileEntry] {
    profiles.entries().toArray().map(func((p, prof) : (Principal, UserProfile)) : ProfileEntry {
      { principalId = p.toText(); profile = prof };
    });
  };

  // Safe upsert: only write fields that are non-empty, preserving existing data
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    let existing = profiles.get(caller);
    let merged : UserProfile = switch (existing) {
      case (null) { profile };
      case (?ex) {
        {
          displayName = if (profile.displayName != "") { profile.displayName } else { ex.displayName };
          username = if (profile.username != "") { profile.username } else { ex.username };
          bio = if (profile.bio != "") { profile.bio } else { ex.bio };
          avatarBlobId = if (profile.avatarBlobId != "") { profile.avatarBlobId } else { ex.avatarBlobId };
        };
      };
    };
    profiles.add(caller, merged);
  };

  // ── Video Functions ─────────────────────────────────────────────────────

  public shared ({ caller }) func uploadVideo(
    id : Text,
    title : Text,
    videoBlob : Storage.ExternalBlob,
    thumbnailBlob : Storage.ExternalBlob,
    description : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    let perm = computePermission(caller);
    if (not perm.allowed) { Runtime.trap("Upload limit reached: " # perm.reason) };
    recordUploadInternal(caller, id);
    // Preserve existing video if it already exists (re-upload safety)
    switch (videos.get(id)) {
      case (?_existing) {
        // Video already exists — do not overwrite
        return id;
      };
      case (null) {};
    };
    let data : VideoData = {
      id;
      title;
      description;
      creatorId = caller.toText();
      creatorName = switch (profiles.get(caller)) { case (null) { "" }; case (?p) { p.displayName } };
      qualityLevel = "";
      videoBlob;
      thumbnailBlob;
      views = 0;
      uploadTime = Time.now();
      status = "uploading";
      captionVtt = "";
    };
    videos.add(id, data);
    id;
  };

  public shared ({ caller }) func updateVideoMetadata(videoId : Text, newTitle : Text, newThumbnailBlob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?data) {
        if (data.creatorId != caller.toText() and not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized") };
        videos.add(videoId, { data with title = newTitle; thumbnailBlob = newThumbnailBlob });
      };
    };
  };

  public shared ({ caller }) func updateVideoStatus(videoId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?data) {
        if (data.creatorId != caller.toText() and not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized") };
        videos.add(videoId, { data with status });
      };
    };
  };

  public shared ({ caller }) func updateVideoQuality(videoId : Text, quality : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?data) {
        if (data.creatorId != caller.toText() and not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized") };
        videos.add(videoId, { data with qualityLevel = quality });
      };
    };
  };

  public shared ({ caller }) func deleteVideo(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?data) {
        if (data.creatorId != caller.toText() and not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized") };
        videos.remove(videoId);
        captionTracks.remove(videoId);
        videoSchedules.remove(videoId);
        videoViewers.remove(videoId);
        videoLikes.remove(videoId);
        videoComments.remove(videoId);
      };
    };
  };

  public query func listReadyVideos() : async [Video] {
    videos.values().toArray()
      .filter(func(d : VideoData) : Bool { isVideoPublic(d) })
      .map(toVideo);
  };

  public query func listAllVideos() : async [Video] {
    videos.values().toArray().map(toVideo);
  };

  public query func searchVideos(searchTerm : Text) : async [Video] {
    videos.values().toArray()
      .filter(func(d : VideoData) : Bool { isVideoPublic(d) and d.title.contains(#text searchTerm) })
      .map(toVideo);
  };

  public query func getVideosByCreator(creatorId : Text) : async [Video] {
    videos.values().toArray()
      .filter(func(d : VideoData) : Bool { d.creatorId == creatorId })
      .map(toVideo);
  };

  // Legacy — kept for compatibility
  public shared func incrementViews(videoId : Text) : async () {
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?data) { videos.add(videoId, { data with views = data.views + 1 }) };
    };
  };

  // ── Engagement: Views ─────────────────────────────────────────────

  // Record a view only once per user. Caller must be authenticated.
  public shared ({ caller }) func recordView(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    let callerId = caller.toText();
    let viewers = switch (videoViewers.get(videoId)) { case (null) { [] }; case (?v) { v } };
    let alreadyViewed = viewers.filter(func(uid : Text) : Bool { uid == callerId }).size() > 0;
    if (not alreadyViewed) {
      videoViewers.add(videoId, [callerId].concat(viewers));
      switch (videos.get(videoId)) {
        case (null) {};
        case (?data) { videos.add(videoId, { data with views = data.views + 1 }) };
      };
    };
  };

  // ── Engagement: Likes ─────────────────────────────────────────────

  public shared ({ caller }) func likeVideo(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    let callerId = caller.toText();
    let likers = switch (videoLikes.get(videoId)) { case (null) { [] }; case (?l) { l } };
    let alreadyLiked = likers.filter(func(uid : Text) : Bool { uid == callerId }).size() > 0;
    if (alreadyLiked) {
      // Toggle off
      videoLikes.add(videoId, likers.filter(func(uid : Text) : Bool { uid != callerId }));
    } else {
      // Add like, remove any dislike
      videoLikes.add(videoId, [callerId].concat(likers));
      let dislikers = switch (videoDislikes.get(videoId)) { case (null) { [] }; case (?d) { d } };
      videoDislikes.add(videoId, dislikers.filter(func(uid : Text) : Bool { uid != callerId }));
    };
  };

  public shared ({ caller }) func unlikeVideo(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    let callerId = caller.toText();
    let likers = switch (videoLikes.get(videoId)) { case (null) { [] }; case (?l) { l } };
    videoLikes.add(videoId, likers.filter(func(uid : Text) : Bool { uid != callerId }));
  };

  public shared ({ caller }) func dislikeVideo(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    let callerId = caller.toText();
    let dislikers = switch (videoDislikes.get(videoId)) { case (null) { [] }; case (?d) { d } };
    let alreadyDisliked = dislikers.filter(func(uid : Text) : Bool { uid == callerId }).size() > 0;
    if (alreadyDisliked) {
      // Toggle off
      videoDislikes.add(videoId, dislikers.filter(func(uid : Text) : Bool { uid != callerId }));
    } else {
      // Add dislike, remove any like
      videoDislikes.add(videoId, [callerId].concat(dislikers));
      let likers = switch (videoLikes.get(videoId)) { case (null) { [] }; case (?l) { l } };
      videoLikes.add(videoId, likers.filter(func(uid : Text) : Bool { uid != callerId }));
    };
  };

  public query func getLikeCount(videoId : Text) : async Nat {
    switch (videoLikes.get(videoId)) { case (null) { 0 }; case (?l) { l.size() } };
  };

  public query ({ caller }) func isLiked(videoId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { return false };
    let callerId = caller.toText();
    let likers = switch (videoLikes.get(videoId)) { case (null) { [] }; case (?l) { l } };
    likers.filter(func(uid : Text) : Bool { uid == callerId }).size() > 0;
  };

  // ── Engagement: Comments ──────────────────────────────────────────

  public shared ({ caller }) func postComment(videoId : Text, text : Text) : async Comment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    if (text == "") { Runtime.trap("Comment text cannot be empty") };
    let callerId = caller.toText();
    let (username, avatarBlobId) = switch (profiles.get(caller)) {
      case (null) { ("Anonymous", "") };
      case (?p) { (p.displayName, p.avatarBlobId) };
    };
    let commentId = callerId # "-" # Time.now().toText();
    let newComment : Comment = {
      id = commentId;
      userId = callerId;
      username;
      avatarBlobId;
      text;
      timestamp = Time.now();
    };
    let existing = switch (videoComments.get(videoId)) { case (null) { [] }; case (?c) { c } };
    videoComments.add(videoId, existing.concat([newComment]));
    newComment;
  };

  public query func getComments(videoId : Text) : async [Comment] {
    switch (videoComments.get(videoId)) { case (null) { [] }; case (?c) { c } };
  };

  public shared ({ caller }) func deleteComment(videoId : Text, commentId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    let callerId = caller.toText();
    let existing = switch (videoComments.get(videoId)) { case (null) { [] }; case (?c) { c } };
    let filtered = existing.filter(func(c : Comment) : Bool {
      if (c.id == commentId) {
        // Only owner or admin can delete
        c.userId != callerId and not AccessControl.isAdmin(accessControlState, caller);
      } else { true };
    });
    videoComments.add(videoId, filtered);
  };

  // ── Combined engagement fetch ──────────────────────────────────────

  public query ({ caller }) func getVideoEngagement(videoId : Text) : async VideoEngagement {
    let viewCount = switch (videos.get(videoId)) { case (null) { 0 }; case (?d) { d.views } };
    let likers = switch (videoLikes.get(videoId)) { case (null) { [] }; case (?l) { l } };
    let dislikers = switch (videoDislikes.get(videoId)) { case (null) { [] }; case (?d) { d } };
    let likeCount = likers.size();
    let dislikeCount = dislikers.size();
    let (isLikedByCaller, userReaction) = if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      let callerId = caller.toText();
      let liked = likers.filter(func(uid : Text) : Bool { uid == callerId }).size() > 0;
      let disliked = dislikers.filter(func(uid : Text) : Bool { uid == callerId }).size() > 0;
      if (liked) { (true, "like") }
      else if (disliked) { (false, "dislike") }
      else { (false, "none") };
    } else { (false, "none") };
    let comments = switch (videoComments.get(videoId)) { case (null) { [] }; case (?c) { c } };
    { viewCount; likeCount; dislikeCount; userReaction; isLiked = isLikedByCaller; comments };
  };

  // ── Scheduling Functions ────────────────────────────────────────────

  public shared ({ caller }) func scheduleVideo(videoId : Text, publishTimeNano : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    if (publishTimeNano <= Time.now()) { Runtime.trap("Scheduled time must be in the future") };
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?data) {
        if (data.creatorId != caller.toText() and not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized") };
        videos.add(videoId, { data with status = "scheduled" });
        videoSchedules.add(videoId, publishTimeNano);
      };
    };
  };

  public shared ({ caller }) func updateSchedule(videoId : Text, publishTimeNano : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    if (publishTimeNano <= Time.now()) { Runtime.trap("Scheduled time must be in the future") };
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?data) {
        if (data.creatorId != caller.toText() and not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized") };
        videoSchedules.add(videoId, publishTimeNano);
      };
    };
  };

  public shared ({ caller }) func cancelSchedule(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?data) {
        if (data.creatorId != caller.toText() and not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized") };
        videos.add(videoId, { data with status = "ready" });
        videoSchedules.remove(videoId);
      };
    };
  };

  public query ({ caller }) func listScheduledVideos() : async [Video] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    let callerIdText = caller.toText();
    videos.values().toArray()
      .filter(func(d : VideoData) : Bool { d.creatorId == callerIdText and d.status == "scheduled" })
      .map(toVideo);
  };

  // ── Caption Functions ────────────────────────────────────────────────

  public shared ({ caller }) func setCaptionTrack(videoId : Text, language : Text, captionLabel : Text, vtt : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?data) {
        if (data.creatorId != caller.toText() and not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized") };
        let existing = switch (captionTracks.get(videoId)) { case (null) { [] }; case (?t) { t } };
        let newTrack : CaptionTrack = { language; captionLabel; vtt };
        let filtered = existing.filter(func(t : CaptionTrack) : Bool { t.language != language });
        captionTracks.add(videoId, [newTrack].concat(filtered));
      };
    };
  };

  public shared ({ caller }) func removeCaptionTrack(videoId : Text, language : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?data) {
        if (data.creatorId != caller.toText() and not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized") };
        let existing = switch (captionTracks.get(videoId)) { case (null) { [] }; case (?t) { t } };
        captionTracks.add(videoId, existing.filter(func(t : CaptionTrack) : Bool { t.language != language }));
      };
    };
  };

  public query func getCaptionTracks(videoId : Text) : async [CaptionTrack] {
    switch (captionTracks.get(videoId)) { case (null) { [] }; case (?t) { t } };
  };

  public shared ({ caller }) func updateVideoCaption(videoId : Text, vtt : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?data) {
        if (data.creatorId != caller.toText() and not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized") };
        videos.add(videoId, { data with captionVtt = vtt });
      };
    };
  };

  public query func getVideoCaption(videoId : Text) : async Text {
    switch (videos.get(videoId)) { case (null) { Runtime.trap("Video not found") }; case (?data) { data.captionVtt } };
  };

  // ── Watch History ──────────────────────────────────────────────────────

  public shared ({ caller }) func updateWatchHistory(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    let newView : VideoView = { videoId; timestamp = Time.now() };
    let existing = switch (watchHistory.get(caller)) { case (null) { [] }; case (?h) { h } };
    let deduped = existing.filter(func(v : VideoView) : Bool { v.videoId != videoId });
    watchHistory.add(caller, [newView].concat(deduped));
  };

  public query ({ caller }) func getWatchHistory() : async [VideoView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    switch (watchHistory.get(caller)) { case (null) { [] }; case (?h) { h } };
  };

  // ── Settings ──────────────────────────────────────────────────────────

  public shared ({ caller }) func updateSettings(settings : UserSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    userSettings.add(caller, settings);
  };

  public query ({ caller }) func getSettings() : async ?UserSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    userSettings.get(caller);
  };

  // ── Subscriptions ──────────────────────────────────────────────────────

  public shared ({ caller }) func subscribe(creatorId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    let existing = switch (subscriptions.get(caller)) { case (null) { [] }; case (?l) { l } };
    let already = existing.filter(func(p : Principal) : Bool { p == creatorId }).size() > 0;
    if (not already) { subscriptions.add(caller, [creatorId].concat(existing)) };
  };

  public shared ({ caller }) func unsubscribe(creatorId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    let existing = switch (subscriptions.get(caller)) { case (null) { [] }; case (?l) { l } };
    subscriptions.add(caller, existing.filter(func(p : Principal) : Bool { p != creatorId }));
  };

  public query ({ caller }) func isSubscribed(creatorId : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { return false };
    let existing = switch (subscriptions.get(caller)) { case (null) { [] }; case (?l) { l } };
    existing.filter(func(p : Principal) : Bool { p == creatorId }).size() > 0;
  };

  public query func getSubscriberCount(creatorId : Principal) : async Nat {
    var count : Nat = 0;
    for ((_, subs) in subscriptions.entries()) {
      for (p in subs.vals()) { if (p == creatorId) { count += 1 } };
    };
    count;
  };

  public query ({ caller }) func getSubscriptions() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) { Runtime.trap("Unauthorized") };
    switch (subscriptions.get(caller)) { case (null) { [] }; case (?l) { l } };
  };
};
