import { z } from "zod";

export const agentEditSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(60),
	description: z
		.string()
		.min(5, "Description must be at least 5 characters")
		.max(300),
	status: z.enum(["active", "inactive", "training", "deprecated"]),
	category: z.string().min(1, "Category is required"),
	tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export type AgentEditFormValues = z.infer<typeof agentEditSchema>;
