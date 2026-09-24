# RETRO OLLIE GAMES

**OLD TECH. NEW LIFE.**

Restored consoles, games & tech — sourced from marketplaces and eBay, restored at the
workbench, and shipped ready to play. Plus a full refurbishment service: customers send in
their consoles and get them respawned.

## Stack

| Layer      | Tech                                    |
| ---------- | --------------------------------------- |
| Framework  | Next.js 16 (App Router) + TypeScript    |
| Database   | Neon PostgreSQL + Prisma 7 (serverless) |
| Payments   | Stripe Checkout + verified webhooks     |
| Styling    | Tailwind CSS 4 + custom CRT design sys  |
| Hosting    | Vercel                                  |
| Source     | GitHub                                  |

## Commerce features

- **One-of-one inventory protection** — atomic server-side reservation inside a DB
  transaction; two customers can never buy the same unique console
- **Server-authoritative pricing** — the browser never sends prices; checkout pulls real
  product data from Neon
- **Idempotent Stripe webhooks** — status-guarded order transitions; duplicate deliveries
  can't corrupt inventory
- **Abandoned-checkout restock** — reserved units return to the shelf automatically
- **Price snapshots** — orders store what was actually paid, not the current catalog price
- **Refund architecture** — admin-initiated Stripe refunds; inventory is *not* auto-restocked
  (the owner decides after physical return)

## Refurbishment (Respawn) system

- Customer intake with generated job numbers (`RESPAWN-00128`)
- 10-stage pipeline: REQUEST_RECEIVED → AWAITING_DEVICE → … → COMPLETED
- Customer-facing status tracking at `/respawn-log` (job number + email)
- Stripe deposit flow per job, quote adjustable after inspection
- Internal notes stay internal

## Admin Control Center (`/admin`)

Product CRUD with private acquisition/parts/other costs (never rendered publicly),
publish/unpublish, order management with guarded refunds, service pipeline updates,
trade-lead tracking, and real analytics (revenue, AOV, contribution profit, margin,
inventory value).

## Local development

```bash
pnpm install
cp .env.example .env.local   # fill in real values
pnpm prisma db push          # sync schema
pnpm seed                    # platforms, tiers, catalog, admin user
pnpm dev
```

## Scripts

```bash
pnpm build       # production build
pnpm typecheck   # tsc --noEmit
pnpm seed        # idempotent seed (skips existing records)
pnpm db:check    # row counts per table
```

## Environment variables

See `.env.example` for the full list with safe placeholders. Real values live only in
Vercel (Production/Preview) and local `.env.local` — never committed.

## Deployment

GitHub → Vercel (auto-deploys on push). Neon pooler connection string, Stripe keys, and
`AUTH_SECRET` are configured as Vercel environment variables. Stripe webhook endpoint:
`https://retro-ollie-games.vercel.app/api/stripe/webhook`
