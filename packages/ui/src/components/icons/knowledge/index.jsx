import React from "react";
import { cn } from "../../../lib/utils";
import { iconVariants } from "../icon";
function createSvgIcon(d, label) {
    function SvgIcon({ size, color, className, ...props }) {
        return (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={cn(iconVariants({ size, color }), className)} aria-label={label} role="img" {...props}>
        <path d={d}/>
      </svg>);
    }
    SvgIcon.displayName = label;
    return SvgIcon;
}
export const ConceptIcon = createSvgIcon("M12 2a4 4 0 0 1 4 4c0 1.8-1.2 3.3-2.8 3.8l.8 1.7 3.5-1.2a4 4 0 1 1 1.8 1.2l-4 1.3-1-2A4 4 0 0 1 12 2Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM4 6h3v2H4V6Zm0 4h3v2H4v-2Zm0 4h3v2H4v-2Z", "Concept");
export const ThinkerIcon = createSvgIcon("M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-3 5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-5 10c0-3.3 4.5-5 8-5s8 1.7 8 5v1H4v-1Z", "Thinker");
export const ArticleIcon = createSvgIcon("M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v14h14V5H5Zm2 3h10v2H7V8Zm0 4h10v2H7v-2Zm0 4h7v2H7v-2Z", "Article");
export const GuideIcon = createSvgIcon("M12 2 2 7l10 5 10-5-10-5ZM4 8.5V17l8 4 8-4V8.5l-8 4-8-4Z", "Guide");
export const BookIcon = createSvgIcon("M4 3h16v18H4V3Zm2 2v14h12V5H6Zm2 2h3v3H8V7Zm0 5h8v2H8v-2Zm0 4h6v2H8v-2Z", "Book");
export const TimelineEventIcon = createSvgIcon("M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-4V9l3 3-3 3Z", "Timeline");
export const QuoteIcon = createSvgIcon("M7 8H3v6h4v2H4v2h4a2 2 0 0 0 2-2v-5a3 3 0 0 0-3-3V8Zm10 0h-4v6h4v2h-3v2h4a2 2 0 0 0 2-2v-5a3 3 0 0 0-3-3V8Z", "Quote");
export const CollectionIcon = createSvgIcon("M20 7H4v12h16V7ZM4 5h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm6 4h8v2h-8V9Zm0 4h6v2h-6v-2Z", "Collection");
export const SymbolIcon = createSvgIcon("M12 2 9 8H3l5 4-2 6 6-4 6 4-2-6 5-4h-6L12 2Z", "Symbol");
