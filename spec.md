# SUB PREMIUM

## Current State
VideoPlayerPage has CC button and Settings panel. CC button is hidden when no tracks exist (`hasTracks || liveHasTracks` guard). Settings panel Subtitles row is also hidden when no tracks exist. Auto-generated captions are not supported.

## Requested Changes (Diff)

### Add
- CC button always visible (never hidden)
- Disabled/low-opacity CC state when no subtitles exist
- "No captions available" toast when tapping CC with no tracks
- "Auto captions unavailable" message in settings Subtitles row when no tracks
- "Upload .vtt" button in settings Subtitles row when no tracks (opens caption upload sheet)
- Save CC ON/OFF state and last selected language to localStorage
- Auto-apply saved language preference on next video load

### Modify
- CC button: remove `(hasTracks || liveHasTracks)` guard — always render, but visually disabled when no tracks
- CC tap behavior: if no tracks → show toast "No captions available"; if tracks exist → toggle ON/OFF
- Settings panel Subtitles row: always shown; if no tracks → show "Auto captions unavailable" + upload .vtt button; if tracks → show Off + available languages
- Subtitles row label: show current status (OFF or language name)

### Remove
- Nothing removed

## Implementation Plan
1. In VideoPlayerPage.tsx, update CC button JSX: remove conditional rendering guard, add `opacity-40 cursor-default` styles when no tracks, change onClick to show toast when no tracks
2. Update Settings panel Subtitles row: remove `(hasTracks || liveHasTracks)` guard, always render row; when no tracks show "Auto captions unavailable" text + upload .vtt button; when tracks exist show existing language picker
3. Ensure localStorage saves CC ON/OFF and selected language
4. Validate and build
