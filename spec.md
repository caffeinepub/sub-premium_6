# SUB PREMIUM

## Current State
The app has a caption system with:
- `CaptionManager` component (upload .vtt or paste transcript)
- `useGetCaptionTracks`, `useSetCaptionTrack`, `useRemoveCaptionTrack` hooks
- VideoPlayerPage fetches caption tracks and renders `<track>` elements
- CC button shows only if `captionTracks.length > 0`
- Settings panel has Subtitles submenu only if tracks exist
- "No captions yet" strip for creators — but clicking "Add Captions" sends to setPage("upload") (wrong)
- CaptionManager is only in UploadPage with empty videoId
- CaptionManager has both "Upload .vtt" and "Paste Transcript" tabs

## Requested Changes (Diff)

### Add
- In-player caption modal: when creator taps "Add Captions", open a Sheet/Dialog containing CaptionManager with the correct `videoId` (not navigate away)
- After saving a caption track, invalidate the caption tracks query so CC button and Settings update immediately
- "Add Captions" button visible for video creator below the player when no tracks exist

### Modify
- CaptionManager: Remove the "Paste Transcript" tab entirely — only allow real .vtt file upload. This prevents any fake/auto-generated captions.
- CaptionManager: After a track is saved, trigger a callback `onSaved()` so the parent (modal) can close or the player can refresh
- VideoPlayerPage: Change the "Add Captions" button `onClick` from `setPage("upload")` to open a local state caption modal (`captionModalOpen`)
- VideoPlayerPage: Import CaptionManager and render it inside a Sheet/Dialog when `captionModalOpen === true`
- "No captions yet" strip: keep showing for creator (already working), just fix the button action

### Remove
- "Paste Transcript" tab from CaptionManager (eliminates fake caption generation path)
- Navigation to upload page from the "Add Captions" player button

## Implementation Plan
1. Update `CaptionManager` component:
   - Remove the Paste Transcript tab and all related state (transcript, durationMins, previewVtt, previewCaptions, handlePreview)
   - Remove the `transcriptToVtt` function export or keep it but don't expose it in UI
   - Add optional `onSaved?: () => void` prop — call it after successful `setTrack.mutateAsync`
   - Keep multi-language chips, .vtt upload, existing tracks list, remove track button

2. Update `VideoPlayerPage`:
   - Add `captionModalOpen` state (boolean)
   - Import `CaptionManager` and `Sheet/SheetContent/SheetHeader/SheetTitle` from shadcn
   - Change the "Add Captions" button onClick to `setCaptionModalOpen(true)` instead of `setPage("upload")`
   - Render a Sheet at the bottom with `<CaptionManager videoId={selectedVideo.id} onSaved={() => setCaptionModalOpen(false)} />`
   - After save, the caption tracks query auto-refetches via react-query, updating CC button visibility and Settings subtitles list
