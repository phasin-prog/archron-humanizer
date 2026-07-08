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

Archron is a monorepo with 3 Next.js apps: `@archron/web`, `@archron/admin`, `@archron/studio`. Each deployed as separate Vercel project.

### Vercel Projects Setup

Create 3 separate Vercel projects:

1. **archron-web** (Production)
   - Root Directory: `apps/web`
   - Uses `apps/web/vercel.json`
   - Domain: `archron.com`

2. **archron-admin** (Admin Panel)
   - Root Directory: `apps/admin`
   - Uses `apps/admin/vercel.json`
   - Domain: `admin.archron.com` or subdomain

3. **archron-studio** (Studio)
   - Root Directory: `apps/studio`
   - Uses `apps/studio/vercel.json`
   - Domain: `studio.archron.com` or subdomain

### Configuration Files

Each app has `vercel.json`:

**`apps/web/vercel.json`**:
```json
{
  "buildCommand": "cd ../.. && pnpm install && pnpm turbo build --filter=@archron/web",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "cd ../.. && pnpm install",
  "ignoreCommand": "exit 0"
}
```

**`apps/admin/vercel.json`**:
```json
{
  "buildCommand": "cd ../.. && pnpm install && pnpm turbo build --filter=@archron/admin",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "cd ../.. && pnpm install",
  "ignoreCommand": "exit 0"
}
```

**`apps/studio/vercel.json`**:
```json
{
  "buildCommand": "cd ../.. && pnpm install && pnpm turbo build --filter=@archron/studio",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "cd ../.. && pnpm install",
  "ignoreCommand": "exit 0"
}
```

**Why this works**:
- Root Directory points to app subdirectory (Vercel finds Next.js in package.json)
- Build commands use `cd ../..` to run from monorepo root
- Turbo `--filter` builds only target app + dependencies
- `ignoreCommand: "exit 0"` forces deploy on every push
- Output directory relative to Root Directory

**Important**: Set Root Directory in each Vercel project settings to match app path.

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
