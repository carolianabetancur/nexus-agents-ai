"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            padding: "3rem 2rem",
            textAlign: "center",
            fontFamily: "'Syne',sans-serif",
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
              fontFamily: "'Space Mono',monospace",
              margin: 0,
              maxWidth: 320,
              lineHeight: 1.6,
            }}
          >
            {this.state.error?.message ??
              "An unexpected error occurred in this section."}
          </p>
          <button
            type="button"
            onClick={this.reset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.6rem 1.1rem",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 8,
              color: "#f87171",
              fontFamily: "'Syne',sans-serif",
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
    return this.props.children;
  }
}
