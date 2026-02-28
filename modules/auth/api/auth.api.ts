import { apiClient } from "@/lib/api-client";
import { AuthUser } from "@/store/auth.store";

interface LoginResponse {
	user: AuthUser;
	token: string;
}

export const authApi = {
	login: (email: string, password: string) =>
		apiClient.post<LoginResponse>("/api/auth/login", { email, password }),

	logout: () => apiClient.post<{ success: boolean }>("/api/auth/logout", {}),

	me: () => apiClient.get<{ user: AuthUser }>("/api/auth/me"),
};
