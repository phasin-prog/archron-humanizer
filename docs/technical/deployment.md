# Deployment

## Stack

| Layer | Provider |
|-------|----------|
| Hosting | Vercel |
| DNS + CDN | Cloudflare |
| Database | Supabase |
| Storage | Supabase Storage |
| Auth | Supabase Auth |
| Monitoring | Sentry (future) |

## Pipeline

```
GitHub Push
    │
    ▼
Vercel Build
    │
    ├── Lint
    ├── Type check
    ├── Test
    └── Build
    │
    ▼
Vercel Deploy
    │
    ├── Preview (PR)
    └── Production (main)
```

## Environments

| Environment | URL | Branch |
|-------------|-----|--------|
| Production | archron.com | main |
| Staging | staging.archron.com | staging |
| Preview | *.vercel.app | PR branches |

## Caching Strategy

```
Next.js Cache
    │
    ▼
Cloudflare CDN
    │
    └── Static assets (images, CSS, JS)
    │
    ▼
Redis (future)
    └── Session cache, query cache
```

- Static pages are revalidated via ISR (Incremental Static Regeneration)
- Object pages revalidate on publish / update via `revalidatePath`
- Media assets are served from Supabase Storage CDN via Cloudflare
- API responses use `stale-while-revalidate` headers
- No full-site cache invalidation — per-path revalidation only

## Monorepo Configuration

Archron is a monorepo with 3 Next.js apps: `@archron/web`, `@archron/admin`, `@archron/studio`. Each requires separate Vercel project configuration.

### Root `vercel.json` (Web App)

```json
{
  "buildCommand": "turbo build --filter=@archron/web",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs",
  "installCommand": "pnpm install"
}
```

**Why this is needed**:
- Vercel expects `public/` output by default; Next.js outputs to `.next/`
- Turbo filter targets only the web app, skipping admin/studio builds
- Explicit `installCommand` uses pnpm (required by workspace)

### Deploying Other Apps

To deploy `@archron/admin` or `@archron/studio`:

1. Create separate Vercel projects
2. Add app-specific `vercel.json`:
   ```json
   {
     "buildCommand": "turbo build --filter=@archron/admin",
     "outputDirectory": "apps/admin/.next",
     "framework": "nextjs",
     "installCommand": "pnpm install"
   }
   ```
3. Configure environment variables per app

**Note**: Admin app uses `basePath: "/admin"` — consider deploying as subdomain instead.

## Environment Variables

### Required for Build

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | Clerk authentication secret |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-only) |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret |
| `R2_ENDPOINT` | R2 bucket endpoint |
| `R2_BUCKET_NAME` | R2 bucket name |
| `RESEND_API_KEY` | Resend email API key |
| `UPSTASH_REDIS_REST_URL` | Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Redis auth token |
| `FIRECRAWL_API_KEY` | Firecrawl API key |

### Frontend Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (used in image config) |
| `SENTRY_DSN` | Error tracking DSN (future) |
