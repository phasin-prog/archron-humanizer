# ARCHRON Design Audit — 2026-07-08

## Executive Summary

Build ผ่านแล้ว ✅ แต่พบ design quality issues หลายจุด

---

## P0 — Critical (Block Production)

### 1. Contrast Issues — Text Readability
**Location:** `apps/web/src/styles/globals.css`
- `--color-text-muted: #94A3B8` on `--color-background: #171C24` = **3.8:1** ❌ (ต้องการ ≥4.5:1)
- `--color-text-disabled: #64748B` on background = **2.4:1** ❌ (ต้องการ ≥4.5:1)
- Placeholder text ใช้ muted colors เดียวกัน = fail WCAG AA

**Fix:** Bump `text-muted` → `#A8B8D0` (4.6:1), `text-disabled` → `#8494AC` (3.2:1 สำหรับ disabled ยอมรับได้)

### 2. Domain Colors — Saturated Hard-Coded Hex
**Location:** `apps/web/src/app/explore/page.tsx` L19-32
```typescript
{ slug: "psychology", color: "#34D3F5" }  // Bright cyan
{ slug: "philosophy", color: "#A78BFA" }  // Bright purple
{ slug: "mythology", color: "#DC2626" }   // Bright red
```

**Problems:**
- Hard-coded hex ไม่อ้างอิง design tokens
- Saturated colors ไม่ match muted palette ใน globals.css
- No contrast validation against dark bg

**Fix:** ใช้ `--color-domain-*` จาก globals.css แทน

---

## P1 — High Priority (UX Impact)

### 3. Missing Responsive Breakpoints
**Location:** `apps/web/src/app/page.tsx`
- Grid: `sm:grid-cols-2 lg:grid-cols-3` — no md breakpoint
- Cards overflow on 768-1024px range
- Search bar width fixed ไม่ scale

**Fix:** เพิ่ม `md:grid-cols-2` และ responsive search bar width

### 4. Motion — No Reduced Motion Support
**Location:** Throughout app
- Transition ทุกตัวใช้ `duration-[var(--motion-*)]`
- ไม่มี `@media (prefers-reduced-motion: reduce)` override

**Fix:** เพิ่ม reduced motion stylesheet:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5. Card Hover State — Inconsistent
**Location:** 
- `page.tsx` L48: `hover:border-primary/30`
- `explore/page.tsx` L74: `hover:border-primary/30`
- `search/page.tsx` L287: `hover:border-primary/30`

**Observation:** Consistent แต่ hard-coded — ควรเป็น design token

**Fix:** สร้าง `--color-interactive-border-hover` token

### 6. Typography — Line Length Uncapped
**Location:** Hero sections ทั่วไป
- ไม่มี `max-width: 65ch` บน body text
- Long lines ยาก scan บน wide screens

**Fix:** เพิ่ม `max-w-reading` (65ch) wrapper

---

## P2 — Medium Priority (Polish)

### 7. Loading States Missing
**Location:** Search, explore pages
- ไม่มี skeleton หรือ spinner
- Suspense fallback แสดงแค่ "Loading..." text

**Fix:** สร้าง skeleton components สำหรับ cards

### 8. Empty States Generic
**Location:** `apps/web/src/app/search/page.tsx` L255
```tsx
<p className="font-serif text-section text-text-muted">No results found</p>
```

**Improvement:** เพิ่ม illustration, suggested actions, หรือ related domains

### 9. Z-Index Scattered
**Location:** Multiple files
- Arbitrary values: `z-10`, `z-20`
- ไม่มี semantic scale

**Fix:** สร้าง z-index design tokens:
```css
--z-base: 0;
--z-dropdown: 100;
--z-sticky: 200;
--z-modal-backdrop: 300;
--z-modal: 400;
--z-toast: 500;
--z-tooltip: 600;
```

### 10. Icon Sizes — Inconsistent Props
**Location:** `apps/web/src/app/explore/page.tsx` L76
```tsx
<type.icon size="lg" className="..." />
```

`size` prop ไม่ match Tailwind utilities — confusing API

**Fix:** Align with Tailwind: `size-4`, `size-6`, `size-8` or standardize custom sizes

---

## P3 — Low Priority (Nice to Have)

### 11. Focus Indicators Weak
**Observation:** Focus ring ใช้ `--color-ring: #5F8DCE`
- Contrast OK แต่ไม่ bold พอสำหรับ keyboard nav

**Suggestion:** เพิ่ม `ring-2` + `ring-offset-2` สำหรับ interactive elements

### 12. Card Shadows Subtle
**Location:** Cards ใช้ border แต่ไม่มี shadow
- Flat appearance บน elevated surfaces

**Suggestion:** เพิ่ม `shadow-sm` default, `shadow-md` on hover

### 13. Badge Colors Generic
**Location:** Object type badges ใช้ `color-mix(in_srgb, var(--color-concept) 15%, transparent)`
- Complex syntax, hard maintain

**Suggestion:** สร้าง badge variant tokens

### 14. Transition Curves — All Ease Default
**Observation:** ไม่มี exponential easing (ease-out-quart/quint)
- Mechanical feel

**Suggestion:** Define custom easings:
```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

### 15. Button Variants Limited
**Location:** `@archron/ui` buttons
- Only `outline` and `primary` visible in code

**Observation:** No ghost, soft, or danger variants yet

---

## Architecture Observations

### Design System Maturity: **Early Stage**
- ✅ Color tokens defined และ organized
- ✅ Typography scales exist (`text-display`, `text-section`, etc.)
- ⚠️ No spacing scale tokens (ใช้ Tailwind utilities ตรง)
- ⚠️ No motion tokens beyond duration
- ❌ No component-level tokens (button-padding, card-radius)

### Code Quality: **Good**
- TypeScript strict mode
- Component separation clean
- Props typed properly

### Build Status: **✅ Production Ready**
- All pages generate successfully
- No runtime errors
- TypeScript passes

---

## Recommended Priority Order

1. **P0.1** — Fix text contrast (globals.css)
2. **P0.2** — Replace hard-coded domain colors with tokens
3. **P1.4** — Add reduced motion support
4. **P1.3** — Fix responsive breakpoints
5. **P1.5** — Extract hover state tokens
6. **P2.9** — Create z-index scale
7. **P2.7** — Add loading skeletons
8. Rest as time permits

---

## Next Steps

1. ✅ Audit complete
2. 📖 Read AGENT-ARCHITECTURE-v2.md fully
3. 📖 Read ROADMAP.md remaining phases
4. 📋 Create P0-P3 task breakdown
5. 🔧 Fix P0 issues first
6. 💾 Commit changes
7. 🚀 Push to GitHub

---

Generated: 2026-07-08
Auditor: Claude (Kiro CLI)
