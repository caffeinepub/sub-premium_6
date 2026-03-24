# SUB PREMIUM

## Current State
- Like system exists (likeVideo/unlikeVideo) with likeCount and isLiked in VideoEngagement
- Dislike button is rendered in UI but is non-functional (no backend, no handler)
- Share button opens native share or copies text (no URL included)
- Download button uses videoUrl directly with blob-style anchor (may use blob URL from storage)
- No dislikeCount or userReaction (like/dislike/none) stored in backend
- Action row: Like | Dislike | Share | Save | Download — exists but Dislike is a stub

## Requested Changes (Diff)

### Add
- Backend: `videoReactions` stable map storing userId -> {like|dislike} per video
- Backend: `dislikeVideo(videoId)` — saves dislike, removes any existing like
- Backend: updated `likeVideo(videoId)` — saves like, removes any existing dislike, toggles off if already liked
- Backend: `removeReaction(videoId)` — removes user reaction
- Backend: `VideoEngagement` extended with `dislikeCount: Nat` and `userReaction: Text` ("like"|"dislike"|"none")
- Frontend: Dislike handler with mutual-exclusion logic
- Frontend: Share handler includes full window.location.href URL
- Frontend: Download handler uses real video URL (never blob:), shows "Downloading..." toast, handles errors
- Divider lines above and below the action buttons section

### Modify
- Backend: `getVideoEngagement` returns dislikeCount + userReaction
- Backend: `likeVideo` now removes dislike if present, and toggles off if already liked
- Frontend: Like button highlights dark yellow when active
- Frontend: Dislike button highlights active state when disliked
- Frontend: Share copies `window.location.href` (not just text), shows "Link copied" toast as fallback
- Frontend: Download skips blob: URLs, uses direct video URL with download attribute

### Remove
- Nothing removed

## Implementation Plan
1. Update backend: add `videoReactions` stable map, add/modify like/dislike/removeReaction functions, extend VideoEngagement type
2. Regenerate backend.d.ts bindings
3. Update frontend hooks for dislike/removeReaction
4. Update VideoPlayerPage: dislike handler, like toggle-off logic, share with URL, download with toast
5. Update action buttons UI: active states for like (dark yellow) and dislike, dividers above/below row
