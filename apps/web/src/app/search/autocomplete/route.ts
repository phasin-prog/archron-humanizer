import { NextRequest, NextResponse } from "next/server"

type ObjectType = "concept" | "thinker" | "book" | "article"

interface AutocompleteItem {
  slug: string
  title: string
  description: string
  type: ObjectType
  meta?: string
}

interface AutocompleteGroup {
  type: ObjectType
  label: string
  items: AutocompleteItem[]
}

interface AutocompleteResponse {
  groups: AutocompleteGroup[]
}

const PLACEHOLDER_DATA: Record<ObjectType, AutocompleteItem[]> = {
  concept: [
    {
      slug: "shadow", title: "Shadow", type: "concept",
      description: "The shadow is an unconscious aspect of the personality.",
      meta: "Archetype",
    },
    {
      slug: "shadow-work", title: "Shadow Work", type: "concept",
      description: "The process of integrating the shadow into conscious awareness.",
      meta: "Process",
    },
    {
      slug: "individuation", title: "Individuation", type: "concept",
      description: "The lifelong process of psychological integration and self-realization.",
      meta: "Process",
    },
    {
      slug: "ego", title: "Ego", type: "concept",
      description: "The center of consciousness and personal identity in Jungian psychology.",
      meta: "Structure",
    },
  ],
  thinker: [
    {
      slug: "carl-jung", title: "Carl Jung", type: "thinker",
      description: "Swiss psychiatrist who founded analytical psychology.",
      meta: "1875-1961",
    },
    {
      slug: "sigmund-freud", title: "Sigmund Freud", type: "thinker",
      description: "Austrian neurologist and the founder of psychoanalysis.",
      meta: "1856-1939",
    },
    {
      slug: "friedrich-nietzsche", title: "Friedrich Nietzsche", type: "thinker",
      description: "German philosopher who profoundly influenced modern thought.",
      meta: "1844-1900",
    },
    {
      slug: "marie-louise-von-franz", title: "Marie-Louise von Franz", type: "thinker",
      description: "Swiss Jungian psychologist known for work on alchemy and fairy tales.",
      meta: "1915-1998",
    },
  ],
  book: [
    {
      slug: "man-and-his-symbols", title: "Man and His Symbols", type: "book",
      description: "Jung's final work exploring dreams, symbols, and the unconscious.",
      meta: "by Carl Jung — 1964",
    },
    {
      slug: "the-red-book", title: "The Red Book", type: "book",
      description: "Jung's personal journal of self-experimentation with visions and fantasies.",
      meta: "by Carl Jung — 2009",
    },
    {
      slug: "psychological-types", title: "Psychological Types", type: "book",
      description: "Foundational work on personality types, introversion, and extraversion.",
      meta: "by Carl Jung — 1921",
    },
    {
      slug: "memories-dreams-reflections", title: "Memories, Dreams, Reflections", type: "book",
      description: "Jung's autobiographical account of his life and inner experiences.",
      meta: "by Carl Jung — 1962",
    },
  ],
  article: [
    {
      slug: "understanding-the-shadow", title: "Understanding the Shadow", type: "article",
      description: "A comprehensive guide to the shadow archetype and its integration.",
      meta: "by Maria K.",
    },
    {
      slug: "the-role-of-dreams", title: "The Role of Dreams in Individuation", type: "article",
      description: "How dream analysis facilitates the individuation process.",
      meta: "by Elena R.",
    },
    {
      slug: "archetypes-modern-culture", title: "Archetypes in Modern Culture", type: "article",
      description: "Tracing Jungian archetypes in contemporary media and literature.",
      meta: "by David T.",
    },
    {
      slug: "active-imagination", title: "Active Imagination: A Practical Guide", type: "article",
      description: "Step-by-step methodology for engaging with unconscious contents.",
      meta: "by Clara W.",
    },
  ],
}

const TYPE_ORDER: ObjectType[] = ["concept", "thinker", "book", "article"]
const TYPE_LABELS: Record<ObjectType, string> = {
  concept: "Concepts",
  thinker: "Thinkers",
  book: "Books",
  article: "Articles",
}

function filterByQuery(items: AutocompleteItem[], q: string): AutocompleteItem[] {
  const query = q.toLowerCase().trim()
  if (!query) return items
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
  )
}

export async function GET(request: NextRequest): Promise<NextResponse<AutocompleteResponse>> {
  const { searchParams } = request.nextUrl
  const q = searchParams.get("q") ?? ""

  const groups: AutocompleteGroup[] = []

  for (const type of TYPE_ORDER) {
    const data = PLACEHOLDER_DATA[type]
    if (!data) continue
    const filtered = filterByQuery(data, q).slice(0, 2)
    if (filtered.length > 0) {
      groups.push({
        type,
        label: TYPE_LABELS[type],
        items: filtered,
      })
    }
  }

  return NextResponse.json({ groups })
}
