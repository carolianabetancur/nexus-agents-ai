import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { agentApi } from "../api/agent.api";
import { Agent, AgentListParams, UpdateAgentInput } from "../types/agent.types";

export const AGENT_KEYS = {
	all: ["agents"] as const,
	lists: () => ["agents", "list"] as const,
	list: (params: AgentListParams) => ["agents", "list", params] as const,
	detail: (id: string) => ["agents", "detail", id] as const,
};

export function useAgents(params: AgentListParams) {
	return useQuery({
		queryKey: AGENT_KEYS.list(params),
		queryFn: () => agentApi.list(params),
		placeholderData: (prev) => prev,
	});
}

export function useAgent(id: string) {
	return useQuery({
		queryKey: AGENT_KEYS.detail(id),
		queryFn: () => agentApi.get(id),
		enabled: !!id,
	});
}

export function useUpdateAgent(id: string) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (input: UpdateAgentInput) => agentApi.update(id, input),

		onMutate: async (input) => {
			await qc.cancelQueries({ queryKey: AGENT_KEYS.detail(id) });

			const previous = qc.getQueryData<Agent>(AGENT_KEYS.detail(id));

			qc.setQueryData<Agent>(AGENT_KEYS.detail(id), (old) =>
				old ? { ...old, ...input, updatedAt: new Date().toISOString() } : old,
			);

			return { previous };
		},

		onError: (err: Error, _input, context) => {
			if (context?.previous) {
				qc.setQueryData(AGENT_KEYS.detail(id), context.previous);
			}
			toast.error(err.message ?? "Failed to update agent");
		},

		onSuccess: (updated) => {
			qc.setQueryData(AGENT_KEYS.detail(id), updated);
			qc.invalidateQueries({ queryKey: AGENT_KEYS.lists() });
			toast.success("Agent updated successfully");
		},
	});
}
