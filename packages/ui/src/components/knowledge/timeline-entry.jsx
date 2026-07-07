import React from "react";
import { cn } from "../../lib/utils";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
export function TimelineEntry({ slug, date, title, description, significance, relatedThinkers = [], isLast = false, className, onClick, }) {
    return (<div className={cn("relative flex gap-4 pb-8", className)}>
      <div className="flex flex-col items-center shrink-0">
        <div className={cn("size-3 rounded-full border-2 border-primary bg-background", significance === "major" && "bg-primary")}/>
        {!isLast && <div className="w-px flex-1 bg-border"/>}
      </div>
      <Card className={cn("flex-1 cursor-pointer transition-shadow hover:shadow-md")} onClick={onClick ?? (() => { window.location.href = `/${slug}`; })}>
        <div className="p-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {date}
            </span>
            {significance && (<Badge variant={significance === "major"
                ? "default"
                : significance === "minor"
                    ? "secondary"
                    : "outline"} className="text-xs">
                {significance}
              </Badge>)}
          </div>
          <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
            {title}
          </h4>
          {description && (<p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>)}
          {relatedThinkers.length > 0 && (<div className="flex flex-wrap gap-1 mt-2">
              {relatedThinkers.map((thinker) => (<Badge key={thinker} variant="outline" className="text-xs">
                  {thinker}
                </Badge>))}
            </div>)}
        </div>
      </Card>
    </div>);
}
