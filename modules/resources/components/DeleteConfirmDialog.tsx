"use client";

import { Category } from "../types/category.types";
import { useDeleteCategory } from "../hooks/useCategories";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
}

export function DeleteConfirmDialog({
  open,
  category,
  onClose,
}: DeleteConfirmDialogProps) {
  const deleteCategory = useDeleteCategory();

  if (!open || !category) return null;

  const handleDelete = async () => {
    await deleteCategory.mutateAsync(category.id);
    onClose();
  };

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <div className="panel">
        <div className="panel-header">
          <div className="warning-icon" aria-hidden="true">
            <AlertTriangle size={20} />
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <h2 id="delete-title" className="panel-title">
          Delete Category
        </h2>
        <p className="panel-body">
          Are you sure you want to delete{" "}
          <strong>&ldquo;{category.name}&rdquo;</strong>? This action cannot be
          undone.
        </p>
        <div className="panel-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={deleteCategory.isPending}
          >
            Cancel
          </button>
          <button
            className="btn-delete"
            onClick={handleDelete}
            disabled={deleteCategory.isPending}
          >
            {deleteCategory.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <style>{`
        .overlay {
          position: fixed; inset: 0;
          background: rgba(5, 8, 16, 0.8);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 60; padding: 1rem;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        .panel {
          background: #0d1424;
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 14px;
          padding: 1.5rem;
          width: 100%; max-width: 380px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px) }
          to { opacity: 1; transform: translateY(0) }
        }

        .panel-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 0.8rem;
        }
        .warning-icon {
          width: 40px; height: 40px;
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #f87171;
        }
        .close-btn {
          background: none; border: none; color: #475569;
          cursor: pointer; padding: 4px; border-radius: 6px;
          display: flex; align-items: center; transition: color 0.15s;
        }
        .close-btn:hover { color: #94a3b8; }

        .panel-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700;
          color: #f1f5f9; margin: 0 0 0.5rem;
        }
        .panel-body {
          font-size: 0.875rem; color: #64748b;
          line-height: 1.6; margin: 0 0 1.4rem;
        }
        .panel-body strong { color: #94a3b8; }

        .panel-actions {
          display: flex; justify-content: flex-end; gap: 0.6rem;
        }
        .btn-cancel {
          padding: 0.6rem 1rem;
          background: rgba(30,41,59,0.8);
          border: 1px solid rgba(71,85,105,0.5);
          border-radius: 8px; color: #94a3b8;
          font-family: 'Syne', sans-serif; font-size: 0.875rem; font-weight: 600;
          cursor: pointer; transition: color 0.15s;
        }
        .btn-cancel:hover:not(:disabled) { color: #cbd5e1; }
        .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-delete {
          padding: 0.6rem 1.1rem;
          background: #dc2626;
          border: none; border-radius: 8px;
          color: white; font-family: 'Syne', sans-serif;
          font-size: 0.875rem; font-weight: 700;
          cursor: pointer; transition: opacity 0.15s;
          box-shadow: 0 4px 14px rgba(220,38,38,0.3);
        }
        .btn-delete:hover:not(:disabled) { opacity: 0.85; }
        .btn-delete:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
