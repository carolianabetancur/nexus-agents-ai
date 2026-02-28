import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050810",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        fontFamily: "'Syne',sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');
        @keyframes glitch {
          0%,94%,100% { text-shadow: 2px 0 #6366f1, -2px 0 #38bdf8; }
          95% { text-shadow: -4px 0 #6366f1, 4px 0 #38bdf8; }
          97% { text-shadow: 4px 0 #f87171, -4px 0 #6366f1; }
        }
        .glitch-num { animation: glitch 3s infinite; }
      `}</style>
      <div
        className="glitch-num"
        style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: "6rem",
          fontWeight: 700,
          color: "#1e293b",
          letterSpacing: -4,
          lineHeight: 1,
          textShadow: "2px 0 #6366f1, -2px 0 #38bdf8",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "#f1f5f9",
          margin: 0,
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontSize: "0.85rem",
          color: "#475569",
          fontFamily: "'Space Mono',monospace",
          margin: 0,
          maxWidth: 320,
          lineHeight: 1.6,
        }}
      >
        This sector of the platform doesn&apos;t exist or has been
        decommissioned.
      </p>
      <Link
        href="/app/dashboard"
        style={{
          fontSize: "0.85rem",
          color: "#6366f1",
          textDecoration: "none",
          fontFamily: "'Space Mono',monospace",
        }}
      >
        ← Return to dashboard
      </Link>
    </div>
  );
}
