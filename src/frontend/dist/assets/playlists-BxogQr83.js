const KEY = "sub_playlists";
const WATCH_LATER_ID = "watch_later";
function ensureWatchLater(playlists) {
  if (!playlists.find((p) => p.id === WATCH_LATER_ID)) {
    const wl = {
      id: WATCH_LATER_ID,
      name: "Watch Later",
      title: "Watch Later",
      videoIds: [],
      privacy: "private",
      createdAt: 0,
      updatedAt: 0
    };
    return [wl, ...playlists];
  }
  return playlists;
}
function getPlaylists() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const migrated = data.map((p) => ({
      ...p,
      title: p.title || p.name || "Untitled",
      privacy: p.privacy || "public",
      updatedAt: p.updatedAt || p.createdAt || 0
    }));
    return ensureWatchLater(migrated);
  } catch {
    return ensureWatchLater([]);
  }
}
function savePlaylists(playlists) {
  localStorage.setItem(KEY, JSON.stringify(playlists));
}
function createPlaylist(title, privacy = "public") {
  const playlists = getPlaylists();
  const now = Date.now();
  const newPlaylist = {
    id: `pl_${now}`,
    name: title,
    title,
    videoIds: [],
    privacy,
    createdAt: now,
    updatedAt: now
  };
  savePlaylists([...playlists, newPlaylist]);
  return newPlaylist;
}
function deletePlaylist(id) {
  if (id === WATCH_LATER_ID) return;
  savePlaylists(getPlaylists().filter((p) => p.id !== id));
}
function addVideoToPlaylist(playlistId, videoId) {
  let added = false;
  const playlists = getPlaylists().map((p) => {
    if (p.id !== playlistId) return p;
    if (p.videoIds.includes(videoId)) return p;
    added = true;
    return { ...p, videoIds: [videoId, ...p.videoIds], updatedAt: Date.now() };
  });
  if (added) savePlaylists(playlists);
  return added;
}
function removeVideoFromPlaylist(playlistId, videoId) {
  const playlists = getPlaylists().map(
    (p) => p.id === playlistId ? {
      ...p,
      videoIds: p.videoIds.filter((id) => id !== videoId),
      updatedAt: Date.now()
    } : p
  );
  savePlaylists(playlists);
}
function isVideoInPlaylist(playlistId, videoId) {
  var _a;
  return !!((_a = getPlaylists().find((p) => p.id === playlistId)) == null ? void 0 : _a.videoIds.includes(videoId));
}
function isVideoInAnyPlaylist(videoId) {
  return getPlaylists().some((p) => p.videoIds.includes(videoId));
}
export {
  addVideoToPlaylist as a,
  isVideoInAnyPlaylist as b,
  createPlaylist as c,
  deletePlaylist as d,
  getPlaylists as g,
  isVideoInPlaylist as i,
  removeVideoFromPlaylist as r
};
