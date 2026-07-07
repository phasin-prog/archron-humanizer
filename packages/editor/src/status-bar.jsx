import React from "react";
import { cn } from "@archron/ui";
export function StatusBar({ wordCount, readingTime, lastSaved, status = "draft", referenceCount = 0, className, }) {
    const ago = lastSaved
        ? (() => {
            const diff = Math.round((Date.now() - lastSaved.getTime()) / 1000);
            if (diff < 60)
                return `${diff}s ago`;
            if (diff < 3600)
                return `${Math.round(diff / 60)}m ago`;
            return `${Math.round(diff / 3600)}h ago`;
        })()
        : "not saved";
    return (<div className={cn("flex items-center gap-4 px-4 py-1.5 border-t text-caption text-muted-foreground bg-muted/20", className)}>
      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", status === "published" && "bg-success/10 text-success", status === "review" && "bg-warning/10 text-warning", status === "draft" && "bg-muted text-muted-foreground", status === "archived" && "bg-destructive/10 text-destructive")}>
        {status}
      </span>
      <span>Words: {wordCount.toLocaleString()}</span>
      <span>Reading: {readingTime}m</span>
      <span>Refs: {referenceCount}</span>
      <span className="ml-auto">Saved: {ago}</span>
    </div>);
}
