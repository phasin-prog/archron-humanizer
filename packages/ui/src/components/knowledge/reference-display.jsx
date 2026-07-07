import React from "react";
import { cn } from "../../lib/utils";
import { ClipboardCopy } from "lucide-react";
export function ReferenceDisplay({ citation, authors, year, title, doi, format = "apa", className, }) {
    const [copied, setCopied] = React.useState(false);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(citation);
        setCopied(true);
        setTimeout(() => { setCopied(false); }, 2000);
    };
    const metaParts = [authors?.join(", "), year, title && `"${title}"`].filter(Boolean);
    return (<div className={cn("relative rounded-lg border bg-card p-4 text-sm", className)} data-format={format}>
      <button type="button" className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={(e) => { e.stopPropagation(); void handleCopy(); }} aria-label={copied ? "Copied" : "Copy citation"}>
        <ClipboardCopy className="size-4"/>
      </button>
      <p className="text-foreground leading-relaxed pr-8">{citation}</p>
      {metaParts.length > 0 && (<p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
          {metaParts.join(" \u00b7 ")}
        </p>)}
      {doi && (<a href={`https://doi.org/${doi}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs text-primary hover:underline">
          {doi}
        </a>)}
      {copied && (<span className="absolute top-3 right-10 text-xs text-emerald-500 font-medium">
          Copied
        </span>)}
    </div>);
}
