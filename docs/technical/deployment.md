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

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-only) |
| `SENTRY_DSN` | Error tracking DSN (future) |
