# ARCHRON Security Audit — 2026-07-08

## Executive Summary

โครงสร้างมี **ช่องโหว่ร้ายแรง (P0) 6 จุด** ที่ต้องแก้ก่อน production
พบหลักๆ: middleware ไม่ถูกติดตั้ง, IDOR ใน studio API, บายพาสขั้นตอน review,
privilege escalation ใน admin, ขาด security headers

---

## P0 — Critical (ห้ามขึ้น production ก่อนแก้)

### 1. Middleware ไม่ถูกติดตั้ง — Route protection ใช้งานไม่ได้
**Location:** `packages/auth/src/middleware.ts` + ไม่มี `apps/*/src/middleware.ts`

`authMiddleware` ถูก export จาก package แต่ไม่มี app ไหนติดตั้ง
Next.js ต้องการ `middleware.ts` ที่ root ของ app (`apps/<app>/src/middleware.ts`)
ผลที่ตามมา: `isPublicRoute` matcher ไม่ทำงาน — ทุก route เปิดให้เข้าถึงได้โดยไม่มีการตรวจสิทธิ์ระดับ middleware

**Fix:** สร้าง `apps/web/src/middleware.ts`, `apps/admin/src/middleware.ts`, `apps/studio/src/middleware.ts`
แต่ละไฟล์ re-export จาก `@archron/auth`:
```ts
export { default } from "@archron/auth/middleware"
```
และขยาย `isPublicRoute` ให้ครอบคลุม public content routes ของ web app

---

### 2. IDOR — Studio draft routes ไม่ตรวจ ownership
**Location:** `apps/studio/src/app/api/drafts/[id]/route.ts`

`GET`, `PUT`, `DELETE` เช็คแค่ `userId` มีอยู่ (authenticated) แต่ไม่เช็คว่า
ผู้ใช้เป็นเจ้าของ draft นั้นหรือไม่ — writer คนไหนก็อ่าน/แก้/ล้าง draft ของ writer คนอื่นได้

**Fix:** หลังจาก `findObjectById` ให้เช็ค `obj.authorId === userId`
ถ้าไม่ใช่ return 403 หรือกรองตอน query เลย (`eq(objects.authorId, userId)`)

---

### 3. IDOR — Studio object routes ไม่ตรวจ ownership
**Location:** `apps/studio/src/app/api/objects/[slug]/route.ts`

ปัญหาเดียวกับ #2 — `GET`, `PUT` ไม่เช็ค ownership
writer คนไหนก็ edit object ของคนอื่นได้

**Fix:** เพิ่ม ownership check หรือกรองด้วย `authorId`

---

### 4. Authorization bypass — เปลี่ยน status บายพาสขั้นตอน review
**Location:** `apps/studio/src/app/api/drafts/[id]/route.ts` L27-28, `apps/studio/src/app/api/objects/[slug]/route.ts` L30-31

`PUT` ส่ง `request.json()` ตรงไป `updateObject()` ซึ่งรับฟิลด์ `status`
writer สามารถตั้ง `status: "published"` ได้โดยตรง — บายพาสขั้นตอน review/editor approval ทั้งหมด
และสามารถเปลี่ยน `authorId` เพื่อปลอมแต่งความเป็นเจ้าของได้

**Fix:** สร้าง whitelist ของฟิลด์ที่ writer แก้ได้ (title, description, tags, etc.)
ห้ามส่ง `status` และ `authorId` ผ่าน body — status เปลี่ยนได้ผ่าน publish/review flow เท่านั้น

```ts
const ALLOWED_FIELDS = ["title", "description", "tags", "domains", "aliases", "thumbnail"]
const sanitized = Object.fromEntries(
  Object.entries(body).filter(([k]) => ALLOWED_FIELDS.includes(k))
)
```

---

### 5. ไม่ตรวจ ownership ใน publish route
**Location:** `apps/studio/src/app/api/publish/route.ts`

