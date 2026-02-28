"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormValues } from "../types/category.schemas";
import { Category } from "../types/category.types";
import { useCreateCategory, useUpdateCategory } from "../hooks/useCategories";
import { X } from "lucide-react";

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  editTarget?: Category | null;
}

export function CategoryFormDialog({
  open,
  onClose,
  editTarget,
}: CategoryFormDialogProps) {
  const isEdit = !!editTarget;
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const isPending = createCategory.isPending || updateCategory.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  });

  // Populate form when editing
  useEffect(() => {
    if (editTarget) {
      reset({ name: editTarget.name, description: editTarget.description });
    } else {
      reset({ name: "", description: "" });
    }
  }, [editTarget, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    if (isEdit && editTarget) {
      await updateCategory.mutateAsync({ id: editTarget.id, input: data });
    } else {
      await createCategory.mutateAsync(data);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="dialog-panel">
        {/* Header */}
        <div className="dialog-header">
          <h2 id="dialog-title" className="dialog-title">
            {isEdit ? "Edit Category" : "New Category"}
          </h2>
          <button
            className="dialog-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="dialog-form"
        >
          <div className="field-group">
            <label htmlFor="cat-name" className="field-label">
              Name
            </label>
            <input
              id="cat-name"
              type="text"
              placeholder="e.g. Finance"
              className={`field-input ${errors.name ? "field-input--error" : ""}`}
              {...register("name")}
            />
            {errors.name && (
              <span className="field-error" role="alert">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="cat-desc" className="field-label">
              Description
            </label>
            <textarea
              id="cat-desc"
              rows={3}
              placeholder="What kind of agents does this category cover?"
              className={`field-input field-textarea ${errors.description ? "field-input--error" : ""}`}
              {...register("description")}
            />
            {errors.description && (
              <span className="field-error" role="alert">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="dialog-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? (
                <span className="btn-loading">
                  <span className="spinner" aria-hidden="true" />
                  {isEdit ? "Saving..." : "Creating..."}
                </span>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .dialog-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 8, 16, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1rem;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        .dialog-panel {
          background: #0d1424;
          border: 1px solid rgba(56, 189, 248, 0.15);
          border-radius: 14px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px) }
          to { opacity: 1; transform: translateY(0) }
        }

        .dialog-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.4rem 1.5rem 0;
        }
        .dialog-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #f1f5f9;
          margin: 0;
        }
        .dialog-close {
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .dialog-close:hover { color: #94a3b8; }
        .dialog-close:focus-visible { outline: 2px solid #6366f1; }

        .dialog-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          padding: 1.2rem 1.5rem 1.5rem;
        }

        .field-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .field-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .field-input {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.6);
          border-radius: 8px;
          padding: 0.65rem 0.9rem;
          color: #e2e8f0;
          font-size: 0.875rem;
          font-family: 'Space Mono', monospace;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          box-sizing: border-box;
          resize: none;
        }
        .field-input::placeholder { color: #334155; }
        .field-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        .field-input--error {
          border-color: #f87171 !important;
          box-shadow: 0 0 0 3px rgba(248,113,113,0.1) !important;
        }
        .field-textarea { font-family: 'Syne', sans-serif; line-height: 1.5; }
        .field-error { font-size: 0.75rem; color: #f87171; font-family: 'Space Mono', monospace; }

        .dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.6rem;
          margin-top: 0.4rem;
        }
        .btn-secondary {
          padding: 0.6rem 1.1rem;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 8px;
          color: #94a3b8;
          font-family: 'Syne', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-secondary:hover:not(:disabled) { border-color: #475569; color: #cbd5e1; }
        .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-primary {
          padding: 0.6rem 1.2rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none;
          border-radius: 8px;
          color: white;
          font-family: 'Syne', sans-serif;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.3);
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-loading {
          display: flex; align-items: center; gap: 0.5rem;
        }
        .spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
