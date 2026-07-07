# Phase 5 — Design System: Full Component Library — Design Spec

Date: 2026-07-07
Version: 1.0
Status: Draft

## Overview

Expand `@archron/ui` from 5 to 39 components across 4 groups. Every component follows the shadcn/ui CVA pattern established by Button, Card, Badge.

## Pattern

Every component file exports:
1. Default component (React.FC)
2. Named CVA variant export (e.g., `buttonVariants`)
3. TypeScript interface for props (e.g., `ButtonProps`)

All use `cn()` from `lib/utils` for class merging.

---

## File Structure

```
packages/ui/src/components/
  ui/
    index.ts                    # MODIFY — export all new primitives
    input.tsx                   # NEW
    textarea.tsx                # NEW
    select.tsx                  # NEW
    checkbox.tsx                # NEW
    radio.tsx                   # NEW
    switch.tsx                  # NEW
    label.tsx                   # NEW
    dialog.tsx                  # NEW
    sheet.tsx                   # NEW
    popover.tsx                 # NEW
    tooltip.tsx                 # NEW
    dropdown-menu.tsx           # NEW
    command.tsx                 # NEW
    tabs.tsx                    # NEW
    breadcrumbs.tsx             # NEW
    pagination.tsx              # NEW
    avatar.tsx                  # NEW
    chip.tsx                    # NEW
    tag.tsx                     # NEW
    divider.tsx                 # NEW
    skeleton.tsx                # NEW
    progress.tsx                # NEW
    scroll-area.tsx             # NEW
    collapsible.tsx             # NEW
    table.tsx                   # NEW
  knowledge/
    index.ts                    # MODIFY — export all new knowledge cards
    book-card.tsx               # NEW
    article-card.tsx            # NEW
    symbol-card.tsx             # NEW
    theory-card.tsx             # NEW
    school-card.tsx             # NEW
    timeline-entry.tsx          # NEW
    quote-block.tsx             # NEW
    reference-display.tsx       # NEW
    concept-link.tsx            # NEW
    thinker-link.tsx            # NEW
    knowledge-card.tsx          # NEW
    compare-view.tsx            # NEW
    related-section.tsx         # NEW
    glossary-card.tsx           # NEW
```

Total: 28 new files + 2 modified barrel files

---

## Group 1: Inputs (7 components)

### Input — `components/ui/input.tsx`
```
Uses: CVA with variants: default, error, disabled
Props: value, onChange, placeholder, type, disabled, className, error (string for error message)

cva("flex w-full rounded-md border bg-surface px-3 py-2 text-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors", {
  variants: {
    variant: { default: "", error: "border-destructive focus:ring-destructive/20 focus:border-destructive" }
  }
})
```

### Textarea — `components/ui/textarea.tsx`
```
Same as Input but with min-h-[100px]. No variants needed beyond default/error.
```

### Select — `components/ui/select.tsx`
```
Compound: Select (root context) + SelectTrigger + SelectContent + SelectItem + SelectValue
Uses native-like select behavior with role="listbox"
Props: options, value, onChange, placeholder, disabled
```

### Checkbox — `components/ui/checkbox.tsx`
```
Props: checked, onChange, label, disabled
Renders: <input type="checkbox"> with custom styling + <label>
```

### Radio — `components/ui/radio.tsx`
```
Radio group pattern: RadioGroup (root) + RadioItem
Props: value, name, checked, onChange, label
```

### Switch — `components/ui/switch.tsx`
```
Props: checked, onChange, disabled
Toggle slider ui
```

### Label — `components/ui/label.tsx`
```
Props: htmlFor, children, required (shows asterisk)
cva("text-body font-medium leading-none")
```

---

## Group 2: Overlays (6 components)

### Dialog — `components/ui/dialog.tsx`
```
Compound: Dialog + DialogTrigger + DialogContent + DialogHeader + DialogTitle + DialogDescription + DialogFooter
Uses state: open/closed, animated with CSS transitions
Backdrop: bg-black/50
```

