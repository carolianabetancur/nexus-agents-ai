import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoryApi } from "../api/category.api";
import {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "../types/category.types";

export const CATEGORY_KEYS = {
	all: ["categories"] as const,
	list: (search?: string) => ["categories", "list", search ?? ""] as const,
};

export function useCategories(search?: string) {
	return useQuery({
		queryKey: CATEGORY_KEYS.list(search),
		queryFn: () => categoryApi.list(search),
	});
}

export function useCreateCategory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateCategoryInput) => categoryApi.create(input),
		onSuccess: (created) => {
			qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
			toast.success(`Category "${created.name}" created successfully`);
		},
		onError: (err: Error) => {
			toast.error(err.message ?? "Failed to create category");
		},
	});
}

export function useUpdateCategory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
			categoryApi.update(id, input),
		onSuccess: (updated) => {
			qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
			toast.success(`Category "${updated.name}" updated`);
		},
		onError: (err: Error) => {
			toast.error(err.message ?? "Failed to update category");
		},
	});
}

export function useDeleteCategory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => categoryApi.remove(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
			toast.success("Category deleted");
		},
		onError: (err: Error) => {
			toast.error(err.message ?? "Failed to delete category");
		},
	});
}
