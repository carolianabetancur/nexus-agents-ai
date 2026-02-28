"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generatorSchema,
  GeneratorFormValues,
} from "@/modules/generations/types/generation.schemas";
import { useRunGeneration } from "@/modules/generations/hooks/useGenerations";
import { GenerationRun } from "@/modules/generations/types/generation.types";
import { StatusBadge } from "@/modules/agents/components/StatusBadge";
import Link from "next/link";
import {
  Zap,
  RefreshCw,
  ChevronRight,
  Bot,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shuffle,
  Hash,
} from "lucide-react";

const CATEGORIES = [
  "home",
  "education",
  "productivity",
  "finance",
  "health",
  "entertainment",
];
const TEMPLATES = ["default", "advanced", "minimal"];

type PageState = "idle" | "loading" | "success" | "error";

export default function GeneratorPage() {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [result, setResult] = useState<GenerationRun | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const runGeneration = useRunGeneration();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<GeneratorFormValues>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      quantity: 10,
      category: "productivity",
      template: "default",
      useSeed: false,
      seed: undefined,
    },
  });

  const useSeed = watch("useSeed");
  const quantity = watch("quantity");

  const randomizeSeed = () => {
    setValue("seed", Math.floor(Math.random() * 9000) + 1000, {
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: GeneratorFormValues) => {
    setPageState("loading");
    setErrorMessage("");
    try {
      const run = await runGeneration.mutateAsync({
        quantity: data.quantity,
        category: data.category,
        template: data.template,
        seed: data.useSeed ? data.seed : undefined,
      });
      setResult(run);
      setPageState("success");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Generation failed");
      setPageState("error");
    }
  };

  const handleRetry = () => {
    setPageState("loading");
    setErrorMessage("");
    handleSubmit(onSubmit)();
  };

  const resetToIdle = () => {
    setPageState("idle");
    setResult(null);
    setErrorMessage("");
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Zap size={22} className="title-icon" aria-hidden="true" />
            Agent Generator
          </h1>
          <p className="page-subtitle">
            Configure parameters and launch a bulk generation run
          </p>
        </div>
        <Link href="/app/generations" className="audit-link">
          View Audit Log <ChevronRight size={14} />
        </Link>
      </div>

      <div className="layout">
        {/* ── Config Form ─────────────────────────────────────────────────── */}
        <div className="config-card">
          <h2 className="card-title">Generation Parameters</h2>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
            {/* Quantity slider + input */}
            <div className="field-group">
              <div className="field-label-row">
                <label htmlFor="quantity" className="field-label">
                  <Bot size={12} /> Agent Count
                </label>
                <span className="quantity-badge">{quantity ?? 0}</span>
              </div>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <input
                    type="range"
                    id="quantity"
                    min={1}
                    max={500}
                    step={1}
                    className="range-slider"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-valuenow={field.value}
                    aria-valuemin={1}
                    aria-valuemax={500}
                  />
                )}
              />
              <div className="range-labels">
                <span>1</span>
                <span>250</span>
                <span>500</span>
              </div>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    min={1}
                    max={500}
                    className={`field-input ${errors.quantity ? "field-input--error" : ""}`}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-label="Agent quantity (manual input)"
                  />
                )}
              />
              {errors.quantity && (
                <span className="field-error" role="alert">
                  {errors.quantity.message}
                </span>
              )}
            </div>

            {/* Category */}
            <div className="field-group">
              <label htmlFor="category" className="field-label">
                Category / Domain
              </label>
              <select
                id="category"
                className={`field-input field-select ${errors.category ? "field-input--error" : ""}`}
                {...register("category")}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="field-error" role="alert">
                  {errors.category.message}
                </span>
              )}
            </div>

            {/* Template */}
            <div className="field-group">
              <label className="field-label">Agent Template</label>
              <div
                className="template-options"
                role="radiogroup"
                aria-label="Agent template"
              >
                {TEMPLATES.map((t) => {
                  const descriptions: Record<string, string> = {
                    default: "512mb · 100 tasks",
                    advanced: "2gb · 1000 tasks",
                    minimal: "128mb · 10 tasks",
                  };
                  return (
                    <label
                      key={t}
                      className={`template-option ${watch("template") === t ? "template-option--selected" : ""}`}
                    >
                      <input
                        type="radio"
                        value={t}
                        {...register("template")}
                        className="sr-only"
                      />
                      <span className="template-name">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </span>
                      <span className="template-desc">{descriptions[t]}</span>
                    </label>
                  );
                })}
              </div>
              {errors.template && (
                <span className="field-error" role="alert">
                  {errors.template.message}
                </span>
              )}
            </div>

            {/* Seed (optional) */}
            <div className="field-group">
              <div className="seed-toggle-row">
                <label className="field-label">
                  <Hash size={12} /> Reproducibility Seed
                </label>
                <label className="toggle" aria-label="Enable seed">
                  <Controller
                    name="useSeed"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        className="toggle-input"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <span className="toggle-track">
                    <span className="toggle-thumb" />
                  </span>
                </label>
              </div>
              {useSeed && (
                <div className="seed-row">
                  <input
                    type="number"
                    min={1000}
                    max={9999}
                    placeholder="e.g. 4291"
                    className="field-input"
                    {...register("seed", { valueAsNumber: true })}
                  />
                  <button
                    type="button"
                    className="btn-randomize"
                    onClick={randomizeSeed}
                    aria-label="Randomize seed"
                  >
                    <Shuffle size={14} />
                  </button>
                </div>
              )}
              <p className="field-hint">
                {useSeed
                  ? "Same seed + params will always produce identical agents."
                  : "Enable to make generation reproducible."}
              </p>
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="btn-generate"
              disabled={pageState === "loading"}
              aria-busy={pageState === "loading"}
            >
              {pageState === "loading" ? (
                <span className="btn-inner">
                  <Loader2 size={16} className="spin" />
                  Generating {quantity} agents...
                </span>
              ) : (
                <span className="btn-inner">
                  <Zap size={16} />
                  Launch Generation
                </span>
              )}
            </button>
          </form>
        </div>

        {/* ── Result Panel ─────────────────────────────────────────────────── */}
        <div className="result-panel">
          {/* Idle */}
          {pageState === "idle" && (
            <div className="result-idle">
              <div className="idle-orb" aria-hidden="true">
                <Zap size={32} />
              </div>
              <p className="idle-title">Ready to generate</p>
              <p className="idle-subtitle">
                Configure parameters on the left and hit Launch Generation.
              </p>
            </div>
          )}

          {/* Loading */}
          {pageState === "loading" && (
            <div className="result-loading">
              <div
                className="loading-ring"
                aria-label="Generating agents"
                role="status"
              >
                <div className="ring ring-1" />
                <div className="ring ring-2" />
                <div className="ring ring-3" />
                <Zap size={20} className="ring-icon" aria-hidden="true" />
              </div>
              <p className="loading-title">Generating agents</p>
              <p className="loading-subtitle">
                Spinning up {quantity} agent{quantity !== 1 ? "s" : ""}...
                <br />
                This may take a few seconds.
              </p>
              <div className="loading-params">
                <span className="param-chip">{getValues("category")}</span>
                <span className="param-chip">{getValues("template")}</span>
                <span className="param-chip">{quantity} agents</span>
              </div>
            </div>
          )}

          {/* Success */}
          {pageState === "success" && result && (
            <div className="result-success">
              <div className="success-icon" aria-hidden="true">
                <CheckCircle2 size={28} />
              </div>
              <p className="success-title">Generation Complete!</p>

              <div className="summary-grid">
                <div className="summary-stat">
                  <span className="summary-val">{result.generatedCount}</span>
                  <span className="summary-label">Agents Created</span>
                </div>
                <div className="summary-stat">
                  <span className="summary-val capitalize">
                    {result.params.category}
                  </span>
                  <span className="summary-label">Category</span>
                </div>
                <div className="summary-stat">
                  <span className="summary-val capitalize">
                    {result.params.template}
                  </span>
                  <span className="summary-label">Template</span>
                </div>
                {result.params.seed && (
                  <div className="summary-stat">
                    <span className="summary-val">{result.params.seed}</span>
                    <span className="summary-label">Seed Used</span>
                  </div>
                )}
              </div>

              <div className="run-id-row">
                <span className="run-id-label">Run ID</span>
                <code className="run-id">{result.id}</code>
              </div>

              {/* Sample agents */}
              <div className="agent-samples">
                <p className="samples-label">Sample agents from this run:</p>
                {result.agentIds.slice(0, 5).map((aid) => (
                  <Link
                    key={aid}
                    href={`/app/agents/${aid}`}
                    className="agent-sample-row"
                  >
                    <span className="sample-dot" aria-hidden="true" />
                    <span className="sample-id">{aid}</span>
                    <StatusBadge status="active" />
                    <ChevronRight size={13} className="sample-arrow" />
                  </Link>
                ))}
                {result.agentIds.length > 5 && (
                  <p className="samples-more">
                    +{result.agentIds.length - 5} more agents
                  </p>
                )}
              </div>

              <div className="success-actions">
                <button className="btn-new-run" onClick={resetToIdle}>
                  <RefreshCw size={14} /> New Run
                </button>
                <Link href="/app/generations" className="btn-audit">
                  View Audit Log <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* Error */}
          {pageState === "error" && (
            <div className="result-error">
              <div className="error-icon" aria-hidden="true">
                <AlertCircle size={28} />
              </div>
              <p className="error-title">Generation Failed</p>
              <p className="error-message">
                {errorMessage || "An unexpected error occurred."}
              </p>
              <div className="error-actions">
                <button className="btn-retry" onClick={handleRetry}>
                  <RefreshCw size={14} /> Retry
                </button>
                <button className="btn-cancel-err" onClick={resetToIdle}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

        .page { display: flex; flex-direction: column; gap: 1.5rem; font-family: 'Syne', sans-serif; color: #e2e8f0; max-width: 1100px; }

        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: #f1f5f9; margin: 0 0 0.2rem; letter-spacing: -0.3px; display: flex; align-items: center; gap: 0.5rem; }
        .title-icon { color: #818cf8; }
        .page-subtitle { font-size: 0.82rem; color: #475569; margin: 0; font-family: 'Space Mono', monospace; }
        .audit-link { display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-family: 'Space Mono', monospace; color: #6366f1; text-decoration: none; transition: color 0.15s; white-space: nowrap; }
        .audit-link:hover { color: #818cf8; }

        /* Layout */
        .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; align-items: start; }

        /* Config card */
        .config-card {
          background: rgba(10,15,28,0.7); border: 1px solid rgba(56,189,248,0.08);
          border-radius: 14px; padding: 1.6rem;
        }
        .card-title { font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 1.4rem; font-family: 'Space Mono', monospace; }
        .form { display: flex; flex-direction: column; gap: 1.3rem; }

        .field-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-label-row { display: flex; align-items: center; justify-content: space-between; }
        .field-label { display: flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
        .field-hint { font-size: 0.72rem; color: #334155; font-family: 'Space Mono', monospace; margin: 0; }
        .field-error { font-size: 0.72rem; color: #f87171; font-family: 'Space Mono', monospace; }

        .quantity-badge {
          font-family: 'Space Mono', monospace; font-size: 0.85rem; font-weight: 700;
          color: #818cf8; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2);
          border-radius: 6px; padding: 1px 9px;
        }

        /* Range slider */
        .range-slider {
          width: 100%; height: 4px; appearance: none; background: rgba(99,102,241,0.2);
          border-radius: 99px; outline: none; cursor: pointer;
          accent-color: #6366f1;
        }
        .range-labels { display: flex; justify-content: space-between; font-size: 0.68rem; font-family: 'Space Mono', monospace; color: #334155; }

        .field-input {
          background: rgba(30,41,59,0.8); border: 1px solid rgba(71,85,105,0.6);
          border-radius: 8px; padding: 0.6rem 0.8rem; color: #e2e8f0;
          font-size: 0.875rem; font-family: 'Space Mono', monospace; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; width: 100%; box-sizing: border-box;
        }
        .field-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .field-input--error { border-color: #f87171 !important; }
        .field-select { cursor: pointer; }

        /* Template picker */
        .template-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
        .template-option {
          display: flex; flex-direction: column; gap: 0.2rem;
          padding: 0.65rem 0.75rem; border-radius: 8px; cursor: pointer;
          border: 1px solid rgba(71,85,105,0.4); background: rgba(15,23,42,0.6);
          transition: all 0.15s;
        }
        .template-option:hover { border-color: rgba(99,102,241,0.4); }
        .template-option--selected { border-color: #6366f1; background: rgba(99,102,241,0.1); }
        .template-name { font-size: 0.82rem; font-weight: 700; color: #e2e8f0; }
        .template-desc { font-size: 0.68rem; font-family: 'Space Mono', monospace; color: #475569; }
        .template-option--selected .template-name { color: #c4b5fd; }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }

        /* Toggle */
        .seed-toggle-row { display: flex; align-items: center; justify-content: space-between; }
        .toggle { display: flex; align-items: center; cursor: pointer; }
        .toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
        .toggle-track {
          width: 36px; height: 20px; background: rgba(30,41,59,0.8); border-radius: 99px;
          border: 1px solid rgba(71,85,105,0.5); position: relative; transition: background 0.2s, border-color 0.2s;
        }
        .toggle-input:checked + .toggle-track { background: rgba(99,102,241,0.3); border-color: #6366f1; }
        .toggle-thumb {
          width: 14px; height: 14px; background: #475569; border-radius: 50%;
          position: absolute; top: 2px; left: 2px; transition: transform 0.2s, background 0.2s;
        }
        .toggle-input:checked + .toggle-track .toggle-thumb { transform: translateX(16px); background: #818cf8; }
        .toggle-input:focus-visible + .toggle-track { outline: 2px solid #6366f1; }

        .seed-row { display: flex; gap: 0.5rem; }
        .btn-randomize {
          padding: 0 0.8rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
          border-radius: 8px; color: #818cf8; cursor: pointer; transition: background 0.15s;
          display: flex; align-items: center; flex-shrink: 0;
        }
        .btn-randomize:hover { background: rgba(99,102,241,0.2); }

        /* Generate CTA */
        .btn-generate {
          width: 100%; padding: 0.9rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none; border-radius: 10px; color: white;
          font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800;
          cursor: pointer; transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 4px 24px rgba(99,102,241,0.4);
          letter-spacing: 0.3px;
        }
        .btn-generate:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(99,102,241,0.5); }
        .btn-generate:active:not(:disabled) { transform: translateY(0); }
        .btn-generate:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-inner { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

        /* Result panel */
        .result-panel {
          background: rgba(10,15,28,0.7); border: 1px solid rgba(56,189,248,0.08);
          border-radius: 14px; min-height: 400px;
          display: flex; align-items: center; justify-content: center;
        }

        /* Idle state */
        .result-idle { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2rem; text-align: center; }
        .idle-orb {
          width: 70px; height: 70px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(56,189,248,0.1));
          border: 1px solid rgba(99,102,241,0.2);
          display: flex; align-items: center; justify-content: center; color: #475569;
        }
        .idle-title { font-size: 1rem; font-weight: 700; color: #475569; margin: 0; }
        .idle-subtitle { font-size: 0.8rem; color: #334155; font-family: 'Space Mono', monospace; margin: 0; max-width: 220px; line-height: 1.6; }

        /* Loading state */
        .result-loading { display: flex; flex-direction: column; align-items: center; gap: 1.2rem; padding: 2rem; text-align: center; }
        .loading-ring {
          width: 80px; height: 80px; position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .ring {
          position: absolute; border-radius: 50%; border-style: solid; border-color: transparent;
          animation: ringPulse 1.5s linear infinite;
        }
        .ring-1 { width: 80px; height: 80px; border-top-color: #6366f1; border-width: 2px; animation-delay: 0s; }
        .ring-2 { width: 60px; height: 60px; border-top-color: #818cf8; border-width: 2px; animation-delay: -0.5s; }
        .ring-3 { width: 40px; height: 40px; border-top-color: #38bdf8; border-width: 2px; animation-delay: -1s; }
        .ring-icon { color: #6366f1; }
        @keyframes ringPulse { to { transform: rotate(360deg); } }
        .loading-title { font-size: 1rem; font-weight: 700; color: #e2e8f0; margin: 0; }
        .loading-subtitle { font-size: 0.78rem; color: #475569; font-family: 'Space Mono', monospace; margin: 0; line-height: 1.7; }
        .loading-params { display: flex; gap: 0.4rem; flex-wrap: wrap; justify-content: center; }
        .param-chip {
          padding: 2px 10px; border-radius: 99px; font-size: 0.7rem;
          font-family: 'Space Mono', monospace; text-transform: capitalize;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: #818cf8;
        }

        /* Success state */
        .result-success { display: flex; flex-direction: column; gap: 1.2rem; padding: 1.6rem; width: 100%; }
        .success-icon { color: #4ade80; }
        .success-title { font-size: 1.1rem; font-weight: 800; color: #f1f5f9; margin: 0; }
        .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
        .summary-stat {
          background: rgba(15,23,42,0.8); border: 1px solid rgba(56,189,248,0.08);
          border-radius: 10px; padding: 0.85rem;
          display: flex; flex-direction: column; gap: 0.2rem;
        }
        .summary-val { font-size: 1.1rem; font-weight: 800; color: #e2e8f0; font-family: 'Space Mono', monospace; }
        .summary-label { font-size: 0.68rem; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
        .summary-val.capitalize { text-transform: capitalize; }

        .run-id-row { display: flex; align-items: center; gap: 0.6rem; }
        .run-id-label { font-size: 0.7rem; color: #475569; font-family: 'Space Mono', monospace; text-transform: uppercase; }
        .run-id { font-size: 0.75rem; color: #818cf8; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 5px; padding: 2px 8px; }

        .agent-samples { display: flex; flex-direction: column; gap: 0.35rem; }
        .samples-label { font-size: 0.7rem; color: #475569; font-family: 'Space Mono', monospace; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 0.2rem; }
        .agent-sample-row {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.5rem 0.7rem; border-radius: 8px;
          background: rgba(15,23,42,0.6); border: 1px solid rgba(56,189,248,0.06);
          text-decoration: none; transition: border-color 0.15s, background 0.15s;
        }
        .agent-sample-row:hover { border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.06); }
        .sample-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; flex-shrink: 0; }
        .sample-id { font-size: 0.75rem; font-family: 'Space Mono', monospace; color: #94a3b8; flex: 1; }
        .sample-arrow { color: #334155; margin-left: auto; }
        .samples-more { font-size: 0.72rem; color: #334155; font-family: 'Space Mono', monospace; text-align: center; padding: 0.3rem; }

        .success-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
        .btn-new-run {
          display: flex; align-items: center; gap: 0.4rem;
          padding: 0.6rem 1rem; background: rgba(30,41,59,0.8);
          border: 1px solid rgba(71,85,105,0.5); border-radius: 8px;
          color: #94a3b8; font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 600;
          cursor: pointer; transition: color 0.15s;
        }
        .btn-new-run:hover { color: #e2e8f0; }
        .btn-audit {
          display: flex; align-items: center; gap: 0.3rem;
          padding: 0.6rem 1rem; background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none; border-radius: 8px; color: white;
          font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 700;
          text-decoration: none; transition: opacity 0.15s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.3);
        }
        .btn-audit:hover { opacity: 0.9; }

        /* Error state */
        .result-error { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2rem; text-align: center; }
        .error-icon { color: #f87171; }
        .error-title { font-size: 1rem; font-weight: 700; color: #f87171; margin: 0; }
        .error-message { font-size: 0.8rem; color: #64748b; font-family: 'Space Mono', monospace; margin: 0; max-width: 260px; line-height: 1.6; }
        .error-actions { display: flex; gap: 0.6rem; }
        .btn-retry {
          display: flex; align-items: center; gap: 0.4rem;
          padding: 0.6rem 1.1rem; background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.25); border-radius: 8px;
          color: #f87171; font-family: 'Syne', sans-serif; font-size: 0.875rem; font-weight: 700;
          cursor: pointer; transition: background 0.15s;
        }
        .btn-retry:hover { background: rgba(248,113,113,0.18); }
        .btn-cancel-err {
          padding: 0.6rem 1rem; background: none;
          border: 1px solid rgba(71,85,105,0.4); border-radius: 8px;
          color: #475569; font-family: 'Syne', sans-serif; font-size: 0.875rem; font-weight: 600;
          cursor: pointer; transition: color 0.15s;
        }
        .btn-cancel-err:hover { color: #94a3b8; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .layout { grid-template-columns: 1fr; }
          .template-options { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
