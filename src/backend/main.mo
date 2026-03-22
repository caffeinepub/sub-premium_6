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
  let COOLDOWN_NANOS : Int = 30_000_000_000; // 30 seconds
  let DAY_NANOS : Int = 86_400_000_000_000; // 24 hours
  let RAPID_WINDOW_NANOS : Int = 300_000_000_000; // 5 minutes
  let TEMP_BLOCK_NANOS : Int = 3_600_000_000_000; // 1 hour

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

  let creatorTiers = Map.empty<Principal, CreatorTier>();
  let profiles = Map.empty<Principal, UserProfile>();
  let videos = Map.empty<Text, Video>();
  let captionTracks = Map.empty<Text, [CaptionTrack]>();
  let userSettings = Map.empty<Principal, UserSettings>();
  let watchHistory = Map.empty<Principal, [VideoView]>();
  let uploadLimits = Map.empty<Principal, UploadLimits>();
  // subscriptions: subscriber principal -> array of creator principals they follow
  let subscriptions = Map.empty<Principal, [Principal]>();

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

    // Reset daily count if 24h has passed
    let dailyCount = if (now - limits.dailyResetTime > DAY_NANOS) {
      0
    } else {
      limits.dailyCount
    };

    {
      tier;
      totalUploads = limits.totalUploads;
      dailyCount;
      dailyLimit = getDailyLimit(caller);
      lastUploadTime = limits.lastUploadTime;
    };
  };

  public shared ({ caller }) func verifyCreator(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can verify creators");
    };
    creatorTiers.add(user, #verified);
  };

  // ── Upload Limits API ────────────────────────────────────────────────

  func getOrDefaultLimits(user : Principal) : UploadLimits {
    switch (uploadLimits.get(user)) {
      case (?l) { l };
      case (null) {
        {
          dailyCount = 0;
          dailyResetTime = Time.now();
          lastUploadTime = 0;
          totalStorageBytes = 0;
          tempBlockUntil = 0;
          totalUploads = 0;
        };
      };
    };
  };

  public query ({ caller }) func checkUploadPermission() : async UploadPermission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    computePermission(caller);
  };

  public query ({ caller }) func getUploadStats() : async UploadPermission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    computePermission(caller);
  };

  public shared ({ caller }) func addStorageUsage(bytes : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let limits = getOrDefaultLimits(caller);
    uploadLimits.add(caller, { limits with totalStorageBytes = limits.totalStorageBytes + bytes });
  };

  func computePermission(user : Principal) : UploadPermission {
    let now = Time.now();
    var limits = getOrDefaultLimits(user);

    // Reset daily count if 24h has passed
    if (now - limits.dailyResetTime > DAY_NANOS) {
      limits := {
        limits with
        dailyCount = 0;
        dailyResetTime = now;
      };
    };

    // Check temp block
    if (limits.tempBlockUntil > now) {
      let remaining = Int.abs(limits.tempBlockUntil - now) / 1_000_000_000;
      return {
        allowed = false;
        reason = "Uploads temporarily blocked due to rapid activity. Try again in " # remaining.toText() # " seconds.";
        dailyCount = limits.dailyCount;
        dailyLimit = getDailyLimit(user);
        cooldownRemaining = 0;
        storageUsedBytes = limits.totalStorageBytes;
        tempBlockRemaining = remaining;
      };
    };

    // Check daily limit
    let dailyLimit = getDailyLimit(user);
    if (limits.dailyCount >= dailyLimit) {
      return {
        allowed = false;
        reason = "Daily upload limit reached (" # dailyLimit.toText() # " uploads/day). Resets in 24 hours.";
        dailyCount = limits.dailyCount;
        dailyLimit;
        cooldownRemaining = 0;
        storageUsedBytes = limits.totalStorageBytes;
        tempBlockRemaining = 0;
      };
    };

    // Check cooldown
    if (limits.lastUploadTime > 0) {
      let elapsed = now - limits.lastUploadTime;
      if (elapsed < COOLDOWN_NANOS) {
        let remaining = Int.abs(COOLDOWN_NANOS - elapsed) / 1_000_000_000;
        return {
          allowed = false;
          reason = "Please wait " # remaining.toText() # " seconds before uploading again.";
          dailyCount = limits.dailyCount;
          dailyLimit;
          cooldownRemaining = remaining;
          storageUsedBytes = limits.totalStorageBytes;
          tempBlockRemaining = 0;
        };
      };
    };

    {
      allowed = true;
      reason = "";
      dailyCount = limits.dailyCount;
      dailyLimit;
      cooldownRemaining = 0;
      storageUsedBytes = limits.totalStorageBytes;
      tempBlockRemaining = 0;
    };
  };

  func getDailyLimit(user : Principal) : Nat {
    switch (creatorTiers.get(user)) {
      case (null) { 5 }; // new_user default
      case (?tier) {
        switch (tier) {
          case (#new_user) { 5 };
          case (#active) { 15 };
          case (#verified) { 30 };
        };
      };
    };
  };

  // tracks this upload for abuse detection and stats

  func recordUploadInternal(user : Principal, videoId : Text) {
    let now = Time.now();
    var limits = getOrDefaultLimits(user);

    // Reset daily count if 24h has passed
    if (now - limits.dailyResetTime > DAY_NANOS) {
      limits := {
        limits with
        dailyCount = 0;
        dailyResetTime = now;
      };
    };

    let newDailyCount = limits.dailyCount + 1;
    let newTotalUploads = limits.totalUploads + 1;

    // Rapid upload abuse detection threshold and window
    let rapidThreshold = switch (creatorTiers.get(user)) {
      case (?tier) {
        switch (tier) {
          case (#new_user) { 3 };
          case (#active) { 6 };
          case (#verified) { 10 };
        };
      };
      case (null) { 3 };
    };

    var newTempBlockUntil = limits.tempBlockUntil;
    if (newDailyCount >= rapidThreshold) {
      let windowElapsed = now - limits.dailyResetTime;
      if (windowElapsed < RAPID_WINDOW_NANOS) {
        newTempBlockUntil := now + TEMP_BLOCK_NANOS;
      };
    };

    uploadLimits.add(user, {
      limits with
      dailyCount = newDailyCount;
      lastUploadTime = now;
      tempBlockUntil = newTempBlockUntil;
      totalUploads = newTotalUploads;
    });

    // Tier promotion logic
    let currentTier = switch (creatorTiers.get(user)) {
      case (?tier) { tier };
      case (null) { #new_user };
    };

    if (currentTier == #new_user and newTotalUploads >= 7) {
      creatorTiers.add(user, #active);
    };
  };

  // ── User Profile Functions ───────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  // Public profile — no auth restriction, for channel pages
  public query func getPublicProfile(creatorId : Principal) : async ?UserProfile {
    profiles.get(creatorId);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  // ── Video Functions ──────────────────────────────────────────────────

  public shared ({ caller }) func uploadVideo(
    id : Text,
    title : Text,
    videoBlob : Storage.ExternalBlob,
    thumbnailBlob : Storage.ExternalBlob,
    description : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload videos");
    };

    // Check upload permission
    let perm = computePermission(caller);
    if (not perm.allowed) {
      Runtime.trap("Upload limit reached: " # perm.reason);
    };

    // Record this upload against the user's limits
    recordUploadInternal(caller, id);

    let creatorId = caller.toText();
    let videoId = id;

    let video : Video = {
      id = videoId;
      title;
      description;
      creatorId;
      creatorName = switch (profiles.get(caller)) {
        case (null) { "" };
        case (?profile) { profile.displayName };
      };
      qualityLevel = "";
      videoBlob;
      thumbnailBlob;
      views = 0;
      uploadTime = Time.now();
      status = "uploading";
      captionVtt = "";
    };

    videos.add(videoId, video);
    videoId;
  };

  public shared ({ caller }) func updateVideoMetadata(
    videoId : Text,
    newTitle : Text,
    newThumbnailBlob : Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update video metadata");
    };
    switch (videos.get(videoId)) {
      case (null) {
        Runtime.trap("Video not found");
      };
      case (?video) {
        let isOwner = video.creatorId == caller.toText();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        if (not (isOwner or isAdmin)) {
          Runtime.trap("Unauthorized: Only the creator or admin can update metadata");
        };

        let updatedVideo : Video = {
          video with
          title = newTitle;
          thumbnailBlob = newThumbnailBlob;
        };
        videos.add(videoId, updatedVideo);
      };
    };
  };

  public shared ({ caller }) func updateVideoStatus(videoId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update video status");
    };
    switch (videos.get(videoId)) {
      case (null) {
        Runtime.trap("Video not found");
      };
      case (?video) {
        let isOwner = video.creatorId == caller.toText();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        if (not (isOwner or isAdmin)) {
          Runtime.trap("Unauthorized: Only the video owner can update its status");
        };
        let updatedVideo : Video = { video with status };
        videos.add(videoId, updatedVideo);
      };
    };
  };

  public shared ({ caller }) func updateVideoQuality(videoId : Text, quality : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update video quality");
    };

    switch (videos.get(videoId)) {
      case (null) {
        Runtime.trap("Video not found");
      };
      case (?video) {
        let isOwner = video.creatorId == caller.toText();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        if (not (isOwner or isAdmin)) {
          Runtime.trap("Unauthorized: Only video owner or admin can change quality");
        };

        let updatedVideo : Video = { video with qualityLevel = quality };
        videos.add(videoId, updatedVideo);
      };
    };
  };

  public shared ({ caller }) func deleteVideo(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete videos");
    };

    switch (videos.get(videoId)) {
      case (null) {
        Runtime.trap("Video not found");
      };
      case (?video) {
        let isOwner = video.creatorId == caller.toText();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        if (not (isOwner or isAdmin)) {
          Runtime.trap("Unauthorized: Only video owner or admin can delete videos");
        };

        videos.remove(videoId);
        captionTracks.remove(videoId);
      };
    };
  };

  public query func listReadyVideos() : async [Video] {
    videos.values().toArray().filter(func(video) { video.status == "ready" });
  };

  public query func listAllVideos() : async [Video] {
    videos.values().toArray();
  };

  public query func searchVideos(searchTerm : Text) : async [Video] {
    videos.values().toArray().filter(func(video) { video.title.contains(#text searchTerm) });
  };

  // Public query: get all videos by a creator (by creatorId text)
  public query func getVideosByCreator(creatorId : Text) : async [Video] {
    videos.values().toArray().filter(func(video) { video.creatorId == creatorId });
  };

  public shared func incrementViews(videoId : Text) : async () {
    switch (videos.get(videoId)) {
      case (null) {
        Runtime.trap("Video not found");
      };
      case (?video) {
        let updatedVideo : Video = { video with views = video.views + 1 };
        videos.add(videoId, updatedVideo);
      };
    };
  };

  // ── Caption Functions ────────────────────────────────────────────────

  public shared ({ caller }) func setCaptionTrack(videoId : Text, language : Text, captionLabel : Text, vtt : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add captions");
    };

    switch (videos.get(videoId)) {
      case (null) {
        Runtime.trap("Video not found");
      };
      case (?video) {
        let isOwner = video.creatorId == caller.toText();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        if (not (isOwner or isAdmin)) {
          Runtime.trap("Unauthorized: Only video owners or admin can add captions");
        };

        let existingTracks = switch (captionTracks.get(videoId)) {
          case (null) { [] };
          case (?tracks) { tracks };
        };

        let newTrack : CaptionTrack = { language; captionLabel; vtt };
        let filteredTracks = existingTracks.filter(func(track) { track.language != language });
        let combinedTracks = [newTrack].concat(filteredTracks);
        captionTracks.add(videoId, combinedTracks);
      };
    };
  };

  public shared ({ caller }) func removeCaptionTrack(videoId : Text, language : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove captions");
    };

    switch (videos.get(videoId)) {
      case (null) {
        Runtime.trap("Video not found");
      };
      case (?video) {
        let isOwner = video.creatorId == caller.toText();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        if (not (isOwner or isAdmin)) {
          Runtime.trap("Unauthorized: Only video owners or admin can remove captions");
        };

        let existingTracks = switch (captionTracks.get(videoId)) {
          case (null) { [] };
          case (?tracks) { tracks };
        };

        let filteredTracks = existingTracks.filter(func(track) { track.language != language });
        captionTracks.add(videoId, filteredTracks);
      };
    };
  };

  public query func getCaptionTracks(videoId : Text) : async [CaptionTrack] {
    switch (captionTracks.get(videoId)) {
      case (null) { [] };
      case (?tracks) { tracks };
    };
  };

  public shared ({ caller }) func updateVideoCaption(videoId : Text, vtt : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update captions");
    };

    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) {
        let isOwner = video.creatorId == caller.toText();
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        if (not (isOwner or isAdmin)) {
          Runtime.trap("Unauthorized: Only video owners or admin can update captions");
        };

        let updatedVideo : Video = { video with captionVtt = vtt };
        videos.add(videoId, updatedVideo);
      };
    };
  };

  public query func getVideoCaption(videoId : Text) : async Text {
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) { video.captionVtt };
    };
  };

  // ── Watch History Functions ──────────────────────────────────────────

  public shared ({ caller }) func updateWatchHistory(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can track watch history");
    };

    let newView : VideoView = { videoId; timestamp = Time.now() };
    let existingHistory = switch (watchHistory.get(caller)) {
      case (null) { [] };
      case (?history) { history };
    };
    // Remove any existing entry with the same videoId (dedup), then prepend new entry
    let deduped = existingHistory.filter(func(v : VideoView) : Bool { v.videoId != videoId });
    watchHistory.add(caller, [newView].concat(deduped));
  };

  public query ({ caller }) func getWatchHistory() : async [VideoView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access watch history");
    };

    switch (watchHistory.get(caller)) {
      case (null) { [] };
      case (?history) { history };
    };
  };

  // ── Settings Functions ───────────────────────────────────────────────

  public shared ({ caller }) func updateSettings(settings : UserSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update settings");
    };
    userSettings.add(caller, settings);
  };

  public query ({ caller }) func getSettings() : async ?UserSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access settings");
    };
    userSettings.get(caller);
  };

  // ── Subscription Functions ───────────────────────────────────────────

  // Subscribe to a creator (caller follows creatorId)
  public shared ({ caller }) func subscribe(creatorId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can subscribe");
    };
    let existing = switch (subscriptions.get(caller)) {
      case (null) { [] };
      case (?list) { list };
    };
    // Prevent duplicates
    let alreadySubscribed = existing.filter(func(p : Principal) : Bool { p == creatorId }).size() > 0;
    if (not alreadySubscribed) {
      subscriptions.add(caller, [creatorId].concat(existing));
    };
  };

  // Unsubscribe from a creator
  public shared ({ caller }) func unsubscribe(creatorId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unsubscribe");
    };
    let existing = switch (subscriptions.get(caller)) {
      case (null) { [] };
      case (?list) { list };
    };
    subscriptions.add(caller, existing.filter(func(p : Principal) : Bool { p != creatorId }));
  };

  // Check if caller is subscribed to creatorId
  public query ({ caller }) func isSubscribed(creatorId : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return false;
    };
    let existing = switch (subscriptions.get(caller)) {
      case (null) { [] };
      case (?list) { list };
    };
    existing.filter(func(p : Principal) : Bool { p == creatorId }).size() > 0;
  };

  // Get total subscriber count for a creator
  public query func getSubscriberCount(creatorId : Principal) : async Nat {
    var count : Nat = 0;
    for ((_, subs) in subscriptions.entries()) {
      for (p in subs.vals()) {
        if (p == creatorId) {
          count += 1;
        };
      };
    };
    count;
  };

  // Get all creator principals the caller subscribes to
  public query ({ caller }) func getSubscriptions() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get subscriptions");
    };
    switch (subscriptions.get(caller)) {
      case (null) { [] };
      case (?list) { list };
    };
  };
};
