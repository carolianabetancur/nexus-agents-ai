import { apiClient } from "@/lib/api-client";
import {
	Agent,
	AgentListParams,
	AgentListResponse,
	UpdateAgentInput,
} from "../types/agent.types";

function buildQuery(params: AgentListParams): string {
	const q = new URLSearchParams();
	if (params.page) q.set("page", String(params.page));
	if (params.limit) q.set("limit", String(params.limit));
	if (params.search) q.set("search", params.search);
	if (params.category) q.set("category", params.category);
	if (params.status) q.set("status", params.status);
	if (params.sortBy) q.set("sortBy", params.sortBy);
	if (params.sortDir) q.set("sortDir", params.sortDir);
	return q.toString() ? `?${q.toString()}` : "";
}

export const agentApi = {
	list: (params: AgentListParams = {}) =>
		apiClient.get<AgentListResponse>(`/api/agents${buildQuery(params)}`),

	get: (id: string) => apiClient.get<Agent>(`/api/agents/${id}`),

	update: (id: string, input: UpdateAgentInput) =>
		apiClient.patch<Agent>(`/api/agents/${id}`, input),
};
