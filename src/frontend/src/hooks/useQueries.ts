import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CaptionTrack,
  UserProfile,
  UserSettings,
  Video,
  VideoView,
} from "../backend";
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
      return actor.listReadyVideos();
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
