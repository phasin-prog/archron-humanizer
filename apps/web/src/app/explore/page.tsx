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
import { db, listObjects } from "@archron/database"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Static domain metadata
const DOMAIN_METADATA: DomainInfo[] = [
  { slug: "psychology", name: "Psychology", color: "var(--color-domain-psychology)", conceptCount: 0, thinkerCount: 0, description: "The scientific study of the mind and behavior" },
  { slug: "philosophy", name: "Philosophy", color: "var(--color-domain-philosophy)", conceptCount: 0, thinkerCount: 0, description: "Exploration of existence, knowledge, and values" },
  { slug: "anthropology", name: "Anthropology", color: "var(--color-domain-anthropology)", conceptCount: 0, thinkerCount: 0, description: "The study of human societies, cultures, and their development" },
  { slug: "history", name: "History", color: "var(--color-domain-history)", conceptCount: 0, thinkerCount: 0, description: "The study of past events and their interpretation" },
  { slug: "language", name: "Language", color: "var(--color-domain-language)", conceptCount: 0, thinkerCount: 0, description: "The structure, evolution, and philosophy of language" },
  { slug: "mythology", name: "Mythology", color: "var(--color-domain-mythology)", conceptCount: 0, thinkerCount: 0, description: "The study of myths, legends, and their symbolic meaning" },
  { slug: "religion", name: "Religion", color: "var(--color-domain-religion)", conceptCount: 0, thinkerCount: 0, description: "Belief systems, spiritual practices, and sacred traditions" },
  { slug: "science", name: "Science", color: "var(--color-domain-science)", conceptCount: 0, thinkerCount: 0, description: "Systematic study of the natural and physical world" },
  { slug: "symbolism", name: "Symbolism", color: "var(--color-domain-symbolism)", conceptCount: 0, thinkerCount: 0, description: "The study of symbols, archetypes, and meaning" },
  { slug: "art", name: "Art", color: "var(--color-domain-art)", conceptCount: 0, thinkerCount: 0, description: "Visual art, aesthetics, and creative expression" },
  { slug: "ai", name: "AI", color: "var(--color-domain-ai)", conceptCount: 0, thinkerCount: 0, description: "Artificial intelligence and its philosophical implications" },
  { slug: "civilization", name: "Civilization", color: "var(--color-domain-civilization)", conceptCount: 0, thinkerCount: 0, description: "The development of human societies and cultures" },
]

export default async function ExplorePage() {
  // Query all published objects
  const allObjects = await listObjects(db, { status: ["published"] })

  // Build domain stats via client-side aggregation
  const domainStats: Record<string, { concepts: number; thinkers: number }> = {}
  for (const obj of allObjects) {
    for (const domain of obj.domains || []) {
      if (!domainStats[domain]) {
        domainStats[domain] = { concepts: 0, thinkers: 0 }
      }
      if (obj.objectType === "concept") domainStats[domain]!.concepts += 1
      if (obj.objectType === "thinker") domainStats[domain]!.thinkers += 1
    }
  }

  // Merge with metadata
  const domains = DOMAIN_METADATA.map(meta => ({
    ...meta,
    conceptCount: domainStats[meta.slug]?.concepts || 0,
    thinkerCount: domainStats[meta.slug]?.thinkers || 0,
  }))

  // Build type counts
  const typeCounts: Record<string, number> = {}
  for (const obj of allObjects) {
    typeCounts[obj.objectType] = (typeCounts[obj.objectType] || 0) + 1
  }

  const objectTypes: { slug: string; label: string; count: number; icon: React.ComponentType<any> }[] = [
    { slug: "concepts", label: "Concepts", count: typeCounts.concept || 0, icon: ConceptIcon },
    { slug: "thinkers", label: "Thinkers", count: typeCounts.thinker || 0, icon: ThinkerIcon },
    { slug: "books", label: "Books", count: typeCounts.book || 0, icon: BookIcon },
    { slug: "articles", label: "Articles", count: typeCounts.article || 0, icon: ArticleIcon },
    { slug: "symbols", label: "Symbols", count: typeCounts.symbol || 0, icon: SymbolIcon },
    { slug: "timeline", label: "Timeline", count: typeCounts.timeline_event || 0, icon: TimelineIcon },
    { slug: "guides", label: "Guides", count: typeCounts.guide || 0, icon: GuideIcon },
    { slug: "collections", label: "Collections", count: typeCounts.collection || 0, icon: CollectionIcon },
  ]

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
