import { loginSchema } from "@/modules/auth/types/auth.schemas";

describe("loginSchema", () => {
	it("accepts valid credentials", () => {
		const result = loginSchema.safeParse({
			email: "ada@aiplatform.dev",
			password: "password123",
		});
		expect(result.success).toBe(true);
	});
	it("rejects invalid email", () => {
		const result = loginSchema.safeParse({
			email: "not-an-email",
			password: "password123",
		});
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].path).toContain("email");
	});
	it("rejects password shorter than 6 chars", () => {
		const result = loginSchema.safeParse({
			email: "ada@aiplatform.dev",
			password: "123",
		});
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].path).toContain("password");
	});
});
