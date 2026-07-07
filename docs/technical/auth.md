# Authentication

## Identity Flow

```
Guest
    │
    ▼
Login / Register
    │
    ▼
Session (Supabase Auth)
    │
    ▼
Role Assigned
    │
    ▼
Permission Check
    │
    ▼
Access Resource
```

## Auth Stack

- **Provider:** Supabase Auth
- **Session:** HTTP-only cookies via `@supabase/ssr`
- **Strategies:** Email + password, OAuth (Google, GitHub — future)
- **MFA:** Future scope

## Auth Rules

- All `/studio`, `/editor`, `/admin` routes require authentication
- API routes check the session token on every request
- Role is stored in the User's metadata on Supabase Auth
- Role changes are logged in an audit table
- Session refresh is handled automatically by the Supabase client
- Guest users can read all published content without auth
- Authentication state is managed server-side (no client-side tokens)
- Middleware checks auth for protected routes at the edge

## Permission Enforcement

```
Route Handler / Server Action
    │
    ▼
Auth Check (session)
    │
    ▼
Role Check (metadata)
    │
    ▼
Knowledge Engine (business logic)
    │
    ▼
Database
```

Permissions are enforced at three levels:
1. **Route level** — middleware redirects unauthenticated users
2. **Engine level** — Knowledge Engine validates user permissions before operations
3. **Database level** — Row Level Security (RLS) on Supabase as final safeguard
