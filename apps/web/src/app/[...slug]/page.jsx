import { BreadcrumbBar } from "@/components/reading/breadcrumb-bar";
import { DefinitionBar } from "@/components/reading/definition-bar";
import { ReadingSidebar } from "@/components/reading/reading-sidebar";
const PLACEHOLDER_BREADCRUMB = [
    { label: "Psychology", href: "/explore/psychology" },
    { label: "Analytical Psychology", href: "/explore/psychology/analytical-psychology" },
    { label: "Shadow" },
];
const PLACEHOLDER_OBJECT = {
    type: "Concept",
    definition: "The unconscious aspect of personality containing repressed weaknesses, desires, and instincts that the conscious self does not identify with.",
    title: "Shadow",
};
const PLACEHOLDER_SIDEBAR = [
    {
        title: "Related Concepts",
        links: [
            { label: "Persona", href: "/persona" },
            { label: "Anima", href: "/anima" },
            { label: "Animus", href: "/animus" },
            { label: "Self", href: "/self" },
        ],
    },
    {
        title: "Thinkers",
        links: [
            { label: "Carl Jung", href: "/carl-jung", subtitle: "1875–1961" },
            { label: "Marie-Louise von Franz", href: "/marie-louise-von-franz", subtitle: "1915–1998" },
        ],
    },
    {
        title: "Books",
        links: [
            { label: "Man and His Symbols", href: "/man-and-his-symbols" },
            { label: "Aion", href: "/aion" },
        ],
    },
    {
        title: "Timeline",
        links: [
            { label: "1912 — Published in Symbols of Transformation", href: "/timeline/1912" },
            { label: "1921 — Defined in Psychological Types", href: "/timeline/1921" },
        ],
    },
    {
        title: "References",
        links: [
            { label: "Jung, C. (1951). Aion.", href: "#ref-1" },
            { label: "Jung, C. (1964). Man and His Symbols.", href: "#ref-2" },
            { label: "Stein, M. (1998). Jung's Map of the Soul.", href: "#ref-3" },
        ],
    },
];
export default async function ObjectPage({ params, }) {
    const { slug } = await params;
    void slug;
    return (<div className="min-h-screen">
      <BreadcrumbBar segments={PLACEHOLDER_BREADCRUMB} objectType={PLACEHOLDER_OBJECT.type}/>

      <DefinitionBar objectType={PLACEHOLDER_OBJECT.type} definition={PLACEHOLDER_OBJECT.definition}/>

      <div className="mx-auto flex max-w-container-page gap-8 px-6 py-8">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-page-title font-bold text-text mb-4">
            {PLACEHOLDER_OBJECT.title}
          </h1>

          <section className="font-serif text-body text-text-secondary leading-relaxed space-y-4 mb-8">
            <p>
              In analytical psychology, the shadow is an unconscious aspect of the
              personality that the conscious ego does not identify in itself. The shadow
              represents the unknown or little-known attributes and qualities of the ego,
              including aspects the individual often does not want to acknowledge.
            </p>
            <p>
              Because one tends to reject or remain ignorant of the least desirable aspects
              of one&apos;s personality, the shadow is largely negative. However, there are
              positive aspects that may also remain hidden in one&apos;s shadow — especially
              in people with low self-esteem, anxieties, and false beliefs.
            </p>
            <p>
              Jung emphasized the importance of being aware of shadow material and
              incorporating it into conscious awareness, lest one project these attributes
              onto others. The shadow in dreams is often represented by dark figures of the
              same gender as the dreamer.
            </p>
          </section>

          <section className="font-serif text-body text-text-secondary leading-relaxed space-y-4 mb-8">
            <h2 className="font-serif text-section font-semibold text-text mb-4">
              Deep Reading
            </h2>
            <p>
              The shadow is an archetype that consists of the sex and life instincts. The
              shadow exists as part of the unconscious mind and is composed of repressed
              ideas, weaknesses, desires, instincts, and shortcomings. The shadow is often
              described as the darker side of the psyche, representing wildness, chaos, and
              the unknown.
            </p>
            <p>
              Jung believed that &quot;Everyone carries a shadow, and the less it is
              embodied in the individual&apos;s conscious life, the blacker and denser it
              is.&quot; At all counts, it forms an unconscious snag, thwarting our most
              well-meant intentions.
            </p>
            <p>
              The shadow appears in many forms. It may be experienced as a figure of the
              same sex in dreams, as the dark brother or dark sister in mythology, or as
              the devil or a demonic figure in religion. It may be personified as the Joker
              in popular culture or as Hyde to Jekyll.
            </p>
            <p>
              The encounter with the shadow plays a central part in the process of
              individuation. Jung considered that &quot;the shadow is the doorway to
              individuality.&quot; In this sense, the shadow must be confronted and
              integrated into the personality for personal growth to occur.
            </p>
          </section>
        </div>

        <div className="hidden lg:block">
          <ReadingSidebar sections={PLACEHOLDER_SIDEBAR}/>
        </div>
      </div>
    </div>);
}
