import React from "react";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
export function TheoryCard({ slug, title, description, school, conceptCount, className, onClick, }) {
    return (<Card className={cn("group cursor-pointer transition-shadow hover:shadow-md", className)} onClick={onClick ?? (() => { window.location.href = `/${slug}`; })}>
      <CardHeader>
        <div className="flex items-center justify-between">
          {school && (<Badge variant="secondary" className="text-xs">
              {school}
            </Badge>)}
          {conceptCount !== undefined && (<span className="text-xs text-muted-foreground">
              {conceptCount} {conceptCount === 1 ? "concept" : "concepts"}
            </span>)}
        </div>
        <CardTitle className="group-hover:text-primary transition-colors mt-2">
          {title}
        </CardTitle>
      </CardHeader>
      {description && (<CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        </CardContent>)}
    </Card>);
}
