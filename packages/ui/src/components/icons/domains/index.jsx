import React from "react";
import { cn } from "../../../lib/utils";
import { iconVariants } from "../icon";
function createDomainGlyph(d, label) {
    function Glyph({ size, color, className, ...props }) {
        return (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={cn(iconVariants({ size, color }), className)} aria-label={label} role="img" {...props}>
        <path d={d}/>
      </svg>);
    }
    Glyph.displayName = label;
    return Glyph;
}
export const PsychologyGlyph = createDomainGlyph("M12 2a5 5 0 0 0-5 5v1a5 5 0 0 0 5 5 5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Zm0 8a3 3 0 0 1-3-3V7a3 3 0 0 1 6 0v1a3 3 0 0 1-3 3Zm-4 4h8l2 6H6l2-6Z", "Psychology");
export const PhilosophyGlyph = createDomainGlyph("M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 2a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm-3 5h6v2H9v-2Zm0 3h4v2H9v-2Zm3-6v2h-1v2h2v-4h-1Z", "Philosophy");
export const AnthropologyGlyph = createDomainGlyph("M12 2a4 4 0 0 0-4 4c0 2.2 1.8 4 4 4s4-1.8 4-4a4 4 0 0 0-4-4Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-5 8h2v4H7v-4Zm4 0h2v8h-2v-8Zm4 0h2v4h-2v-4Z", "Anthropology");
export const HistoryGlyph = createDomainGlyph("M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2Zm0 4v6h4v2h-6V6h2Z", "History");
export const LanguageGlyph = createDomainGlyph("M5 3h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5l-3 3-3-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v10h3.2l1.8 1.8L11.8 15H19V5H5Zm2 3h4v2H7V8Zm0 3h6v2H7v-2Z", "Language");
export const MythologyGlyph = createDomainGlyph("M12 2 9 8H3l5 4-2 6 6-4 6 4-2-6 5-4h-6L12 2Zm0 4.2L13.5 10h4.3l-3.5 2.8 1.3 4-3.6-2.4-3.6 2.4 1.3-4L6.2 10h4.3L12 6.2Z", "Mythology");
export const ReligionGlyph = createDomainGlyph("M12 2 9 8H3l5 4-2 6 6-4 6 4-2-6 5-4h-6L12 2Zm0 3 2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4Z", "Religion");
export const ScienceGlyph = createDomainGlyph("M9 3h6v2H9V3Zm-1 4h8v1h-1v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8H6V7h2Zm3 4h2v3h-2v-3Z", "Science");
export const SymbolismGlyph = createDomainGlyph("M12 2 9 8H3l5 4-2 6 6-4 6 4-2-6 5-4h-6L12 2Z", "Symbolism");
export const ArtGlyph = createDomainGlyph("M3 21h18v-2H3v2ZM5 3h14a2 2 0 0 1 2 2v10H3V5a2 2 0 0 1 2-2Zm0 2v8h14V5H5Zm5 2a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3 0 4 4-1 1-4-4 1-1Zm-3 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z", "Art");
export const AIGlyph = createDomainGlyph("M12 2a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3 3 3 0 0 0 3-3V5a3 3 0 0 0-3-3Zm0 2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1 1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM5 14h14v2H5v-2Zm3 3h8v2H8v-2Z", "AI");
export const CivilizationGlyph = createDomainGlyph("M3 21h18v-2H3v2ZM5 3h2v2H5V3Zm4 0h2v2H9V3Zm4 0h2v2h-2V3Zm4 0h2v2h-2V3ZM4 7h16v2H4V7Zm0 4h16v2H4v-2Zm0 4h10v2H4v-2Z", "Civilization");
