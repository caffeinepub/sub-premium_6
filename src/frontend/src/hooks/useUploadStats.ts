import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export interface UploadPermission {
  allowed: boolean;
  reason: string;
  dailyCount: bigint;
  dailyLimit: bigint;
  cooldownRemaining: bigint;
  storageUsedBytes: bigint;
  tempBlockRemaining: bigint;
}

export function useUploadStats() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UploadPermission | undefined>({
    queryKey: ["uploadStats"],
    queryFn: async () => {
      if (!actor) return undefined;
      try {
        return (await (actor as any).getUploadStats()) as UploadPermission;
      } catch {
        return undefined;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  return { stats: query.data, isLoading: query.isLoading };
}
