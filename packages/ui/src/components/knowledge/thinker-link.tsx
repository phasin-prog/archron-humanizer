import React from "react"
import { cn } from "../../lib/utils"
import { Badge } from "../ui/badge"

export interface ThinkerLinkProps {
  thinkerSlug: string
  label?: string
  bio?: string
  era?: string
  portraitUrl?: string
  className?: string
}

export function ThinkerLink({
  thinkerSlug,
  label,
  bio,
  era,
  portraitUrl,
  className,
}: ThinkerLinkProps): React.ReactElement {
  return (
    <span className={cn("relative inline-block group", className)}>
      <a
        href={`/${thinkerSlug}`}
        className="inline text-primary underline decoration-dotted underline-offset-2 cursor-pointer hover:text-primary/80 transition-colors"
      >
        {label ?? thinkerSlug}
      </a>
      {(bio || era || portraitUrl) && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
          <div className="w-72 p-3 rounded-lg border bg-card text-card-foreground shadow-lg text-sm flex gap-3">
            {portraitUrl && (
              <div className="size-12 shrink-0 rounded-full overflow-hidden bg-muted">
                <img
                  src={portraitUrl}
                  alt={label ?? thinkerSlug}
                  className="size-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">
                {label ?? thinkerSlug}
              </p>
              {era && (
                <Badge variant="secondary" className="text-xs mt-1">
                  {era}
                </Badge>
              )}
              {bio && (
                <p className="text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed">
                  {bio}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </span>
  )
}
