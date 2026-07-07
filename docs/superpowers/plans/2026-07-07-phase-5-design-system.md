# Phase 5 — Design System: Full Component Library — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 28 new CVA-based components to `@archron/ui`, expanding from 5 to 39 total components.

**Architecture:** shadcn/ui CVA pattern. Each file exports default component + variant export + Props interface. 4 independent groups dispatched in parallel.

**Tech Stack:** React, TypeScript, CVA (class-variance-authority), clsx, tailwind-merge, lucide-react, Tailwind CSS

## Global Constraints

- Every component file exports: default React.FC, CVA variants object, Props interface
- Use `cn()` from `@/lib/utils` for className merging
- All components use `forwardRef` where applicable (Input, Textarea, Select, Button-like)
- No external dependencies beyond existing: cva, clsx, tailwind-merge, lucide-react
- verbatimModuleSyntax: true, esModuleInterop: true
- tsconfig.json strict: true
- Follow existing patterns: `button.tsx`, `card.tsx`, `badge.tsx`, `concept-card.tsx`, `thinker-card.tsx`

---

## Parallel Execution Map

```
Task 1 (Inputs — 7 files) ──────────┐
Task 2 (Overlays — 6 files) ────────┤
Task 3 (Nav + Display — 12 files) ──┤
                                     ├──► Task 4 update barrels
Task 1/2/3 create new files only — no shared files → safe for parallel
```

**Task 4** modifies 2 barrel files AFTER tasks 1-3 complete: `components/ui/index.ts` and `components/knowledge/index.ts`

---

### Task 1: Input Components (7 files)

**Files:**
- Create: `packages/ui/src/components/ui/input.tsx`
- Create: `packages/ui/src/components/ui/textarea.tsx`
- Create: `packages/ui/src/components/ui/select.tsx`
- Create: `packages/ui/src/components/ui/checkbox.tsx`
- Create: `packages/ui/src/components/ui/radio.tsx`
- Create: `packages/ui/src/components/ui/switch.tsx`
- Create: `packages/ui/src/components/ui/label.tsx`

**Interfaces:**
- Consumes: `cn` from `../../lib/utils`
- Produces: 7 default-exported components with CVA variants

- [ ] **Step 1: Create input.tsx**

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border bg-surface px-3 py-2 text-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus:ring-destructive/20 focus:border-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, error, ...props }, ref) => (
    <div className="w-full">
      <input
        className={cn(inputVariants({ variant: error ? "error" : variant }), className)}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-caption text-destructive">{error}</p>}
    </div>
  )
)
Input.displayName = "Input"

export { Input, inputVariants }
```

- [ ] **Step 2: Create textarea.tsx**

```tsx
import * as React from "react"
import { cn } from "../../lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-md border bg-surface px-3 py-2 text-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
          className,
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-caption text-destructive">{error}</p>}
    </div>
  )
)
Textarea.displayName = "Textarea"

export { Textarea }
```

- [ ] **Step 3: Create select.tsx**

```tsx
import * as React from "react"
import { cn } from "../../lib/utils"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[]
  placeholder?: string
  error?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, error, ...props }, ref) => (
    <div className="w-full">
      <select
        className={cn(
          "flex w-full rounded-md border bg-surface px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
          error && "border-destructive",
          className,
        )}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-caption text-destructive">{error}</p>}
    </div>
  )
)
Select.displayName = "Select"

export { Select }
```

- [ ] **Step 4: Create checkbox.tsx**

```tsx
import * as React from "react"
import { cn } from "../../lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => (
    <label className={cn("flex items-center gap-2 cursor-pointer text-body", className)}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border accent-primary cursor-pointer"
        ref={ref}
        id={id}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
```

- [ ] **Step 5: Create radio.tsx**

```tsx
import * as React from "react"
import { cn } from "../../lib/utils"

