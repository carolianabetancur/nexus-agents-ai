import { redirect } from "next/navigation";

// The root route just redirects — middleware handles auth gating
export default function RootPage() {
  redirect("/app/dashboard");
}
