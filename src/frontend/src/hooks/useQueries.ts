import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

// ── localStorage profile cache helpers ──────────────────────────────────────
const PROFILE_CACHE_KEY = "subpremium_profile_cache";

function getCachedProfile(principalId: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(`${PROFILE_CACHE_KEY}_${principalId}`);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

function setCachedProfile(principalId: string, profile: UserProfile) {
  try {
    localStorage.setItem(
      `${PROFILE_CACHE_KEY}_${principalId}`,
      JSON.stringify(profile),
    );
  } catch {
    /* non-critical */
  }
}

export function clearCachedProfile(principalId: string) {
  try {
    localStorage.removeItem(`${PROFILE_CACHE_KEY}_${principalId}`);
  } catch {
    /* non-critical */
  }
}

// ── Queries ──────────────────────────────────────────────────────────────────

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
  const { identity } = useInternetIdentity();
  const principalId = identity?.getPrincipal().toString() ?? "";

  const query = useQuery<UserProfile | null>({
    queryKey: ["userProfile", principalId],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const serverProfile = await actor.getCallerUserProfile();
      // Server is the source of truth — cache the result
      if (serverProfile && principalId) {
        setCachedProfile(principalId, serverProfile);
      }
      return serverProfile ?? null;
    },
    // Seed from localStorage while waiting for server
    placeholderData: () => {
      if (!principalId) return null;
      return getCachedProfile(principalId);
    },
    enabled: !!actor && !isFetching && !!principalId,
    staleTime: 30_000,
    gcTime: 300_000,
    retry: 2,
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

// Retry helper: attempt fn up to maxAttempts times with exponential backoff
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 800 * attempt));
      }
    }
  }
  throw lastError;
}

export function useSaveProfile() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const qc = useQueryClient();
  const principalId = identity?.getPrincipal().toString() ?? "";

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!identity) throw new Error("Not authenticated — please log in first");
      if (!actor) throw new Error("Actor not ready");
      // Safety: never save a fully-empty profile over existing data
      const allEmpty =
        !profile.displayName.trim() &&
        !profile.username.trim() &&
        !profile.bio.trim() &&
        !profile.avatarBlobId.trim();
      if (allEmpty) {
        throw new Error(
          "Profile has no data to save. Fill in at least your display name.",
        );
      }
      await withRetry(() => actor.saveCallerUserProfile(profile));
      // Update local cache immediately after confirmed server write
      if (principalId) setCachedProfile(principalId, profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to save profile";
      const friendly = msg.includes("Not authenticated")
        ? "Session expired — please log in again."
        : msg.includes("Actor not ready")
          ? "Network not ready — please try again."
          : msg.includes("no data to save")
            ? msg
            : `Save failed: ${msg}. Your changes were not lost — try saving again.`;
      toast.error(friendly, { duration: 6000 });
    },
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

export function useSubscriberCount(creatorId: string | null) {
  return useQuery<number>({
    queryKey: ["subscriberCount", creatorId ?? ""],
    queryFn: () => getLocalSubscriberCount(creatorId ?? ""),
    enabled: !!creatorId,
    staleTime: 0,
  });
}

export function useIsSubscribed(creatorId: string | null) {
  return useQuery<boolean>({
    queryKey: ["isSubscribed", creatorId ?? ""],
    queryFn: () => isSubscribed(creatorId ?? ""),
    enabled: !!creatorId,
    staleTime: 0,
  });
}

export function usePublicProfile(creatorId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["publicProfile", creatorId ?? ""],
    queryFn: async () => {
      if (!actor || !creatorId) return null;
      try {
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

export function useSubscriptions() {
  return useQuery<string[]>({
    queryKey: ["subscriptions"],
    queryFn: () => getSubscriptions(),
    staleTime: 0,
  });
}

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

export function useInitSubscriberCount(creatorId: string | null) {
  useQuery({
    queryKey: ["initSubCount", creatorId ?? ""],
    queryFn: () => {
      if (!creatorId) return null;
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
