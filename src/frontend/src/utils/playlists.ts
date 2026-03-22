const KEY = "sub_playlists";
const WATCH_LATER_ID = "watch_later";

export type PlaylistPrivacy = "public" | "private";

export interface Playlist {
  id: string;
  name: string; // keep for backward compat
  title: string; // new canonical field
  videoIds: string[]; // newest first (prepend)
  privacy: PlaylistPrivacy;
  createdAt: number;
  updatedAt: number;
}

function ensureWatchLater(playlists: Playlist[]): Playlist[] {
  if (!playlists.find((p) => p.id === WATCH_LATER_ID)) {
    const wl: Playlist = {
      id: WATCH_LATER_ID,
      name: "Watch Later",
      title: "Watch Later",
      videoIds: [],
      privacy: "private",
      createdAt: 0,
      updatedAt: 0,
    };
    return [wl, ...playlists];
  }
  return playlists;
}

export function getPlaylists(): Playlist[] {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? "[]") as Playlist[];
    const migrated = data.map((p) => ({
      ...p,
      title: p.title || p.name || "Untitled",
      privacy: p.privacy || ("public" as PlaylistPrivacy),
      updatedAt: p.updatedAt || p.createdAt || 0,
    }));
    return ensureWatchLater(migrated);
  } catch {
    return ensureWatchLater([]);
  }
}

function savePlaylists(playlists: Playlist[]): void {
  localStorage.setItem(KEY, JSON.stringify(playlists));
}

export function createPlaylist(
  title: string,
  privacy: PlaylistPrivacy = "public",
): Playlist {
  const playlists = getPlaylists();
  const now = Date.now();
  const newPlaylist: Playlist = {
    id: `pl_${now}`,
    name: title,
    title,
    videoIds: [],
    privacy,
    createdAt: now,
    updatedAt: now,
  };
  savePlaylists([...playlists, newPlaylist]);
  return newPlaylist;
}

export function deletePlaylist(id: string): void {
  if (id === WATCH_LATER_ID) return;
  savePlaylists(getPlaylists().filter((p) => p.id !== id));
}

/** Returns true if added, false if already in playlist */
export function addVideoToPlaylist(
  playlistId: string,
  videoId: string,
): boolean {
  let added = false;
  const playlists = getPlaylists().map((p) => {
    if (p.id !== playlistId) return p;
    if (p.videoIds.includes(videoId)) return p; // duplicate, skip
    added = true;
    return { ...p, videoIds: [videoId, ...p.videoIds], updatedAt: Date.now() };
  });
  if (added) savePlaylists(playlists);
  return added;
}

export function removeVideoFromPlaylist(
  playlistId: string,
  videoId: string,
): void {
  const playlists = getPlaylists().map((p) =>
    p.id === playlistId
      ? {
          ...p,
          videoIds: p.videoIds.filter((id) => id !== videoId),
          updatedAt: Date.now(),
        }
      : p,
  );
  savePlaylists(playlists);
}

export function isVideoInPlaylist(
  playlistId: string,
  videoId: string,
): boolean {
  return !!getPlaylists()
    .find((p) => p.id === playlistId)
    ?.videoIds.includes(videoId);
}

export function isVideoInAnyPlaylist(videoId: string): boolean {
  return getPlaylists().some((p) => p.videoIds.includes(videoId));
}
