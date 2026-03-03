<div align="center">

# NishchayJyot · निश्चयज्योत

### Citizen Grievance Portal for India's One Nation One Challan (ONOC) Initiative

*"Resolving with certainty"*

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)](https://nextjs.org) [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](./Dockerfile)

**Built for the SSIP Hackathon 2023 · Gujarat, India**

</div>

---

## Overview

India's **One Nation One Challan (ONOC)** initiative unifies traffic enforcement across states — but the current grievance process is fragmented, opaque, and difficult for citizens to navigate.

**NishchayJyot** addresses this with a unified, AI-assisted grievance redressal portal purpose-built for ONOC. It gives citizens visibility into their challans, a guided path to contest errors, and real-time status updates at every stage. Authorities get a structured admin panel with analytics and reporting tools to manage cases efficiently.

### The Problem

Gujarat's ONOC pilot — spanning Ahmedabad, Rajkot, Gandhinagar, Vadodara, and Surat — leverages the **VISWAS** project: 7,000+ CCTV cameras at DIAMOND junctions that auto-generate challans. This scale creates systemic gaps:

| Gap | Impact |
|---|---|
| No centralized challan database | Citizens receive inconsistent data across portals |
| Generic grievance forms | Not aligned to ONOC-specific violation types |
| No post-submission tracking | Citizens have zero visibility once a grievance is filed |
| Geographic enforcement bias | Challans concentrated around specific camera clusters |
| Limited violation coverage | Only 2 of 10+ violation types are actively tracked |

---

## Features

### Citizen Portal

| Feature | Description |
|---|---|
| **Dashboard** | Stats overview, pending payments, recent grievances, quick actions |
| **Challan Lookup** | Search any challan by number — view violation, fine, and payment status |
| **Lodge Grievance (Form)** | Direct submission form across 6 grievance categories |
| **Lodge Grievance (AI)** | Conversational chatbot that guides citizens through filing step by step |
| **Track Grievances** | Full list with status filters and search; click through to a detailed timeline |
| **Grievance Timeline** | Real-time audit trail of every status change, powered by Supabase Realtime |
| **Notifications** | In-app notification centre with live bell badge updates |
| **Feedback** | Post-resolution satisfaction rating with optional comments |
| **FAQ** | Searchable knowledge base; managed by admins |
| **Profile** | Edit personal info, vehicle number, and driving licence number |

### Admin Portal

| Feature | Description |
|---|---|
| **Dashboard** | KPI cards (total, open, resolved, SLA-breached) with trend charts |
| **Manage Grievances** | Paginated table with search by challan number or description, plus status filters |
| **Grievance Review** | Full detail view; update status and priority, attach resolution notes |
| **Reports & Analytics** | Recharts visualizations: status donut, category bars, monthly trend, hotspot ranking |
| **CSV Export** | Download all grievances with full metadata as a timestamped CSV |
| **Manage FAQs** | Full CRUD interface: create, edit, publish/unpublish, and delete entries |
| **Citizen Feedback** | View all submitted feedback with satisfaction ratings |

### AI Chatbot

- Powered by **OpenAI `gpt-4o-mini`** when `OPENAI_API_KEY` is set
- Falls back to a smart, keyword-based mock response if no key is configured
- Streaming SSE responses (token-by-token) via an **Edge runtime** route handler
- System prompt scoped exclusively to the ONOC grievance domain

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
| Toast Notifications | Sonner |
| Package Manager | pnpm |
| Deployment | Vercel / Docker |

---

## Project Structure

```text
client/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, Register pages
│   │   ├── (citizen)/           # Citizen dashboard pages
│   │   ├── (admin)/             # Admin dashboard pages
│   │   ├── api/chat/            # Streaming AI chatbot route (Edge runtime)
│   │   ├── globals.css          # Tailwind v4 theme (Government Blue + Saffron)
│   │   ├── layout.tsx           # Root layout (Poppins font)
│   │   └── page.tsx             # Public landing page
│   ├── actions/                 # Next.js Server Actions
│   │   ├── auth.ts              # Login, register, logout
│   │   ├── grievances.ts        # CRUD + status updates
│   │   ├── challans.ts          # Challan lookup + user challans
│   │   ├── notifications.ts     # Fetch + mark as read
│   │   ├── feedback.ts          # Submit + admin read
│   │   └── faqs.ts              # CRUD for admin
│   ├── components/
│   │   ├── layout/              # TopNavbar, DashboardShell
│   │   ├── citizen/             # ChallanLookupWidget
│   │   ├── dashboard/           # Recharts chart components
│   │   ├── faq/                 # FAQ CRUD dialog
│   │   ├── grievance/           # GrievanceTimelineRealtime
│   │   └── ui/                  # shadcn/ui components
│   ├── hooks/
│   │   ├── use-realtime-notifications.ts
│   │   └── use-realtime-grievance.ts
│   └── lib/
│       ├── supabase/            # client.ts, server.ts, admin.ts, types.ts
│       ├── ai/                  # chatbot.ts (system prompt)
│       ├── constants.ts         # Labels and colors for enums
│       └── utils.ts             # formatDate, formatCurrency, cn()
```

---

## Database Schema

Seven core tables, all with **Row Level Security (RLS)** enabled:

| Table | Purpose |
|---|---|
| `profiles` | Extends `auth.users` with citizen/admin profile data |
| `challans` | ONOC traffic challans (seeded from external source or VISWAS feed) |
| `grievances` | Citizen-submitted complaints linked to challans |
| `grievance_timeline` | Immutable audit trail for every grievance status change |
| `notifications` | Per-user notification feed, subscribed via Realtime |
| `feedback` | Post-resolution citizen satisfaction data |
| `faqs` | Admin-managed knowledge base articles |

### Grievance Categories

| Value | Description |
|---|---|
| `false_challan` | Challan issued for a violation that did not occur |
| `wrong_amount` | Fine amount is incorrect or disproportionate |
| `wrong_vehicle` | Challan issued against the wrong vehicle |
| `duplicate_challan` | Same violation has been challaned more than once |
| `payment_issue` | Payment was made but challan still shows as unpaid |
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

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials (found in **Supabase Dashboard → Project Settings → API**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-...          # Optional — chatbot works in mock mode without this
```

### 3. Set up the database

Run the SQL migrations in order via **Supabase Dashboard → SQL Editor → New Query**:

| Order | File | Purpose |
|---|---|---|
| 1 | `00001_enums.sql` | Postgres enum types |
| 2 | `00002_tables.sql` | All tables with constraints |
| 3 | `00003_rls.sql` | Row Level Security policies |
| 4 | `00004_functions.sql` | Helper functions and triggers |
| 5 | `00005_seed_challans.sql` | Sample ONOC challan data |
| 6 | `00006_seed_faqs.sql` | Default FAQ entries |
| 7 | `00007_notifications_trigger.sql` | Auto-notification on grievance events |

### 4. Create an admin user

1. Register a user through the app at `/register`
2. Promote them to admin in the SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE phone = 'your_phone_number';
```

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Docker

The app ships with a three-stage Dockerfile (`deps → builder → runner`) using Next.js [standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) to produce a minimal production image (~200 MB).

### Quick start with Docker Compose

```bash
cp .env.example .env.local
docker compose up --build
# App is available at http://localhost:3000
```

### Build and run manually

```bash
# Build
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key \
  -t nischayjyot .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
  -e OPENAI_API_KEY=sk-... \
  nischayjyot
```

### Environment variables — build vs. runtime

| Variable | When needed | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Build **and** runtime | `NEXT_PUBLIC_*` vars are inlined at compile time |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build **and** runtime | Must be a build-arg for the same reason |
| `SUPABASE_SERVICE_ROLE_KEY` | Runtime only | Server-side secret — never bake into image layers |
| `OPENAI_API_KEY` | Runtime only | Optional; chatbot falls back to mock mode |
| `CLOUDINARY_CLOUD_NAME` | Runtime only | Optional; evidence upload feature |
| `CLOUDINARY_API_KEY` | Runtime only | Optional; evidence upload feature |
| `CLOUDINARY_API_SECRET` | Runtime only | Optional; evidence upload feature |

> **Security:** Never pass `SUPABASE_SERVICE_ROLE_KEY` or `OPENAI_API_KEY` as Docker build args — doing so permanently embeds them in the image layer history.

### Docker files

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build: deps → builder → Alpine runner |
| `docker-compose.yml` | Single-service Compose for local / self-hosted deployment |
| `.dockerignore` | Excludes `node_modules`, `.next`, `.env.*`, `.git` from build context |

---

## Deploying to Vercel

1. Push the `client/` directory to a GitHub repository
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. If deploying from a monorepo, set **Root Directory** to `client`
4. Add the following environment variables under **Project Settings → Environment Variables**:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only — never exposed to the browser |
| `OPENAI_API_KEY` | No | Enables real AI responses; mock fallback used otherwise |

5. Click **Deploy** — Vercel auto-detects Next.js and runs `pnpm build`

> **Note:** Remove `output: "standalone"` from `next.config.ts` when deploying to Vercel. Standalone mode is for Docker only; Vercel manages its own build output.

---

## Architecture Notes

**Server Actions over REST** — Server Actions colocate data fetching with UI, reduce boilerplate, and are natively type-safe. They integrate cleanly with Next.js caching and revalidation primitives.

**Supabase Realtime for notifications** — Uses PostgreSQL logical replication. Citizens see badge updates and timeline changes the moment an admin acts — no polling, no latency.

**Edge runtime for the chatbot** — Streaming SSE responses require open connections held for several seconds. Vercel Edge eliminates cold starts and has no execution timeout.

**Cookie-based auth via `@supabase/ssr`** — Works identically across Server Components, Server Actions, Route Handlers, and Middleware with no localStorage dependency and no hydration mismatches.

**Admin client isolation** — `createAdminClient()` (service role key) is only ever called in server-side code. RLS is bypassed exclusively for privileged admin operations.

---

## Team Coding Brigades

<div align="center">
  <table border="0" cellpadding="15">
    <tr>
      <td align="center" width="200">
        <a href="https://github.com/slantie">
          <img src="https://github.com/slantie.png?size=120" width="100" style="border-radius:50%; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);" alt="Kandarp Gajjar"/>
          <br /><br /><b>Kandarp Gajjar</b>
        </a>
        <br /><i>Full Stack / AI</i>
      </td>
      <td align="center" width="200">
        <a href="https://github.com/ridh21">
          <img src="https://github.com/ridh21.png?size=120" width="100" style="border-radius:50%; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);" alt="Ridham Patel"/>
          <br /><br /><b>Ridham Patel</b>
        </a>
        <br /><i>Frontend / UI</i>
      </td>
      <td align="center" width="200">
        <a href="https://github.com/xcode-nancy">
          <img src="https://github.com/xcode-nancy.png?size=120" width="100" style="border-radius:50%; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);" alt="Nancy Patel"/>
          <br /><br /><b>Nancy Patel</b>
        </a>
        <br /><i>Frontend / UI</i>
      </td>
      <td align="center" width="200">
        <a href="https://github.com/stack-krutika">
          <img src="https://github.com/stack-krutika.png?size=120" width="100" style="border-radius:50%; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);" alt="Krutika Patel"/>
          <br /><br /><b>Krutika Patel</b>
        </a>
        <br /><i>Frontend / UI</i>
      </td>
    </tr>
    <tr>
      <td align="center" width="200">
        <a href="https://github.com/kritikaat">
          <img src="https://github.com/kritikaat.png?size=120" width="100" style="border-radius:50%; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);" alt="Kritika Thakkar"/>
          <br /><br /><b>Kritika Thakkar</b>
        </a>
        <br /><i>Backend / Database</i>
      </td>
      <td align="center" width="200">
        <a href="https://github.com/Palvanp">
          <img src="https://github.com/Palvanp.png?size=120" width="100" style="border-radius:50%; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);" alt="Palak Vanpariya"/>
          <br /><br /><b>Palak Vanpariya</b>
        </a>
        <br /><i>AI / Database</i>
      </td>
      <td align="center" width="200">
        <a href="https://github.com/HarshDodiya1">
          <img src="https://github.com/HarshDodiya1.png?size=120" width="100" style="border-radius:50%; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);" alt="Harsh Dodiya"/>
          <br /><br /><b>Harsh Dodiya</b>
        </a>
        <br /><i>Backend / Database</i>
      </td>
      <td align="center" width="200">
        <a href="https://github.com/Oum-Gadani">
          <img src="https://github.com/Oum-Gadani.png?size=120" width="100" style="border-radius:50%; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);" alt="Oum Gadani"/>
          <br /><br /><b>Oum Gadani</b>
        </a>
        <br /><i>Backend / Database</i>
      </td>
    </tr>
  </table>

  <br />
  <p><b>Project Mentor:</b> Dr. Himani Trivedi</p>
</div>

</div>

---

*NishchayJyot — SSIP Hackathon Project, Gujarat, India.*
