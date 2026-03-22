# SUB PREMIUM

## Current State
Fully deployed video streaming platform with dark-themed mobile-first UI. Has Settings sheet, video player with CC support, comments, bottom nav, and app context. No i18n system exists — all UI text is hardcoded in English. Subtitle language preference is not persisted across sessions. Comments have no translation UI.

## Requested Changes (Diff)

### Add
- `src/frontend/src/i18n/` directory with:
  - `index.ts` — i18n context/provider, `useT()` hook, lazy-load logic, fallback to English
  - `locales/en.json`, `fr.json`, `es.json`, `hi.json`, `ar.json` — key-based translation files covering nav, buttons, labels, system messages
- `I18nProvider` wrapping app in `App.tsx`
- Language selector in `SettingsSheet.tsx` — dropdown with English, French, Spanish, Hindi, Arabic; persists to localStorage; applies instantly
- Subtitle language preference stored in localStorage; auto-selects matching CC track on video load
- `CommentItem` component with inline translate button (shown when comment language differs from app language), fade animation for text swap, "Show original" toggle, and cache of translated results in a Map
- `translateComment()` stub function in `i18n/index.ts` — modular, ready for real API swap

### Modify
- `BottomNav.tsx` — use `useT()` for nav labels
- `SettingsSheet.tsx` — add language selector section; use `useT()` for all labels
- `VideoPlayerPage.tsx` — read subtitle language pref from localStorage and auto-select track; persist CC language choice on change
- `Header.tsx` — use `useT()` for search placeholder and icon labels
- `HomePage.tsx` — use `useT()` for section titles
- `MenuPage.tsx` — use `useT()` for menu item labels
- `UploadPage.tsx` — use `useT()` for form labels and buttons
- Comments area in `VideoPlayerPage.tsx` — wrap each comment in `CommentItem` with translate affordance
- `App.tsx` — wrap content in `I18nProvider`

### Remove
- No removals

## Implementation Plan
1. Create translation JSON files (en, fr, es, hi, ar) covering all key UI strings
2. Build `i18n/index.ts` with:
   - `I18nProvider` — reads language from localStorage, lazy-loads locale JSON, provides context
   - `useT()` hook — returns `t(key)` function with English fallback
   - `translateComment(text, targetLang)` — stub returning mock translated text, structured for future API replacement
3. Wrap `AppContent` in `I18nProvider` in `App.tsx`
4. Add language selector to `SettingsSheet.tsx` — instantly updates context + localStorage
5. Apply `useT()` across BottomNav, Header, HomePage, MenuPage, UploadPage, SettingsSheet
6. In VideoPlayerPage, read `subtitleLang` from localStorage on mount; auto-select matching track; persist on CC language change
7. Build `CommentItem` with translate button logic, fade animation, cached translations, and "Show original" toggle
8. Wire `CommentItem` into VideoPlayerPage comments list
