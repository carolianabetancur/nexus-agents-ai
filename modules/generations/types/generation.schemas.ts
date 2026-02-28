import { z } from "zod";

export const generatorSchema = z.object({
	quantity: z
		.number({ invalid_type_error: "Quantity must be a number" })
		.int("Must be a whole number")
		.min(1, "Minimum 1 agent")
		.max(500, "Maximum 500 agents per run"),
	category: z.string().min(1, "Please select a category"),
	template: z.string().min(1, "Please select a template"),
	seed: z
		.number()
		.int()
		.min(1000)
		.max(9999)
		.optional()
		.or(z.literal(undefined)),
	useSeed: z.boolean(),
});

export type GeneratorFormValues = z.infer<typeof generatorSchema>;
