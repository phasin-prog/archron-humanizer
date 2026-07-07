import React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
export function ConceptLink({ conceptSlug, label, definition, domain, className, }) {
    return (<span className={cn("relative inline-block group", className)}>
      <a href={`/${conceptSlug}`} className="inline text-primary underline decoration-dotted underline-offset-2 cursor-pointer hover:text-primary/80 transition-colors">
        {label ?? conceptSlug}
      </a>
      {definition && (<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
          <div className="w-64 p-3 rounded-lg border bg-card text-card-foreground shadow-lg text-sm">
            {domain && (<Badge variant="outline" className="text-xs mb-1.5">
                {domain}
              </Badge>)}
            <p className="text-foreground leading-relaxed">{definition}</p>
          </div>
        </div>)}
    </span>);
}
