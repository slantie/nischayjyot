# NishchayJyot — Citizen Grievance Portal for ONOC

> **SSIP Hackathon Project** — Student Startup and Innovation Policy
> A modern, AI-assisted grievance redressal portal for India's One Nation One Challan (ONOC) traffic enforcement system.

---

## Overview

**NishchayJyot** ("resolving with certainty") addresses critical gaps in the existing eChallan grievance workflow. India's ONOC initiative unifies traffic challan enforcement across states, but the current grievance process is fragmented, opaque, and difficult for citizens to navigate.

This portal provides:

- A citizen-facing dashboard for lodging, tracking, and resolving challan grievances
- An AI chatbot assistant that guides citizens through the grievance process conversationally
- A full admin panel for police/NIC staff to review, prioritize, and resolve cases
- Real-time status notifications at every stage of the resolution workflow
- Challan analytics and reporting for data-driven enforcement insights

### Problem Context

The Gujarat pilot of ONOC (covering Ahmedabad, Rajkot, Gandhinagar, Vadodara, and Surat) leverages the **VISWAS** project — a network of 7,000+ CCTV cameras at DIAMOND junctions — to auto-generate challans. This creates challenges:

| Gap | Impact |
|---|---|
| No centralized challan database | Citizens get inconsistent data across portals |
| Generic grievance forms | Not aligned to ONOC violation types |
| No real-time tracking | Citizens have no visibility post-submission |
| Enforcement bias | Challans concentrated at specific geographic points |
| Limited violation coverage | Only 2 of 10+ violation types tracked |

**NishchayJyot** solves this with a unified, transparent, AI-assisted interface.

---

## Features

### Citizen Portal

| Feature | Description |
|---|---|
| **Dashboard** | Stats overview, pending challan payments, recent grievances, quick actions |
| **Challan Lookup** | Search any challan by number — see violation, fine, payment status |
| **Lodge Grievance (Form)** | Direct submission form with 6 grievance categories |
| **Lodge Grievance (AI)** | Conversational chatbot guides through lodging step by step |
| **Track Grievances** | Full list with status filters and search; click through to timeline |
| **Grievance Timeline** | Real-time audit trail of every status change, powered by Supabase Realtime |
| **Notifications** | In-app notification centre; bell badge updates live |
| **Feedback** | Post-resolution satisfaction rating with comments |
| **FAQ** | Searchable knowledge base; admin-managed |
| **Profile** | Edit personal info, vehicle number, DL number |

### Admin Portal

| Feature | Description |
|---|---|
| **Dashboard** | KPI cards (total, open, resolved, SLA breached), trend charts |
| **Manage Grievances** | Paginated table with search (challan no., description) + status filters |
| **Grievance Review** | Full detail view; change status, priority, add resolution notes |
| **Reports & Analytics** | Recharts visualizations: status donut, category bars, monthly trend, hotspot ranking, resolution rates |
| **CSV Export** | Download all grievances with full metadata as a dated CSV file |
| **Manage FAQs** | CRUD interface (create, edit, publish/unpublish, delete) |
| **Citizen Feedback** | Read all submitted feedback with satisfaction ratings |

### AI Chatbot

- Powered by OpenAI (`gpt-4o-mini`) when `OPENAI_API_KEY` is configured
- Falls back to a smart keyword-based mock response if no key is set
- Streaming SSE responses (token-by-token) via Edge runtime route
- System prompt scoped to ONOC grievance domain

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions, Route Handlers) |
| Database & Auth | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Charts | Recharts |
| AI | Vercel AI SDK + OpenAI (`gpt-4o-mini`) |
| Validation | Zod |
| Forms | React Hook Form |
| Notifications (UI) | Sonner |
| Package Manager | pnpm |
| Deployment | Vercel |

---

## Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login, Register pages
│   │   ├── (citizen)/       # Citizen dashboard pages
│   │   ├── (admin)/         # Admin dashboard pages
│   │   ├── api/chat/        # Streaming AI chatbot route (Edge runtime)
│   │   ├── globals.css      # Tailwind v4 theme (Government Blue + Saffron)
│   │   ├── layout.tsx       # Root layout (Poppins font)
│   │   └── page.tsx         # Public landing page
│   ├── actions/             # Next.js Server Actions
│   │   ├── auth.ts          # Login, register, logout
│   │   ├── grievances.ts    # CRUD + status update
│   │   ├── challans.ts      # Challan lookup + user challans
│   │   ├── notifications.ts # Fetch + mark read
│   │   ├── feedback.ts      # Submit + admin read
│   │   └── faqs.ts          # CRUD for admin
│   ├── components/
│   │   ├── layout/          # TopNavbar, DashboardShell
│   │   ├── citizen/         # ChallanLookupWidget
│   │   ├── dashboard/       # Recharts chart components
│   │   ├── faq/             # FAQ CRUD dialog
│   │   ├── grievance/       # GrievanceTimelineRealtime
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/
│   │   ├── use-realtime-notifications.ts
│   │   └── use-realtime-grievance.ts
│   └── lib/
│       ├── supabase/        # client.ts, server.ts, admin.ts, types.ts
│       ├── ai/              # chatbot.ts (system prompt)
│       ├── constants.ts     # Labels, colors for enums
│       └── utils.ts         # formatDate, formatCurrency, cn()
```

---

## Database Schema

Seven core tables with full RLS (Row Level Security) on every table:

| Table | Purpose |
|---|---|
| `profiles` | Extends `auth.users` with citizen/admin profile data |
| `challans` | ONOC traffic challans (seeded from external source or VISWAS feed) |
| `grievances` | Citizen-submitted complaints linked to challans |
| `grievance_timeline` | Immutable audit trail for every grievance status change |
| `notifications` | Per-user notification feed, Realtime-subscribed |
| `feedback` | Post-resolution citizen satisfaction data |
| `faqs` | Admin-managed knowledge base articles |

### Grievance Categories

| Value | Meaning |
|---|---|
| `false_challan` | Challan issued for a violation that never occurred |
| `wrong_amount` | Fine amount is incorrect or disproportionate |
| `wrong_vehicle` | Challan issued against the wrong vehicle number |
| `duplicate_challan` | Same violation challan'd more than once |
| `payment_issue` | Payment was made but challan still shows unpaid |
| `other` | Any other ONOC-related grievance |

### Grievance Status Flow

```
open → in_progress → under_review → resolved
                                  → rejected
                                  → escalated
```

---

## Local Development

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- A [Supabase](https://supabase.com) project

### 1. Install dependencies

```bash
cd client
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase project credentials (found in Supabase Dashboard → Project Settings → API):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-...          # Optional — chatbot works in mock mode without it
```

### 3. Set up the database

Run the SQL migrations in your Supabase project (SQL Editor → New Query) in order:

1. `00001_enums.sql` — Postgres enum types
2. `00002_tables.sql` — All tables with constraints
3. `00003_rls.sql` — Row Level Security policies
4. `00004_functions.sql` — Helper functions and triggers
5. `00005_seed_challans.sql` — Sample ONOC challan data
6. `00006_seed_faqs.sql` — Default FAQ entries
7. `00007_notifications_trigger.sql` — Auto-notification on grievance events

### 4. Create an admin user

1. Register a user through the app at `/register`
2. Promote them to admin in Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE phone = 'your_phone_number';
```

### 5. Start development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

### Steps

1. Push the `client/` directory to a GitHub repository
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. If deploying from a monorepo, set **Root Directory** to `client`
4. Add these environment variables in Vercel → Project Settings → Environment Variables:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only — never exposed to browser |
| `OPENAI_API_KEY` | No | Enables real AI; mock fallback used otherwise |

5. Click **Deploy** — Vercel auto-detects Next.js and uses `pnpm build`

### Notes

- The AI chat route (`/api/chat`) uses `export const runtime = "edge"` for streaming
- No `vercel.json` is required — Next.js 16 is auto-detected
- All admin routes use the service role key server-side only

---

## Architecture Notes

**Server Actions over REST API** — Server Actions colocate data fetching with UI, reduce boilerplate, and are natively type-safe. They integrate with Next.js caching and revalidation.

**Supabase Realtime for notifications** — Uses PostgreSQL logical replication. Citizens see badge updates and timeline changes the moment an admin acts — no polling needed.

**Edge runtime for the chatbot** — Streaming SSE responses need open connections for several seconds. Vercel Edge has no cold starts and no execution timeout.

**Cookie-based auth (`@supabase/ssr`)** — Works identically across Server Components, Server Actions, Route Handlers, and Middleware. No localStorage, no hydration mismatches.

**Admin client isolation** — `createAdminClient()` (service role) is only ever called in server-side code. RLS is bypassed only for privileged admin operations.

---

## License

MIT License

---

*NishchayJyot — SSIP Hackathon Project, Gujarat, India.*