### Sheet — `components/ui/sheet.tsx`
```
Compound: Sheet + SheetTrigger + SheetContent + SheetHeader + SheetTitle + SheetDescription
Similar to Dialog but slides from side (left, right, top, bottom)
Props: side = "left" | "right" | "top" | "bottom"
```

### Popover — `components/ui/popover.tsx`
```
Compound: Popover + PopoverTrigger + PopoverContent
Lightweight floating panel, no backdrop
Position: auto (bottom by default, flip if needed)
```

### Tooltip — `components/ui/tooltip.tsx`
```
Compound: Tooltip + TooltipTrigger + TooltipContent
No click, hover only. Auto-position.
Delay: 500ms show, instant hide
```

### DropdownMenu — `components/ui/dropdown-menu.tsx`
```
Compound: DropdownMenu + DropdownMenuTrigger + DropdownMenuContent + DropdownMenuItem + DropdownMenuSeparator + DropdownMenuLabel
Items have: icon slot, label, shortcut, disabled, destructive variant
```

### Command — `components/ui/command.tsx`
```
Compound: Command + CommandInput + CommandList + CommandItem + CommandGroup + CommandEmpty
Searchable command palette
Props: items, onSelect, placeholder
Filter function built-in
```

---

## Group 3: Navigation (4 components)

### Tabs — `components/ui/tabs.tsx`
```
Compound: Tabs + TabsList + TabsTrigger + TabsContent
Props: defaultValue, value, onChange
Horizontal tab bar, underline indicator on active
```

### Breadcrumbs — `components/ui/breadcrumbs.tsx`
```
Compound: Breadcrumbs + BreadcrumbItem + BreadcrumbSeparator
Props: items = [{ label, href?, icon? }]
Separator: "/" or chevron icon
Last item: not clickable (current page)
```

### Pagination — `components/ui/pagination.tsx`
```
Compound: Pagination + PaginationPrevious + PaginationNext + PaginationItem
Props: currentPage, totalPages, onChange
Shows: Previous, page numbers (with truncation), Next
```

### TableOfContents — `components/ui/table-of-contents.tsx`
```
Compound: TOC + TOCItem
Props: items = [{ id, text, depth }]
Auto-highlights current heading based on scroll position
```

---

## Group 4: Display (8 components)

### Avatar — `components/ui/avatar.tsx`
```
Compound: Avatar + AvatarImage + AvatarFallback
Props: src, alt, fallback (initials)
cva: size = sm | md | lg
Fallback: shows initials when image fails
```

### Chip — `components/ui/chip.tsx`
```
Props: label, onRemove?, active?, icon?
cva variants: default, active, removable
Small rounded pill. If removable, shows X button.
```

### Tag — `components/ui/tag.tsx`
```
Props: label, objectType, color?
cva variants: color per ObjectType (concept=purple, thinker=blue, theory=green...)
Uses label from ObjectTypes enum
```

### Divider — `components/ui/divider.tsx`
```
Props: orientation = "horizontal" | "vertical", label? (text in middle)
Just a styled <hr> or <div>
```

### Skeleton — `components/ui/skeleton.tsx`
```
Props: variant = "text" | "circular" | "rectangular", width?, height?, className?
cva: "animate-pulse rounded bg-muted"
Uses: loading placeholder
```

### Progress — `components/ui/progress.tsx`
```
Props: value (0-100), max?, label?
Horizontal bar with fill animation
States: determinate (value), indeterminate (no value → animating)
```

### ScrollArea — `components/ui/scroll-area.tsx`
```
Props: orientation = "vertical" | "horizontal" | "both", className?
Container with overflow:auto + styled scrollbar
```

### Collapsible — `components/ui/collapsible.tsx`
```
Compound: Collapsible + CollapsibleTrigger + CollapsibleContent
Props: open, onOpenChange
Animated height transition
```

