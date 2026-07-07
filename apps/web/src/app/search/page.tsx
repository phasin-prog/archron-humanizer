"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardTitle, Badge, Button } from "@archron/ui"
import {
  KnowledgeConceptIcon,
  KnowledgeThinkerIcon,
  KnowledgeBookIcon,
  KnowledgeArticleIcon,
} from "@archron/ui"
import { SearchFilters } from "@/components/search/search-filters"

type ObjectType = "concept" | "thinker" | "book" | "article"
type FilterType = "all" | ObjectType

interface SearchResultItem {
  id: string
  slug: string
  title: string
  type: ObjectType
  description: string
  language?: string
  difficulty?: string
  readingTime?: number
  publishedAt?: string
  author?: string
  year?: number
  domain?: string
}

const PLACEHOLDER_RESULTS: SearchResultItem[] = [
  {
    id: "c1", slug: "shadow", title: "The Shadow", type: "concept",
    description: "The shadow is the unconscious aspect of the personality that the conscious ego does not identify with.",
    domain: "Analytical Psychology", difficulty: "intermediate",
  },
  {
    id: "c2", slug: "shadow-work", title: "Shadow Work", type: "concept",
    description: "The process of integrating the shadow — making the unconscious conscious through active dialogue with repressed aspects.",
    domain: "Analytical Psychology", difficulty: "advanced",
  },
  {
    id: "c3", slug: "individuation", title: "Individuation", type: "concept",
    description: "The lifelong psychological process of differentiation of the self, integrating conscious and unconscious elements.",
    domain: "Analytical Psychology", difficulty: "advanced",
  },
  {
    id: "c4", slug: "ego", title: "Ego", type: "concept",
    description: "The center of consciousness — the organizing complex of ideas and attitudes that constitutes the sense of personal identity.",
    domain: "Analytical Psychology", difficulty: "beginner",
  },
  {
    id: "c5", slug: "anima", title: "Anima", type: "concept",
    description: "The unconscious feminine side of a man, representing the inner image of the feminine in the male psyche.",
    domain: "Analytical Psychology", difficulty: "intermediate",
  },
  {
    id: "c6", slug: "persona", title: "Persona", type: "concept",
    description: "The social mask we wear — the outward face we present to the world, shaped by social expectations and roles.",
    domain: "Analytical Psychology", difficulty: "beginner",
  },
  {
    id: "c7", slug: "collective-unconscious", title: "Collective Unconscious", type: "concept",
    description: "The deepest layer of the psyche, containing inherited psychological patterns that transcend personal experience.",
    domain: "Analytical Psychology", difficulty: "intermediate",
  },
  {
    id: "c8", slug: "archetype", title: "Archetype", type: "concept",
    description: "Universal, archaic patterns and images that derive from the collective unconscious and form the basic content of mythologies.",
    domain: "Analytical Psychology", difficulty: "beginner",
  },
  {
    id: "c9", slug: "synchronicity", title: "Synchronicity", type: "concept",
    description: "The occurrence of meaningful coincidences that cannot be explained by cause and effect — an acausal connecting principle.",
    domain: "Analytical Psychology", difficulty: "advanced",
  },
  {
    id: "c10", slug: "self", title: "The Self", type: "concept",
    description: "The archetype of wholeness and the regulating center of the psyche — the totality of conscious and unconscious processes.",
    domain: "Analytical Psychology", difficulty: "advanced",
  },
  {
    id: "t1", slug: "carl-jung", title: "Carl Jung", type: "thinker",
    description: "Swiss psychiatrist and psychoanalyst who founded analytical psychology. Born 1875, died 1961.",
    domain: "Analytical Psychology",
  },
  {
    id: "t2", slug: "sigmund-freud", title: "Sigmund Freud", type: "thinker",
    description: "Austrian neurologist and the founder of psychoanalysis. Born 1856, died 1939.",
    domain: "Psychoanalysis",
  },
  {
    id: "t3", slug: "friedrich-nietzsche", title: "Friedrich Nietzsche", type: "thinker",
    description: "German philosopher, cultural critic, and poet who profoundly influenced modern intellectual history. Born 1844, died 1900.",
    domain: "Philosophy",
  },
  {
    id: "t4", slug: "marie-louise-von-franz", title: "Marie-Louise von Franz", type: "thinker",
    description: "Swiss Jungian psychologist and scholar, known for her work on alchemy, fairy tales, and dream interpretation. Born 1915, died 1998.",
    domain: "Analytical Psychology",
  },
  {
    id: "t5", slug: "james-hillman", title: "James Hillman", type: "thinker",
    description: "American psychologist who founded archetypal psychology, moving beyond Jung's clinical framework. Born 1926, died 2011.",
    domain: "Archetypal Psychology",
  },
  {
    id: "t6", slug: "erich-neumann", title: "Erich Neumann", type: "thinker",
    description: "German psychologist and writer, one of Jung's most creative students, known for his work on the origins of consciousness.",
    domain: "Analytical Psychology",
  },
  {
    id: "b1", slug: "man-and-his-symbols", title: "Man and His Symbols", type: "book",
    description: "Jung's final work, written for a general audience, exploring the significance of dreams, symbols, and the unconscious mind.",
    author: "Carl Jung", year: 1964,
  },
  {
    id: "b2", slug: "the-red-book", title: "The Red Book", type: "book",
    description: "Jung's personal journal of self-experimentation with visions and fantasies, containing elaborate calligraphy and paintings.",
    author: "Carl Jung", year: 2009,
  },
  {
    id: "b3", slug: "psychological-types", title: "Psychological Types", type: "book",
    description: "Jung's foundational work on personality types, introducing the concepts of introversion, extraversion, and the four functions.",
    author: "Carl Jung", year: 1921,
  },
  {
    id: "b4", slug: "memories-dreams-reflections", title: "Memories, Dreams, Reflections", type: "book",
    description: "Jung's autobiographical account of his life, inner experiences, and the development of his psychological theories.",
    author: "Carl Jung", year: 1962,
  },
  {
    id: "b5", slug: "the-origins-of-consciousness", title: "The Origins and History of Consciousness", type: "book",
    description: "A comprehensive study of the evolution of consciousness through mythological stages, from the uroboros to the hero myth.",
    author: "Erich Neumann", year: 1949,
  },
  {
    id: "b6", slug: "shadow-and-evil", title: "Shadow and Evil in Fairy Tales", type: "book",
    description: "An exploration of the shadow archetype through the lens of folk tales, examining how different cultures personify evil.",
    author: "Marie-Louise von Franz", year: 1974,
  },
  {
    id: "a1", slug: "understanding-the-shadow", title: "Understanding the Shadow", type: "article",
    description: "A comprehensive guide to the shadow archetype — its origins, manifestations, and the process of integration.",
    author: "Maria K.", readingTime: 15, publishedAt: "2024-06-15",
  },
  {
    id: "a2", slug: "the-role-of-dreams", title: "The Role of Dreams in Individuation", type: "article",
    description: "How dream analysis serves as the via regia to the unconscious and facilitates the individuation process.",
    author: "Elena R.", readingTime: 12, publishedAt: "2024-05-20",
  },
  {
    id: "a3", slug: "archetypes-modern-culture", title: "Archetypes in Modern Culture", type: "article",
    description: "Tracing the presence and evolution of Jungian archetypes in contemporary media, film, and literature.",
    author: "David T.", readingTime: 10, publishedAt: "2024-04-08",
  },
  {
    id: "a4", slug: "active-imagination", title: "Active Imagination: A Practical Guide", type: "article",
    description: "Step-by-step methodology for engaging with unconscious contents through the technique of active imagination.",
    author: "Clara W.", readingTime: 18, publishedAt: "2024-03-22",
  },
  {
    id: "a5", slug: "synchronicity-practice", title: "Synchronicity in Clinical Practice", type: "article",
    description: "Case studies exploring meaningful coincidences in the therapeutic setting and their role in psychological transformation.",
    author: "James L.", readingTime: 14, publishedAt: "2024-02-11",
  },
  {
    id: "a6", slug: "jung-and-nietzsche", title: "Jung and Nietzsche: The Unconscious Roots", type: "article",
    description: "Examining the profound influence of Nietzsche's philosophy on Jung's conception of the unconscious and the self.",
    author: "Hans M.", readingTime: 20, publishedAt: "2024-01-05",
  },
]

