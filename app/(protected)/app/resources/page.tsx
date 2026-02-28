"use client";

import { useState, useCallback } from "react";
import { useCategories } from "@/modules/resources/hooks/useCategories";
import { CategoryFormDialog } from "@/modules/resources/components/CategoryFormDialog";
import { DeleteConfirmDialog } from "@/modules/resources/components/DeleteConfirmDialog";
import { Category } from "@/modules/resources/types/category.types";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Tag,
  Loader2,
  ServerOff,
} from "lucide-react";
import { format } from "date-fns";

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  // Simple debounce via timeout ref
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    const t = setTimeout(() => setDebouncedSearch(value), 350);
    return () => clearTimeout(t);
  }, []);

  const { data, isLoading, isError, error } = useCategories(
    debouncedSearch || undefined,
  );

  const openCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setFormOpen(true);
  };

  const openDelete = (cat: Category) => setDeleteTarget(cat);

  return (
    <div className="page">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Resources</h1>
          <p className="page-subtitle">
            Manage categories that power agent generation
          </p>
        </div>
        <button
          className="btn-create"
          onClick={openCreate}
          aria-label="Create new category"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Category
        </button>
      </div>

      {/* Search bar */}
      <div className="search-row">
        <div className="search-wrap">
          <Search size={15} className="search-icon" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search categories..."
            className="search-input"
            aria-label="Search categories"
          />
        </div>
        {data && (
          <span className="result-count">
            {data.total} {data.total === 1 ? "category" : "categories"}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="table-wrap">
        {isLoading && (
          <div className="state-box">
            <Loader2 size={24} className="spin" aria-label="Loading" />
            <span>Loading categories...</span>
          </div>
        )}

        {isError && (
          <div className="state-box state-error">
            <ServerOff size={24} />
            <span>
              {(error as Error)?.message ?? "Failed to load categories"}
            </span>
          </div>
        )}

        {!isLoading && !isError && data?.data.length === 0 && (
          <div className="state-box state-empty">
            <Tag size={28} />
            <span>
              {debouncedSearch
                ? "No categories match your search"
                : "No categories yet"}
            </span>
            {!debouncedSearch && (
              <button className="btn-create-inline" onClick={openCreate}>
                Create your first category
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && (data?.data.length ?? 0) > 0 && (
          <table className="table" role="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Slug</th>
                <th scope="col">Description</th>
                <th scope="col">Created</th>
                <th scope="col" className="col-actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((cat) => (
                <tr key={cat.id} className="table-row">
                  <td>
                    <div className="cat-name">
                      <span className="cat-dot" aria-hidden="true" />
                      {cat.name}
                    </div>
                  </td>
                  <td>
                    <code className="slug-badge">{cat.slug}</code>
                  </td>
                  <td className="col-desc">{cat.description}</td>
                  <td className="col-date">
                    {format(new Date(cat.createdAt), "MMM d, yyyy")}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="action-btn action-btn--edit"
                        onClick={() => openEdit(cat)}
                        aria-label={`Edit ${cat.name}`}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="action-btn action-btn--delete"
                        onClick={() => openDelete(cat)}
                        aria-label={`Delete ${cat.name}`}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Dialogs */}
      <CategoryFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editTarget={editTarget}
      />
      <DeleteConfirmDialog
        open={!!deleteTarget}
        category={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

        .page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          font-family: 'Syne', sans-serif;
          color: #e2e8f0;
          max-width: 1100px;
        }

        /* Header */
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .page-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #f1f5f9;
          margin: 0 0 0.2rem;
          letter-spacing: -0.3px;
        }
        .page-subtitle {
          font-size: 0.85rem;
          color: #475569;
          margin: 0;
          font-family: 'Space Mono', monospace;
        }

        .btn-create {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.2rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none;
          border-radius: 8px;
          color: white;
          font-family: 'Syne', sans-serif;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
          white-space: nowrap;
        }
        .btn-create:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-create:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }

        /* Search */
        .search-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 220px;
          max-width: 400px;
        }
        .search-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 8px;
          padding: 0.6rem 0.9rem 0.6rem 2.4rem;
          color: #e2e8f0;
          font-size: 0.875rem;
          font-family: 'Space Mono', monospace;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .search-input::placeholder { color: #334155; }
        .search-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .result-count {
          font-size: 0.78rem;
          font-family: 'Space Mono', monospace;
          color: #475569;
          white-space: nowrap;
        }

        /* Table */
        .table-wrap {
          background: rgba(10, 15, 28, 0.7);
          border: 1px solid rgba(56, 189, 248, 0.08);
          border-radius: 12px;
          overflow: hidden;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }
        .table th {
          padding: 0.75rem 1.1rem;
          text-align: left;
          font-size: 0.72rem;
          font-weight: 600;
          font-family: 'Space Mono', monospace;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(56, 189, 248, 0.07);
          background: rgba(5, 8, 16, 0.5);
        }
        .table td {
          padding: 0.9rem 1.1rem;
          font-size: 0.875rem;
          color: #94a3b8;
          border-bottom: 1px solid rgba(56, 189, 248, 0.05);
          vertical-align: middle;
        }
        .table-row:last-child td { border-bottom: none; }
        .table-row:hover td { background: rgba(99,102,241,0.04); }

        .cat-name {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 600;
          color: #e2e8f0;
        }
        .cat-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #38bdf8);
          flex-shrink: 0;
        }

        .slug-badge {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 4px;
          padding: 2px 7px;
          color: #818cf8;
        }

        .col-desc {
          max-width: 280px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .col-date {
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          white-space: nowrap;
        }
        .col-actions { width: 80px; }

        .row-actions {
          display: flex;
          gap: 0.4rem;
          align-items: center;
        }
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          background: none;
          border: 1px solid transparent;
          border-radius: 7px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .action-btn--edit { color: #475569; }
        .action-btn--edit:hover {
          color: #818cf8;
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.2);
        }
        .action-btn--delete { color: #475569; }
        .action-btn--delete:hover {
          color: #f87171;
          background: rgba(248,113,113,0.08);
          border-color: rgba(248,113,113,0.2);
        }
        .action-btn:focus-visible { outline: 2px solid #6366f1; }

        /* States */
        .state-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 4rem 2rem;
          color: #334155;
          font-size: 0.9rem;
          font-family: 'Space Mono', monospace;
          text-align: center;
        }
        .state-error { color: #f87171; }
        .state-empty { color: #475569; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .btn-create-inline {
          margin-top: 0.5rem;
          padding: 0.55rem 1.1rem;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 7px;
          color: #818cf8;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-create-inline:hover { background: rgba(99,102,241,0.2); }

        @media (max-width: 640px) {
          .col-desc, .col-date { display: none; }
          .page-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
