# SUB PREMIUM

## Current State
Settings are in a slide-out `SettingsSheet` component opened from the header. It has basic sections: dark mode toggle, language selector, subtitle language, storage management, clear cache, app version, and logout. The MenuPage is the Profile/Settings hub but has no dedicated full-page settings route.

## Requested Changes (Diff)

### Add
- New `settings` page type in AppContext.Page
- New `SettingsPage.tsx` full-page component with 7 structured sections
- Local-storage-backed settings state: notifications toggles, appearance (dark/light, font size S/M/L), app preferences (sound effects, autoplay, captions default)
- Delete account confirmation dialog in Privacy & Security
- Feedback form modal in Support & About
- FAQ accordion in Support & About
- Date/time preferences section (time format 12h/24h, date format, timezone)
- Settings navigation entry in MenuPage

### Modify
- AppContext: add `settings` to Page union type
- App.tsx: render SettingsPage for `page === "settings"`
- MenuPage: add a Settings list item that navigates to the settings page
- Existing SettingsSheet: keep for backward compat but the new page is the primary settings UI

### Remove
- Nothing removed; SettingsSheet kept as fallback

## Implementation Plan
1. Update `AppContext.tsx` — add `"settings"` to the Page type
2. Update `App.tsx` — import and render `SettingsPage` for `page === "settings"`
3. Create `SettingsPage.tsx` with sections:
   - **Account**: avatar, name, username, bio edit (inline) + linked accounts placeholder + save button
   - **Notifications**: master push toggle + sub-toggles (new videos, comments & replies, upload status)
   - **Appearance**: dark/light mode toggle + font size selector (S/M/L, applies CSS var)
   - **Language & Region**: language selector (uses existing I18n system) + date format + time format + timezone
   - **Privacy & Security**: change password placeholder, clear cache button, manage storage link, logout button, delete account (with confirmation dialog)
   - **Support & About**: FAQ accordion (3 items), feedback form (textarea + send), app version v1.0.0, © 2026 SUB PREMIUM
   - **App Preferences**: sound effects toggle, autoplay toggle, captions default ON/OFF
4. Persist all settings to localStorage under a `app_prefs` key; apply instantly
5. Font size: applies `data-fontsize` attribute on `<html>` element; CSS targets it
6. Update MenuPage: add a `Settings` row item that calls `setPage("settings")`
