import { apiClient } from "@/lib/api-client";
import {
	GenerationListResponse,
	GenerationRun,
	RunGenerationInput,
} from "../types/generation.types";

export const generationApi = {
	list: () => apiClient.get<GenerationListResponse>("/api/generations"),

	get: (id: string) => apiClient.get<GenerationRun>(`/api/generations/${id}`),

	run: (input: RunGenerationInput) =>
		apiClient.post<GenerationRun>("/api/generations/run", input),
};
