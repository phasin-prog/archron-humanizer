import { Breadcrumbs, BreadcrumbItem, BreadcrumbSeparator, Tag } from "@archron/ui"

export interface BreadcrumbSegment {
  label: string
  href?: string
}

export interface BreadcrumbBarProps {
  segments: BreadcrumbSegment[]
  objectType?: string
}

export function BreadcrumbBar({ segments, objectType }: BreadcrumbBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3">
      <Breadcrumbs>
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <BreadcrumbItem
              href={segment.href}
              isCurrent={i === segments.length - 1}
            >
              {segment.label}
            </BreadcrumbItem>
            {i < segments.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </Breadcrumbs>
      {objectType && (
        <Tag
          objectType={objectType.toLowerCase() as "concept" | "thinker" | "theory" | "school" | "book" | "article" | "symbol" | "quote" | "timeline_event"}
          label={objectType}
        />
      )}
    </div>
  )
}
