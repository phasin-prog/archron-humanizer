# ARCHRON Navigation System Rule

Version: 1.0
Type: Immutable Rule
Enforcement: ABSOLUTE

## Core Philosophy

Navigation is guidance. Not decoration. Not marketing. Not a sitemap. The user should never ask "Where do I go next?"

## Link Limits

| Context | Max Items | Items |
|---------|-----------|-------|
| Desktop Public | 5 | ARCHRON, Guides, Search, Support, Sign In |
| Desktop Auth | 5 | ARCHRON, Continue Reading, Guides, Support, Profile |
| Mobile Bottom | 4 | Search, Guides, Support, Profile/Login |

## Navigation Priority

Search → Continue Reading → Guides → Profile → Support

## Visual Rules

- Background: `bg-background/80 backdrop-blur-md` (sticky)
- Border: `border-b border-border/50`
- Height: 14 (56px)
- Active: `bg-primary/10 text-primary`
- Hover: `bg-elevated text-text`
- Default: `text-text-muted`
- Transition: `duration-[var(--motion-fast)]` (120ms)
- No shadow on default, minimal on scroll if needed

## Reading Mode

When pathname matches `/concepts/*`, `/thinkers/*`, `/articles/*`:
- Reduce navbar opacity: `bg-background/60`
- Hide border: `border-transparent`
- Navigation becomes quieter — content takes priority

## Mobile

- Bottom navigation bar, fixed position
- Height: 16 (64px)
- Max 4 items
- Background: `bg-background/90 backdrop-blur-md`
- Spacer div above to prevent content overlap

## Search

- Desktop: visible inline search bar in navbar (max-width 320px)
- Mobile: search button → expandable or dedicated page
- Always accessible from any page

## Implementation

```
apps/web/src/
  components/layout/
    navbar.tsx          Desktop + tablet horizontal nav
    bottom-nav.tsx      Mobile bottom nav
  app/
    layout.tsx          Wraps children with <Navbar /> + <BottomNav />
```

## Forbidden

- Navigation bars taller than 56px
- More than 5 primary nav items
- Animations longer than 200ms
- Bounce, glow, or exaggerated motion on hover
- Colored icons (icons stay monochrome)
- Multiple active states
- Horizontal scrolling in navigation
- Dropdown menus in primary navigation
