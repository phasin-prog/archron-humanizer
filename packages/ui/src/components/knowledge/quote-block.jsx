import React from "react";
import { cn } from "../../lib/utils";
export function QuoteBlock({ quote, attribution, source, className, }) {
    return (<blockquote className={cn("relative border-l-4 border-primary/60 pl-6 py-2 my-4", className)}>
      <span aria-hidden="true" className="absolute -top-2 left-2 text-5xl leading-none text-primary/20 select-none font-serif">
        &ldquo;
      </span>
      <p className="text-lg italic font-serif text-foreground leading-relaxed">
        {quote}
      </p>
      {(attribution || source) && (<footer className="mt-3 text-sm text-muted-foreground">
          {attribution && (<cite className="not-italic font-medium">{attribution}</cite>)}
          {attribution && source && (<span aria-hidden="true">, </span>)}
          {source && <span>{source}</span>}
        </footer>)}
    </blockquote>);
}
