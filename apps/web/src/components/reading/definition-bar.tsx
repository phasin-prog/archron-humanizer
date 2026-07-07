import { Tag } from "@archron/ui"

export interface DefinitionBarProps {
  objectType: string
  definition: string
}

export function DefinitionBar({ objectType, definition }: DefinitionBarProps) {
  return (
    <div className="sticky top-14 z-[var(--z-dropdown)] border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-container-page items-start gap-3 px-6 py-3">
        <Tag
          objectType={objectType.toLowerCase() as "concept" | "thinker" | "theory" | "school" | "book" | "article" | "symbol" | "quote" | "timeline_event"}
          label={objectType}
          className="mt-0.5 shrink-0"
        />
        <p className="font-serif text-body text-text-muted leading-relaxed">
          {definition}
        </p>
      </div>
    </div>
  )
}
