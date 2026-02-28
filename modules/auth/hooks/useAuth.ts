"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useLogin() {
	const [isLoading, setIsLoading] = useState(false);
	const setAuth = useAuthStore((s) => s.setAuth);
	const router = useRouter();

	async function login(email: string, password: string) {
		setIsLoading(true);
		try {
			const { user, token } = await authApi.login(email, password);

			// Store in Zustand (in-memory + persisted to localStorage)
			setAuth(user, token);

			// Also store in cookie so middleware can read it server-side
			Cookies.set("auth-token", token, { expires: 7, sameSite: "strict" });

			toast.success(`Welcome back, ${user.name}!`);
			router.push("/app/dashboard");
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Login failed";
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	}

	return { login, isLoading };
}

export function useLogout() {
	const clearAuth = useAuthStore((s) => s.clearAuth);
	const router = useRouter();

	async function logout() {
		try {
			await authApi.logout();
		} finally {
			clearAuth();
			Cookies.remove("auth-token");
			router.push("/login");
		}
	}

	return { logout };
}
