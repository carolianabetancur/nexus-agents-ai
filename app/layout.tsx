import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MSWProvider } from "@/components/shared/MSWProvider";
import { QueryProvider } from "@/components/shared/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Agent Platform",
  description: "Massive AI agent generation and management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <MSWProvider>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
