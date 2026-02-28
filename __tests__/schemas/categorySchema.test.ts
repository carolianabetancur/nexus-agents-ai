import { categorySchema } from "@/modules/resources/types/category.schemas";

describe("categorySchema", () => {
	it("accepts a valid category", () => {
		const result = categorySchema.safeParse({
			name: "Finance",
			description: "Financial agents for budgeting",
		});
		expect(result.success).toBe(true);
	});
	it("rejects name shorter than 2 chars", () => {
		const result = categorySchema.safeParse({
			name: "A",
			description: "Valid description here",
		});
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].path).toContain("name");
	});
	it("rejects description shorter than 5 chars", () => {
		const result = categorySchema.safeParse({
			name: "Finance",
			description: "No",
		});
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].path).toContain("description");
	});
	it("rejects name over 50 chars", () => {
		const result = categorySchema.safeParse({
			name: "A".repeat(51),
			description: "Valid description here",
		});
		expect(result.success).toBe(false);
	});
	it("rejects description over 200 chars", () => {
		const result = categorySchema.safeParse({
			name: "Finance",
			description: "A".repeat(201),
		});
		expect(result.success).toBe(false);
	});
});
