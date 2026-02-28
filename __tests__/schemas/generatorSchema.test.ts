import { generatorSchema } from "@/modules/generations/types/generation.schemas";

describe("generatorSchema", () => {
	const valid = {
		quantity: 10,
		category: "finance",
		template: "default",
		useSeed: false,
	};
	it("accepts valid generation params", () => {
		expect(generatorSchema.safeParse(valid).success).toBe(true);
	});
	it("rejects quantity above 500", () => {
		const result = generatorSchema.safeParse({ ...valid, quantity: 501 });
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].path).toContain("quantity");
	});
	it("rejects quantity below 1", () => {
		const result = generatorSchema.safeParse({ ...valid, quantity: 0 });
		expect(result.success).toBe(false);
	});
	it("rejects missing category", () => {
		const result = generatorSchema.safeParse({ ...valid, category: "" });
		expect(result.success).toBe(false);
	});
	it("accepts a valid seed when useSeed is true", () => {
		const result = generatorSchema.safeParse({
			...valid,
			useSeed: true,
			seed: 4291,
		});
		expect(result.success).toBe(true);
	});
	it("rejects seed below 1000", () => {
		const result = generatorSchema.safeParse({
			...valid,
			useSeed: true,
			seed: 42,
		});
		expect(result.success).toBe(false);
	});
});
