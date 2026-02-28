import { agentEditSchema } from "@/modules/agents/types/agent.schemas";

describe("agentEditSchema", () => {
	const valid = {
		name: "NEXUS-7X",
		description: "A productivity agent with memory capabilities",
		status: "active" as const,
		category: "productivity",
		tags: ["nlp", "memory"],
	};
	it("accepts a valid agent edit payload", () => {
		expect(agentEditSchema.safeParse(valid).success).toBe(true);
	});
	it("rejects empty tags array", () => {
		const result = agentEditSchema.safeParse({ ...valid, tags: [] });
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].path).toContain("tags");
	});
	it("rejects invalid status value", () => {
		const result = agentEditSchema.safeParse({ ...valid, status: "flying" });
		expect(result.success).toBe(false);
	});
	it("rejects name shorter than 2 chars", () => {
		const result = agentEditSchema.safeParse({ ...valid, name: "X" });
		expect(result.success).toBe(false);
	});
	it("rejects missing category", () => {
		const result = agentEditSchema.safeParse({ ...valid, category: "" });
		expect(result.success).toBe(false);
	});
});
