import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChallengeId } from "../backend";
import { useActor } from "./useActor";

export function useGetProgress() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["progress"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getProgress();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetTodayCompletion() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["today"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getTodayCompletion();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useStartChallenge() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (challengeId: ChallengeId) => {
      if (!actor) throw new Error("No actor");
      await actor.startChallenge(challengeId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["progress"] });
      qc.invalidateQueries({ queryKey: ["today"] });
    },
  });
}

export function useMarkTaskComplete() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      day,
      taskIndex,
    }: { day: bigint; taskIndex: bigint }) => {
      if (!actor) throw new Error("No actor");
      await actor.markTaskComplete(day, taskIndex);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["progress"] });
      qc.invalidateQueries({ queryKey: ["today"] });
    },
  });
}

export function useResetChallenge() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.resetChallenge();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["progress"] });
      qc.invalidateQueries({ queryKey: ["today"] });
    },
  });
}
