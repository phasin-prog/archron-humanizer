import React from "react";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
export function GlossaryCard({ term, definition, relatedTerms = [], className, }) {
    return (<Card className={cn("transition-shadow hover:shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{term}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {definition}
        </p>
      </CardContent>
      {relatedTerms.length > 0 && (<CardFooter className="flex flex-wrap gap-1">
          {relatedTerms.map((rt) => (<a key={rt.slug} href={`/${rt.slug}`}>
              <Badge variant="outline" className="text-xs hover:bg-accent transition-colors">
                {rt.label}
              </Badge>
            </a>))}
        </CardFooter>)}
    </Card>);
}
