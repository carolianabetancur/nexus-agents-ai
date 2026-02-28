"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAgent, useUpdateAgent } from "@/modules/agents/hooks/useAgents";
import { StatusBadge } from "@/modules/agents/components/StatusBadge";
import {
  agentEditSchema,
  AgentEditFormValues,
} from "@/modules/agents/types/agent.schemas";
import { AgentStatus } from "@/modules/agents/types/agent.types";
import {
  ArrowLeft,
  Pencil,
  X,
  Check,
  Loader2,
  ServerOff,
  Activity,
  Tag,
  Calendar,
  Cpu,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const CATEGORIES = [
  "home",
  "education",
  "productivity",
  "finance",
  "health",
  "entertainment",
];
const STATUSES: AgentStatus[] = [
  "active",
  "inactive",
  "training",
  "deprecated",
];
const ALL_TAGS = [
  "nlp",
  "vision",
  "reasoning",
  "planning",
  "memory",
  "tool-use",
  "multimodal",
];

interface Props {
  params: Promise<{ id: string }>;
}

export default function AgentDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: agent, isLoading, isError, error } = useAgent(id);
  const updateAgent = useUpdateAgent(id);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<AgentEditFormValues>({
    resolver: zodResolver(agentEditSchema),
  });

  // Sync form when agent data loads
  useEffect(() => {
    if (agent) {
      reset({
        name: agent.name,
        description: agent.description,
        status: agent.status,
        category: agent.category,
        tags: agent.tags,
      });
    }
  }, [agent, reset]);

  const watchedTags = watch("tags") ?? [];

  const toggleTag = (tag: string) => {
    const current = watchedTags;
    setValue(
      "tags",
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag],
      { shouldDirty: true },
    );
  };

  const onSubmit = async (data: AgentEditFormValues) => {
    await updateAgent.mutateAsync(data);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    if (agent)
      reset({
        name: agent.name,
        description: agent.description,
        status: agent.status,
        category: agent.category,
        tags: agent.tags,
      });
    setIsEditing(false);
  };

  // ── Loading / error states ──────────────────────────────────────────────
  if (isLoading)
    return (
      <div className="state-page">
        <Loader2 size={28} className="spin" />
        <span>Loading agent...</span>
      </div>
    );

  if (isError || !agent)
    return (
      <div className="state-page state-error">
        <ServerOff size={28} />
        <span>{(error as Error)?.message ?? "Agent not found"}</span>
        <Link href="/app/agents" className="back-link">
          ← Back to agents
        </Link>
      </div>
    );

  return (
    <div className="page">
      {/* Back nav */}
      <Link href="/app/agents" className="back-btn">
        <ArrowLeft size={15} />
        All Agents
      </Link>

      {/* Header card */}
      <div className="hero-card">
        <div className="hero-top">
          <div className="hero-left">
            <div className="agent-avatar" aria-hidden="true">
              {agent.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="agent-name">{agent.name}</h1>
              <code className="agent-id">ID: {agent.id}</code>
            </div>
          </div>
          <div className="hero-right">
            <StatusBadge status={agent.status} />
            {!isEditing ? (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                <Pencil size={14} /> Edit Agent
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  className="btn-cancel"
                  onClick={cancelEdit}
                  disabled={updateAgent.isPending}
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  className="btn-save"
                  onClick={handleSubmit(onSubmit)}
                  disabled={updateAgent.isPending || !isDirty}
                >
                  {updateAgent.isPending ? (
                    <>
                      <span className="spinner" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check size={14} /> Save
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          <div className="stat">
            <Activity size={14} className="stat-icon" />
            <span className="stat-label">Tasks Completed</span>
            <span className="stat-value">
              {agent.metrics.tasksCompleted.toLocaleString()}
            </span>
          </div>
          <div className="stat">
            <Check size={14} className="stat-icon" />
            <span className="stat-label">Success Rate</span>
            <span className="stat-value">
              {(agent.metrics.successRate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="stat">
            <Cpu size={14} className="stat-icon" />
            <span className="stat-label">Template</span>
            <span className="stat-value">{agent.template}</span>
          </div>
          <div className="stat">
            <Hash size={14} className="stat-icon" />
            <span className="stat-label">Generation Run</span>
            <span className="stat-value">{agent.generationRunId}</span>
          </div>
        </div>
      </div>

      {/* Detail / Edit form */}
      <div className="detail-grid">
        {/* Left: editable fields */}
        <div className="detail-card">
          <h2 className="card-title">Configuration</h2>

          <div className="field-group">
            <label className="field-label">
              <Pencil size={11} /> Name
            </label>
            {isEditing ? (
              <>
                <input
                  className={`field-input ${errors.name ? "field-input--error" : ""}`}
                  {...register("name")}
                />
                {errors.name && (
                  <span className="field-error">{errors.name.message}</span>
                )}
              </>
            ) : (
              <p className="field-value mono">{agent.name}</p>
            )}
          </div>

          <div className="field-group">
            <label className="field-label">
              <Tag size={11} /> Description
            </label>
            {isEditing ? (
              <>
                <textarea
                  rows={3}
                  className={`field-input field-textarea ${errors.description ? "field-input--error" : ""}`}
                  {...register("description")}
                />
                {errors.description && (
                  <span className="field-error">
                    {errors.description.message}
                  </span>
                )}
              </>
            ) : (
              <p className="field-value">{agent.description}</p>
            )}
          </div>

          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Status</label>
              {isEditing ? (
                <select
                  className="field-input field-select"
                  {...register("status")}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="field-value">
                  <StatusBadge status={agent.status} />
                </p>
              )}
            </div>

            <div className="field-group">
              <label className="field-label">Category</label>
              {isEditing ? (
                <select
                  className="field-input field-select"
                  {...register("category")}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="field-value capitalize">{agent.category}</p>
              )}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Tags</label>
            {isEditing ? (
              <>
                <div className="tag-picker">
                  {ALL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`tag-option ${watchedTags.includes(tag) ? "tag-option--selected" : ""}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {errors.tags && (
                  <span className="field-error">{errors.tags.message}</span>
                )}
              </>
            ) : (
              <div className="tags-display">
                {agent.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: metadata (read-only) */}
        <div className="detail-card">
          <h2 className="card-title">Metadata</h2>

          <div className="field-group">
            <label className="field-label">
              <Calendar size={11} /> Created
            </label>
            <p className="field-value mono">
              {format(new Date(agent.createdAt), "PPP p")}
            </p>
          </div>

          <div className="field-group">
            <label className="field-label">
              <Calendar size={11} /> Last Updated
            </label>
            <p className="field-value mono">
              {format(new Date(agent.updatedAt), "PPP p")}
            </p>
          </div>

          <div className="field-group">
            <label className="field-label">Generation Run</label>
            <Link href={`/app/generations`} className="run-link">
              {agent.generationRunId} →
            </Link>
          </div>

          {/* Success rate bar */}
          <div className="field-group">
            <label className="field-label">Success Rate</label>
            <div className="rate-bar-wrap">
              <div className="rate-bar">
                <div
                  className="rate-fill"
                  style={{ width: `${agent.metrics.successRate * 100}%` }}
                  role="progressbar"
                  aria-valuenow={agent.metrics.successRate * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <span className="rate-label">
                {(agent.metrics.successRate * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Optimistic update notice */}
          {updateAgent.isPending && (
            <div className="optimistic-notice">
              <Loader2 size={12} className="spin" />
              Saving changes optimistically...
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

        .page { display: flex; flex-direction: column; gap: 1.5rem; font-family: 'Syne', sans-serif; color: #e2e8f0; max-width: 1000px; }

        .back-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          color: #475569; font-size: 0.8rem; font-family: 'Space Mono', monospace;
          text-decoration: none; transition: color 0.15s; width: fit-content;
        }
        .back-btn:hover { color: #94a3b8; }

        /* Hero */
        .hero-card {
          background: rgba(10,15,28,0.7); border: 1px solid rgba(56,189,248,0.1);
          border-radius: 14px; padding: 1.6rem;
        }
        .hero-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .hero-left { display: flex; align-items: center; gap: 1rem; }
        .hero-right { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }

        .agent-avatar {
          width: 52px; height: 52px; border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #38bdf8);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace; font-weight: 700;
          font-size: 1rem; color: white; flex-shrink: 0;
        }
        .agent-name { font-size: 1.4rem; font-weight: 800; color: #f1f5f9; margin: 0 0 0.25rem; letter-spacing: -0.3px; }
        .agent-id { font-size: 0.72rem; color: #334155; font-family: 'Space Mono', monospace; }

        .btn-edit {
          display: flex; align-items: center; gap: 0.4rem;
          padding: 0.55rem 1rem; background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.25); border-radius: 8px;
          color: #818cf8; font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 600;
          cursor: pointer; transition: background 0.15s;
        }
        .btn-edit:hover { background: rgba(99,102,241,0.18); }

        .edit-actions { display: flex; gap: 0.5rem; }
        .btn-cancel {
          display: flex; align-items: center; gap: 0.35rem;
          padding: 0.55rem 0.9rem; background: rgba(30,41,59,0.8);
          border: 1px solid rgba(71,85,105,0.5); border-radius: 8px;
          color: #94a3b8; font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 600;
          cursor: pointer; transition: color 0.15s;
        }
        .btn-cancel:hover:not(:disabled) { color: #e2e8f0; }
        .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-save {
          display: flex; align-items: center; gap: 0.35rem;
          padding: 0.55rem 1rem; background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none; border-radius: 8px; color: white;
          font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 700;
          cursor: pointer; transition: opacity 0.15s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.3);
        }
        .btn-save:hover:not(:disabled) { opacity: 0.9; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

        .spinner {
          width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.7s linear infinite; display: inline-block;
        }

        /* Stats */
        .stats-row {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem; padding-top: 1.2rem;
          border-top: 1px solid rgba(56,189,248,0.07);
        }
        .stat { display: flex; flex-direction: column; gap: 0.3rem; }
        .stat-icon { color: #475569; }
        .stat-label { font-size: 0.7rem; font-family: 'Space Mono', monospace; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: 1rem; font-weight: 700; color: #e2e8f0; font-family: 'Space Mono', monospace; }

        /* Detail grid */
        .detail-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 1.2rem; }
        .detail-card {
          background: rgba(10,15,28,0.7); border: 1px solid rgba(56,189,248,0.08);
          border-radius: 14px; padding: 1.4rem;
          display: flex; flex-direction: column; gap: 1.2rem;
        }
        .card-title { font-size: 0.8rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1px; margin: 0; font-family: 'Space Mono', monospace; }

        .field-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .field-label { display: flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
        .field-value { font-size: 0.875rem; color: #94a3b8; margin: 0; line-height: 1.5; }
        .field-value.mono { font-family: 'Space Mono', monospace; font-size: 0.8rem; }
        .field-value.capitalize { text-transform: capitalize; }

        .field-input {
          background: rgba(30,41,59,0.8); border: 1px solid rgba(71,85,105,0.6);
          border-radius: 8px; padding: 0.6rem 0.8rem; color: #e2e8f0;
          font-size: 0.875rem; font-family: 'Space Mono', monospace; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; width: 100%; box-sizing: border-box; resize: none;
        }
        .field-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .field-input--error { border-color: #f87171 !important; }
        .field-textarea { font-family: 'Syne', sans-serif; line-height: 1.5; }
        .field-select { cursor: pointer; }
        .field-error { font-size: 0.73rem; color: #f87171; font-family: 'Space Mono', monospace; }

        /* Tag picker */
        .tag-picker { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .tag-option {
          padding: 3px 10px; border-radius: 6px; font-size: 0.72rem;
          font-family: 'Space Mono', monospace; cursor: pointer; transition: all 0.15s;
          border: 1px solid rgba(71,85,105,0.4); background: rgba(30,41,59,0.6); color: #475569;
        }
        .tag-option:hover { border-color: #6366f1; color: #818cf8; }
        .tag-option--selected { border-color: #6366f1; color: #818cf8; background: rgba(99,102,241,0.12); }
        .tag-option:focus-visible { outline: 2px solid #6366f1; }

        .tags-display { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .tag-chip {
          padding: 3px 9px; border-radius: 6px; font-size: 0.72rem;
          font-family: 'Space Mono', monospace;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: #818cf8;
        }

        /* Rate bar */
        .rate-bar-wrap { display: flex; align-items: center; gap: 0.75rem; }
        .rate-bar { flex: 1; height: 6px; background: rgba(30,41,59,0.8); border-radius: 99px; overflow: hidden; }
        .rate-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #38bdf8); border-radius: 99px; transition: width 0.5s ease; }
        .rate-label { font-size: 0.75rem; font-family: 'Space Mono', monospace; color: #94a3b8; white-space: nowrap; }

        .run-link { font-size: 0.8rem; font-family: 'Space Mono', monospace; color: #6366f1; text-decoration: none; transition: color 0.15s; }
        .run-link:hover { color: #818cf8; }

        /* Optimistic notice */
        .optimistic-notice {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.72rem; font-family: 'Space Mono', monospace; color: #818cf8;
          background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.15);
          border-radius: 8px; padding: 0.6rem 0.8rem;
        }

        /* State pages */
        .state-page {
          display: flex; flex-direction: column; align-items: center; gap: 1rem;
          min-height: 40vh; justify-content: center;
          font-family: 'Space Mono', monospace; color: #334155;
        }
        .state-error { color: #f87171; }
        .back-link { font-size: 0.8rem; color: #6366f1; text-decoration: none; margin-top: 0.5rem; }
        .back-link:hover { color: #818cf8; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr; }
          .hero-top { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
