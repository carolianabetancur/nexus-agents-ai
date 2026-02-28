"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/modules/auth/hooks/useAuth";
import { useAuthStore } from "@/store/auth.store";
import {
  LayoutDashboard,
  Bot,
  Zap,
  Database,
  History,
  LogOut,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/agents", label: "Agents", icon: Bot },
  { href: "/app/generator", label: "Generator", icon: Zap },
  { href: "/app/resources", label: "Resources", icon: Database },
  { href: "/app/generations", label: "Audit Log", icon: History },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useLogout();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Zap size={18} strokeWidth={2.5} />
          </div>
          <span className="brand-text">
            NEXUS<span className="brand-accent">AI</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`nav-item ${isActive ? "nav-item--active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={17} strokeWidth={2} />
                <span>{label}</span>
                {isActive && <ChevronRight size={14} className="nav-chevron" />}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar" aria-hidden="true">
              {user?.name?.[0] ?? "U"}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name ?? "Operator"}</span>
              <span className="user-role">{user?.role ?? "user"}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="logout-btn"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="app-main">{children}</main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .app-shell {
          display: flex;
          min-height: 100vh;
          background: #050810;
          font-family: 'Syne', sans-serif;
          color: #e2e8f0;
        }

        /* ── Sidebar ── */
        .sidebar {
          width: 220px;
          min-height: 100vh;
          background: rgba(10, 15, 28, 0.95);
          border-right: 1px solid rgba(56, 189, 248, 0.08);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0.75rem;
          position: sticky;
          top: 0;
          height: 100vh;
          flex-shrink: 0;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0 0.5rem 1.5rem;
          border-bottom: 1px solid rgba(56, 189, 248, 0.08);
          margin-bottom: 1rem;
        }
        .brand-icon {
          width: 30px; height: 30px;
          background: linear-gradient(135deg, #6366f1, #38bdf8);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .brand-text {
          font-family: 'Space Mono', monospace;
          font-size: 1rem;
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: 2px;
        }
        .brand-accent { color: #38bdf8; }

        /* ── Nav ── */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
          position: relative;
        }
        .nav-item:hover {
          color: #cbd5e1;
          background: rgba(255,255,255,0.04);
        }
        .nav-item--active {
          color: #e2e8f0;
          background: rgba(99, 102, 241, 0.12);
        }
        .nav-item--active:hover { background: rgba(99, 102, 241, 0.16); }
        .nav-chevron { margin-left: auto; color: #6366f1; }

        /* ── Footer ── */
        .sidebar-footer {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(56, 189, 248, 0.08);
          margin-top: 1rem;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex: 1;
          min-width: 0;
        }
        .user-avatar {
          width: 30px; height: 30px;
          background: linear-gradient(135deg, #6366f1, #38bdf8);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
          text-transform: uppercase;
        }
        .user-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .user-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #cbd5e1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-role {
          font-size: 0.68rem;
          font-family: 'Space Mono', monospace;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .logout-btn {
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: color 0.15s, background 0.15s;
          flex-shrink: 0;
        }
        .logout-btn:hover { color: #f87171; background: rgba(248,113,113,0.08); }
        .logout-btn:focus-visible { outline: 2px solid #6366f1; }

        /* ── Main ── */
        .app-main {
          flex: 1;
          min-height: 100vh;
          overflow-y: auto;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .app-main { padding: 1rem; }
        }
      `}</style>
    </div>
  );
}