const ITEMS_PER_PAGE = 10
const TYPE_LABELS: Record<ObjectType, string> = {
  concept: "Concepts",
  thinker: "Thinkers",
  book: "Books",
  article: "Articles",
}
const TYPE_ORDER: ObjectType[] = ["concept", "thinker", "book", "article"]
const TYPE_ICONS: Record<ObjectType, React.ComponentType<{ size?: "sm" | "md" | "lg" | "xl"; className?: string }>> = {
  concept: KnowledgeConceptIcon,
  thinker: KnowledgeThinkerIcon,
  book: KnowledgeBookIcon,
  article: KnowledgeArticleIcon,
}

function filterResults(results: SearchResultItem[], query: string, type: FilterType): SearchResultItem[] {
  const q = query.toLowerCase().trim()
  let filtered = results

  if (type !== "all") {
    filtered = filtered.filter((r) => r.type === type)
  }

  if (q) {
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q)
    )
  }

  return filtered
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const [activeType, setActiveType] = useState<FilterType>("all")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const filtered = useMemo(
    () => filterResults(PLACEHOLDER_RESULTS, query, activeType),
    [query, activeType]
  )

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visible.length < filtered.length

  const grouped = useMemo(() => {
    const groups: { type: ObjectType; label: string; items: SearchResultItem[] }[] = []
    for (const ot of TYPE_ORDER) {
      const items = visible.filter((r) => r.type === ot)
      if (items.length > 0) {
        groups.push({ type: ot, label: TYPE_LABELS[ot], items })
      }
    }
    return groups
  }, [visible])

  const handleTypeChange = (type: FilterType) => {
    setActiveType(type)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const noResults = filtered.length === 0

  return (
    <main className="mx-auto w-full max-w-container-page px-6 py-8">
      <h1 className="mb-2 font-serif text-page-title font-semibold text-text">
        {query ? `Results for "${query}"` : "Search"}
      </h1>
      <p className="mb-6 text-caption text-text-muted">
        {filtered.length} {filtered.length === 1 ? "result" : "results"} found
      </p>

      <SearchFilters active={activeType} onTypeChange={handleTypeChange} />

      {noResults ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="font-serif text-section text-text-muted">No results found</p>
          <p className="text-caption text-text-disabled">
            Try searching for a different term or exploring related disciplines.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["Analytical Psychology", "Philosophy", "Psychoanalysis"].map((domain) => (
              <Link
                key={domain}
                href={`/explore/${domain.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-lg border border-border bg-card px-4 py-2 text-caption text-text-muted transition-colors hover:border-primary/30 hover:text-text"
              >
                {domain}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {grouped.map((group) => (
            <section key={group.type}>
              <h2 className="mb-4 flex items-center gap-2 font-serif text-section font-semibold text-text">
                {group.label}
                <span className="font-sans text-meta text-text-disabled">
                  ({group.items.length})
                </span>
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => {
                  const Icon = TYPE_ICONS[item.type]
                  return (
                    <Link key={item.id} href={`/${item.slug}`}>
                      <Card className="group transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated">
                        <CardContent className="flex flex-col gap-2 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon size="sm" className="shrink-0 text-text-disabled" />
                              <CardTitle className="truncate font-serif text-card-title font-semibold text-text group-hover:text-primary">
                                {item.title}
                              </CardTitle>
                            </div>
                            <Badge variant="secondary" className="shrink-0 capitalize">
                              {item.type}
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-2 text-caption text-text-muted">
                            {item.description}
                          </CardDescription>
                          <div className="flex flex-wrap items-center gap-3 text-meta text-text-disabled">
                            {item.domain && <span>{item.domain}</span>}
                            {item.difficulty && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="capitalize">{item.difficulty}</span>
                              </>
                            )}
                            {item.readingTime && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{item.readingTime} min read</span>
                              </>
                            )}
                            {item.author && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>by {item.author}</span>
                              </>
                            )}
                            {item.year && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{item.year}</span>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((v) => v + ITEMS_PER_PAGE)}
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
