import React from "react"
import { cn } from "../../lib/utils"
import { Badge } from "../ui/badge"

interface CompareProperty {
  label: string
  leftValue: string
  rightValue: string
  differs?: boolean
}

interface CompareObject {
  slug: string
  objectType: string
  title: string
  properties: CompareProperty[]
}

export interface CompareViewProps {
  left: CompareObject
  right: CompareObject
  className?: string
}

export function CompareView({
  left,
  right,
  className,
}: CompareViewProps): React.ReactElement {
  const allProperties: CompareProperty[] = []

  const rightPropMap = new Map(
    right.properties.map((p) => [p.label, p]),
  )

  for (const lp of left.properties) {
    const rp = rightPropMap.get(lp.label)
    allProperties.push({
      label: lp.label,
      leftValue: lp.leftValue,
      rightValue: rp?.rightValue ?? "\u2014",
      differs: lp.leftValue !== (rp?.rightValue ?? ""),
    })
    if (rp) {
      rightPropMap.delete(lp.label)
    }
  }

  for (const [, rp] of rightPropMap) {
    allProperties.push({
      label: rp.label,
      leftValue: "\u2014",
      rightValue: rp.rightValue,
      differs: true,
    })
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-4",
        className,
      )}
    >
      <CompareColumn
        slug={left.slug}
        objectType={left.objectType}
        title={left.title}
      />
      <CompareColumn
        slug={right.slug}
        objectType={right.objectType}
        title={right.title}
      />

      <div className="md:col-span-2 border-t pt-4">
        <div className="space-y-2">
          {allProperties.map((prop) => (
            <div
              key={prop.label}
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-2 py-1.5 px-3 rounded-md text-sm",
                prop.differs && "bg-amber-500/10",
              )}
            >
              <span className="text-muted-foreground font-medium col-span-full md:col-span-1 md:col-start-1">
                {prop.label}
              </span>
              <div className="grid grid-cols-2 md:contents gap-2">
                <span className={cn(prop.differs && "text-amber-600 font-medium")}>
                  {prop.leftValue}
                </span>
                <span className={cn(prop.differs && "text-amber-600 font-medium")}>
                  {prop.rightValue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CompareColumn({
  slug,
  objectType,
  title,
}: {
  slug: string
  objectType: string
  title: string
}): React.ReactElement {
  return (
    <a
      href={`/${slug}`}
      className="block rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
    >
      <Badge variant="outline" className="text-xs mb-2">
        {objectType}
      </Badge>
      <h4 className="font-semibold text-sm text-foreground">{title}</h4>
    </a>
  )
}
