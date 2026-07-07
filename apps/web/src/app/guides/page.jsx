import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, KnowledgeGuideIcon, } from "@archron/ui";
const guides = [
    {
        slug: "intro-analytical-psychology",
        title: "Introduction to Analytical Psychology",
        description: "A structured journey through Jungian concepts, thinkers, and theories. From the unconscious to individuation.",
        lessonCount: 12,
        estimatedHours: 6,
        domain: "Psychology",
        domainColor: "#34D3F5",
    },
    {
        slug: "history-of-philosophy",
        title: "The History of Philosophy",
        description: "From ancient Greece to modern thought — understanding the evolution of ideas that shaped civilization.",
        lessonCount: 16,
        estimatedHours: 8,
        domain: "Philosophy",
        domainColor: "#A78BFA",
    },
    {
        slug: "myths-and-archetypes",
        title: "Myths and Archetypes",
        description: "Explore the universal patterns that appear across cultures — the hero's journey, creation myths, and the collective unconscious.",
        lessonCount: 8,
        estimatedHours: 4,
        domain: "Mythology",
        domainColor: "#DC2626",
    },
    {
        slug: "symbols-and-meaning",
        title: "Symbols and Meaning",
        description: "Decode the language of symbols — from alchemical emblems to dream imagery and cultural iconography.",
        lessonCount: 10,
        estimatedHours: 5,
        domain: "Symbolism",
        domainColor: "#4F46E5",
    },
    {
        slug: "existential-thought",
        title: "Existential Thought",
        description: "Confront the fundamental questions of existence, freedom, and authenticity through the works of Kierkegaard, Nietzsche, and Sartre.",
        lessonCount: 14,
        estimatedHours: 7,
        domain: "Philosophy",
        domainColor: "#A78BFA",
    },
    {
        slug: "language-and-mind",
        title: "Language and Mind",
        description: "How language shapes thought — from Saussure's structuralism to Chomsky's universal grammar and beyond.",
        lessonCount: 9,
        estimatedHours: 4.5,
        domain: "Language",
        domainColor: "#10B981",
    },
    {
        slug: "shadow-work-practice",
        title: "Shadow Work: A Practical Guide",
        description: "Learn to recognize, confront, and integrate the hidden aspects of your personality through guided exercises.",
        lessonCount: 6,
        estimatedHours: 3,
        domain: "Psychology",
        domainColor: "#34D3F5",
    },
    {
        slug: "ai-consciousness",
        title: "AI and Consciousness",
        description: "Exploring the philosophical and psychological implications of artificial intelligence on our understanding of consciousness.",
        lessonCount: 7,
        estimatedHours: 3.5,
        domain: "AI",
        domainColor: "#6366F1",
    },
];
export default function GuidesPage() {
    return (<div className="min-h-screen">
      <div className="mx-auto max-w-container-page px-6 pb-24">
        <section className="pt-24">
          <h1 className="font-display text-display font-bold tracking-tight text-text">
            Guides
          </h1>
          <p className="mt-2 max-w-2xl text-body text-text-muted">
            Structured learning journeys through the knowledge ecosystem — curated paths that connect concepts, thinkers, and ideas
          </p>
        </section>

        <section className="mt-16">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {guides.map((guide) => (<Link key={guide.slug} href={`/${guide.slug}`} className="group">
                <Card className="h-full cursor-pointer border-border transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KnowledgeGuideIcon size="sm" className="text-primary"/>
                        <Badge variant="outline" className="text-meta font-medium" style={{
                borderColor: `${guide.domainColor}40`,
                color: guide.domainColor,
            }}>
                          {guide.domain}
                        </Badge>
                      </div>
                      <span className="text-caption text-text-disabled">
                        {guide.estimatedHours}h
                      </span>
                    </div>
                    <CardTitle className="mt-3 text-card-title text-text group-hover:text-primary transition-colors duration-[var(--motion-fast)]">
                      {guide.title}
                    </CardTitle>
                    <CardDescription className="text-caption text-text-muted">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 text-caption text-text-disabled">
                      <span>{guide.lessonCount} lessons</span>
                      <span aria-hidden="true">·</span>
                      <span>{guide.estimatedHours}h estimated</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>))}
          </div>
        </section>
      </div>
    </div>);
}
