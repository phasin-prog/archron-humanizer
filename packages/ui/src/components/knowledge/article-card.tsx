"use client"

import React from "react"
import { cn } from "../../lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"

export interface ArticleCardProps {
  slug: string
  title: string
  excerpt?: string
  readingTime?: number
  author?: string
  publishDate?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
  className?: string
  onClick?: () => void
}

export function ArticleCard({
  slug,
  title,
  excerpt,
  readingTime,
  author,
  publishDate,
  difficulty,
  className,
  onClick,
}: ArticleCardProps): React.ReactElement {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-shadow hover:shadow-md",
        className,
      )}
      onClick={onClick ?? (() => { window.location.href = `/${slug}` })}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          {difficulty && (
            <Badge
              variant={
                difficulty === "beginner"
                  ? "success"
                  : difficulty === "intermediate"
                    ? "info"
                    : "warning"
              }
            >
              {difficulty}
            </Badge>
          )}
          {readingTime !== undefined && (
            <span className="text-xs text-muted-foreground">
              {readingTime} min read
            </span>
          )}
        </div>
        <CardTitle className="group-hover:text-primary transition-colors mt-2">
          {title}
        </CardTitle>
        {(author || publishDate) && (
          <CardDescription>
            {[author, publishDate].filter(Boolean).join(" · ")}
          </CardDescription>
        )}
      </CardHeader>
      {excerpt && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {excerpt}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
