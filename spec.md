# SUB PREMIUM — Real Engagement System

## Current State
- `incrementViews` is a public, unauthenticated call with no per-user dedup — any call bumps the count
- Likes are stored only in `useState` — lost on refresh, not tied to any user
- Comments are stored only in `useState` — lost on refresh, no user association
- `CommentData` has `{text, time, lang}` — no username, no avatarBlobId

## Requested Changes (Diff)

### Add
- `videoViews: Map<Text, [Text]>` — stable map of videoId → [userId] for per-user dedup
- `videoLikes: Map<Text, [Text]>` — stable map of videoId → [userId]
- `videoComments: Map<Text, [Comment]>` — stable map of videoId → comment list
- `Comment` type: `{ id: Text; userId: Text; username: Text; avatarBlobId: Text; text: Text; timestamp: Time }`
- `recordView(videoId)` — authenticated; only increments if caller not already in viewers list
- `likeVideo(videoId)` — authenticated; adds like if not already liked
- `unlikeVideo(videoId)` — authenticated; removes like
- `getLikeCount(videoId)` — public query → Nat
- `isLiked(videoId)` — authenticated query → Bool
- `postComment(videoId, text)` — authenticated; appends comment with caller profile data
- `getComments(videoId)` — public query → [Comment]
- `getVideoEngagement(videoId)` — authenticated query returning `{viewCount, likeCount, isLiked, comments}` in one round-trip

### Modify
- `incrementViews` — keep for backward compat but replace usage in frontend with `recordView`
- `CommentData` interface in frontend — add `userId`, `username`, `avatarBlobId`, `timestamp`

### Remove
- Frontend `useState` for `liked`, `disliked`, `likeCount`, `comments` — replace with backend queries

## Implementation Plan
1. Add `Comment` type and stable maps to main.mo
2. Add `recordView`, `likeVideo`, `unlikeVideo`, `getLikeCount`, `isLiked`, `postComment`, `getComments`, `getVideoEngagement` functions
3. Update frontend `CommentData` interface
4. Add `useVideoEngagement`, `useLikeVideo`, `useUnlikeVideo`, `usePostComment` hooks
5. Replace `VideoPlayerPage` local state with real backend queries
6. Update `CommentItem` to show username + avatar
7. Add 3-second view timer in player before calling `recordView`
