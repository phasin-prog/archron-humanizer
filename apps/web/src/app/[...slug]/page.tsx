import { notFound } from "next/navigation"
import { BreadcrumbBar } from "@/components/reading/breadcrumb-bar"
import { DefinitionBar } from "@/components/reading/definition-bar"
import { ReadingSidebar } from "@/components/reading/reading-sidebar"
import { db } from "@archron/database"
import { findObjectBySlug, findRelations } from "@archron/database"

export default async function ObjectPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const slugStr = slug.join("/")

  // Query object from database
  const object = await findObjectBySlug(db, slugStr)
  if (!object || object.status !== "published") {
    notFound()
  }

  // Query relations for sidebar
  const relations = await findRelations(db, {
    objectId: object.id,
    direction: "both",
    limit: 50,
  })

  // Build breadcrumb from domains
  const breadcrumb = object.domains?.slice(0, 2).map((domain: string) => ({
    label: domain.charAt(0).toUpperCase() + domain.slice(1),
    href: `/explore/${domain}`,
  })) || []
  breadcrumb.push({ label: object.title, href: `/${slugStr}` })

  // Build sidebar from relations
  const relatedConcepts = relations
    .filter((r) => r.target?.objectType === "concept")
    .slice(0, 5)
    .map((r) => ({ label: r.target?.title || "", href: `/${r.target?.slug}` }))

  const relatedThinkers = relations
    .filter((r) => r.target?.objectType === "thinker")
    .slice(0, 3)
    .map((r) => ({ label: r.target?.title || "", href: `/${r.target?.slug}` }))

  const relatedBooks = relations
    .filter((r) => r.target?.objectType === "book")
    .slice(0, 3)
    .map((r) => ({ label: r.target?.title || "", href: `/${r.target?.slug}` }))

  const sidebar = [
    relatedConcepts.length > 0 && { title: "Related Concepts", links: relatedConcepts },
    relatedThinkers.length > 0 && { title: "Thinkers", links: relatedThinkers },
    relatedBooks.length > 0 && { title: "Books", links: relatedBooks },
  ].filter(Boolean)

  return (
    <div className="min-h-screen">
      <BreadcrumbBar
        segments={breadcrumb}
        objectType={object.objectType}
      />

      <DefinitionBar
        objectType={object.objectType}
        definition={object.description || ""}
      />

      <div className="mx-auto flex max-w-container-page gap-8 px-6 py-8">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-page-title font-bold text-text mb-4">
            {object.title}
          </h1>

          <section className="font-serif text-body text-text-secondary leading-relaxed space-y-4 mb-8">
            <p>{object.description}</p>
          </section>
        </div>

        <div className="hidden lg:block">
          <ReadingSidebar sections={sidebar as any} />
        </div>
      </div>
    </div>
  )
}
