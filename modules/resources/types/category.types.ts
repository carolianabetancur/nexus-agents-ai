export interface Category {
	id: string;
	name: string;
	slug: string;
	description: string;
	createdAt: string;
}

export interface CategoryListResponse {
	data: Category[];
	total: number;
}

export interface CreateCategoryInput {
	name: string;
	description: string;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
