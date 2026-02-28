import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generationApi } from "../api/generation.api";
import { RunGenerationInput } from "../types/generation.types";

export const GENERATION_KEYS = {
	all: ["generations"] as const,
	list: () => ["generations", "list"] as const,
	detail: (id: string) => ["generations", "detail", id] as const,
};

export function useGenerations() {
	return useQuery({
		queryKey: GENERATION_KEYS.list(),
		queryFn: generationApi.list,
	});
}

export function useRunGeneration() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: RunGenerationInput) => generationApi.run(input),
		onSuccess: () => {
			// Invalidate both generations list and agents list so new agents appear
			qc.invalidateQueries({ queryKey: GENERATION_KEYS.all });
			qc.invalidateQueries({ queryKey: ["agents"] });
		},
	});
}
