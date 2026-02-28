import { useAuthStore } from "@/store/auth.store";

class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
	const token = useAuthStore.getState().token;

	const res = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new ApiError(res.status, error.message ?? "Request failed");
	}

	return res.json();
}

export const apiClient = {
	get: <T>(url: string) => request<T>(url),
	post: <T>(url: string, body: unknown) =>
		request<T>(url, { method: "POST", body: JSON.stringify(body) }),
	patch: <T>(url: string, body: unknown) =>
		request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
	delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

export { ApiError };
