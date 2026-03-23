# SUB PREMIUM

## Current State
VideoPlayerPage.tsx has a working settings panel (⚙️) with Speed, Subtitles (conditional), and Quality sections. The panel uses framer-motion animation (duration: 0.15). Fullscreen targets the `<video>` element via `videoRef`. `hasTracks` is derived from `captionTracks` (backend query). The fullscreen button is top-left, CC + Settings top-right.

## Requested Changes (Diff)

### Add
- A `videoContainerRef` (RefObject<HTMLDivElement>) on the `div.relative.w-full.aspect-video` element
- A `liveHasTracks` state (boolean) that reads from `videoRef.current.textTracks.length > 0` after video loads (on `onLoadedMetadata`), updated in state — use this as the condition for CC button and settings subtitles section in addition to existing `hasTracks`

### Modify
1. **Settings panel animation**: Change `transition={{ duration: 0.15 }}` on the settings panel `motion.div` to `transition={{ duration: 0 }}` so it opens instantly with no delay.
2. **Fullscreen handler**: Change `handleFullscreen` to target `videoContainerRef.current` (the aspect-video div) instead of `videoRef.current`. This ensures controls overlay is included in fullscreen. Keep same API: `requestFullscreen()` / `exitFullscreen()`.
3. **hasTracks check**: The condition `{hasTracks && (...)}` for both the CC button and the subtitles section in settings should use `hasTracks || liveHasTracks` so real text tracks loaded natively are also detected.
4. **Subtitle submenu tracks**: When showing the subtitle language list in the submenu, also pull from `videoRef.current?.textTracks` to detect any natively-loaded tracks not in `captionTracks`. Merge both sources (deduplicate by language code).
5. **Settings panel title**: Add a "Settings" header row at the top of the settings panel (text: "Settings", small, white/60, uppercase tracking-wide) to make it clear this is the settings panel.

### Remove
- Nothing to remove

## Implementation Plan
1. Add `videoContainerRef = useRef<HTMLDivElement>(null)` near other refs
2. Add `liveHasTracks` state, set it in `onLoadedMetadata` handler by checking `e.currentTarget.textTracks.length > 0`
3. Attach `ref={videoContainerRef}` to the `div.relative.w-full.aspect-video`
4. Update `handleFullscreen` to use `videoContainerRef.current`
5. Change settings panel `motion.div` transition duration to 0
6. Add "Settings" label at top of settings panel content
7. Update all `hasTracks` checks to `hasTracks || liveHasTracks`
8. In subtitle submenu, merge `captionTracks` with live `videoRef.current.textTracks` array