---

## Group 5: Knowledge Cards (14 components)

Every knowledge card follows this interface pattern:
```ts
interface CardBaseProps {
  slug: string
  title: string
  description?: string
  className?: string
  onClick?: () => void
}
```

### BookCard — `components/knowledge/book-card.tsx`
```
Shows: cover image, title, subtitle, author(s), publishYear, tags
```

### ArticleCard — `components/knowledge/article-card.tsx`
```
Shows: title, excerpt, readingTime, author name, publishDate, difficulty badge
```

### SymbolCard — `components/knowledge/symbol-card.tsx`
```
Shows: symbol image/icon, name, meaning (brief), culturalContext
```

### TheoryCard — `components/knowledge/theory-card.tsx`
```
Shows: title, short description, school badge, related concepts count
```

### SchoolCard — `components/knowledge/school-card.tsx`
```
Shows: title, period, location, methodology (brief), key thinkers count
```

### TimelineEntry — `components/knowledge/timeline-entry.tsx`
```
Shows: date (formatted), title, description, significance badge, related thinkers
Visual: timeline dot + line + content card
```

### QuoteBlock — `components/knowledge/quote-block.tsx`
```
Shows: quote text (italic, serif), attribution (speaker name), source
Visual: large opening quote mark, border-left accent
```

### Reference — `components/knowledge/reference-display.tsx`
```
Shows: formatted citation (APA/MLA), authors, year, title, DOI link
Copy-to-clipboard button for citation text
```

### ConceptLink — `components/knowledge/concept-link.tsx`
```
Inline link with tooltip: concept name → hover shows definition + domain badge
Props: conceptSlug, label?
```

### ThinkerLink — `components/knowledge/thinker-link.tsx`
```
Inline link with tooltip: thinker name → hover shows portrait + bio snippet + era
Props: thinkerSlug, label?
```

### KnowledgeCard — `components/knowledge/knowledge-card.tsx`
```
Generic object preview card
Shows: type icon + label, title, description, backlink count, view count
Props: objectType, slug, title, description, metadata?
The fallback card — used when no specific card type exists
```

### CompareView — `components/knowledge/compare-view.tsx`
```
Side-by-side comparison of 2 knowledge objects
Props: left={slug, objectType, title, properties}, right={...}
Shows: two columns with properties listed vertically, differences highlighted
```

### RelatedSection — `components/knowledge/related-section.tsx`
```
Grid of related object cards
Props: items={slug, objectType, title, description}[], title?
Auto-layout: responsive grid (1 col mobile, 2 tablet, 3 desktop)
```

### GlossaryCard — `components/knowledge/glossary-card.tsx`
```
Shows: term, definition, related terms links
Compact card style for glossary entries
```

---

## Multi-Agent Execution Groups

4 agents in parallel (independent groups):

| Agent | Group | Files |
|-------|-------|-------|
| A | Inputs (7) | input, textarea, select, checkbox, radio, switch, label |
| B | Overlays (6) | dialog, sheet, popover, tooltip, dropdown-menu, command |
| C | Navigation + Display (12) | tabs, breadcrumbs, pagination, table-of-contents, avatar, chip, tag, divider, skeleton, progress, scroll-area, collapsible |
| D | Knowledge Cards (14) + barrels | 14 card files + modify ui/index.ts + modify knowledge/index.ts |

Agent D includes the barrel updates (registers all new exports).

---

## Acceptance Criteria

- [ ] All 28 new components created and exported
- [ ] `pnpm --filter @archron/ui typecheck` passes
- [ ] Every component uses CVA for variants
- [ ] Every component has TypeScript props interface
- [ ] Every component uses cn() for className merging
- [ ] Knowledge cards follow consistent CardBaseProps pattern
- [ ] Barrel files (ui/index.ts, knowledge/index.ts) export all new components
- [ ] No external dependencies added beyond existing (cva, clsx, lucide-react, tailwind-merge)
