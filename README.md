# NEXUS AI — Agent Platform

> **Frontend Senior Technical Test** — Next.js 16 · TypeScript · App Router

A platform for generating, managing, and auditing massive fleets of AI agents. Built with performance, solid architecture, and real-world UX patterns as first-class priorities.

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Install
```bash
npm install
```

### Environment Variables
```env
# No external API required — all data is mocked via MSW.
# Uncomment only if wiring up a real backend:
# NEXT_PUBLIC_API_URL=https://your-api.com
```

### Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

### Demo Credentials
| Field | Value |
|---|---|
| Email | `ada@aiplatform.dev` |
| Password | `password123` |

---

## How to Test Each Screen

### 1. Authentication — `/login`
- Visit `/` → middleware redirects to `/login`
- Submit with empty fields → inline Zod validation errors appear
- Enter wrong credentials → error toast from MSW mock
- Login with demo credentials → redirects to `/app/dashboard`
- Click **Log out** in sidebar → session cleared, back to `/login`
- Navigate to `/app/agents` while logged out → redirected to `/login`

### 2. Dashboard — `/app/dashboard`
- Live stats cards: total agents, generation runs, categories, successful runs
- Recent agents list with status badges — each links to agent detail
- Recent generation runs with status dots — each shows run metadata
- **Launch Generator** button in top right

### 3. Resources — `/app/resources`
- Search categories (350ms debounce)
- Click **New Category** → modal form with inline validation
- Click pencil → edit form pre-populated
- Click trash → delete confirmation dialog
- All mutations fire toast notifications (success and error)

### 4. Agents — `/app/agents`
- 500 agents rendered via **TanStack Virtual** (only visible rows are in DOM)
- Search, category filter and status filter work simultaneously
- Click column headers **Name / Category / Created** to sort; click again to reverse
- Paginate with arrow buttons or numbered page pills
- Click **View →** on any row → agent detail

### 5. Agent Detail — `/app/agents/[id]`
- Full metadata: name, ID, category, status, tags, template, metrics, generation run
- Click **Edit Agent** → inline edit mode
- Modify name, description, status, category, or tags via tag picker
- Click **Save** → **optimistic update** (UI reflects change before server responds)
- If server fails → automatic rollback + error toast
- Click **Cancel** → form resets to original values; Save is disabled when unchanged

### 6. Generator — `/app/generator`
- Drag quantity slider (1–500) or type manually — both stay in sync
- Choose category dropdown and template card (Default / Advanced / Minimal)
- Toggle **Reproducibility Seed** — enable to type a 4-digit seed or click shuffle
- **Launch Generation** → animated triple-ring loading state
- On success → summary card with agent count, category, template, run ID, and sample agent links
- Click **New Run** to reset; click **View Audit Log** to jump to history
- To test error: the MSW mock has a 10% random failure rate — retry until it triggers, or see E2E tests which force a 503

### 7. Audit Log — `/app/generations`
- Chronological list of all generation runs
- Each card: run ID, timestamp, status badge, agent count, category, template, seed (if used)
- Successful runs link to the agents view
- **New Run →** button in header

---

## Running Tests

### Unit Tests (Jest + Testing Library)
```bash
npm run test            # run once
npm run test:watch      # watch mode
npm run test:coverage   # with coverage report
```

Covers:
- All four Zod schemas (`loginSchema`, `categorySchema`, `agentEditSchema`, `generatorSchema`)
- `StatusBadge` component rendering for all four statuses

---

## Scripts
```json
{
  "dev":            "next dev",
  "build":          "next build",
  "start":          "next start",
  "lint":           "eslint",
  "test":           "jest",
  "test:watch":     "jest --watch",
  "test:coverage":  "jest --coverage"
}
```

---

## Project Structure

```
.
├── app/
│   ├── (public)/login/          # Unauthenticated route
│   ├── (protected)/app/         # Auth-gated routes
│   │   ├── dashboard/
│   │   ├── agents/[id]/
│   │   ├── generator/
│   │   ├── resources/
│   │   └── generations/
│   ├── global-error.tsx          # Next.js uncaught error boundary
│   ├── not-found.tsx             # 404 page
│   └── layout.tsx                # Root layout (MSW + Query + Toaster)
├── modules/                      # Feature modules — each owns its api/hooks/types/components
│   ├── agents/
│   ├── auth/
│   ├── generations/
│   └── resources/
├── components/
│   ├── shared/                   # ErrorBoundary, QueryProvider, MSWProvider
│   └── ui/                       # shadcn primitives
├── lib/
│   └── api-client.ts             # Typed fetch wrapper with auto Bearer injection
├── store/
│   └── auth.store.ts             # Zustand auth store (persisted to localStorage)
├── mocks/                        # MSW handlers — 500 agents, auth, resources, generations
├── middleware.ts                  # Edge middleware — protects /app/* routes
├── __tests__/                    # Jest unit tests
├── jest.config.ts
├── jest.setup.ts
└── TECHNICAL_DECISIONS.md
```

---

## Mock API Reference

All requests are intercepted by **MSW** — no backend needed.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Mock JWT login |
| `GET` | `/api/auth/me` | Current user from token |
| `GET` | `/api/agents` | Paginated list — supports `page`, `limit`, `search`, `category`, `status`, `sortBy`, `sortDir` |
| `GET` | `/api/agents/:id` | Single agent |
| `PATCH` | `/api/agents/:id` | Update agent (600ms simulated latency) |
| `GET` | `/api/resources/categories` | List with optional `search` |
| `POST` | `/api/resources/categories` | Create category |
| `PATCH` | `/api/resources/categories/:id` | Update category |
| `DELETE` | `/api/resources/categories/:id` | Delete category |
| `GET` | `/api/resources/templates` | List templates |
| `GET` | `/api/generations` | All generation runs |
| `POST` | `/api/generations/run` | Run bulk generation (2s delay, 10% random failure) |

The 500 agents are generated with `faker.seed(42)` — fully deterministic and reproducible.
