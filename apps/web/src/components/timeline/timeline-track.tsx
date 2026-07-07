"use client"

import { useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { cn, Badge } from "@archron/ui"

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description?: string
  relatedThinkers?: string[]
  type: "event" | "concept" | "thinker" | "book"
  slug: string
}

export interface TimelineEra {
  id: string
  label: string
  startYear: number
  endYear: number
}

interface TimelineTrackProps {
  events: TimelineEvent[]
  eras: TimelineEra[]
  className?: string
}

const TYPE_COLORS: Record<string, string> = {
  event: "var(--color-timeline)",
  concept: "var(--color-concept)",
  thinker: "var(--color-thinker)",
  book: "var(--color-book)",
}

export function TimelineTrack({ events, eras, className }: TimelineTrackProps) {
  const router = useRouter()
  const trackRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, scroll: 0 })

  const sortedEvents = [...events].sort(
    (a, b) => parseInt(a.date) - parseInt(b.date)
  )

  const firstEvent = sortedEvents[0]
  const lastEvent = sortedEvents[sortedEvents.length - 1]
  const minYear = firstEvent ? parseInt(firstEvent.date) : 1800
  const maxYear = lastEvent
    ? parseInt(lastEvent.date)
    : 2000
  const yearSpan = maxYear - minYear || 1

  const getPositionPercent = (year: number) =>
    ((year - minYear) / yearSpan) * 100

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!trackRef.current) return
      setIsDragging(true)
      dragStart.current = {
        x: e.clientX,
        scroll: trackRef.current.scrollLeft,
      }
    },
    []
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !trackRef.current) return
      const dx = e.clientX - dragStart.current.x
      trackRef.current.scrollLeft = dragStart.current.scroll - dx
    },
    [isDragging]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDotClick = useCallback(
    (event: TimelineEvent) => {
      if (isDragging) return
      setSelectedId((prev) => (prev === event.id ? null : event.id))
    },
    [isDragging]
  )

  const handleDoubleClick = useCallback(
    (event: TimelineEvent) => {
      router.push(`/${event.slug}`)
    },
    [router]
  )

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative w-full overflow-x-auto overflow-y-hidden pb-16 select-none",
        isDragging && "cursor-grabbing",
        !isDragging && "cursor-grab",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="relative h-64" style={{ width: "3000px", minWidth: "100%" }}>
        {eras.map((era) => {
          const left = getPositionPercent(era.startYear)
          const width = getPositionPercent(era.endYear) - left
          return (
            <div
              key={era.id}
              className="absolute bottom-12"
              style={{ left: `${left}%`, width: `${width}%` }}
            >
              <span className="block text-meta font-bold uppercase tracking-wider text-text-disabled">
                {era.label}
              </span>
              <div className="mt-1 h-1 w-full rounded-full bg-border/30" />
            </div>
          )
        })}

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border" />

        {sortedEvents.map((event, i) => {
          const left = getPositionPercent(parseInt(event.date))
          const color = TYPE_COLORS[event.type] ?? "var(--color-primary)"
          const isSelected = selectedId === event.id

          return (
            <div key={event.id}>
              <div
                className={cn(
                  "absolute bottom-0 -translate-x-1/2 translate-y-1/2 z-10",
                  "size-3 rounded-full border-2 border-border bg-card cursor-pointer",
                  "transition-all duration-[var(--motion-fast)]",
                  "hover:scale-150 hover:shadow-glow"
                )}
                style={{
                  left: `${left}%`,
                  borderColor: color,
                  backgroundColor: isSelected ? color : "var(--color-card)",
                }}
                onClick={() => handleDotClick(event)}
                onDoubleClick={() => handleDoubleClick(event)}
                title={event.title}
              />

              {i < sortedEvents.length - 1 && (() => {
                const nextEvent = sortedEvents[i + 1]
                if (!nextEvent) return null
                return (
                  <div
                    className="absolute bottom-0 h-0.5 bg-border/30"
                    style={{
                      left: `${left}%`,
                      width: `${getPositionPercent(parseInt(nextEvent.date)) - left}%`,
                    }}
                  />
                )
              })()}

              <div
                className={cn(
                  "absolute bottom-4 -translate-x-1/2 transition-all duration-[var(--motion-fast)]",
                  isSelected && "opacity-0 pointer-events-none"
                )}
                style={{ left: `${left}%` }}
              >
                <span
                  className="block text-meta font-medium whitespace-nowrap"
                  style={{ color }}
                >
                  {event.date}
                </span>
              </div>

              {isSelected && (
                <div
                  className="absolute bottom-16 -translate-x-1/2 z-20"
                  style={{ left: `${left}%` }}
                >
                  <div className="w-64 rounded-xl border border-border bg-card p-4 shadow-medium">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span
                        className="text-meta font-medium"
                        style={{ color }}
                      >
                        {event.date}
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {event.type}
                      </Badge>
                    </div>
                    <h4 className="mb-1 font-sans text-sm font-semibold text-text">
                      {event.title}
                    </h4>
                    {event.description && (
                      <p className="text-caption text-text-muted line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    {event.relatedThinkers &&
                      event.relatedThinkers.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {event.relatedThinkers.map((thinker) => (
                            <Badge
                              key={thinker}
                              variant="outline"
                              className="text-xs"
                            >
                              {thinker}
                            </Badge>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
