"use client";
import { useMemo, useState } from "react";
import { TimelineTrack } from "@/components/timeline/timeline-track";
import { cn } from "@archron/ui";
const PLACEHOLDER_EVENTS = [
    {
        id: "e1",
        date: "1875",
        title: "Carl Jung born",
        description: "Birth of the Swiss psychiatrist who founded analytical psychology.",
        relatedThinkers: ["Carl Jung"],
        type: "thinker",
        slug: "thinkers/carl-jung",
    },
    {
        id: "e2",
        date: "1895",
        title: "Freud publishes Studies on Hysteria",
        description: "Foundational text of psychoanalysis co-authored with Josef Breuer.",
        relatedThinkers: ["Sigmund Freud"],
        type: "book",
        slug: "books/studies-on-hysteria",
    },
    {
        id: "e3",
        date: "1900",
        title: "The Interpretation of Dreams",
        description: "Freud's seminal work introducing the theory of the unconscious.",
        relatedThinkers: ["Sigmund Freud"],
        type: "book",
        slug: "books/interpretation-of-dreams",
    },
    {
        id: "e4",
        date: "1912",
        title: "Symbols of Transformation",
        description: "Jung's break with Freud, marking the birth of analytical psychology.",
        relatedThinkers: ["Carl Jung"],
        type: "book",
        slug: "books/symbols-of-transformation",
    },
    {
        id: "e5",
        date: "1921",
        title: "Psychological Types published",
        description: "Jung introduces the concepts of introversion and extraversion.",
        relatedThinkers: ["Carl Jung"],
        type: "book",
        slug: "books/psychological-types",
    },
    {
        id: "e6",
        date: "1930",
        title: "Concept: Shadow developed",
        description: "The shadow archetype formalized as a core concept in analytical psychology.",
        relatedThinkers: ["Carl Jung"],
        type: "concept",
        slug: "concepts/shadow",
    },
    {
        id: "e7",
        date: "1940",
        title: "Concept: Self archetype",
        description: "The Self emerges as the central archetype representing wholeness.",
        relatedThinkers: ["Carl Jung"],
        type: "concept",
        slug: "concepts/self",
    },
    {
        id: "e8",
        date: "1961",
        title: "Carl Jung dies",
        description: "Jung passes away in Zurich, leaving a vast legacy in psychology.",
        relatedThinkers: ["Carl Jung"],
        type: "event",
        slug: "thinkers/carl-jung",
    },
];
const PLACEHOLDER_ERAS = [
    { id: "era1", label: "Ancient", startYear: 400, endYear: 500 },
    { id: "era2", label: "Medieval", startYear: 800, endYear: 1400 },
    { id: "era3", label: "Renaissance", startYear: 1400, endYear: 1700 },
    { id: "era4", label: "Enlightenment", startYear: 1700, endYear: 1850 },
    { id: "era5", label: "Modern", startYear: 1850, endYear: 2000 },
];
const FILTERS = [
    { label: "All", value: "all" },
    { label: "Concepts", value: "concept" },
    { label: "Thinkers", value: "thinker" },
    { label: "Books", value: "book" },
    { label: "Events", value: "event" },
];
const ZOOM_LEVELS = [
    { label: "1y", years: 1 },
    { label: "5y", years: 5 },
    { label: "10y", years: 10 },
    { label: "50y", years: 50 },
    { label: "100y", years: 100 },
];
export default function TimelinePage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [activeZoom, setActiveZoom] = useState(50);
    const filteredEvents = useMemo(() => activeFilter === "all"
        ? PLACEHOLDER_EVENTS
        : PLACEHOLDER_EVENTS.filter((e) => e.type === activeFilter), [activeFilter]);
    return (<div className="mx-auto flex min-h-screen max-w-container-page flex-col px-6 pb-20 pt-8">
      <div className="mb-2">
        <h1 className="font-serif text-page-title font-bold text-text">
          Timeline of Psychology
        </h1>
        <p className="mt-1 font-sans text-caption text-text-muted">
          Every object connected through time
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (<button key={f.value} onClick={() => setActiveFilter(f.value)} className={cn("rounded-lg px-3 py-1.5 text-caption font-medium transition-colors duration-[var(--motion-fast)]", activeFilter === f.value
                ? "bg-primary/10 text-primary"
                : "text-text-muted hover:bg-elevated hover:text-text")}>
              {f.label}
            </button>))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-meta text-text-disabled">Zoom:</span>
          {ZOOM_LEVELS.map((z) => (<button key={z.label} onClick={() => setActiveZoom(z.years)} className={cn("rounded-md px-2 py-0.5 text-meta font-medium transition-colors duration-[var(--motion-fast)]", activeZoom === z.years
                ? "bg-primary/10 text-primary"
                : "text-text-muted hover:bg-elevated hover:text-text")}>
              {z.label}
            </button>))}
        </div>
      </div>

      <TimelineTrack events={filteredEvents} eras={PLACEHOLDER_ERAS} className="rounded-xl border border-border bg-surface/50 p-4"/>

      <p className="mt-6 text-center text-meta text-text-disabled">
        Click an event dot to see details. Double-click to navigate to the
        object page.
      </p>
    </div>);
}
