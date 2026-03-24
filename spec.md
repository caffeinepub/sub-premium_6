# SUB PREMIUM

## Current State
The video player has a CC button (always visible), a Settings panel with Subtitles section, and auto-caption language detection based on video title/description heuristics. Subtitles default behavior and smart suggestion system are not implemented. User preferred subtitle language is saved to localStorage.

## Requested Changes (Diff)

### Add
- Smart suggestion banner: when detected video language ≠ user preferred language, show non-intrusive toast/banner: "This video is in Hindi. Watch with English subtitles?" with an "Enable English Subtitles" button
- Subtitles OFF by default on every video load (never auto-enable)
- Settings → Subtitles options: Off, Original (Detected: Language), English, Hindi, Arabic, Spanish, French, Chinese
- Highlight user's saved preferred language in the subtitles settings menu
- "Translating..." overlay when switching subtitle language
- CC button: toggle ON/OFF only — does not change language, only activates/deactivates the current selection

### Modify
- Subtitle initialization: always start OFF, never auto-enable even if preferred language track exists
- Settings subtitle menu: replace current language list with standardized set (Off, Original, English, Hindi, Arabic, Spanish, French, Chinese)
- User memory: save preferred subtitle language; on next video load highlight it in settings but do NOT auto-enable
- CC button behavior: pure toggle (ON/OFF), language is only changed via Settings

### Remove
- Any logic that auto-enables subtitles on video load
- Auto-apply of saved language (save preference for highlight only, not auto-enable)

## Implementation Plan
1. Update VideoPlayerPage / player component: on load, always set all tracks to disabled (OFF)
2. After detecting video language, compare with user preferred language (from localStorage). If different, show smart suggestion banner below player with message and "Enable [Language] Subtitles" button. Tapping the button enables that language and saves preference.
3. Update Settings subtitle menu to show: Off, Original (Detected: [lang]), English, Hindi, Arabic, Spanish, French, Chinese. Highlight saved preferred language with orange indicator.
4. On subtitle language select in Settings: show "Translating..." overlay briefly, then switch track. Save selection as preferred language.
5. CC button: toggle current active language ON/OFF only. If no language selected, tapping CC when tracks exist enables the preferred/detected language. Does not open language picker.
6. Smart suggestion banner auto-dismisses after user acts or dismisses manually.
