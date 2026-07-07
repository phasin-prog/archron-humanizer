"use client";
import { useMemo, useState } from "react";
import { ConstellationScene, } from "@/components/constellation/constellation-scene";
import { cn } from "@archron/ui";
const NODE_TYPE_COLORS = {
    concept: "#38BDF8",
    thinker: "#A78BFA",
    theory: "#F59E0B",
    school: "#10B981",
    discipline: "#EC4899",
    book: "#FB923C",
    article: "#CBD5E1",
    symbol: "#6366F1",
};
function nodeColor(type) {
    return NODE_TYPE_COLORS[type] ?? "#C49B55";
}
const PLACEHOLDER_NODES = [
    { id: "n1", label: "Shadow", type: "concept", x: 400, y: 180, color: nodeColor("concept"), size: 8, highlighted: false, slug: "concepts/shadow" },
    { id: "n2", label: "Ego", type: "concept", x: 300, y: 280, color: nodeColor("concept"), size: 7, highlighted: false, slug: "concepts/ego" },
    { id: "n3", label: "Anima/Animus", type: "concept", x: 500, y: 300, color: nodeColor("concept"), size: 6, highlighted: false, slug: "concepts/anima-animus" },
    { id: "n4", label: "Self", type: "concept", x: 420, y: 100, color: nodeColor("concept"), size: 7, highlighted: false, slug: "concepts/self" },
    { id: "n5", label: "Individuation", type: "concept", x: 320, y: 140, color: nodeColor("concept"), size: 6, highlighted: false, slug: "concepts/individuation" },
    { id: "n6", label: "Carl Jung", type: "thinker", x: 400, y: 240, color: nodeColor("thinker"), size: 10, highlighted: false, slug: "thinkers/carl-jung" },
    { id: "n7", label: "Sigmund Freud", type: "thinker", x: 200, y: 240, color: nodeColor("thinker"), size: 9, highlighted: false, slug: "thinkers/sigmund-freud" },
    { id: "n8", label: "Psychological Types", type: "book", x: 560, y: 200, color: nodeColor("book"), size: 4, highlighted: false, slug: "books/psychological-types" },
    { id: "n9", label: "Symbols of Transformation", type: "book", x: 520, y: 340, color: nodeColor("book"), size: 4, highlighted: false, slug: "books/symbols-of-transformation" },
    { id: "n10", label: "Analytical Psychology", type: "school", x: 300, y: 380, color: nodeColor("school"), size: 7, highlighted: false, slug: "schools/analytical-psychology" },
    { id: "n11", label: "Psychoanalysis", type: "school", x: 180, y: 340, color: nodeColor("school"), size: 6, highlighted: false, slug: "schools/psychoanalysis" },
    { id: "n12", label: "Unconscious", type: "concept", x: 250, y: 180, color: nodeColor("concept"), size: 8, highlighted: false, slug: "concepts/unconscious" },
];
const PLACEHOLDER_EDGES = [
    { id: "e1", source: "n6", target: "n4", color: "#334155", weight: 5, opacity: 0.6 },
    { id: "e2", source: "n6", target: "n1", color: "#334155", weight: 5, opacity: 0.6 },
    { id: "e3", source: "n6", target: "n2", color: "#334155", weight: 4, opacity: 0.5 },
    { id: "e4", source: "n6", target: "n3", color: "#334155", weight: 3, opacity: 0.4 },
    { id: "e5", source: "n6", target: "n5", color: "#334155", weight: 4, opacity: 0.5 },
    { id: "e6", source: "n7", target: "n12", color: "#334155", weight: 5, opacity: 0.6 },
    { id: "e7", source: "n6", target: "n8", color: "#334155", weight: 3, opacity: 0.4 },
    { id: "e8", source: "n6", target: "n9", color: "#334155", weight: 3, opacity: 0.4 },
    { id: "e9", source: "n6", target: "n10", color: "#334155", weight: 5, opacity: 0.6 },
    { id: "e10", source: "n7", target: "n11", color: "#334155", weight: 5, opacity: 0.6 },
    { id: "e11", source: "n7", target: "n2", color: "#334155", weight: 3, opacity: 0.4 },
    { id: "e12", source: "n6", target: "n7", color: "#334155", weight: 4, opacity: 0.5 },
    { id: "e13", source: "n12", target: "n1", color: "#334155", weight: 3, opacity: 0.4 },
    { id: "e14", source: "n4", target: "n5", color: "#334155", weight: 4, opacity: 0.5 },
    { id: "e15", source: "n10", target: "n1", color: "#334155", weight: 4, opacity: 0.5 },
];
const TYPE_FILTERS = [
    { label: "All", type: "all" },
    { label: "Concepts", type: "concept" },
    { label: "Thinkers", type: "thinker" },
    { label: "Schools", type: "school" },
    { label: "Books", type: "book" },
];
export default function ConstellationPage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const filteredNodes = useMemo(() => activeFilter === "all"
        ? PLACEHOLDER_NODES
        : PLACEHOLDER_NODES.filter((n) => n.type === activeFilter), [activeFilter]);
    const filteredEdges = useMemo(() => {
        const nodeIds = new Set(filteredNodes.map((n) => n.id));
        return PLACEHOLDER_EDGES.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));
    }, [filteredNodes]);
    return (<div className="mx-auto flex min-h-screen max-w-container-page flex-col px-6 pb-20 pt-8">
      <div className="mb-2">
        <h1 className="font-serif text-page-title font-bold text-text">
          Constellation
        </h1>
        <p className="mt-1 font-sans text-caption text-text-muted">
          Explore the knowledge graph — drag to pan, click a node to navigate
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-1 border-b border-border pb-4">
        {TYPE_FILTERS.map((f) => (<button key={f.type} onClick={() => setActiveFilter(f.type)} className={cn("rounded-lg px-3 py-1.5 text-caption font-medium transition-colors duration-[var(--motion-fast)]", activeFilter === f.type
                ? "bg-primary/10 text-primary"
                : "text-text-muted hover:bg-elevated hover:text-text")}>
            {f.label}
          </button>))}
      </div>

      <ConstellationScene nodes={filteredNodes} edges={filteredEdges}/>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {Object.entries(NODE_TYPE_COLORS).map(([type, color]) => (<div key={type} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: color }}/>
            <span className="text-meta capitalize text-text-muted">
              {type}
            </span>
          </div>))}
      </div>
    </div>);
}
