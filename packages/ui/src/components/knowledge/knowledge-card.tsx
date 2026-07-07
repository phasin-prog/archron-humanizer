import React from "react"
import { cn } from "../../lib/utils"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card"
import { Badge } from "../ui/badge"
import {
  BookOpen,
  FileText,
  Lightbulb,
  User,
  School,
  type LucideIcon,
} from "lucide-react"

const typeConfig: Record<string, { icon: LucideIcon; label: string }> = {
  concept: { icon: Lightbulb, label: "Concept" },
  thinker: { icon: User, label: "Thinker" },
  book: { icon: BookOpen, label: "Book" },
  article: { icon: FileText, label: "Article" },
  school: { icon: School, label: "School" },
  theory: { icon: Lightbulb, label: "Theory" },
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
  const config = typeConfig[objectType] ?? { icon: FileText, label: objectType }
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
            <Icon className="size-3" />
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
