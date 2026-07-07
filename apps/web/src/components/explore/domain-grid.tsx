import Link from "next/link"
import {
  PsychologyIcon,
  PhilosophyIcon,
  AnthropologyIcon,
  HistoryIcon,
  LanguageIcon,
  MythologyIcon,
  ReligionIcon,
  ScienceIcon,
  SymbolismIcon,
  ArtIcon,
  AIIcon,
  CivilizationIcon,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  type IconProps,
} from "@archron/ui"

const domainGlyphs: Record<string, React.FC<IconProps>> = {
  psychology: PsychologyIcon,
  philosophy: PhilosophyIcon,
  anthropology: AnthropologyIcon,
  history: HistoryIcon,
  language: LanguageIcon,
  mythology: MythologyIcon,
  religion: ReligionIcon,
  science: ScienceIcon,
  symbolism: SymbolismIcon,
  art: ArtIcon,
  ai: AIIcon,
  civilization: CivilizationIcon,
}

export interface DomainInfo {
  slug: string
  name: string
  color: string
  conceptCount: number
  thinkerCount: number
  description?: string
}

export interface DomainGridProps {
  domains: DomainInfo[]
}

export function DomainGrid({ domains }: DomainGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {domains.map((domain) => {
        const Glyph = domainGlyphs[domain.slug]
        return (
          <Link
            key={domain.slug}
            href={`/explore/${domain.slug}`}
            className="group"
          >
            <Card
              className="h-full cursor-pointer border-border transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated"
              style={
                {
                  "--domain-color": domain.color,
                } as React.CSSProperties
              }
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-[var(--motion-normal)] group-hover:bg-[var(--domain-color)]/10"
                    style={{ color: domain.color }}
                  >
                    {Glyph ? <Glyph size="md" /> : null}
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
              {domain.description && (
                <CardContent>
                  <p className="line-clamp-2 text-caption text-text-muted">
                    {domain.description}
                  </p>
                </CardContent>
              )}
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
