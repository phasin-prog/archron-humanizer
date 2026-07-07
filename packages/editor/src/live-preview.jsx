"use client";
import React, { useMemo } from "react";
import { cn } from "@archron/ui";
export function LivePreview({ markdown, className }) {
    const html = useMemo(() => {
        const lines = markdown.split("\n");
        return lines
            .map((line) => {
            if (/^#{1,6}\s/.test(line)) {
                const level = line.match(/^(#{1,6})\s/)[1].length;
                const text = line.replace(/^#{1,6}\s/, "");
                return `<h${level} class="text-${["display", "page-title", "section", "card-title", "body", "caption"][level - 1] ?? "body"} font-serif font-bold mb-2">${text}</h${level}>`;
            }
            if (/^>\s/.test(line))
                return `<blockquote class="border-l-4 border-primary/30 pl-4 py-1 my-2 text-muted-foreground italic">${line.replace(/^>\s/, "")}</blockquote>`;
            if (/^-{3,}$/.test(line))
                return `<hr class="my-4 border-border" />`;
            if (/^\*\*.*\*\*$/.test(line))
                return `<p class="text-body font-semibold mb-2">${line.replace(/\*\*/g, "")}</p>`;
            if (/^\*.*\*$/.test(line) && !/^\*\*/.test(line))
                return `<p class="text-body italic mb-2">${line.replace(/\*/g, "")}</p>`;
            if (/^`/.test(line))
                return `<code class="rounded bg-muted px-1 py-0.5 text-caption font-mono">${line.replace(/`/g, "")}</code>`;
            if (line.trim() === "")
                return `<br />`;
            return `<p class="text-body leading-relaxed mb-2">${line}</p>`;
        })
            .join("\n");
    }, [markdown]);
    return (<div className={cn("prose max-w-none p-6 text-body leading-relaxed", className)} dangerouslySetInnerHTML={{ __html: html }}/>);
}
