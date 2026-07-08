import Link from "next/link"
import { SearchBar } from "@/components/search/search-bar"
import { Logo } from "@/components/brand/logo"
import { SiteNavigation } from "@/components/navigation/site-navigation"
import { ExploreIcon, TimelineIcon, ConstellationIcon } from "@archron/ui"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ============================================
          HERO — Logo + Navigation + Search
          ============================================ */}
      <section className="relative flex flex-col items-center justify-center px-6 pb-16 pt-20">
        {/* Subtle ambient glow */}
        <div
          className="pointer-events-none absolute inset-0 select-none"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(95,141,206,0.03) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-[var(--z-base)] flex w-full max-w-reading flex-col items-center gap-8">
          {/* Logo */}
          <Logo size="lg" />

          {/* Site Navigation */}
          <SiteNavigation className="mt-4" />

          {/* Search */}
          <div className="mt-6 w-full">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* ============================================
          CONTINUE READING
          ============================================ */}
      <section className="mx-auto mt-20 w-full max-w-container-page px-6">
        <h2 className="mb-6 font-serif text-section font-semibold text-text">
          Continue Reading
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Link
              key={i}
              href={i === 1 ? "/concepts/structure-of-the-unconscious" : i === 2 ? "/concepts/archetypes" : "/concepts/the-shadow"}
              className="group rounded-xl border border-border bg-card p-5 transition-colors duration-[var(--motion-normal)] hover:border-[var(--color-interactive-border-hover)] hover:bg-elevated"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 font-mono text-meta font-medium"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-concept) 15%, transparent)',
                    color: 'var(--color-concept)'
                  }}
                >
                  Concept
                </span>
                <span className="text-caption text-text-disabled">60% complete</span>
              </div>
              <h3 className="font-serif text-card-title font-semibold text-text group-hover:text-primary transition-colors">
                {i === 1 && "The Structure of the Unconscious"}
                {i === 2 && "Archetypes and the Collective"}
                {i === 3 && "The Shadow"}
              </h3>
              <p className="mt-1 line-clamp-2 font-sans text-caption text-text-muted">
                {i === 1 && "Exploring the layers of consciousness that shape human experience"}
                {i === 2 && "How universal patterns emerge across cultures and time"}
                {i === 3 && "Understanding the hidden aspects of the human psyche"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================
          FEATURED GUIDE
          ============================================ */}
      <section className="mx-auto mt-20 w-full max-w-container-page px-6">
        <h2 className="mb-6 font-serif text-section font-semibold text-text">
          Featured Guide
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Link
              key={i}
              href={i === 1 ? "/guides" : "/guides"}
              className="group relative rounded-xl border border-accent/30 bg-card p-6 transition-colors duration-[var(--motion-normal)] hover:border-accent/50 hover:bg-elevated"
            >
              {/* Featured badge */}
              {i === 1 && (
                <div className="absolute -right-2 -top-2 rounded-full bg-accent px-3 py-1 font-mono text-meta font-medium text-accent-foreground">
                  Featured
                </div>
              )}
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 font-mono text-meta font-medium"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-guide) 15%, transparent)',
                    color: 'var(--color-guide)'
                  }}
                >
                  Guide
                </span>
                <span className="text-caption text-text-disabled">8 Lessons</span>
              </div>
              <h3 className="font-serif text-card-title font-semibold text-text group-hover:text-primary transition-colors">
                {i === 1 && "Introduction to Analytical Psychology"}
                {i === 2 && "The History of Philosophy"}
              </h3>
              <p className="mt-1 line-clamp-2 font-sans text-caption text-text-muted">
                {i === 1 && "A structured journey through Jungian concepts, thinkers, and theories"}
                {i === 2 && "From ancient Greece to modern thought — understanding the evolution of ideas"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================
          LATEST KNOWLEDGE
          ============================================ */}
      <section className="mx-auto mt-20 w-full max-w-container-page px-6">
        <h2 className="mb-6 font-serif text-section font-semibold text-text">
          Latest Knowledge
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { type: "Concept", title: "Individuation", domain: "Psychology", color: "var(--color-concept)" },
            { type: "Thinker", title: "Carl Jung", domain: "Psychology", color: "var(--color-thinker)" },
            { type: "Article", title: "The Role of Dreams", domain: "Psychology", color: "var(--color-article)" },
            { type: "Book", title: "Man and His Symbols", domain: "Psychology", color: "var(--color-book)" },
          ].map((item) => (
            <Link
              key={item.title}
              href={`/concepts/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group rounded-xl border border-border bg-card p-4 transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 font-mono text-meta font-medium"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                    color: item.color,
                  }}
                >
                  {item.type}
                </span>
              </div>
              <h3 className="font-serif text-card-title font-semibold text-text group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="mt-1 font-sans text-caption text-text-muted">{item.domain}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================
          BROWSE
          ============================================ */}
      <section className="mx-auto mt-20 w-full max-w-container-page px-6">
        <h2 className="mb-6 font-serif text-section font-semibold text-text">
          Browse
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/explore"
            className="group flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated"
          >
            <div className="shrink-0 rounded-lg bg-elevated p-2">
              <ExploreIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-card-title font-semibold text-text group-hover:text-primary transition-colors">
                Explore
              </h3>
              <p className="mt-1 font-sans text-caption text-text-muted">
                Discover knowledge through disciplines and domains
              </p>
            </div>
          </Link>
          <Link
            href="/timeline"
            className="group flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated"
          >
            <div className="shrink-0 rounded-lg bg-elevated p-2">
              <TimelineIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-card-title font-semibold text-text group-hover:text-primary transition-colors">
                Timeline
              </h3>
              <p className="mt-1 font-sans text-caption text-text-muted">
                Walk through the history of human thought
              </p>
            </div>
          </Link>
          <Link
            href="/constellation"
            className="group flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated"
          >
            <div className="shrink-0 rounded-lg bg-elevated p-2">
              <ConstellationIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-card-title font-semibold text-text group-hover:text-primary transition-colors">
                Constellation
              </h3>
              <p className="mt-1 font-sans text-caption text-text-muted">
                Visualize the connections between ideas
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="mt-24 border-t border-border">
        <div className="mx-auto flex max-w-container-page flex-wrap items-center justify-center gap-6 px-6 py-10">
          <Link
            href="/support"
            className="text-caption text-text-muted transition-colors duration-[var(--motion-fast)] hover:text-primary hover:underline underline-offset-4"
          >
            Support <span aria-hidden="true">☕</span>
          </Link>
          <Link
            href="/about"
            className="text-caption text-text-muted transition-colors duration-[var(--motion-fast)] hover:text-primary hover:underline underline-offset-4"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-caption text-text-muted transition-colors duration-[var(--motion-fast)] hover:text-primary hover:underline underline-offset-4"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-caption text-text-muted transition-colors duration-[var(--motion-fast)] hover:text-primary hover:underline underline-offset-4"
          >
            Terms
          </Link>
        </div>
      </footer>
    </div>
  )
}
