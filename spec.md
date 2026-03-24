# SUB PREMIUM

## Current State
The video player has a CC button + Settings panel with subtitle support via real user-uploaded .vtt files. The CC button is always visible (disabled state when no tracks). Settings panel shows Speed, Subtitles (Off/available languages from real tracks), Quality. Language preference is saved to localStorage and auto-applied. No auto-detection or translation exists.

## Requested Changes (Diff)

### Add
- Auto caption language detection system (client-side heuristic: uses video metadata, creator profile language, or app language as a fallback signal — no external API required)
- "Auto (Detected: English)" label shown in the Subtitles section and CC button tooltip when auto-captions are active
- Translation layer: when user picks a non-original language, show "Translating..." overlay briefly (600ms), then switch to that language's caption track (or a simulated translated track if only one .vtt exists)
- Multi-language subtitle menu in Settings → Subtitles:
  - Auto (Original language) — labeled "Auto (Detected: [lang])"
  - English, Hindi, Arabic, Spanish, French, Chinese (shown as translatable options)
  - Populated from real tracks + auto-detected language entry
- CC button label updates to show active language abbreviation when ON (e.g. "CC EN", "CC HI")
- `translating` boolean state to show "Translating..." spinner while switching languages
- Save preferred subtitle language to localStorage; auto-apply on next videos
- `AutoCaptionEngine` utility: detects likely spoken language from video title/description keywords and app language setting, returns a language code

### Modify
- VideoPlayerPage.tsx: integrate auto-detection on video load; update Subtitles submenu to show multi-language list with "Auto" entry at top; add translating state and smooth transition; CC button shows language tag when active
- Settings panel Subtitles section: always show multi-language list (English, Hindi, Arabic, Spanish, French, Chinese + auto-detected); highlight current selection; show "Translating..." during switch
- CC button: show "CC" + language code when ON (e.g. CC·EN), show translating spinner icon during switch

### Remove
- Nothing removed; existing .vtt upload flow stays intact

## Implementation Plan
1. Create `src/frontend/src/utils/autoCaptions.ts` — `detectLanguage(video)` function returning a language code based on heuristics; `SUPPORTED_LANGUAGES` constant list; `getAutoLabel(langCode)` returning display string like "Auto (Detected: English)"
2. Update `VideoPlayerPage.tsx`:
   a. On video load: call `detectLanguage(selectedVideo)` → set `detectedLang` state
   b. Add `translating` state (boolean)
   c. When user selects a subtitle language: set `translating = true`, wait 600ms, then switch track + set `translating = false`
   d. Update Settings Subtitles submenu: show "Auto (Detected: [lang])" at top, then list of supported languages; highlight active
   e. Update CC button: show language code abbreviation when active, show spinning indicator when translating
   f. If no real tracks exist for selected language, gracefully show "Translation unavailable" and keep CC off
3. Smooth fade transition on caption text change (opacity 0 → 1 over 200ms)
