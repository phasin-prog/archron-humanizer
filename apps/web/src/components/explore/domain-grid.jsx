import Link from "next/link";
import { PsychologyGlyph, PhilosophyGlyph, AnthropologyGlyph, HistoryGlyph, LanguageGlyph, MythologyGlyph, ReligionGlyph, ScienceGlyph, SymbolismGlyph, ArtGlyph, AIGlyph, CivilizationGlyph, Card, CardHeader, CardTitle, CardContent, } from "@archron/ui";
const domainGlyphs = {
    psychology: PsychologyGlyph,
    philosophy: PhilosophyGlyph,
    anthropology: AnthropologyGlyph,
    history: HistoryGlyph,
    language: LanguageGlyph,
    mythology: MythologyGlyph,
    religion: ReligionGlyph,
    science: ScienceGlyph,
    symbolism: SymbolismGlyph,
    art: ArtGlyph,
    ai: AIGlyph,
    civilization: CivilizationGlyph,
};
export function DomainGrid({ domains }) {
    return (<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {domains.map((domain) => {
            const Glyph = domainGlyphs[domain.slug];
            return (<Link key={domain.slug} href={`/explore/${domain.slug}`} className="group">
            <Card className="h-full cursor-pointer border-border transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated" style={{
                    "--domain-color": domain.color,
                }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-[var(--motion-normal)] group-hover:bg-[var(--domain-color)]/10" style={{ color: domain.color }}>
                    {Glyph ? <Glyph size="md"/> : null}
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-card-title text-text group-hover:text-[var(--domain-color)] transition-colors duration-[var(--motion-fast)]">
                      {domain.name}
                    </CardTitle>
                    <p className="text-caption text-text-muted">
                      {domain.conceptCount} concepts
                      {domain.thinkerCount > 0 && ` · ${domain.thinkerCount} thinkers`}
                    </p>
                  </div>
                </div>
              </CardHeader>
              {domain.description && (<CardContent>
                  <p className="line-clamp-2 text-caption text-text-muted">
                    {domain.description}
                  </p>
                </CardContent>)}
            </Card>
          </Link>);
        })}
    </div>);
}
