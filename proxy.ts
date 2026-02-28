import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("auth-token")?.value;

	const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
	const isProtectedPath = pathname.startsWith("/app");

	// Redirect unauthenticated users away from protected routes
	if (isProtectedPath && !token) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("from", pathname); // so we can redirect back after login
		return NextResponse.redirect(loginUrl);
	}

	// Redirect authenticated users away from login
	if (isPublicPath && token) {
		return NextResponse.redirect(new URL("/app/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	// Run middleware on these paths only (skip static assets, api routes)
	matcher: ["/app/:path*", "/login"],
};
