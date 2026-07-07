"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  Badge,
  Progress,
  Divider,
  PlusIcon,
  ArticleIcon,
  ConceptIcon,
} from "@archron/ui"

interface Activity {
  id: string
  text: string
  date: string
}

interface Draft {
  id: string
  title: string
  type: string
  progress: number
  lastEdited: string
}

const MOCK_STATS = {
  reputation: 485,
  publishedCount: 12,
  currentDrafts: 3,
  reviewsPending: 1,
}

const MOCK_ACTIVITY: Activity[] = [
  { id: "1", text: 'Your article "The Shadow in Cinema" was published', date: "2026-07-05" },
  { id: "2", text: "Review completed for Introduction to Analytical Psychology", date: "2026-07-03" },
  { id: "3", text: 'Your concept "Individuation" was cited in a new article', date: "2026-06-28" },
  { id: "4", text: 'Achievement earned: "First Article Published"', date: "2026-06-20" },
  { id: "5", text: 'Draft "Modern Applications" submitted for review', date: "2026-06-15" },
]

const MOCK_DRAFTS: Draft[] = [
  { id: "1", title: "Dream Analysis Methods", type: "Article", progress: 75, lastEdited: "2026-07-06" },
  { id: "2", title: "Marie-Louise von Franz", type: "Thinker", progress: 40, lastEdited: "2026-07-01" },
  { id: "3", title: "The Psychology of Fairy Tales", type: "Article", progress: 15, lastEdited: "2026-06-25" },
]

export default function StudioPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-container-page px-6 pb-24">
        <section className="pt-24">
          <div className="flex items-center gap-2.5">
            <PlusIcon className="h-5 w-5 text-primary" />
            <h1 className="font-display text-display font-bold tracking-tight text-text">
              Creator Studio
            </h1>
          </div>
          <p className="mt-2 text-body text-text-muted">
            Your creative dashboard — write, publish, and track your knowledge contributions
          </p>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 font-serif text-section font-semibold text-text">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link href="/studio/new-article">
              <Card className="group cursor-pointer transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated">
                <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <ArticleIcon size="lg" />
                  </div>
                  <div>
                    <p className="font-serif text-body font-semibold text-text">
                      New Article
                    </p>
                    <p className="text-caption text-text-muted">
                      Write an analytical or interpretive essay
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/studio/new-concept">
              <Card className="group cursor-pointer transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated">
                <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <ConceptIcon size="lg" />
                  </div>
                  <div>
                    <p className="font-serif text-body font-semibold text-text">
                      New Concept
                    </p>
                    <p className="text-caption text-text-muted">
                      Define a psychological or philosophical idea
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/studio/upload">
              <Card className="group cursor-pointer transition-colors duration-[var(--motion-normal)] hover:border-primary/30 hover:bg-elevated">
                <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <PlusIcon size="lg" />
                  </div>
                  <div>
                    <p className="font-serif text-body font-semibold text-text">
                      Upload Media
                    </p>
                    <p className="text-caption text-text-muted">
                      Add images, audio, or video assets
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 font-serif text-section font-semibold text-text">
            Stats
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="py-5">
                <div className="flex items-center justify-between">
                  <span className="text-caption text-text-muted">Reputation</span>
                  <Badge variant="success">{MOCK_STATS.reputation}</Badge>
                </div>
                <Progress value={MOCK_STATS.reputation} max={1000} className="mt-3" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center py-5">
                <span className="font-display text-card-title font-bold text-text">
                  {MOCK_STATS.publishedCount}
                </span>
                <span className="text-caption text-text-muted">Published</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center py-5">
                <span className="font-display text-card-title font-bold text-text">
                  {MOCK_STATS.currentDrafts}
                </span>
                <span className="text-caption text-text-muted">Drafts</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center py-5">
                <span className="font-display text-card-title font-bold text-text">
                  {MOCK_STATS.reviewsPending}
                </span>
                <span className="text-caption text-text-muted">Pending Review</span>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <h2 className="mb-4 font-serif text-section font-semibold text-text">
              Drafts in Progress
            </h2>
            <div className="space-y-3">
              {MOCK_DRAFTS.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-body text-text-muted">No drafts yet</p>
                  </CardContent>
                </Card>
              )}
              {MOCK_DRAFTS.map((draft) => (
                <Card key={draft.id} className="transition-colors duration-[var(--motion-normal)] hover:border-primary/30">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{draft.type}</Badge>
                          <p className="truncate font-serif text-body font-medium text-text">
                            {draft.title}
                          </p>
                        </div>
                        <p className="mt-0.5 text-caption text-text-disabled">
                          Last edited {draft.lastEdited}
                        </p>
                      </div>
                      <span className="shrink-0 text-caption text-text-muted">
                        {draft.progress}%
                      </span>
                    </div>
                    <Progress value={draft.progress} className="mt-3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-section font-semibold text-text">
              Recent Activity
            </h2>
            <Card>
              <CardContent className="py-4">
                {MOCK_ACTIVITY.length === 0 && (
                  <p className="py-4 text-center text-caption text-text-muted">No recent activity</p>
                )}
                <div className="space-y-3">
                  {MOCK_ACTIVITY.map((item, i) => (
                    <div key={item.id}>
                      <p className="text-caption text-text">{item.text}</p>
                      <p className="mt-0.5 text-meta text-text-disabled">{item.date}</p>
                      {i < MOCK_ACTIVITY.length - 1 && <Divider className="mt-3" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
