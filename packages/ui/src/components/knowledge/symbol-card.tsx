import React from "react"
import { cn } from "../../lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"

export interface SymbolCardProps {
  slug: string
  name: string
  meaning?: string
  culturalContext?: string
  imageUrl?: string
  icon?: React.ReactNode
  className?: string
  onClick?: () => void
}

export function SymbolCard({
  slug,
  name,
  meaning,
  culturalContext,
  imageUrl,
  icon,
  className,
  onClick,
}: SymbolCardProps): React.ReactElement {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-shadow hover:shadow-md",
        className,
      )}
      onClick={onClick ?? (() => { window.location.href = `/${slug}` })}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          {(imageUrl || icon) && (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="size-full object-cover"
                />
              ) : (
                icon
              )}
            </div>
          )}
          <div>
            <CardTitle className="group-hover:text-primary transition-colors">
              {name}
            </CardTitle>
            {culturalContext && (
              <CardDescription className="text-xs uppercase tracking-wider">
                {culturalContext}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      {meaning && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {meaning}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
