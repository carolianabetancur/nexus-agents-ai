import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";

// ─── Resources ────────────────────────────────────────────────────────────────
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

let templates = [
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
	http.get("/api/resources/categories", ({ request }) => {
		const url = new URL(request.url);
		const search = url.searchParams.get("search")?.toLowerCase() ?? "";
		const filtered = categories.filter(
			(c) => !search || c.name.toLowerCase().includes(search),
		);
		return HttpResponse.json({ data: filtered, total: filtered.length });
	}),

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

	http.patch("/api/resources/categories/:id", async ({ params, request }) => {
		const body = (await request.json()) as Record<string, unknown>;
		const idx = categories.findIndex((c) => c.id === params.id);
		if (idx === -1)
			return HttpResponse.json({ message: "Not found" }, { status: 404 });
		categories[idx] = { ...categories[idx], ...body };
		return HttpResponse.json(categories[idx]);
	}),

	http.delete("/api/resources/categories/:id", ({ params }) => {
		categories = categories.filter((c) => c.id !== params.id);
		return HttpResponse.json({ success: true });
	}),

	http.get("/api/resources/templates", () => {
		return HttpResponse.json({ data: templates, total: templates.length });
	}),
];

// ─── Generations ──────────────────────────────────────────────────────────────
let generationRuns = Array.from({ length: 12 }, (_, i) => ({
	id: `run-${faker.string.alphanumeric(6)}`,
	createdAt: faker.date.past({ years: 0.5 }).toISOString(),
	params: {
		quantity: faker.number.int({ min: 5, max: 100 }),
		category: faker.helpers.arrayElement([
			"home",
			"education",
			"productivity",
			"finance",
		]),
		template: faker.helpers.arrayElement(["default", "advanced", "minimal"]),
		seed: faker.number.int({ min: 1000, max: 9999 }),
	},
	status: faker.helpers.arrayElement([
		"success",
		"success",
		"success",
		"failed",
	]),
	generatedCount: faker.number.int({ min: 5, max: 100 }),
	agentIds: Array.from(
		{ length: faker.number.int({ min: 3, max: 10 }) },
		(_, j) => `agent-${j + 1}`,
	),
}));

export const generationHandlers = [
	http.get("/api/generations", () => {
		const sorted = [...generationRuns].sort((a, b) =>
			b.createdAt.localeCompare(a.createdAt),
		);
		return HttpResponse.json({ data: sorted, total: sorted.length });
	}),

	http.get("/api/generations/:id", ({ params }) => {
		const run = generationRuns.find((r) => r.id === params.id);
		if (!run)
			return HttpResponse.json({ message: "Not found" }, { status: 404 });
		return HttpResponse.json(run);
	}),

	http.post("/api/generations/run", async ({ request }) => {
		const body = (await request.json()) as {
			quantity: number;
			category: string;
			template: string;
			seed?: number;
		};

		// Simulate processing time
		await new Promise((r) => setTimeout(r, 2000));

		// 10% chance of failure for realism
		if (Math.random() < 0.1) {
			return HttpResponse.json(
				{ message: "Generation cluster unavailable. Please retry." },
				{ status: 503 },
			);
		}

		const newRun = {
			id: `run-${faker.string.alphanumeric(6)}`,
			createdAt: new Date().toISOString(),
			params: body,
			status: "success" as const,
			generatedCount: body.quantity,
			agentIds: Array.from(
				{ length: Math.min(body.quantity, 10) },
				(_, i) => `agent-${i + 1}`,
			),
		};

		generationRuns.unshift(newRun);
		return HttpResponse.json(newRun, { status: 201 });
	}),
];
