import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";

// ─── Seed data ────────────────────────────────────────────────────────────────
const CATEGORIES = [
	"home",
	"education",
	"productivity",
	"finance",
	"health",
	"entertainment",
];
const STATUSES = ["active", "inactive", "training", "deprecated"] as const;
const TAGS = [
	"nlp",
	"vision",
	"reasoning",
	"planning",
	"memory",
	"tool-use",
	"multimodal",
];

function generateAgent(id: string) {
	return {
		id,
		name:
			faker.person.firstName() +
			"-" +
			faker.string.alphanumeric(4).toUpperCase(),
		category: faker.helpers.arrayElement(CATEGORIES),
		status: faker.helpers.arrayElement(STATUSES),
		tags: faker.helpers.arrayElements(TAGS, { min: 1, max: 3 }),
		template: faker.helpers.arrayElement(["default", "advanced", "minimal"]),
		description: faker.lorem.sentence(),
		createdAt: faker.date.past({ years: 1 }).toISOString(),
		updatedAt: faker.date.recent({ days: 30 }).toISOString(),
		generationRunId: `run-${faker.string.alphanumeric(6)}`,
		metrics: {
			tasksCompleted: faker.number.int({ min: 0, max: 5000 }),
			successRate: faker.number.float({ min: 0.6, max: 1, fractionDigits: 2 }),
		},
	};
}

// Generate a stable list of 500 agents
faker.seed(42);
let agentDb = Array.from({ length: 500 }, (_, i) =>
	generateAgent(`agent-${i + 1}`),
);

// ─── Handlers ─────────────────────────────────────────────────────────────────
export const agentHandlers = [
	// List agents with filters, sort, pagination
	http.get("/api/agents", ({ request }) => {
		const url = new URL(request.url);
		const page = Number(url.searchParams.get("page") ?? 1);
		const limit = Number(url.searchParams.get("limit") ?? 20);
		const search = url.searchParams.get("search")?.toLowerCase() ?? "";
		const category = url.searchParams.get("category") ?? "";
		const status = url.searchParams.get("status") ?? "";
		const sortBy = url.searchParams.get("sortBy") ?? "createdAt";
		const sortDir = url.searchParams.get("sortDir") ?? "desc";

		let filtered = agentDb
			.filter(
				(a) =>
					!search ||
					a.name.toLowerCase().includes(search) ||
					a.description.toLowerCase().includes(search),
			)
			.filter((a) => !category || a.category === category)
			.filter((a) => !status || a.status === status);

		filtered = filtered.sort((a, b) => {
			const aVal = a[sortBy as keyof typeof a] as string;
			const bVal = b[sortBy as keyof typeof b] as string;
			return sortDir === "asc"
				? aVal.localeCompare(bVal)
				: bVal.localeCompare(aVal);
		});

		const total = filtered.length;
		const data = filtered.slice((page - 1) * limit, page * limit);

		return HttpResponse.json({
			data,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		});
	}),

	// Get single agent
	http.get("/api/agents/:id", ({ params }) => {
		const agent = agentDb.find((a) => a.id === params.id);
		if (!agent)
			return HttpResponse.json({ message: "Not found" }, { status: 404 });
		return HttpResponse.json(agent);
	}),

	// Update agent
	http.patch("/api/agents/:id", async ({ params, request }) => {
		const body = (await request.json()) as Record<string, unknown>;
		const idx = agentDb.findIndex((a) => a.id === params.id);
		if (idx === -1)
			return HttpResponse.json({ message: "Not found" }, { status: 404 });
		agentDb[idx] = {
			...agentDb[idx],
			...body,
			updatedAt: new Date().toISOString(),
		};
		await new Promise((r) => setTimeout(r, 600)); // simulate latency
		return HttpResponse.json(agentDb[idx]);
	}),
];
