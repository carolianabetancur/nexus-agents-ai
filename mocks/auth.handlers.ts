import { http, HttpResponse } from "msw";

const MOCK_USER = {
	id: "user-1",
	name: "Ada Lovelace",
	email: "ada@aiplatform.dev",
	role: "admin",
};

export const authHandlers = [
	http.post("/api/auth/login", async ({ request }) => {
		const body = (await request.json()) as { email: string; password: string };

		if (
			body.email === "ada@aiplatform.dev" &&
			body.password === "password123"
		) {
			return HttpResponse.json({
				user: MOCK_USER,
				token: "mock-jwt-token-xyz",
			});
		}

		return HttpResponse.json(
			{ message: "Invalid credentials" },
			{ status: 401 },
		);
	}),

	http.post("/api/auth/logout", () => {
		return HttpResponse.json({ success: true });
	}),

	http.get("/api/auth/me", ({ request }) => {
		const auth = request.headers.get("Authorization");
		if (!auth || !auth.includes("mock-jwt-token")) {
			return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		return HttpResponse.json({ user: MOCK_USER });
	}),
];
