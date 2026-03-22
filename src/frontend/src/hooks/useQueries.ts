import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CaptionTrack,
  UserProfile,
  UserSettings,
  Video,
  VideoView,
} from "../backend";
import {
  getLocalSubscriberCount,
  getSubscriptions,
  isSubscribed,
  setLocalSubscriberCount,
  subscribeToCreator,
  unsubscribeFromCreator,
} from "../utils/subscriptions";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useListVideos(searchTerm?: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Video[]>({
    queryKey: ["videos", searchTerm ?? ""],
    queryFn: async () => {
      if (!actor) return [];
      if (searchTerm?.trim()) {
        return actor.searchVideos(searchTerm.trim());
      }
      return actor.listAllVideos();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useWatchHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoView[]>({
    queryKey: ["watchHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWatchHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: isFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<UserSettings | null>({
    queryKey: ["settings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!identity) throw new Error("Not authenticated — please log in first");
      if (!actor) throw new Error("Actor not ready");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

export function useUpdateSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.updateSettings(settings);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.deleteVideo(videoId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
}

export function useIncrementViews() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) return;
      await actor.incrementViews(videoId);
    },
    // Refresh video list after view increment so real count shows immediately
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
}

export function useUpdateWatchHistory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) return;
      await actor.updateWatchHistory(videoId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchHistory"] }),
  });
}

export function useGetVideoCaption(videoId: string, enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["caption", videoId],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getVideoCaption(videoId);
    },
    enabled: enabled && !!videoId && !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useUpdateVideoCaption() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ videoId, vtt }: { videoId: string; vtt: string }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.updateVideoCaption(videoId, vtt);
    },
    onSuccess: (_data, { videoId }) =>
      qc.invalidateQueries({ queryKey: ["caption", videoId] }),
  });
}

export function useGetCaptionTracks(videoId: string, enabled = true) {
  const { actor, isFetching } = useActor();
  return useQuery<CaptionTrack[]>({
    queryKey: ["captionTracks", videoId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCaptionTracks(videoId);
    },
    enabled: enabled && !!videoId && !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useSetCaptionTrack() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      videoId,
      language,
      captionLabel,
      vtt,
    }: {
      videoId: string;
      language: string;
      captionLabel: string;
      vtt: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.setCaptionTrack(videoId, language, captionLabel, vtt);
    },
    onSuccess: (_data, { videoId }) =>
      qc.invalidateQueries({ queryKey: ["captionTracks", videoId] }),
  });
}

export function useRemoveCaptionTrack() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      videoId,
      language,
    }: {
      videoId: string;
      language: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.removeCaptionTrack(videoId, language);
    },
    onSuccess: (_data, { videoId }) =>
      qc.invalidateQueries({ queryKey: ["captionTracks", videoId] }),
  });
}

// ── Subscription hooks (localStorage-backed) ────────────────────────────────

/** Get subscriber count for a creator (local approximation) */
export function useSubscriberCount(creatorId: string | null) {
  return useQuery<number>({
    queryKey: ["subscriberCount", creatorId ?? ""],
    queryFn: () => getLocalSubscriberCount(creatorId ?? ""),
    enabled: !!creatorId,
    staleTime: 0,
  });
}

/** Check if current user is subscribed to a creator */
export function useIsSubscribed(creatorId: string | null) {
  return useQuery<boolean>({
    queryKey: ["isSubscribed", creatorId ?? ""],
    queryFn: () => isSubscribed(creatorId ?? ""),
    enabled: !!creatorId,
    staleTime: 0,
  });
}

/** Get public profile for any user */
export function usePublicProfile(creatorId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["publicProfile", creatorId ?? ""],
    queryFn: async () => {
      if (!actor || !creatorId) return null;
      try {
        // Use getUserProfile with Principal
        const { Principal } = await import("@icp-sdk/core/principal");
        const principal = Principal.fromText(creatorId);
        return actor.getUserProfile(principal);
      } catch {
        return null;
      }
    },
    enabled: !!creatorId && !!actor && !isFetching,
    staleTime: 60_000,
  });
}

/** Get all videos by a creator principal string */
export function useVideosByCreator(creatorId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Video[]>({
    queryKey: ["videosByCreator", creatorId ?? ""],
    queryFn: async () => {
      if (!actor || !creatorId) return [];
      const all = await actor.listAllVideos();
      return all
        .filter((v) => v.creatorId === creatorId)
        .sort((a, b) => Number(b.uploadTime - a.uploadTime));
    },
    enabled: !!creatorId && !!actor && !isFetching,
    staleTime: 30_000,
  });
}

/** Get subscriptions list (local) */
export function useSubscriptions() {
  return useQuery<string[]>({
    queryKey: ["subscriptions"],
    queryFn: () => getSubscriptions(),
    staleTime: 0,
  });
}

/** Subscribe to a creator */
export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (creatorId: string) => {
      subscribeToCreator(creatorId);
    },
    onSuccess: (_data, creatorId) => {
      qc.invalidateQueries({ queryKey: ["subscriberCount", creatorId] });
      qc.invalidateQueries({ queryKey: ["isSubscribed", creatorId] });
      qc.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

/** Unsubscribe from a creator */
export function useUnsubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (creatorId: string) => {
      unsubscribeFromCreator(creatorId);
    },
    onSuccess: (_data, creatorId) => {
      qc.invalidateQueries({ queryKey: ["subscriberCount", creatorId] });
      qc.invalidateQueries({ queryKey: ["isSubscribed", creatorId] });
      qc.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

/** Initialize local subscriber count for own profile (seed from 0 if never set) */
export function useInitSubscriberCount(creatorId: string | null) {
  useQuery({
    queryKey: ["initSubCount", creatorId ?? ""],
    queryFn: () => {
      if (!creatorId) return null;
      // Only init if not set
      const stored = localStorage.getItem(`sub_subcount_${creatorId}`);
      if (stored === null) {
        setLocalSubscriberCount(creatorId, 0);
      }
      return null;
    },
    enabled: !!creatorId,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
