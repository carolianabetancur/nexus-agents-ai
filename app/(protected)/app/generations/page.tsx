"use client";

import { useGenerations } from "@/modules/generations/hooks/useGenerations";
import Link from "next/link";
import { format } from "date-fns";
import {
  History,
  CheckCircle2,
  XCircle,
  Bot,
  ChevronRight,
  Loader2,
  ServerOff,
  Hash,
} from "lucide-react";

export default function GenerationsPage() {
  const { data, isLoading, isError, error } = useGenerations();

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <History size={20} className="title-icon" aria-hidden="true" />
            Audit Log
          </h1>
          <p className="page-subtitle">
            {data
              ? `${data.total} generation run${data.total !== 1 ? "s" : ""} recorded`
              : "All generation runs"}
          </p>
        </div>
        <Link href="/app/generator" className="btn-new">
          New Run →
        </Link>
      </div>

      {/* States */}
      {isLoading && (
        <div className="state-box">
          <Loader2 size={24} className="spin" />
          <span>Loading runs...</span>
        </div>
      )}

      {isError && (
        <div className="state-box state-error">
          <ServerOff size={24} />
          <span>
            {(error as Error)?.message ?? "Failed to load generation history"}
          </span>
        </div>
      )}

      {!isLoading && !isError && data?.data.length === 0 && (
        <div className="state-box state-empty">
          <History size={28} />
          <span>No generation runs yet</span>
          <Link href="/app/generator" className="btn-start">
            Launch your first run
          </Link>
        </div>
      )}

      {/* Run list */}
      {!isLoading && !isError && (data?.data.length ?? 0) > 0 && (
        <div className="run-list">
          {data!.data.map((run) => (
            <div key={run.id} className="run-card">
              {/* Left: status + id */}
              <div className="run-left">
                <div
                  className={`status-icon ${run.status === "success" ? "status-icon--success" : "status-icon--failed"}`}
                  aria-label={run.status}
                >
                  {run.status === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </div>
                <div>
                  <div className="run-id-row">
                    <code className="run-id">{run.id}</code>
                    <span
                      className={`status-badge ${run.status === "success" ? "status-badge--success" : "status-badge--failed"}`}
                    >
                      {run.status}
                    </span>
                  </div>
                  <div className="run-date">
                    {format(new Date(run.createdAt), "PPP · p")}
                  </div>
                </div>
              </div>

              {/* Middle: params */}
              <div className="run-params">
                <div className="param">
                  <Bot size={11} className="param-icon" />
                  <span className="param-val">{run.generatedCount}</span>
                  <span className="param-label">agents</span>
                </div>
                <div className="param">
                  <span className="param-pill capitalize">
                    {run.params.category}
                  </span>
                </div>
                <div className="param">
                  <span className="param-pill">{run.params.template}</span>
                </div>
                {run.params.seed && (
                  <div className="param">
                    <Hash size={11} className="param-icon" />
                    <span className="param-val">{run.params.seed}</span>
                  </div>
                )}
              </div>

              {/* Right: link to agents */}
              <div className="run-right">
                {run.status === "success" && run.agentIds.length > 0 ? (
                  <Link
                    href="/app/agents"
                    className="view-agents-link"
                    aria-label={`View agents from run ${run.id}`}
                  >
                    View {run.agentIds.length} agent
                    {run.agentIds.length !== 1 ? "s" : ""}
                    <ChevronRight size={13} />
                  </Link>
                ) : (
                  <span className="failed-note">No agents created</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

        .page { display: flex; flex-direction: column; gap: 1.5rem; font-family: 'Syne', sans-serif; color: #e2e8f0; max-width: 960px; }

        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: #f1f5f9; margin: 0 0 0.2rem; letter-spacing: -0.3px; display: flex; align-items: center; gap: 0.5rem; }
        .title-icon { color: #818cf8; }
        .page-subtitle { font-size: 0.82rem; color: #475569; margin: 0; font-family: 'Space Mono', monospace; }

        .btn-new {
          padding: 0.6rem 1.1rem; background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none; border-radius: 8px; color: white;
          font-family: 'Syne', sans-serif; font-size: 0.875rem; font-weight: 700;
          text-decoration: none; transition: opacity 0.15s;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3); white-space: nowrap;
          display: inline-flex; align-items: center;
        }
        .btn-new:hover { opacity: 0.9; }

        /* Run list */
        .run-list { display: flex; flex-direction: column; gap: 0.75rem; }

        .run-card {
          background: rgba(10,15,28,0.7); border: 1px solid rgba(56,189,248,0.08);
          border-radius: 12px; padding: 1.1rem 1.3rem;
          display: grid; grid-template-columns: 1fr auto auto;
          align-items: center; gap: 1.5rem;
          transition: border-color 0.15s;
        }
        .run-card:hover { border-color: rgba(99,102,241,0.2); }

        /* Left */
        .run-left { display: flex; align-items: flex-start; gap: 0.85rem; min-width: 0; }
        .status-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .status-icon--success { background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.2); color: #4ade80; }
        .status-icon--failed { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.2); color: #f87171; }

        .run-id-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.25rem; }
        .run-id { font-size: 0.78rem; color: #818cf8; font-family: 'Space Mono', monospace; }
        .status-badge { font-size: 0.65rem; font-family: 'Space Mono', monospace; font-weight: 700; padding: 1px 7px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-badge--success { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
        .status-badge--failed { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
        .run-date { font-size: 0.72rem; font-family: 'Space Mono', monospace; color: #334155; }

        /* Params */
        .run-params { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
        .param { display: flex; align-items: center; gap: 0.3rem; }
        .param-icon { color: #475569; flex-shrink: 0; }
        .param-val { font-size: 0.82rem; font-family: 'Space Mono', monospace; font-weight: 700; color: #e2e8f0; }
        .param-label { font-size: 0.7rem; color: #475569; font-family: 'Space Mono', monospace; }
        .param-pill {
          font-size: 0.7rem; font-family: 'Space Mono', monospace;
          background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.15);
          border-radius: 6px; padding: 2px 8px; color: #7dd3fc;
        }
        .param-pill.capitalize { text-transform: capitalize; }

        /* Right */
        .run-right { display: flex; align-items: center; }
        .view-agents-link {
          display: flex; align-items: center; gap: 0.3rem;
          font-size: 0.78rem; font-family: 'Space Mono', monospace;
          color: #6366f1; text-decoration: none; white-space: nowrap;
          transition: color 0.15s;
        }
        .view-agents-link:hover { color: #818cf8; }
        .view-agents-link:focus-visible { outline: 2px solid #6366f1; border-radius: 3px; }
        .failed-note { font-size: 0.72rem; font-family: 'Space Mono', monospace; color: #334155; }

        /* States */
        .state-box { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 5rem 2rem; color: #334155; font-family: 'Space Mono', monospace; font-size: 0.875rem; text-align: center; }
        .state-error { color: #f87171; }
        .state-empty { color: #475569; }
        .btn-start { margin-top: 0.4rem; padding: 0.55rem 1.1rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25); border-radius: 7px; color: #818cf8; font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 600; text-decoration: none; transition: background 0.15s; }
        .btn-start:hover { background: rgba(99,102,241,0.18); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .run-card { grid-template-columns: 1fr; gap: 0.75rem; }
        }
      `}</style>
    </div>
  );
}
