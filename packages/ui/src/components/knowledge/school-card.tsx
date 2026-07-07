import React from "react"
import { cn } from "../../lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"

export interface SchoolCardProps {
  slug: string
  title: string
  period?: string
  location?: string
  methodology?: string
  keyThinkersCount?: number
  className?: string
  onClick?: () => void
}

export function SchoolCard({
  slug,
  title,
  period,
  location,
  methodology,
  keyThinkersCount,
  className,
  onClick,
}: SchoolCardProps): React.ReactElement {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-shadow hover:shadow-md",
        className,
      )}
      onClick={onClick ?? (() => { window.location.href = `/${slug}` })}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          {period && (
            <Badge variant="outline" className="text-xs">
              {period}
            </Badge>
          )}
          {keyThinkersCount !== undefined && (
            <span className="text-xs text-muted-foreground">
              {keyThinkersCount} {keyThinkersCount === 1 ? "thinker" : "thinkers"}
            </span>
          )}
        </div>
        <CardTitle className="group-hover:text-primary transition-colors mt-2">
          {title}
        </CardTitle>
        {location && (
          <CardDescription className="text-xs uppercase tracking-wider">
            {location}
          </CardDescription>
        )}
      </CardHeader>
      {methodology && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {methodology}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
