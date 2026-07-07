"use client";
import { cn } from "@archron/ui";
const FILTERS = [
    { type: "all", label: "All" },
    { type: "concept", label: "Concepts" },
    { type: "thinker", label: "Thinkers" },
    { type: "book", label: "Books" },
    { type: "article", label: "Articles" },
];
export function SearchFilters({ active, onTypeChange }) {
    return (<div className="flex items-center gap-1 border-b border-border pb-0.5">
      {FILTERS.map((f) => (<button key={f.type} onClick={() => onTypeChange(f.type)} aria-pressed={active === f.type} className={cn("inline-flex items-center justify-center whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", active === f.type
                ? "border-primary text-text"
                : "border-transparent text-text-muted hover:border-border hover:text-text")}>
          {f.label}
        </button>))}
    </div>);
}
