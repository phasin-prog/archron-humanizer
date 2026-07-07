import Link from "next/link"
import { DomainGrid } from "@/components/explore/domain-grid"
import {
  ConceptIcon,
  ThinkerIcon,
  BookIcon,
  ArticleIcon,
  SymbolIcon,
  TimelineIcon,
  GuideIcon,
  CollectionIcon,
  Card,
  CardContent,
  Button,
  ArrowRightIcon,
} from "@archron/ui"
import type { DomainInfo } from "@/components/explore/domain-grid"

const domains: DomainInfo[] = [
  { slug: "psychology", name: "Psychology", color: "var(--color-domain-psychology)", conceptCount: 48, thinkerCount: 12, description: "The scientific study of the mind and behavior" },
  { slug: "philosophy", name: "Philosophy", color: "var(--color-domain-philosophy)", conceptCount: 32, thinkerCount: 18, description: "Exploration of existence, knowledge, and values" },
  { slug: "anthropology", name: "Anthropology", color: "var(--color-domain-anthropology)", conceptCount: 24, thinkerCount: 8, description: "The study of human societies, cultures, and their development" },
  { slug: "history", name: "History", color: "var(--color-domain-history)", conceptCount: 20, thinkerCount: 6, description: "The study of past events and their interpretation" },
  { slug: "language", name: "Language", color: "var(--color-domain-language)", conceptCount: 22, thinkerCount: 7, description: "The structure, evolution, and philosophy of language" },
  { slug: "mythology", name: "Mythology", color: "var(--color-domain-mythology)", conceptCount: 28, thinkerCount: 0, description: "The study of myths, legends, and their symbolic meaning" },
  { slug: "religion", name: "Religion", color: "var(--color-domain-religion)", conceptCount: 26, thinkerCount: 0, description: "Belief systems, spiritual practices, and sacred traditions" },
  { slug: "science", name: "Science", color: "var(--color-domain-science)", conceptCount: 18, thinkerCount: 10, description: "Systematic study of the natural and physical world" },
  { slug: "symbolism", name: "Symbolism", color: "var(--color-domain-symbolism)", conceptCount: 16, thinkerCount: 0, description: "The study of symbols, archetypes, and meaning" },
  { slug: "art", name: "Art", color: "var(--color-domain-art)", conceptCount: 14, thinkerCount: 5, description: "Visual art, aesthetics, and creative expression" },
  { slug: "ai", name: "AI", color: "var(--color-domain-ai)", conceptCount: 10, thinkerCount: 0, description: "Artificial intelligence and its philosophical implications" },
  { slug: "civilization", name: "Civilization", color: "var(--color-domain-civilization)", conceptCount: 12, thinkerCount: 0, description: "The development of human societies and cultures" },
]

const objectTypes: { slug: string; label: string; count: number; icon: React.ComponentType<any> }[] = [
  { slug: "concepts", label: "Concepts", count: 156, icon: ConceptIcon },
  { slug: "thinkers", label: "Thinkers", count: 48, icon: ThinkerIcon },
  { slug: "books", label: "Books", count: 56, icon: BookIcon },
  { slug: "articles", label: "Articles", count: 34, icon: ArticleIcon },
  { slug: "symbols", label: "Symbols", count: 18, icon: SymbolIcon },
  { slug: "timeline", label: "Timeline", count: 120, icon: TimelineIcon },
  { slug: "guides", label: "Guides", count: 12, icon: GuideIcon },
  { slug: "collections", label: "Collections", count: 8, icon: CollectionIcon },
]

export default function ExplorePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-container-page px-6 pb-24">
        <section className="pt-24">
          <h1 className="font-display text-display font-bold tracking-tight text-text">
            Explore Knowledge
          </h1>
          <p className="mt-2 text-body text-text-muted">
            Browse the knowledge ecosystem by discipline or object type
          </p>
        </section>

        <section className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-section font-semibold text-text">
              Browse by Discipline
            </h2>
          </div>
          <DomainGrid domains={domains} />
        </section>

        <section className="mt-20">
          <h2 className="mb-6 font-serif text-section font-semibold text-text">
            Browse by Object Type
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {objectTypes.map((type) => (
              <Link key={type.slug} href={`/search?type=${type.slug}`} className="group">
                <Card className="h-full cursor-pointer border-border transition-colors duration-[var(--motion-normal)] hover:border-[var(--color-interactive-border-hover)] hover:bg-elevated">
                  <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
                    <type.icon size="lg" className="text-text-muted group-hover:text-primary transition-colors duration-[var(--motion-fast)]" />
                    <span className="text-caption font-medium text-text group-hover:text-primary transition-colors duration-[var(--motion-fast)]">
                      {type.label}
                    </span>
                    <span className="text-meta text-text-disabled">
                      {type.count} objects
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <h2 className="font-serif text-section font-semibold text-text">
              Not sure where to start?
            </h2>
            <p className="mt-2 text-caption text-text-muted">
              Let serendipity guide you to something unexpected
            </p>
            <Button variant="outline" size="lg" className="mt-4 gap-2" asChild>
              <Link href="/explore/random">
                <ArrowRightIcon size="sm" />
                Random Discovery
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
