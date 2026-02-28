export type AgentStatus = "active" | "inactive" | "training" | "deprecated";

export interface AgentMetrics {
	tasksCompleted: number;
	successRate: number;
}

export interface Agent {
	id: string;
	name: string;
	category: string;
	status: AgentStatus;
	tags: string[];
	template: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	generationRunId: string;
	metrics: AgentMetrics;
}

export interface AgentListResponse {
	data: Agent[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface AgentListParams {
	page?: number;
	limit?: number;
	search?: string;
	category?: string;
	status?: string;
	sortBy?: string;
	sortDir?: "asc" | "desc";
}

export type UpdateAgentInput = Partial<
	Pick<Agent, "name" | "description" | "status" | "tags" | "category">
>;
