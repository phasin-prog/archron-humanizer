import React from "react"
import { cn } from "../../lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"

export interface ThinkerCardProps {
  fullName: string
  description: string
  slug: string
  era?: string
  nationality?: string
  birthDate?: string
  deathDate?: string
  portraitUrl?: string
  domains?: string[]
  isHighlighted?: boolean
  className?: string
}

export function ThinkerCard({
  fullName,
  description,
  slug,
  era,
  nationality,
  birthDate,
  deathDate,
  portraitUrl,
  domains = [],
  isHighlighted = false,
  className,
}: ThinkerCardProps): React.ReactElement {
  const lifespan = [birthDate, deathDate].filter(Boolean).join(" - ")

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-shadow hover:shadow-md flex flex-col sm:flex-row",
        isHighlighted && "ring-2 ring-primary",
        className
      )}
      onClick={() => { window.location.href = `/${slug}` }}
    >
      {portraitUrl && (
        <div className="sm:w-32 sm:h-32 shrink-0 overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
          <img
            src={portraitUrl}
            alt={fullName}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            {era && (
              <Badge variant="secondary" className="text-xs">
                {era}
              </Badge>
            )}
            {isHighlighted && (
              <Badge variant="default">Featured</Badge>
            )}
          </div>
          <CardTitle className="group-hover:text-primary transition-colors mt-2">
            {fullName}
          </CardTitle>
          {lifespan && (
            <CardDescription>{lifespan}</CardDescription>
          )}
          {nationality && (
            <CardDescription className="text-xs uppercase tracking-wider">
              {nationality}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </CardContent>
        {domains.length > 0 && (
          <div className="px-6 pb-4 flex flex-wrap gap-1">
            {domains.map(domain => (
              <Badge key={domain} variant="outline" className="text-xs">
                {domain}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
