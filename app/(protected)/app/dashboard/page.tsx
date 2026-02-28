"use client";

import { useAgents } from "@/modules/agents/hooks/useAgents";
import { useGenerations } from "@/modules/generations/hooks/useGenerations";
import { useCategories } from "@/modules/resources/hooks/useCategories";
import { StatusBadge } from "@/modules/agents/components/StatusBadge";
import { AgentStatus } from "@/modules/agents/types/agent.types";
import Link from "next/link";
import {
  Bot,
  Zap,
  Database,
  History,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

export default function DashboardPage() {
  const { data: agentsData } = useAgents({
    page: 1,
    limit: 5,
    sortBy: "createdAt",
    sortDir: "desc",
  });
  const { data: generationsData } = useGenerations();
  const { data: categoriesData } = useCategories();

  const successRuns =
    generationsData?.data.filter((r) => r.status === "success").length ?? 0;
  const totalAgents = agentsData?.total ?? 0;
  const totalCategories = categoriesData?.total ?? 0;
  const totalRuns = generationsData?.total ?? 0;

  const stats = [
    {
      label: "Total Agents",
      value: totalAgents.toLocaleString(),
      icon: Bot,
      href: "/app/agents",
      color: "#818cf8",
    },
    {
      label: "Generation Runs",
      value: totalRuns.toLocaleString(),
      icon: Zap,
      href: "/app/generations",
      color: "#38bdf8",
    },
    {
      label: "Categories",
      value: totalCategories.toLocaleString(),
      icon: Database,
      href: "/app/resources",
      color: "#4ade80",
    },
    {
      label: "Successful Runs",
      value: successRuns.toLocaleString(),
      icon: TrendingUp,
      href: "/app/generations",
      color: "#fbbf24",
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Platform overview</p>
        </div>
        <Link href="/app/generator" className="btn-generate">
          <Zap size={15} /> Launch Generator
        </Link>
      </div>

      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="stat-card"
            aria-label={`${label}: ${value}`}
          >
            <div
              className="stat-icon"
              style={{
                color,
                background: `${color}18`,
                borderColor: `${color}30`,
              }}
            >
              <Icon size={18} />
            </div>
            <div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
            <ArrowRight size={14} className="stat-arrow" />
          </Link>
        ))}
      </div>

      <div className="bottom-grid">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">
              <Bot size={14} /> Recent Agents
            </h2>
            <Link href="/app/agents" className="section-link">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="item-list">
            {(agentsData?.data.length ?? 0) === 0 && (
              <div className="empty-list">No agents yet</div>
            )}
            {agentsData?.data.map((agent) => (
              <Link
                key={agent.id}
                href={`/app/agents/${agent.id}`}
                className="agent-row"
              >
                <div className="agent-avatar">{agent.name.slice(0, 2)}</div>
                <div className="agent-info">
                  <span className="agent-name">{agent.name}</span>
                  <span className="agent-meta">{agent.category}</span>
                </div>
                <StatusBadge status={agent.status as AgentStatus} />
              </Link>
            ))}
          </div>
        </div>

        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">
              <History size={14} /> Recent Runs
            </h2>
            <Link href="/app/generations" className="section-link">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="item-list">
            {(generationsData?.data.length ?? 0) === 0 && (
              <div className="empty-list">No runs yet</div>
            )}
            {generationsData?.data.slice(0, 5).map((run) => (
              <div key={run.id} className="run-row">
                <div
                  className={`run-dot ${run.status === "success" ? "run-dot--ok" : "run-dot--fail"}`}
                />
                <div className="run-info">
                  <code className="run-id">{run.id}</code>
                  <span className="run-meta">
                    {run.generatedCount} agents · {run.params.category}
                  </span>
                </div>
                <span className="run-date">
                  {format(new Date(run.createdAt), "MMM d")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
        .page{display:flex;flex-direction:column;gap:1.5rem;font-family:'Syne',sans-serif;color:#e2e8f0;max-width:1100px}
        .page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap}
        .page-title{font-size:1.6rem;font-weight:800;color:#f1f5f9;margin:0 0 .2rem;letter-spacing:-.3px}
        .page-subtitle{font-size:.82rem;color:#475569;margin:0;font-family:'Space Mono',monospace}
        .btn-generate{display:flex;align-items:center;gap:.4rem;padding:.65rem 1.1rem;background:linear-gradient(135deg,#6366f1,#4f46e5);border:none;border-radius:8px;color:white;font-family:'Syne',sans-serif;font-size:.875rem;font-weight:700;text-decoration:none;box-shadow:0 4px 16px rgba(99,102,241,.3);transition:opacity .15s}
        .btn-generate:hover{opacity:.9}
        .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.85rem}
        .stat-card{display:flex;align-items:center;gap:.9rem;padding:1.1rem 1.2rem;background:rgba(10,15,28,.7);border:1px solid rgba(56,189,248,.08);border-radius:12px;text-decoration:none;transition:border-color .15s}
        .stat-card:hover{border-color:rgba(99,102,241,.25)}
        .stat-icon{width:40px;height:40px;border-radius:10px;border:1px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .stat-value{font-size:1.3rem;font-weight:800;color:#f1f5f9;font-family:'Space Mono',monospace;line-height:1.1}
        .stat-label{font-size:.72rem;color:#475569;text-transform:uppercase;letter-spacing:.5px}
        .stat-arrow{color:#334155;margin-left:auto}
        .bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .section-card{background:rgba(10,15,28,.7);border:1px solid rgba(56,189,248,.08);border-radius:12px;padding:1.2rem}
        .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
        .section-title{font-size:.75rem;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.8px;margin:0;font-family:'Space Mono',monospace;display:flex;align-items:center;gap:.4rem}
        .section-link{font-size:.72rem;color:#6366f1;text-decoration:none;font-family:'Space Mono',monospace;display:flex;align-items:center;gap:.2rem;transition:color .15s}
        .section-link:hover{color:#818cf8}
        .item-list{display:flex;flex-direction:column;gap:.4rem}
        .agent-row{display:flex;align-items:center;gap:.7rem;padding:.55rem .6rem;border-radius:8px;text-decoration:none;transition:background .12s}
        .agent-row:hover{background:rgba(99,102,241,.06)}
        .agent-avatar{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#38bdf8);display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:white;font-family:'Space Mono',monospace;flex-shrink:0;text-transform:uppercase}
        .agent-info{display:flex;flex-direction:column;flex:1;min-width:0}
        .agent-name{font-size:.8rem;font-weight:600;color:#e2e8f0;font-family:'Space Mono',monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .agent-meta{font-size:.68rem;color:#475569;text-transform:capitalize}
        .run-row{display:flex;align-items:center;gap:.7rem;padding:.55rem .4rem;border-radius:8px}
        .run-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .run-dot--ok{background:#4ade80}
        .run-dot--fail{background:#f87171}
        .run-info{display:flex;flex-direction:column;flex:1;min-width:0}
        .run-id{font-size:.75rem;color:#818cf8;font-family:'Space Mono',monospace}
        .run-meta{font-size:.68rem;color:#475569;font-family:'Space Mono',monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .run-date{font-size:.68rem;color:#334155;font-family:'Space Mono',monospace;white-space:nowrap}
        .empty-list{font-size:.78rem;color:#334155;font-family:'Space Mono',monospace;padding:.5rem;text-align:center}
        @media(max-width:768px){.bottom-grid{grid-template-columns:1fr}.stats-grid{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </div>
  );
}
