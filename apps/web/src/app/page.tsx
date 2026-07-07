import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ============================================
          HERO
          ============================================ */}
      <section className="relative flex flex-col items-center justify-center px-6 pb-24 pt-32 text-center">
        <div
          className="pointer-events-none absolute inset-0 select-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(196,155,85,0.06) 0%, transparent 60%)",
          }}
        />

        {/* Constellation */}
        <div className="pointer-events-none absolute inset-0 select-none opacity-[0.04]">
          <div className="absolute left-[20%] top-[30%] h-px w-8 rotate-[25deg] bg-primary" />
          <div className="absolute right-[25%] top-[25%] h-px w-12 -rotate-[20deg] bg-primary" />
          <div className="absolute left-[40%] top-[55%] h-px w-6 rotate-[45deg] bg-primary" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="font-display text-display font-bold tracking-tight text-text">
            ARCHRON
          </h1>
          <p className="font-serif text-page-title font-light text-text-muted">
            Understanding Humanity
          </p>
          <p className="font-serif text-page-title font-light text-text-muted -mt-2">
            Through Knowledge
          </p>
        </div>
      </section>

      {/* Search */}
      <div className="mx-auto -mt-8 w-full max-w-reading px-6">
        <div className="relative">
          <input
            type="search"
            placeholder="Search Everything..."
            className="w-full rounded-xl border border-border bg-card px-5 py-4 text-center font-serif text-body text-text placeholder:text-text-disabled focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors duration-[var(--motion-normal)]"
          />
        </div>
      </div>

      {/* ============================================
          CONTINUE READING
          ============================================ */}
      <section className="mx-auto mt-20 w-full max-w-container-page px-6">
        <h2 className="mb-6 font-serif text-section font-semibold text-text">
          Continue Reading
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Link
              key={i}
              href="#"
              className="group rounded-xl border border-border bg-card p-5 transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-domain-philosophy/15 px-2 py-0.5 font-mono text-meta font-medium text-domain-philosophy">
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Link
              key={i}
              href="#"
              className="group rounded-xl border border-border bg-card p-6 transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-meta font-medium text-primary">
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
            { type: "Concept", title: "Individuation", domain: "Psychology", color: "#34D3F5" },
            { type: "Thinker", title: "Carl Jung", domain: "Psychology", color: "#A78BFA" },
            { type: "Article", title: "The Role of Dreams", domain: "Psychology", color: "#CBD5E1" },
            { type: "Book", title: "Man and His Symbols", domain: "Psychology", color: "#FB923C" },
          ].map((item) => (
            <Link
              key={item.title}
              href="#"
              className="group rounded-xl border border-border bg-card p-4 transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 font-mono text-meta font-medium"
                  style={{
                    backgroundColor: `${item.color}15`,
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
          FOOTER
          ============================================ */}
      <footer className="mt-24 border-t border-border">
        <div className="mx-auto flex max-w-container-page flex-wrap items-center justify-center gap-6 px-6 py-10">
          <Link
            href="/support"
            className="text-caption text-text-muted transition-colors duration-[var(--motion-fast)] hover:text-primary"
          >
            Support <span aria-hidden="true">☕</span>
          </Link>
          <Link
            href="/about"
            className="text-caption text-text-muted transition-colors duration-[var(--motion-fast)] hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-caption text-text-muted transition-colors duration-[var(--motion-fast)] hover:text-primary"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-caption text-text-muted transition-colors duration-[var(--motion-fast)] hover:text-primary"
          >
            Terms
          </Link>
        </div>
      </footer>
    </div>
  )
}
