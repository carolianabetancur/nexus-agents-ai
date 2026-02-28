import { apiClient } from "@/lib/api-client";
import {
	Category,
	CategoryListResponse,
	CreateCategoryInput,
	UpdateCategoryInput,
} from "../types/category.types";

export const categoryApi = {
	list: (search?: string) => {
		const params = search ? `?search=${encodeURIComponent(search)}` : "";
		return apiClient.get<CategoryListResponse>(
			`/api/resources/categories${params}`,
		);
	},

	create: (input: CreateCategoryInput) =>
		apiClient.post<Category>("/api/resources/categories", input),

	update: (id: string, input: UpdateCategoryInput) =>
		apiClient.patch<Category>(`/api/resources/categories/${id}`, input),

	remove: (id: string) =>
		apiClient.delete<{ success: boolean }>(`/api/resources/categories/${id}`),
};
