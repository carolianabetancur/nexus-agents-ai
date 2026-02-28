"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#050810" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
            fontFamily: "'Syne',sans-serif",
          }}
        >
          <AlertTriangle size={36} color="#f87171" />
          <h1
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "#f1f5f9",
              margin: 0,
            }}
          >
            Critical error
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#64748b",
              fontFamily: "'Space Mono',monospace",
              margin: 0,
              maxWidth: 360,
              lineHeight: 1.6,
            }}
          >
            {error.message ??
              "The application encountered an unrecoverable error."}
          </p>
          {error.digest && (
            <code
              style={{
                fontSize: "0.72rem",
                color: "#334155",
                fontFamily: "'Space Mono',monospace",
              }}
            >
              Error ID: {error.digest}
            </code>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.7rem 1.3rem",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 8,
              color: "#f87171",
              fontFamily: "'Syne',sans-serif",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={15} /> Reload application
          </button>
        </div>
      </body>
    </html>
  );
}
