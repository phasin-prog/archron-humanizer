"use client";
import React from "react";
import { cn } from "../../lib/utils";
export function TOC({ items, className, ...props }) {
    const [activeId, setActiveId] = React.useState("");
    React.useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            }
        }, {
            rootMargin: "0px 0px -80% 0px",
            threshold: 0.1,
        });
        const elements = items
            .map((item) => document.getElementById(item.id))
            .filter(Boolean);
        for (const el of elements) {
            if (el)
                observer.observe(el);
        }
        return () => observer.disconnect();
    }, [items]);
    return (<nav className={cn("flex flex-col gap-1", className)} {...props}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (<TOCItem key={item.id} id={item.id} text={item.text} depth={item.depth} isActive={activeId === item.id}/>))}
      </ul>
    </nav>);
}
export function TOCItem({ id, text, depth, isActive, className, ...props }) {
    return (<li>
      <a href={`#${id}`} className={cn("block py-1 text-sm transition-colors", "hover:text-foreground", isActive
            ? "text-foreground font-medium border-l-2 border-primary pl-3"
            : "text-muted-foreground border-l-2 border-transparent pl-[14px]", className)} style={{ paddingLeft: isActive ? `${depth * 0.75}rem` : `calc(${depth * 0.75}rem + 2px)` }} {...props}>
        {text}
      </a>
    </li>);
}
