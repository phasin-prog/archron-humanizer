import React from "react"
import { cn } from "../../lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card"
import { Badge } from "../ui/badge"

export interface ConceptCardProps {
  title: string
  description: string
  slug: string
  difficulty: "beginner" | "intermediate" | "advanced"
  domain?: string
  tags?: string[]
  isCore?: boolean
  className?: string
}

export function ConceptCard({
  title,
  description,
  slug,
  difficulty,
  domain,
  tags = [],
  isCore = false,
  className,
}: ConceptCardProps): React.ReactElement {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-shadow hover:shadow-md",
        isCore && "border-primary/50",
        className
      )}
      onClick={() => { window.location.href = `/${slug}` }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge
            variant={
              difficulty === "beginner" ? "success" :
              difficulty === "intermediate" ? "info" :
              "warning"
            }
          >
            {difficulty}
          </Badge>
          {isCore && (
            <Badge variant="default">Core</Badge>
          )}
        </div>
        <CardTitle className="group-hover:text-primary transition-colors mt-2">
          {title}
        </CardTitle>
        {domain && (
          <CardDescription className="text-xs uppercase tracking-wider">
            {domain}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </CardContent>
      {tags.length > 0 && (
        <CardFooter className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}
