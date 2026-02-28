import { z } from "zod";

export const categorySchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be under 50 characters"),
	description: z
		.string()
		.min(5, "Description must be at least 5 characters")
		.max(200, "Description must be under 200 characters"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