export interface RadioItem {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupProps {
  name: string
  options: RadioItem[]
  value?: string
  onChange?: (value: string) => void
  className?: string
  orientation?: "horizontal" | "vertical"
}

function RadioGroup({ name, options, value, onChange, className, orientation = "vertical" }: RadioGroupProps) {
  return (
    <div className={cn(
      orientation === "horizontal" ? "flex gap-4" : "flex flex-col gap-2",
      className,
    )}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn("flex items-center gap-2 cursor-pointer text-body", opt.disabled && "opacity-50 cursor-not-allowed")}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={opt.disabled}
            className="h-4 w-4 accent-primary cursor-pointer"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

export { RadioGroup }
export type { RadioGroupProps, RadioItem }
```

- [ ] **Step 6: Create switch.tsx**

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const switchVariants = cva(
  "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      checked: {
        true: "bg-primary",
        false: "bg-muted",
      },
    },
  }
)

const thumbVariants = cva(
  "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
  {
    variants: {
      checked: {
        true: "translate-x-4",
        false: "translate-x-0",
      },
    }
  }
)

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, checked, ...props }, ref) => (
    <label className={cn("flex items-center gap-2 cursor-pointer", className)}>
      <input
        type="checkbox"
        className="sr-only"
        ref={ref}
        checked={checked}
        {...props}
      />
      <span className={switchVariants({ checked: !!checked })}>
        <span className={thumbVariants({ checked: !!checked })} />
      </span>
      {label && <span className="text-body">{label}</span>}
    </label>
  )
)
Switch.displayName = "Switch"

export { Switch, switchVariants, thumbVariants }
```

- [ ] **Step 7: Create label.tsx**

```tsx
import * as React from "react"
import { cn } from "../../lib/utils"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      className={cn("text-body font-medium leading-none", className)}
      ref={ref}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
  )
)
Label.displayName = "Label"

export { Label }
```

- [ ] **Step 8: Verify typecheck**

```bash
pnpm --filter @archron/ui typecheck
```

Expected: PASS for all 7 new files.

- [ ] **Step 9: Commit**

```bash
git add packages/ui/src/components/ui/input.tsx packages/ui/src/components/ui/textarea.tsx packages/ui/src/components/ui/select.tsx packages/ui/src/components/ui/checkbox.tsx packages/ui/src/components/ui/radio.tsx packages/ui/src/components/ui/switch.tsx packages/ui/src/components/ui/label.tsx
git commit -m "feat(ui): add input components — input, textarea, select, checkbox, radio, switch, label"
```

---

### Task 2: Overlay Components (6 files)

**Files:**
- Create: `packages/ui/src/components/ui/dialog.tsx`
- Create: `packages/ui/src/components/ui/sheet.tsx`
- Create: `packages/ui/src/components/ui/popover.tsx`
- Create: `packages/ui/src/components/ui/tooltip.tsx`
- Create: `packages/ui/src/components/ui/dropdown-menu.tsx`
- Create: `packages/ui/src/components/ui/command.tsx`

**Interfaces:**
- Consumes: `cn` from `../../lib/utils`
- Produces: 6 compound component families

- [ ] **Step 1: Create dialog.tsx**

```tsx
"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialog() {
  const ctx = React.useContext(DialogContext)
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>")
  return ctx
}

export interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogTrigger({ children, className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useDialog()
  return (
    <button type="button" onClick={() => setOpen(true)} className={className} {...props}>
      {children}
    </button>
  )
}

function DialogContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = useDialog()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-lg border bg-surface p-6 shadow-lg animate-in fade-in zoom-in-95",
          className,
        )}
        {...props}
      >
        {children}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-card-title font-serif font-semibold", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-caption text-muted-foreground", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex justify-end gap-2 mt-4", className)} {...props} />
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
export type { DialogProps }
```

- [ ] **Step 2: Create dropdown-menu.tsx**

```tsx
"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null)

function useDropdown() {
  const ctx = React.useContext(DropdownContext)
  if (!ctx) throw new Error("DropdownMenu components must be used within <DropdownMenu>")
  return ctx
}

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  )
}

function DropdownMenuTrigger({ children, className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useDropdown()
  return (
    <button type="button" onClick={() => setOpen(!open)} className={className} {...props}>
      {children}
    </button>
  )
}

function DropdownMenuContent({ children, className, align = "start", ...props }: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" }) {
  const { open } = useDropdown()
  if (!open) return null

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 min-w-[180px] rounded-md border bg-surface p-1 shadow-md",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuItem({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = useDropdown()
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-body hover:bg-muted transition-colors",
        className,
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("my-1 h-px bg-border", className)} {...props} />
}

function DropdownMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-2 py-1.5 text-caption font-medium text-muted-foreground", className)} {...props} />
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel }
```

- [ ] **Step 3: Create all remaining overlay files with similar pattern**

Create: `packages/ui/src/components/ui/tooltip.tsx`
→ Tooltip + TooltipTrigger + TooltipContent (hover show/hide, 500ms delay)

```tsx
"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

  const show = () => {
    timeoutRef.current = setTimeout(() => setOpen(true), 500)
  }
  const hide = () => {
    clearTimeout(timeoutRef.current)
    setOpen(false)
  }

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type as any)?.displayName === "TooltipTrigger") {
          return child
        }
        if (React.isValidElement(child) && (child.type as any)?.displayName === "TooltipContent") {
          return open ? child : null
        }
        return child
      })}
    </div>
  )
}

function TooltipTrigger({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("cursor-help", className)} {...props}>{children}</span>
}
TooltipTrigger.displayName = "TooltipTrigger"

function TooltipContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 rounded-md bg-foreground px-3 py-1.5 text-caption text-background shadow-md whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent }
```

Create: `packages/ui/src/components/ui/popover.tsx`
→ Popover + PopoverTrigger + PopoverContent (click toggle, no backdrop)

```tsx
"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  )
}

interface PopoverContextValue { open: boolean; setOpen: (open: boolean) => void }
const PopoverContext = React.createContext<PopoverContextValue | null>(null)

function PopoverTrigger({ children, className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(PopoverContext)
  return <button type="button" onClick={() => ctx?.setOpen(!ctx?.open)} className={className} {...props}>{children}</button>
}

function PopoverContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(PopoverContext)
  if (!ctx?.open) return null
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => ctx.setOpen(false)} />
      <div className={cn("absolute z-50 mt-1 rounded-md border bg-surface p-4 shadow-md min-w-[200px]", className)} {...props}>
        {children}
      </div>
    </>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
```

Create: `packages/ui/src/components/ui/sheet.tsx`
→ Sheet + SheetTrigger + SheetContent + SheetHeader + SheetTitle + SheetDescription (slide from side)

Create: `packages/ui/src/components/ui/command.tsx`
→ Command + CommandInput + CommandList + CommandItem + CommandGroup + CommandEmpty (searchable palette)

_These follow the same React context pattern as Dialog/DropdownMenu._

- [ ] **Step 8: Verify typecheck**

```bash
pnpm --filter @archron/ui typecheck
```

- [ ] **Step 9: Commit**

```bash
git add packages/ui/src/components/ui/dialog.tsx packages/ui/src/components/ui/dropdown-menu.tsx packages/ui/src/components/ui/tooltip.tsx packages/ui/src/components/ui/popover.tsx packages/ui/src/components/ui/sheet.tsx packages/ui/src/components/ui/command.tsx
git commit -m "feat(ui): add overlay components — dialog, dropdown-menu, tooltip, popover, sheet, command"
```

---

### Task 3: Navigation + Display Components (12 files)

**Files:**
Create 4 navigation + 8 display files in `packages/ui/src/components/ui/`

Each component follows CVA pattern. Key structures:

- **tabs.tsx** — Tabs + TabsList + TabsTrigger + TabsContent (horizontal tab bar, underline indicator)
- **breadcrumbs.tsx** — Breadcrumbs + BreadcrumbItem + BreadcrumbSeparator (slash/chevron separated path)
- **pagination.tsx** — Pagination + PaginationItem (page numbers with truncation, prev/next)
- **table-of-contents.tsx** — TOC + TOCItem (scroll-spy sidebar)
- **avatar.tsx** — Avatar + AvatarImage + AvatarFallback (size: sm/md/lg)
- **chip.tsx** — Chip with CVA (default/active/removable variants)
- **tag.tsx** — Tag with per-ObjectType color variants
- **divider.tsx** — Divider (horizontal/vertical with optional label)
- **skeleton.tsx** — Skeleton with CVA (text/circular/rectangular)
- **progress.tsx** — Progress (determinate/indeterminate)
- **scroll-area.tsx** — ScrollArea (styled scrollbar container)
- **collapsible.tsx** — Collapsible + CollapsibleTrigger + CollapsibleContent (animated height)

- [ ] **Create all 12 files using the CVA pattern**
- [ ] **Verify typecheck:** `pnpm --filter @archron/ui typecheck`
- [ ] **Commit:**

```bash
git add packages/ui/src/components/ui/tabs.tsx packages/ui/src/components/ui/breadcrumbs.tsx packages/ui/src/components/ui/pagination.tsx packages/ui/src/components/ui/table-of-contents.tsx packages/ui/src/components/ui/avatar.tsx packages/ui/src/components/ui/chip.tsx packages/ui/src/components/ui/tag.tsx packages/ui/src/components/ui/divider.tsx packages/ui/src/components/ui/skeleton.tsx packages/ui/src/components/ui/progress.tsx packages/ui/src/components/ui/scroll-area.tsx packages/ui/src/components/ui/collapsible.tsx
git commit -m "feat(ui): add navigation and display components — tabs, breadcrumbs, pagination, toc, avatar, chip, tag, divider, skeleton, progress, scroll-area, collapsible"
```

---

### Task 4: Knowledge Cards + Barrel Exports (16 files)

**Files:**
- Create: 14 knowledge card files in `packages/ui/src/components/knowledge/`
- Modify: `packages/ui/src/components/ui/index.ts`
- Modify: `packages/ui/src/components/knowledge/index.ts`

**Knowledge cards** (all follow `CardBaseProps` pattern with CVA):
- `book-card.tsx`, `article-card.tsx`, `symbol-card.tsx`, `theory-card.tsx`, `school-card.tsx`
- `timeline-entry.tsx`, `quote-block.tsx`, `reference-display.tsx`
- `concept-link.tsx`, `thinker-link.tsx`
- `knowledge-card.tsx`, `compare-view.tsx`, `related-section.tsx`, `glossary-card.tsx`

Each card:
1. Receives object data via props (`slug`, `title`, `description`, etc.)
2. Renders inside `<div className={cn(cardVariants(), className)}>`
3. Has hover state, click handler for navigation
4. Uses Archron typography tokens (`text-card-title`, `text-body`, `text-caption`)

**Barrel updates:**

`packages/ui/src/components/ui/index.ts` — add imports + exports for all 28 new UI components:
```ts
export { Input, inputVariants } from "./input"
export type { InputProps } from "./input"
// ... all 28 new components ...
```

`packages/ui/src/components/knowledge/index.ts` — add imports + exports for all 14 new knowledge cards (ConceptCard + ThinkerCard already exist):
```ts
export { BookCard } from "./book-card"
export type { BookCardProps } from "./book-card"
// ... all 14 new cards ...
```

- [ ] **Create all 14 knowledge card files**
- [ ] **Update both barrel index.ts files**
- [ ] **Verify typecheck:** `pnpm --filter @archron/ui typecheck`
- [ ] **Commit:**

```bash
git add packages/ui/src/components/knowledge/ packages/ui/src/components/ui/index.ts packages/ui/src/components/knowledge/index.ts
git commit -m "feat(ui): add knowledge cards and update barrel exports — 14 cards + full component registry"
```
