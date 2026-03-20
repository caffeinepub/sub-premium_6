import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfile, UserSettings, Video, VideoView } from "../backend";
import { useActor } from "./useActor";

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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
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
  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) return;
      await actor.incrementViews(videoId);
    },
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
