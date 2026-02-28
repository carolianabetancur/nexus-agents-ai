import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";

faker.seed(99);

let categories = [
	{
		id: "cat-1",
		name: "Home",
		slug: "home",
		description: "Household automation agents",
		createdAt: faker.date.past().toISOString(),
	},
	{
		id: "cat-2",
		name: "Education",
		slug: "education",
		description: "Learning and tutoring agents",
		createdAt: faker.date.past().toISOString(),
	},
	{
		id: "cat-3",
		name: "Productivity",
		slug: "productivity",
		description: "Task and time management agents",
		createdAt: faker.date.past().toISOString(),
	},
	{
		id: "cat-4",
		name: "Finance",
		slug: "finance",
		description: "Financial analysis and budgeting agents",
		createdAt: faker.date.past().toISOString(),
	},
	{
		id: "cat-5",
		name: "Health",
		slug: "health",
		description: "Wellness and medical agents",
		createdAt: faker.date.past().toISOString(),
	},
];

const templates = [
	{
		id: "tpl-1",
		name: "Default",
		config: { maxTasks: 100, memory: "512mb" },
		createdAt: faker.date.past().toISOString(),
	},
	{
		id: "tpl-2",
		name: "Advanced",
		config: { maxTasks: 1000, memory: "2gb" },
		createdAt: faker.date.past().toISOString(),
	},
	{
		id: "tpl-3",
		name: "Minimal",
		config: { maxTasks: 10, memory: "128mb" },
		createdAt: faker.date.past().toISOString(),
	},
];

export const resourceHandlers = [
	// List categories (with optional search)
	http.get("/api/resources/categories", ({ request }) => {
		const url = new URL(request.url);
		const search = url.searchParams.get("search")?.toLowerCase() ?? "";
		const filtered = categories.filter(
			(c) =>
				!search ||
				c.name.toLowerCase().includes(search) ||
				c.description.toLowerCase().includes(search),
		);
		return HttpResponse.json({ data: filtered, total: filtered.length });
	}),

	// Create category
	http.post("/api/resources/categories", async ({ request }) => {
		const body = (await request.json()) as {
			name: string;
			description: string;
		};
		const newCat = {
			id: `cat-${Date.now()}`,
			slug: body.name.toLowerCase().replace(/\s+/g, "-"),
			...body,
			createdAt: new Date().toISOString(),
		};
		categories.push(newCat);
		return HttpResponse.json(newCat, { status: 201 });
	}),

	// Update category
	http.patch("/api/resources/categories/:id", async ({ params, request }) => {
		const body = (await request.json()) as Record<string, unknown>;
		const idx = categories.findIndex((c) => c.id === params.id);
		if (idx === -1)
			return HttpResponse.json({ message: "Not found" }, { status: 404 });
		categories[idx] = { ...categories[idx], ...body };
		return HttpResponse.json(categories[idx]);
	}),

	// Delete category
	http.delete("/api/resources/categories/:id", ({ params }) => {
		categories = categories.filter((c) => c.id !== params.id);
		return HttpResponse.json({ success: true });
	}),

	// List templates
	http.get("/api/resources/templates", () => {
		return HttpResponse.json({ data: templates, total: templates.length });
	}),
];
