# SUB PREMIUM

## Current State
Basic playlist system in localStorage with id/name/videoIds/createdAt. Only in MenuPage. No modal to add from player/card. HomePage: Continue Watching, Recommended, Trending, Discover New. No PlaylistPage.

## Requested Changes (Diff)

### Add
- updatedAt + privacy fields to Playlist type
- AddToPlaylistModal: select existing playlist or create new (title + privacy), auto-add video, "Already in playlist" toast if duplicate
- PlaylistPage: full vertical list with remove button per video
- Playlists horizontal row on HomePage below Continue Watching: max 10, thumbnail+count overlay, + button, View more if >10
- Save/bookmark button on VideoCard and VideoPlayerPage
- playlist page type in AppContext + selectedPlaylistId state

### Modify
- playlists.ts: add updatedAt/privacy, prepend videos (newest first), duplicate returns false
- createPlaylist: accept title + privacy params
- HomePage forYou: Continue Watching -> Playlists -> Your Videos -> Liked Videos -> Recommended -> Trending
- AppContext: add playlist to Page type + selectedPlaylistId
- App.tsx: render PlaylistPage for playlist page
- MenuPage: playlist cards navigate to PlaylistPage

### Remove
- Inline accordion expand for playlist videos in MenuPage

## Implementation Plan
1. Update playlists.ts types and logic
2. Update AppContext + App.tsx
3. Build AddToPlaylistModal component
4. Build PlaylistPage component
5. Add Save button to VideoCard and VideoPlayerPage
6. Update HomePage forYou sections
7. Update MenuPage playlist navigation
