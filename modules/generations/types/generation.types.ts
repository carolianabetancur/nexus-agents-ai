export type GenerationStatus = "success" | "failed";

export interface GenerationParams {
	quantity: number;
	category: string;
	template: string;
	seed?: number;
}

export interface GenerationRun {
	id: string;
	createdAt: string;
	params: GenerationParams;
	status: GenerationStatus;
	generatedCount: number;
	agentIds: string[];
}

export interface GenerationListResponse {
	data: GenerationRun[];
	total: number;
}

export interface RunGenerationInput {
	quantity: number;
	category: string;
	template: string;
	seed?: number;
}