`POST /api/publish` รับ `id` แล้วเปลี่ยน status เป็น "review" โดยไม่เช็คว่า
ผู้ขอเป็นเจ้าของ object นั้นหรือไม่ — writer คนไหนก็ submit object ของคนอื่นเข้า review ได้

**Fix:** โหลด object ก่อน เช็ค `obj.authorId === userId` ก่อนเปลี่ยน status

---

### 6. Privilege escalation — admin user management
**Location:** `apps/admin/src/app/api/users/[id]/route.ts` L23-38, `apps/admin/src/app/(auth)/layout.tsx` L15

admin layout เช็ค `requireRole("editor")` (level 4) และทุก admin API route เช็ค `editor`
แต่ `PUT /api/users/[id]` อนุญาตให้เปลี่ยน role ของ user — editor สามารถ
ยกตัวเอง (หรือใครก็ได้) ขึ้นเป็น `administrator` (level 5) ได้

**Fix:** แยก role check ตาม operation:
- Content management (archive/delete/merge) → `editor` ✓
- User management (list/view) → `editor` ✓
- **User role change + delete user** → `administrator` เท่านั้น
- Admin layout → `requireRole("administrator")` หรือแยก section

---

## P1 — High Priority

### 7. Web app `(auth)` pages ไม่มี layout guard
**Location:** `apps/web/src/app/(auth)/` — ไม่มี `layout.tsx`

