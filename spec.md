# SUB PREMIUM

## Current State
PremierePreviewPage shows a countdown for scheduled (Upcoming) videos with a Subscribe button. App.tsx checks scheduled videos every 60s and fires a toast when they go live. Reminders are not yet implemented.

## Requested Changes (Diff)

### Add
- `reminderUtils.ts` — localStorage-based per-user reminder store: setReminder, removeReminder, hasReminder, getRemindersForVideo
- Set Reminder / Reminder Set toggle button on PremierePreviewPage (bell icon, only shown for upcoming/not-yet-live videos)
- When countdown hits 0, check localStorage reminders and fire toast: "Video is now live" for each subscribed user
- Login prompt if user is not authenticated and taps Set Reminder

### Modify
- `PremierePreviewPage.tsx` — add reminder button UI and logic
- `App.tsx` — extend the 60s scheduler to also check reminder entries and fire notifications

### Remove
- Nothing

## Implementation Plan
1. Create `src/frontend/src/utils/reminderUtils.ts` with get/set/remove/check helpers (key: `reminders_<principalOrAnon>_<videoId>`)
2. Update `PremierePreviewPage.tsx` — add Bell icon button below the premiere info card; toggle state; if not logged in, show login prompt toast
3. Update `App.tsx` checkScheduled loop — when a video goes live, also check if current user has a reminder and fire a distinct toast ("🔔 Video is now live")
