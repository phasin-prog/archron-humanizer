import { notFound } from "next/navigation"
import type { SchoolCardProps, ThinkerCardProps, ArticleCardProps, IconProps } from "@archron/ui"
import {
  PsychologyIcon,
  PhilosophyIcon,
  SchoolCard,
  ThinkerCard,
  ArticleCard,
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@archron/ui"

interface DisciplineData {
  name: string
  slug: string
  color: string
  glyph: React.FC<IconProps>
  description: string
  schools: SchoolCardProps[]
  thinkers: ThinkerCardProps[]
  timeline: { year: number; event: string }[]
  articles: ArticleCardProps[]
}

const disciplines: Record<string, DisciplineData> = {
  psychology: {
    name: "Psychology",
    slug: "psychology",
    color: "#34D3F5",
    glyph: PsychologyIcon,
    description: "The scientific study of the mind and behavior — exploring consciousness, cognition, emotion, and the depths of the human psyche.",
    schools: [
      { slug: "analytical-psychology", title: "Analytical Psychology", period: "1913-Present", location: "Zurich", keyThinkersCount: 5, methodology: "Founded by Carl Jung, exploring the collective unconscious, archetypes, and the process of individuation as the path toward psychological wholeness." },
      { slug: "psychoanalysis", title: "Psychoanalysis", period: "1896-Present", location: "Vienna", keyThinkersCount: 8, methodology: "Developed by Sigmund Freud, focusing on unconscious processes, dream interpretation, and the dynamics of the id, ego, and superego." },
      { slug: "humanistic-psychology", title: "Humanistic Psychology", period: "1950s-Present", location: "United States", keyThinkersCount: 4, methodology: "Emphasizing human potential, self-actualization, and the innate drive toward growth and meaning." },
      { slug: "behaviorism", title: "Behaviorism", period: "1913-1960s", location: "United States", keyThinkersCount: 4, methodology: "Focusing on observable behavior, conditioning, and environmental influences on learning and development." },
      { slug: "cognitive-psychology", title: "Cognitive Psychology", period: "1950s-Present", location: "Global", keyThinkersCount: 6, methodology: "Studying mental processes — perception, memory, problem-solving — through the lens of information processing models." },
      { slug: "existential-psychology", title: "Existential Psychology", period: "1940s-Present", location: "Europe / USA", keyThinkersCount: 3, methodology: "Integrating existential philosophy with psychotherapy, confronting themes of meaning, freedom, and mortality." },
    ],
    thinkers: [
      { fullName: "Carl Gustav Jung", description: "Founder of Analytical Psychology. Developed concepts of the collective unconscious and archetypes.", slug: "carl-jung", era: "20th Century", nationality: "Swiss", birthDate: "1875", deathDate: "1961" },
      { fullName: "Sigmund Freud", description: "Founder of Psychoanalysis. Revolutionized the understanding of the human mind.", slug: "sigmund-freud", era: "20th Century", nationality: "Austrian", birthDate: "1856", deathDate: "1939" },
      { fullName: "Viktor Frankl", description: "Founder of Logotherapy. Survived the Holocaust and discovered meaning in suffering.", slug: "viktor-frankl", era: "20th Century", nationality: "Austrian", birthDate: "1905", deathDate: "1997" },
      { fullName: "William James", description: "Father of American Psychology. Pioneered functionalism and the philosophy of pragmatism.", slug: "william-james", era: "19th-20th Century", nationality: "American", birthDate: "1842", deathDate: "1910" },
    ],
    timeline: [
      { year: 1879, event: "First experimental psychology laboratory — Wundt" },
      { year: 1896, event: "Freud publishes 'The Interpretation of Dreams'" },
      { year: 1913, event: "Jung breaks from Freud; Analytical Psychology born" },
      { year: 1952, event: "DSM-I published" },
      { year: 1975, event: "Jung's 'The Red Book' discovered" },
    ],
    articles: [
      { slug: "individuation-journey", title: "The Journey of Individuation", excerpt: "Understanding the lifelong process of becoming one's true self through the lens of Jungian psychology.", readingTime: 15, author: "Archron Editorial", difficulty: "intermediate" },
      { slug: "shadow-work", title: "Shadow Work: Integrating the Dark Side", excerpt: "Practical guide to confronting and integrating the rejected aspects of the personality.", readingTime: 12, author: "Archron Editorial", difficulty: "beginner" },
      { slug: "dreams-archetypes", title: "Dreams and Archetypes", excerpt: "How universal patterns manifest in dreams and what they reveal about the psyche.", readingTime: 20, author: "Archron Editorial", difficulty: "advanced" },
    ],
  },
  philosophy: {
    name: "Philosophy",
    slug: "philosophy",
    color: "#A78BFA",
    glyph: PhilosophyIcon,
    description: "The love of wisdom — exploring existence, knowledge, values, reason, mind, and language through systematic inquiry and critical reflection.",
    schools: [
      { slug: "existentialism", title: "Existentialism", period: "19th-20th Century", location: "Europe", keyThinkersCount: 7, methodology: "Examining individual existence, freedom, and choice. Key themes include authenticity, absurdity, and the responsibility to create meaning." },
      { slug: "stoicism", title: "Stoicism", period: "3rd Century BCE", location: "Greece / Rome", keyThinkersCount: 4, methodology: "Teaching self-control, virtue, and resilience through the acceptance of what lies beyond our control." },
      { slug: "phenomenology", title: "Phenomenology", period: "20th Century", location: "Germany / France", keyThinkersCount: 5, methodology: "Studying structures of consciousness as experienced from the first-person point of view." },
    ],
    thinkers: [
      { fullName: "Friedrich Nietzsche", description: "Radical philosopher who proclaimed the death of God and explored the will to power.", slug: "friedrich-nietzsche", era: "19th Century", nationality: "German", birthDate: "1844", deathDate: "1900" },
      { fullName: "Jean-Paul Sartre", description: "Leading existentialist who argued that existence precedes essence.", slug: "jean-paul-sartre", era: "20th Century", nationality: "French", birthDate: "1905", deathDate: "1980" },
    ],
    timeline: [
      { year: -399, event: "Trial and death of Socrates" },
      { year: 1641, event: "Descartes publishes 'Meditations'" },
      { year: 1883, event: "Nietzsche publishes 'Thus Spoke Zarathustra'" },
    ],
    articles: [
      { slug: "eternal-recurrence", title: "The Eternal Recurrence", excerpt: "Nietzsche's most challenging thought experiment and its implications.", readingTime: 18, author: "Archron Editorial", difficulty: "advanced" },
    ],
  },
}

type Props = {
  params: Promise<{ discipline: string }>
}

export default async function DisciplinePage({ params }: Props) {
  const { discipline } = await params
  const data = disciplines[discipline]

  if (!data) {
    notFound()
  }

  const Glyph = data.glyph

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-container-page px-6 pb-24">
        <Breadcrumbs className="pt-20">
          <BreadcrumbItem href="/explore">Explore</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem isCurrent>{data.name}</BreadcrumbItem>
        </Breadcrumbs>

        <section className="mt-8">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${data.color}15`, color: data.color }}
            >
              <Glyph size="lg" />
            </div>
            <div>
              <h1 className="font-display text-display font-bold tracking-tight text-text">
                {data.name}
              </h1>
              <p className="mt-2 max-w-2xl text-body text-text-muted">
                {data.description}
              </p>
            </div>
          </div>
        </section>

        {data.schools.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-section font-semibold text-text">
                Schools ({data.schools.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.schools.map((school) => (
                <SchoolCard key={school.slug} {...school} />
              ))}
            </div>
          </section>
        )}

        {data.thinkers.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 font-serif text-section font-semibold text-text">
              Featured Thinkers
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.thinkers.map((thinker) => (
                <ThinkerCard key={thinker.slug} {...thinker} />
              ))}
            </div>
          </section>
        )}

        {data.timeline.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 font-serif text-section font-semibold text-text">
              Timeline
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border bg-card p-6">
              <div className="flex min-w-max gap-0">
                {data.timeline.map((event, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: data.color }}
                      />
                      <span
                        className="mt-1 font-mono text-meta font-medium"
                        style={{ color: data.color }}
                      >
                        {event.year}
                      </span>
                      <span className="mt-1 max-w-[120px] text-center text-caption text-text-muted">
                        {event.event}
                      </span>
                    </div>
                    {i < data.timeline.length - 1 && (
                      <div className="mx-6 mt-2 h-px w-16 bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {data.articles.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 font-serif text-section font-semibold text-text">
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.articles.map((article) => (
                <ArticleCard key={article.slug} {...article} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return Object.keys(disciplines).map((discipline) => ({ discipline }))
}
