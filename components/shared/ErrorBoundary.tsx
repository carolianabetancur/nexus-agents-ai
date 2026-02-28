"use client";

import { useErrorBoundary } from "react-error-boundary";
import { AlertTriangle, RefreshCw } from "lucide-react";

function ErrorFallback({ error }: { error: Error }) {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
        padding: "3rem 2rem",
        textAlign: "center",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <AlertTriangle size={28} color="#f87171" />
      <h2
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "#f1f5f9",
          margin: 0,
        }}
      >
        Something went wrong
      </h2>
      <p
        style={{
          fontSize: "0.8rem",
          color: "#64748b",
          fontFamily: "'Space Mono', monospace",
          margin: 0,
          maxWidth: 320,
          lineHeight: 1.6,
        }}
      >
        {error?.message ?? "An unexpected error occurred in this section."}
      </p>
      <button
        type="button"
        onClick={resetBoundary}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.6rem 1.1rem",
          background: "rgba(248,113,113,0.1)",
          border: "1px solid rgba(248,113,113,0.25)",
          borderRadius: 8,
          color: "#f87171",
          fontFamily: "'Syne', sans-serif",
          fontSize: "0.875rem",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        <RefreshCw size={14} /> Try again
      </button>
    </div>
  );
}

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ErrorBoundary({ children, fallback }: Props) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      {...(fallback && { fallback })}
    >
      {children}
    </ReactErrorBoundary>
  );
}
