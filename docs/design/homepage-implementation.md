# Homepage Design — Implementation Notes

Version: 1.0
Date: 2026-07-07
Status: Complete

---

## Design Requirements

✅ Logo centered on homepage  
✅ Site navigation below logo (at eye level)  
✅ Simple, accessible, fast UX  
✅ Easy on the eyes  
✅ No redundant work

---

## Implementation

### Hero Section (Eye-Level Layout)

```
┌─────────────────────────────────┐
│                                 │
│          ARCHRON                │
│   Understanding Humanity        │
│    Through Knowledge            │
│                                 │
│  [Explore] [Timeline]           │
│  [Constellation] [Guides]       │
│                                 │
│    ┌───────────────────┐        │
│    │ Search Everything │        │
│    └───────────────────┘        │
│                                 │
└─────────────────────────────────┘
```

### Components Created

1. **`Logo` component** — `components/brand/logo.tsx`
   - Centered logo with tagline
   - Size variants: sm, md, lg
   - Uses Playfair Display (serif) + Inter (sans)

2. **`SiteNavigation` component** — `components/navigation/site-navigation.tsx`
   - 4 primary sections: Explore, Timeline, Constellation, Guides
   - Pill-style buttons with icons
   - Subtle hover states using Blue primary color

3. **Updated `page.tsx`** — Hero section redesigned
   - Logo → Navigation → Search (vertical flow)
   - No decorative constellation (removed visual noise)
   - Subtle blue glow instead of gold

---

## Design Constitution Compliance

| Rule | Implementation |
|------|---------------|
| Primary color: Blue | Navigation hover uses `--color-primary` (#5F8DCE) |
| Gold = Premium only | Featured Guide uses `--color-accent` (#B89A63) with badge |
| Muted domain colors | All knowledge object colors use CSS variables from constitution |
| 85% neutral | Most of interface uses foundation colors |
| Typography hierarchy | Large heading, comfortable spacing, serif + sans combination |
| No high saturation | Removed old neon colors (#34D3F5, #FB923C, etc.) |
| Interface invisible | Simple layout, content-first, no decorative gradients |

---

## Color Mapping Changes

### Before (Old)
```css
Primary: Gold #C49B55
Domain Psychology: Neon Cyan #34D3F5
Domain Philosophy: Bright Purple #A78BFA
```

### After (Constitution)
```css
Primary: Blue #5F8DCE
Domain Psychology: Muted Blue #5A9FB5
Domain Philosophy: Muted Purple #9688B8
Object Concept: var(--color-concept)
Object Guide: var(--color-guide)
Premium Accent: Muted Gold #B89A63 (Featured badge only)
```

---

## UX Flow

1. **User arrives** → sees ARCHRON logo centered
2. **Eye drops** → sees 4 navigation options (no thinking required)
3. **Search ready** → large search bar below navigation
4. **Scroll** → curated content sections appear

**Total cognitive load: <3 seconds**

---

## Responsive Behavior

- Logo scales from `text-6xl` to `text-4xl` (mobile)
- Navigation wraps to 2×2 grid on mobile
- Search bar full-width on all devices
- Content sections use responsive grid

---

## What Was Removed

- ❌ Decorative constellation lines (visual noise)
- ❌ Gold glow background (violated constitution)
- ❌ Neon domain colors (high saturation)
- ❌ Multiple navigation patterns (redundancy)

---

## What Was Preserved

- ✅ Sticky Navbar (global navigation remains)
- ✅ Continue Reading section
- ✅ Featured Guide section
- ✅ Latest Knowledge section
- ✅ Browse section
- ✅ Footer

---

## Files Changed

```
apps/web/src/app/page.tsx                             (hero redesign)
apps/web/src/components/brand/logo.tsx               (new)
apps/web/src/components/navigation/site-navigation.tsx (new)
apps/web/src/styles/globals.css                       (color system)
```

---

## Next Steps

- [ ] Add real data to Continue Reading (from user session)
- [ ] Wire Featured Guide to CMS
- [ ] Connect Search to `@archron/search` package
- [ ] Add loading states
- [ ] Add error states

---

End of Implementation Notes
