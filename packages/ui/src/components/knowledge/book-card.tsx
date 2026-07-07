import React from "react"
import { cn } from "../../lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card"
import { Badge } from "../ui/badge"

export interface BookCardProps {
  slug: string
  title: string
  subtitle?: string
  author: string
  authors?: string[]
  publishYear?: number
  coverUrl?: string
  tags?: string[]
  className?: string
  onClick?: () => void
}

export function BookCard({
  slug,
  title,
  subtitle,
  author,
  authors,
  publishYear,
  coverUrl,
  tags = [],
  className,
  onClick,
}: BookCardProps): React.ReactElement {
  const displayAuthors = authors ?? [author]

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-shadow hover:shadow-md flex flex-col sm:flex-row overflow-hidden",
        className,
      )}
      onClick={onClick ?? (() => { window.location.href = `/${slug}` })}
    >
      {coverUrl && (
        <div className="sm:w-36 shrink-0 bg-muted">
          <img
            src={coverUrl}
            alt={title}
            className="h-48 sm:h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          {subtitle && (
            <CardDescription className="italic">{subtitle}</CardDescription>
          )}
          <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            <span>{displayAuthors.join(", ")}</span>
            {publishYear && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>{publishYear}</span>
              </>
            )}
          </div>
        </CardHeader>
        {tags.length > 0 && (
          <CardFooter className="flex flex-wrap gap-1 mt-auto">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </CardFooter>
        )}
      </div>
    </Card>
  )
}
