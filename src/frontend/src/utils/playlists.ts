const KEY = "sub_playlists";
const WATCH_LATER_ID = "watch_later";

export interface Playlist {
  id: string;
  name: string;
  videoIds: string[];
  createdAt: number;
}

function ensureWatchLater(playlists: Playlist[]): Playlist[] {
  if (!playlists.find((p) => p.id === WATCH_LATER_ID)) {
    return [
      { id: WATCH_LATER_ID, name: "Watch Later", videoIds: [], createdAt: 0 },
      ...playlists,
    ];
  }
  return playlists;
}

export function getPlaylists(): Playlist[] {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? "[]") as Playlist[];
    return ensureWatchLater(data);
  } catch {
    return ensureWatchLater([]);
  }
}

function savePlaylists(playlists: Playlist[]): void {
  localStorage.setItem(KEY, JSON.stringify(playlists));
}

export function createPlaylist(name: string): Playlist {
  const playlists = getPlaylists();
  const newPlaylist: Playlist = {
    id: `pl_${Date.now()}`,
    name,
    videoIds: [],
    createdAt: Date.now(),
  };
  savePlaylists([...playlists, newPlaylist]);
  return newPlaylist;
}

export function deletePlaylist(id: string): void {
  if (id === WATCH_LATER_ID) return; // cannot delete Watch Later
  const playlists = getPlaylists().filter((p) => p.id !== id);
  savePlaylists(playlists);
}

export function addVideoToPlaylist(playlistId: string, videoId: string): void {
  const playlists = getPlaylists().map((p) =>
    p.id === playlistId && !p.videoIds.includes(videoId)
      ? { ...p, videoIds: [...p.videoIds, videoId] }
      : p,
  );
  savePlaylists(playlists);
}

export function removeVideoFromPlaylist(
  playlistId: string,
  videoId: string,
): void {
  const playlists = getPlaylists().map((p) =>
    p.id === playlistId
      ? { ...p, videoIds: p.videoIds.filter((id) => id !== videoId) }
      : p,
  );
  savePlaylists(playlists);
}

export function isVideoInPlaylist(
  playlistId: string,
  videoId: string,
): boolean {
  const playlist = getPlaylists().find((p) => p.id === playlistId);
  return !!playlist?.videoIds.includes(videoId);
}
