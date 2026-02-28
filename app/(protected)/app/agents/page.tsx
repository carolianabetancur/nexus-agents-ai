"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import Link from "next/link";
import { useAgents } from "@/modules/agents/hooks/useAgents";
import { StatusBadge } from "@/modules/agents/components/StatusBadge";
import { AgentListParams } from "@/modules/agents/types/agent.types";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ServerOff,
  Bot,
} from "lucide-react";
import { format } from "date-fns";

const CATEGORIES = [
  "home",
  "education",
  "productivity",
  "finance",
  "health",
  "entertainment",
];
const STATUSES = ["active", "inactive", "training", "deprecated"];
const LIMIT = 50;
const ROW_HEIGHT = 56;

type SortKey = "name" | "createdAt" | "category";

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // Debounce search
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 350);
  }, []);

  const params = useMemo<AgentListParams>(
    () => ({
      page,
      limit: LIMIT,
      search: debouncedSearch || undefined,
      category: category || undefined,
      status: status || undefined,
      sortBy,
      sortDir,
    }),
    [page, debouncedSearch, category, status, sortBy, sortDir],
  );

  const { data, isLoading, isError, error, isFetching } = useAgents(params);

  // ── Virtualizer ───────────────────────────────────────────────────────────
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: data?.data.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  // ── Sorting ───────────────────────────────────────────────────────────────
  const handleSort = (col: SortKey) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortBy !== col)
      return <ChevronsUpDown size={13} style={{ color: "#334155" }} />;
    return sortDir === "asc" ? (
      <ChevronUp size={13} style={{ color: "#818cf8" }} />
    ) : (
      <ChevronDown size={13} style={{ color: "#818cf8" }} />
    );
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategory("");
    setStatus("");
    setSortBy("createdAt");
    setSortDir("desc");
    setPage(1);
  };

  const hasFilters = debouncedSearch || category || status;

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Agents</h1>
          <p className="page-subtitle">
            {data
              ? `${data.total.toLocaleString()} agents in fleet`
              : "Loading fleet..."}
          </p>
        </div>
        {isFetching && !isLoading && (
          <div className="fetching-badge">
            <Loader2 size={12} className="spin" />
            Syncing
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="filters-row">
        <div className="search-wrap">
          <Search size={14} className="search-icon" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search agents..."
            className="search-input"
            aria-label="Search agents"
          />
        </div>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="filter-select"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="filter-select"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button className="btn-reset" onClick={resetFilters}>
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-wrap">
        {/* Column headers */}
        <div className="table-head">
          <div className="col-name">
            <button className="sort-btn" onClick={() => handleSort("name")}>
              Name <SortIcon col="name" />
            </button>
          </div>
          <div className="col-category">
            <button className="sort-btn" onClick={() => handleSort("category")}>
              Category <SortIcon col="category" />
            </button>
          </div>
          <div className="col-status">Status</div>
          <div className="col-tags">Tags</div>
          <div className="col-date">
            <button
              className="sort-btn"
              onClick={() => handleSort("createdAt")}
            >
              Created <SortIcon col="createdAt" />
            </button>
          </div>
          <div className="col-action" />
        </div>

        {/* States */}
        {isLoading && (
          <div className="state-box">
            <Loader2 size={24} className="spin" />
            <span>Loading agents...</span>
          </div>
        )}
        {isError && (
          <div className="state-box state-error">
            <ServerOff size={24} />
            <span>{(error as Error)?.message ?? "Failed to load agents"}</span>
          </div>
        )}
        {!isLoading && !isError && data?.data.length === 0 && (
          <div className="state-box state-empty">
            <Bot size={28} />
            <span>
              {hasFilters ? "No agents match your filters" : "No agents found"}
            </span>
            {hasFilters && (
              <button className="btn-reset-inline" onClick={resetFilters}>
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Virtualized rows */}
        {!isLoading && !isError && (data?.data.length ?? 0) > 0 && (
          <div
            ref={parentRef}
            className="virtual-scroll-area"
            style={{
              height: Math.min((data?.data.length ?? 0) * ROW_HEIGHT, 520),
            }}
            role="rowgroup"
            aria-label="Agents list"
          >
            <div
              style={{
                height: rowVirtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const agent = data!.data[virtualRow.index];
                return (
                  <div
                    key={agent.id}
                    className="table-row"
                    style={{
                      position: "absolute",
                      top: virtualRow.start,
                      left: 0,
                      right: 0,
                      height: ROW_HEIGHT,
                    }}
                    role="row"
                  >
                    <div className="col-name" role="cell">
                      <span className="agent-dot" aria-hidden="true" />
                      <span className="agent-name">{agent.name}</span>
                    </div>
                    <div className="col-category" role="cell">
                      <span className="category-pill">
                        {agent.category.charAt(0).toUpperCase() +
                          agent.category.slice(1)}
                      </span>
                    </div>
                    <div className="col-status" role="cell">
                      <StatusBadge status={agent.status} />
                    </div>
                    <div className="col-tags" role="cell">
                      <div className="tags-wrap">
                        {agent.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                        {agent.tags.length > 2 && (
                          <span className="tag tag--more">
                            +{agent.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-date" role="cell">
                      {format(new Date(agent.createdAt), "MMM d, yyyy")}
                    </div>
                    <div className="col-action" role="cell">
                      <Link
                        href={`/app/agents/${agent.id}`}
                        className="view-link"
                        aria-label={`View ${agent.name}`}
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="pagination" role="navigation" aria-label="Pagination">
          <span className="pagination-info">
            Page {data.page} of {data.totalPages} &mdash;{" "}
            {data.total.toLocaleString()} total
          </span>
          <div className="pagination-btns">
            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>
            {/* Page number pills */}
            {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
              const p =
                Math.max(1, Math.min(page - 2, data.totalPages - 4)) + i;
              return (
                <button
                  key={p}
                  className={`page-btn page-btn--num ${p === page ? "page-btn--active" : ""}`}
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </button>
              );
            })}
            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

        .page { display: flex; flex-direction: column; gap: 1.4rem; font-family: 'Syne', sans-serif; color: #e2e8f0; max-width: 1200px; }

        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: #f1f5f9; margin: 0 0 0.2rem; letter-spacing: -0.3px; }
        .page-subtitle { font-size: 0.82rem; color: #475569; margin: 0; font-family: 'Space Mono', monospace; }

        .fetching-badge {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.72rem; font-family: 'Space Mono', monospace;
          color: #818cf8; background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2); border-radius: 99px; padding: 4px 10px;
        }

        /* Filters */
        .filters-row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
        .search-wrap { position: relative; min-width: 200px; flex: 1; max-width: 340px; }
        .search-icon { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: #475569; pointer-events: none; }
        .search-input {
          width: 100%; background: rgba(15,23,42,0.8); border: 1px solid rgba(71,85,105,0.5); border-radius: 8px;
          padding: 0.55rem 0.9rem 0.55rem 2.3rem; color: #e2e8f0; font-size: 0.85rem;
          font-family: 'Space Mono', monospace; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
        }
        .search-input::placeholder { color: #334155; }
        .search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }

        .filter-select {
          background: rgba(15,23,42,0.8); border: 1px solid rgba(71,85,105,0.5); border-radius: 8px;
          padding: 0.55rem 0.8rem; color: #94a3b8; font-size: 0.85rem; font-family: 'Syne', sans-serif;
          outline: none; cursor: pointer; transition: border-color 0.2s;
        }
        .filter-select:focus { border-color: #6366f1; }
        .btn-reset {
          background: none; border: 1px solid rgba(71,85,105,0.4); border-radius: 8px;
          color: #475569; font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 600;
          padding: 0.5rem 0.9rem; cursor: pointer; transition: color 0.15s, border-color 0.15s;
        }
        .btn-reset:hover { color: #94a3b8; border-color: #475569; }

        /* Table */
        .table-wrap {
          background: rgba(10,15,28,0.7); border: 1px solid rgba(56,189,248,0.08);
          border-radius: 12px; overflow: hidden;
        }

        /* Column grid - must match between head + rows */
        .table-head, .table-row {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1fr 1.4fr 1fr 80px;
          align-items: center;
          gap: 0;
        }
        .table-head {
          padding: 0;
          border-bottom: 1px solid rgba(56,189,248,0.07);
          background: rgba(5,8,16,0.5);
        }
        .table-head > div {
          padding: 0.65rem 1rem;
          font-size: 0.7rem; font-weight: 600; font-family: 'Space Mono', monospace;
          color: #475569; text-transform: uppercase; letter-spacing: 0.5px;
        }

        .sort-btn {
          background: none; border: none; color: inherit; cursor: pointer;
          font: inherit; display: flex; align-items: center; gap: 0.3rem;
          padding: 0; transition: color 0.15s;
        }
        .sort-btn:hover { color: #94a3b8; }
        .sort-btn:focus-visible { outline: 2px solid #6366f1; border-radius: 3px; }

        .virtual-scroll-area { overflow-y: auto; }

        .table-row {
          border-bottom: 1px solid rgba(56,189,248,0.05);
          transition: background 0.12s;
        }
        .table-row:hover { background: rgba(99,102,241,0.04); }
        .table-row > div { padding: 0 1rem; font-size: 0.85rem; color: #94a3b8; overflow: hidden; }

        .agent-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #38bdf8);
          flex-shrink: 0; display: inline-block; margin-right: 0.5rem;
        }
        .agent-name { font-weight: 600; color: #e2e8f0; font-family: 'Space Mono', monospace; font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .col-name { display: flex; align-items: center; }
        .col-status, .col-tags, .col-category, .col-date, .col-action { display: flex; align-items: center; }
        .col-date { font-family: 'Space Mono', monospace; font-size: 0.75rem; }

        .category-pill {
          background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.15);
          border-radius: 6px; padding: 2px 8px; font-size: 0.72rem;
          color: #7dd3fc; font-family: 'Space Mono', monospace;
        }

        .tags-wrap { display: flex; gap: 0.3rem; flex-wrap: nowrap; overflow: hidden; }
        .tag {
          background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.15);
          border-radius: 4px; padding: 1px 6px; font-size: 0.68rem;
          color: #818cf8; font-family: 'Space Mono', monospace; white-space: nowrap;
        }
        .tag--more { color: #475569; border-color: rgba(71,85,105,0.3); background: rgba(71,85,105,0.1); }

        .view-link {
          font-size: 0.78rem; font-family: 'Space Mono', monospace;
          color: #6366f1; text-decoration: none; white-space: nowrap;
          transition: color 0.15s;
        }
        .view-link:hover { color: #818cf8; }
        .view-link:focus-visible { outline: 2px solid #6366f1; border-radius: 3px; }

        /* States */
        .state-box {
          display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
          padding: 4rem 2rem; color: #334155; font-size: 0.875rem;
          font-family: 'Space Mono', monospace; text-align: center;
        }
        .state-error { color: #f87171; }
        .state-empty { color: #475569; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .btn-reset-inline {
          margin-top: 0.4rem; padding: 0.5rem 1rem;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
          border-radius: 7px; color: #818cf8; font-family: 'Syne', sans-serif;
          font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: background 0.15s;
        }
        .btn-reset-inline:hover { background: rgba(99,102,241,0.18); }

        /* Pagination */
        .pagination {
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem; flex-wrap: wrap;
        }
        .pagination-info { font-size: 0.75rem; font-family: 'Space Mono', monospace; color: #475569; }
        .pagination-btns { display: flex; gap: 0.35rem; align-items: center; }
        .page-btn {
          min-width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(15,23,42,0.8); border: 1px solid rgba(71,85,105,0.4);
          border-radius: 7px; color: #64748b; font-family: 'Space Mono', monospace;
          font-size: 0.78rem; cursor: pointer; transition: all 0.15s; padding: 0 6px;
        }
        .page-btn:hover:not(:disabled) { border-color: #6366f1; color: #818cf8; }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .page-btn--active { background: rgba(99,102,241,0.15); border-color: #6366f1; color: #818cf8; }
        .page-btn:focus-visible { outline: 2px solid #6366f1; }

        @media (max-width: 768px) {
          .table-head, .table-row { grid-template-columns: 2fr 1fr 1fr 80px; }
          .col-tags, .col-date { display: none !important; }
        }
      `}</style>
    </div>
  );
}
