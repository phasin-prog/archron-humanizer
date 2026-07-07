import React from "react";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
export function RelatedSection({ items, title, className, }) {
    return (<section className={cn("space-y-4", className)}>
      {title && (<h3 className="text-lg font-semibold text-foreground">{title}</h3>)}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (<Card key={item.slug} className="group cursor-pointer transition-shadow hover:shadow-md" onClick={() => { window.location.href = `/${item.slug}`; }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {item.objectType}
                </Badge>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors mt-2 text-base">
                {item.title}
              </CardTitle>
            </CardHeader>
            {item.description && (<CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </CardContent>)}
          </Card>))}
      </div>
    </section>);
}
