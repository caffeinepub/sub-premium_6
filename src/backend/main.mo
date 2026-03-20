import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    displayName : Text;
    username : Text;
    bio : Text;
    avatarBlobId : Text;
  };

  public type Video = {
    id : Text;
    title : Text;
    creatorId : Text;
    creatorName : Text;
    videoBlobId : Storage.ExternalBlob;
    thumbnailBlobId : Storage.ExternalBlob;
    views : Nat;
    uploadTime : Time.Time;
    status : Text;
  };

  public type VideoView = {
    videoId : Text;
    timestamp : Time.Time;
  };

  public type UserSettings = {
    language : Text;
    darkMode : Bool;
  };

  let profiles = Map.empty<Principal, UserProfile>();
  let videos = Map.empty<Text, Video>();
  let userSettings = Map.empty<Principal, UserSettings>();
  let watchHistory = Map.empty<Principal, [VideoView]>();

  func toText(creatorId : Principal) : Text {
    creatorId.toText();
  };

  // User Profile Functions
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

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  // Video Functions
  public shared ({ caller }) func uploadVideo(
    id : Text,
    title : Text,
    videoBlob : Storage.ExternalBlob,
    thumbnailBlob : Storage.ExternalBlob,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload videos");
    };

    let creatorId = toText(caller);
    let videoId = id;

    let video : Video = {
      id = videoId;
      title;
      creatorId;
      creatorName = switch (profiles.get(caller)) {
        case (null) { "" };
        case (?profile) { profile.displayName };
      };
      videoBlobId = videoBlob;
      thumbnailBlobId = thumbnailBlob;
      views = 0;
      uploadTime = Time.now();
      status = "uploading";
    };

    videos.add(videoId, video);
    videoId;
  };

  // Any logged-in user can update their OWN video status
  public shared ({ caller }) func updateVideoStatus(videoId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update video status");
    };
    switch (videos.get(videoId)) {
      case (null) {
        Runtime.trap("Video not found");
      };
      case (?video) {
        let isOwner = video.creatorId == toText(caller);
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        if (not (isOwner or isAdmin)) {
          Runtime.trap("Unauthorized: Only the video owner can update its status");
        };
        let updatedVideo : Video = { video with status };
        videos.add(videoId, updatedVideo);
      };
    };
  };

  public shared ({ caller }) func deleteVideo(videoId : Text) : async () {
    switch (videos.get(videoId)) {
      case (null) {
        Runtime.trap("Video not found");
      };
      case (?video) {
        let isOwner = video.creatorId == toText(caller);
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        if (not (isOwner or isAdmin)) {
          Runtime.trap("Unauthorized: Only video owner or admin can delete videos");
        };

        videos.remove(videoId);
      };
    };
  };

  public query ({ caller }) func listReadyVideos() : async [Video] {
    videos.values().toArray().filter(func(video) { video.status == "ready" });
  };

  public query ({ caller }) func searchVideos(searchTerm : Text) : async [Video] {
    videos.values().toArray().filter(func(video) { video.title.contains(#text searchTerm) });
  };

  public shared ({ caller }) func incrementViews(videoId : Text) : async () {
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

  // Watch History Functions
  public shared ({ caller }) func updateWatchHistory(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can track watch history");
    };

    let newView : VideoView = { videoId; timestamp = Time.now() };
    let existingHistory = switch (watchHistory.get(caller)) {
      case (null) { [] };
      case (?history) { history };
    };
    watchHistory.add(caller, [newView].concat(existingHistory));
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

  // Settings Functions
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
};