ไม่มี middleware (#1) และไม่มี layout guard — หน้า `/studio`, `/settings`,
`/notifications`, `/reviews`, `/achievements`, `/contributions` เข้าถึงได้โดย unauthenticated users
หน้าทั้งหมดเป็น `"use client"` ที่ไม่เรียก `getAuth` หรือ `requireRole`
(API routes เบื้องหลังเช็ค auth อยู่ แต่ UI structure รั่ว)

**Fix:** สร้าง `apps/web/src/app/(auth)/layout.tsx`:
```tsx
import { requireRole } from "@archron/auth"
export default async function AuthLayout({ children }) {
  await requireRole("member")
  return <>{children}</>
}
```
หรือใช้ Clerk's `auth()` + redirect ไป login

---

### 8. ขาด Security Headers
**Location:** `apps/*/next.config.ts`

ไม่มี CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
ในทุก app — เปิดโอกาสให้ clickjacking, MIME sniffing, information leakage

**Fix:** เพิ่ม headers ในทุก `next.config.ts`:
```ts
const config: NextConfig = {
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: "default-src 'self'; ..." },
      ],
    }]
  },
}
```

---

### 9. ไม่มี Rate Limiting
**Location:** ทุก API route

ไม่มี rate limiting บน API route ใด โดยเฉพาะ `POST /api/chat` ที่ไม่มี auth เลย
เมื่อเชื่อม LLM backend จะถูก abuse ได้ทันที

**Fix:** ใช้ Upstash Redis (มีใน .env แล้ว) + `@upstash/ratelimit` สำหรับ
public endpoints อย่างน้อย และ auth บน chat endpoint

---

### 10. Input ไม่ถูก validate ใน update operations
**Location:** `apps/studio/src/app/api/drafts/[id]/route.ts` L27, `apps/studio/src/app/api/objects/[slug]/route.ts` L30

นอกจาก #4 (status/authorId bypass) แล้ว body ไม่ถูก validate เลย
ฟิลด์เช่น `slug` สามารถเปลี่ยนได้โดยไม่ผ่าน Slug Engine — ทำลาย immutability ของ slug

**Fix:** ใช้ zod schema หรือ whitelist ฟิลด์ที่อนุญาต + validate type

---

## P2 — Medium Priority

### 11. `.env` ถูก track ใน git
**Location:** `.env` (tracked), `.gitignore`

`.gitignore` บล็อกแค่ `.env.local` และ `.env.*.local` — `.env` ถูก track อยู่
ตอนนี้มีแค่ค่า non-sensitive แต่ถ้าใครเพิ่ม secret ลงไปจะถูก commit โดยไม่ตั้งใจ

**Fix:** เพิ่ม `.env` ลง `.gitignore` และย้ายค่าที่ไม่ลับไป `.env.example` (มีแล้ว)
หรือเปลี่ยนชื่อเป็น `.env.defaults` และเพิ่มใน `.gitignore`

---

### 12. `.turbo/cache/` ถูก track ใน git
**Location:** `.turbo/cache/` — 66 files tracked

build cache ไม่ควรอยู่ใน git — ทำให้ repo ใหญ่ขึ้นเรื่อยๆ และ merge conflict

**Fix:** เพิ่ม `.turbo/` ลง `.gitignore` และ `git rm -r --cached .turbo/`

---

### 13. Image remote pattern กว้างเกินไป
**Location:** `apps/web/next.config.ts` L28-32

อนุญาต `*.supabase.co` ทุก project ไม่ใช่แค่ project ตัวเอง

**Fix:** ระบุ hostname เฉพาะ: `<project-ref>.supabase.co`
หรือใช้ NEXT_PUBLIC_SUPABASE_URL เพื่อ derive hostname

---

### 14. `POST /api/chat` ไม่มี auth
**Location:** `apps/web/src/app/api/chat/route.ts`

endpoint เปิดให้ใครก็เรียกได้ — ตอนนี้เป็น placeholder แต่ถ้าต่อ LLM
จะเป็นปัญหา cost + abuse

**Fix:** เพิ่ม `getAuth()` check + rate limiting ก่อนเชื่อม LLM

---

### 15. Admin role check ต่ำเกินไปสำหรับ destructive ops
**Location:** `apps/admin/src/app/api/users/[id]/route.ts` (DELETE), `apps/admin/src/app/api/content/route.ts`

`DELETE /api/users/[id]` และ content deletion เช็คแค่ `editor`
user deletion ควรต้องการ `administrator`

**Fix:** ยก level check ของ user deletion + role change เป็น `administrator`

---

## P3 — Low Priority

### 16. ไม่มี CSRF protection บน state-changing endpoints
แม้ JSON body จะลดความเสี่ยง แต่ควรตั้ง SameSite cookie อย่างชัดเจน
Clerk จัดการ session cookie อยู่ แต่ควรยืนยัน SameSite=Lax หรือ Strict

### 17. Error messages รั่ย role structure
`requireRole` โยน error ว่า "Requires at least X role" — เปิดเผย role hierarchy
ควร return generic 403 แทน

---

## สรุปสถานะแยกตาม app

| App | Middleware | Layout Guard | API Auth | Issues |
|-----|-----------|-------------|----------|--------|
| web | ❌ ไม่มี | ❌ ไม่มี (auth) | บาง route ขาด | #1, #7, #8, #14 |
| admin | ❌ ไม่มี | ✅ editor | ✅ แต่ต่ำเกินไป | #1, #6, #8, #15 |
| studio | ❌ ไม่มี | ✅ writer | ✅ แต่ขาด ownership | #1, #2, #3, #4, #5, #10 |

## ลำดับการแก้ไขแนะนำ

1. **#1** — ติดตั้ง middleware ในทุก app (P0, พื้นฐานของทุกอย่าง)
2. **#4** — บล็อก status/authorId manipulation (P0, ง่ายที่สุดแก้)
3. **#2, #3, #5** — เพิ่ม ownership checks (P0)
4. **#6, #15** — ยก admin role check (P0)
5. **#7** — เพิ่ม web auth layout (P1)
6. **#8** — security headers (P1)
7. **#11, #12** — แก้ .gitignore + untrack (P2, ง่าย)
8. **#9** — rate limiting (P1)
9. ที่เหลือตามลำดับ

---

Generated: 2026-07-08
Auditor: opencode (security review)
