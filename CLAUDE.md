# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run lint      # ESLint
npm run start     # Start production server
```

Prisma client is auto-generated on `postinstall`. Regenerate manually with `npx prisma generate`.

## Architecture

### Stack

- **Framework:** Next.js (App Router) + React 19
- **Database/ORM:** PostgreSQL via Supabase + Prisma 7 (client output at `src/generated/prisma/client`)
- **Auth:** Supabase Auth — session stored in cookies, validated server-side
- **Styling:** Tailwind CSS 4 (PostCSS), Framer Motion
- **UI:** shadcn/ui + Radix UI primitives in `src/components/ui/`
- **Forms:** React Hook Form + Zod 4
- **i18n:** next-intl — 3 locales: `fr` (default), `en`, `es`
- **AI:** OpenAI (DALL-E 3 image generation)
- **Email:** Resend with React Email templates
- **File uploads:** Supabase Storage (images uploaded server-side)

### Routing

All public pages live under `src/app/[locale]/` — the `[locale]` segment is always present. `src/app/page.tsx` just redirects to the default locale.

Admin pages live under `src/app/admin/`. Protected admin pages are inside the `(protected)` route group. Every protected page calls `requireAdminPageAccess()` from `src/lib/admin-auth.ts` which checks the Supabase session and verifies the user email is in the `ADMIN_EMAILS` env var.

### API Routes (`src/app/api/`)

Public:
- `GET /api/artworks` — gallery listing
- `POST /api/commandes` — submit a custom order (sends email via Resend)
- `POST /api/generate-image` — OpenAI image generation (DALL-E 3)
- `GET /api/health` — health check

Admin (all require `requireAdmin()` from `src/lib/admin-auth.ts`):
- `/api/admin/artworks` — artwork CRUD
- `/api/admin/artworks/[id]/images` — image upload/delete per artwork
- `/api/admin/commandes/[id]` — order detail & status updates
- `/api/admin/clarity` — Microsoft Clarity analytics proxy

### Auth Flow

`src/lib/supabase/server.ts` — Supabase client with cookie storage (for server components/routes).
`src/lib/supabase.ts` — Supabase admin client with service role key (no session, for DB writes).
`src/lib/admin-auth.ts` — `requireAdmin()` for API routes, `requireAdminPageAccess()` for page components.

### Data Models (Prisma)

- `Artwork` — gallery items (slug, title, description, imageUrl, category, tags, featured)
- `AIImage` — DALL-E generated images
- `Order` — customer commandes (name, email, description, optional imageUrl/budget/dimensions, status)

### i18n

Locale routing is handled by next-intl middleware. Translation files: `src/messages/{fr,en,es}.json`. Use `getTranslations()` (server) or `useTranslations()` (client). Navigation helpers in `src/i18n/navigation.ts` provide locale-aware `<Link>` and `redirect`.

### Environment Variables

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY` | DALL-E image generation |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side Supabase key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin DB access |
| `DATABASE_URL` | PostgreSQL pooler connection string |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `RESEND_TO_EMAIL` | Transactional email |
| `ADMIN_EMAILS` | Comma-separated list of allowed admin emails |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` / `CLARITY_API_TOKEN` | Microsoft Clarity analytics |
