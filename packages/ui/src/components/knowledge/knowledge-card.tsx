import React from "react"
import { cn } from "../../lib/utils"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card"
import { Badge } from "../ui/badge"
import {
  ConceptIcon,
  ThinkerIcon,
  BookIcon,
  ArticleIcon,
  GuideIcon,
  QuoteIcon,
  TimelineIcon,
  SymbolIcon,
  CollectionIcon,
} from "../icons"

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  concept: { icon: ConceptIcon, label: "Concept" },
  thinker: { icon: ThinkerIcon, label: "Thinker" },
  book: { icon: BookIcon, label: "Book" },
  article: { icon: ArticleIcon, label: "Article" },
  guide: { icon: GuideIcon, label: "Guide" },
  quote: { icon: QuoteIcon, label: "Quote" },
  timeline: { icon: TimelineIcon, label: "Timeline" },
  symbol: { icon: SymbolIcon, label: "Symbol" },
  collection: { icon: CollectionIcon, label: "Collection" },
}

export interface KnowledgeCardProps {
  slug: string
  title: string
  objectType: string
  description?: string
  backlinkCount?: number
  viewCount?: number
  className?: string
  onClick?: () => void
}

export function KnowledgeCard({
  slug,
  title,
  objectType,
  description,
  backlinkCount,
  viewCount,
  className,
  onClick,
}: KnowledgeCardProps): React.ReactElement {
  const config = typeConfig[objectType] ?? { icon: ArticleIcon, label: objectType }
  const Icon = config.icon

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-shadow hover:shadow-md",
        className,
      )}
      onClick={onClick ?? (() => { window.location.href = `/${slug}` })}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
        <CardTitle className="group-hover:text-primary transition-colors mt-2">
          {title}
        </CardTitle>
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        </CardContent>
      )}
      {(backlinkCount !== undefined || viewCount !== undefined) && (
        <CardFooter className="flex items-center gap-4 text-xs text-muted-foreground">
          {backlinkCount !== undefined && (
            <span>{backlinkCount} backlinks</span>
          )}
          {viewCount !== undefined && (
            <span>{viewCount.toLocaleString()} views</span>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
