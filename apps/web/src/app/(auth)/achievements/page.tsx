"use client"

import { useState } from "react"
import { Trophy } from "lucide-react"
import {
  Card,
  CardContent,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Progress,
} from "@archron/ui"

type AchievementCategory = "milestone" | "quality" | "domain" | "community"

interface Achievement {
  id: string
  category: AchievementCategory
  icon: string
  name: string
  description: string
  reputationBonus: number
  earnedDate: string | null
}

const CATEGORY_LABEL: Record<AchievementCategory, string> = {
  milestone: "Milestone",
  quality: "Quality",
  domain: "Domain",
  community: "Community",
}

const CATEGORY_ORDER: AchievementCategory[] = ["milestone", "quality", "domain", "community"]

const PLACEHOLDER_ACHIEVEMENTS: Achievement[] = [
  { id: "first-words", category: "milestone", icon: "1", name: "First Words", description: "First Article published", reputationBonus: 10, earnedDate: "2026-06-15T10:00:00Z" },
  { id: "knowledge-builder", category: "milestone", icon: "10", name: "Knowledge Builder", description: "10 Articles published", reputationBonus: 30, earnedDate: "2026-07-07T09:15:00Z" },
  { id: "concept-creator", category: "milestone", icon: "C", name: "Concept Creator", description: "10 Concepts created", reputationBonus: 25, earnedDate: null },
  { id: "library-builder", category: "milestone", icon: "B", name: "Library Builder", description: "10 Books catalogued", reputationBonus: 20, earnedDate: null },
  { id: "reference-master", category: "milestone", icon: "R", name: "Reference Master", description: "100 References added", reputationBonus: 40, earnedDate: null },
  { id: "reviewer", category: "milestone", icon: "V", name: "Reviewer", description: "25 Reviews completed", reputationBonus: 35, earnedDate: null },
  { id: "guide-maker", category: "milestone", icon: "G", name: "Guide Maker", description: "5 Guides published", reputationBonus: 50, earnedDate: null },
  { id: "cartographer", category: "milestone", icon: "C", name: "Cartographer", description: "20 Collections created", reputationBonus: 20, earnedDate: null },
  { id: "editors-choice", category: "quality", icon: "\u2605", name: "Editor's Choice", description: "Article selected as featured", reputationBonus: 50, earnedDate: null },
  { id: "first-attempt", category: "quality", icon: "\u2713", name: "First Attempt", description: "Draft accepted with zero changes on first review", reputationBonus: 30, earnedDate: "2026-06-20T14:30:00Z" },
  { id: "high-impact", category: "quality", icon: "\u2191", name: "High Impact", description: "Article cited by 5+ other Objects", reputationBonus: 40, earnedDate: null },
  { id: "clarity-award", category: "quality", icon: "\u25C7", name: "Clarity Award", description: "Reviewer consistently praises clarity (5+ reviews)", reputationBonus: 25, earnedDate: null },
  { id: "accuracy-seal", category: "quality", icon: "\u26ED", name: "Accuracy Seal", description: "50 consecutive accepted reviews", reputationBonus: 30, earnedDate: null },
  { id: "perfect-record", category: "quality", icon: "\u2606", name: "Perfect Record", description: "10 drafts accepted without changes", reputationBonus: 35, earnedDate: null },
  { id: "psychology-scholar", category: "domain", icon: "\u03C8", name: "Psychology Scholar", description: "10 published objects in Psychology domain", reputationBonus: 30, earnedDate: "2026-07-01T11:00:00Z" },
  { id: "philosophy-expert", category: "domain", icon: "\u03C6", name: "Philosophy Expert", description: "10 published objects in Philosophy domain", reputationBonus: 30, earnedDate: null },
  { id: "domain-master", category: "domain", icon: "\u25C9", name: "Domain Master", description: "Published in 5+ different domains", reputationBonus: 40, earnedDate: null },
  { id: "bridge-builder", category: "domain", icon: "\u2261", name: "Bridge Builder", description: "Connected 2+ domains through relationships", reputationBonus: 35, earnedDate: null },
  { id: "mentor", category: "community", icon: "\u221E", name: "Mentor", description: "Guided 3 new Writers through their first publication", reputationBonus: 40, earnedDate: null },
  { id: "translator", category: "community", icon: "\u00B6", name: "Translator", description: "Translated 10 Objects to another language", reputationBonus: 30, earnedDate: null },
  { id: "crowdsourcer", category: "community", icon: "\u2211", name: "Crowdsourcer", description: "Contributed 50+ References", reputationBonus: 25, earnedDate: null },
  { id: "verifier", category: "community", icon: "\u221A", name: "Verifier", description: "Validated 100 References", reputationBonus: 30, earnedDate: null },
  { id: "corrector", category: "community", icon: "\u2630", name: "Corrector", description: "20 accepted corrections on published content", reputationBonus: 25, earnedDate: null },
  { id: "networker", category: "community", icon: "\u25C6", name: "Networker", description: "Linked 500 Objects through relationships", reputationBonus: 30, earnedDate: null },
  { id: "pioneer", category: "community", icon: "\u2606", name: "Pioneer", description: "First to create an Object in a new Domain", reputationBonus: 50, earnedDate: null },
  { id: "constellation-builder", category: "community", icon: "\u2217", name: "Constellation Builder", description: "Created a Concept with 20+ direct relationships", reputationBonus: 40, earnedDate: null },
  { id: "completionist", category: "community", icon: "\u2261", name: "Completionist", description: "Completed all Guides in a domain", reputationBonus: 30, earnedDate: null },
  { id: "polyglot", category: "community", icon: "\u03C9", name: "Polyglot", description: "Contributed in 3+ languages", reputationBonus: 40, earnedDate: null },
]

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const earned = achievement.earnedDate !== null

  return (
    <Card
      className={`border-border transition-colors ${
        earned
          ? "hover:border-primary/30 bg-card"
          : "opacity-40 border-dashed"
      }`}
    >
      <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold ${
            earned
              ? "bg-primary/15 text-primary"
              : "bg-muted text-text-disabled"
          }`}
        >
          {achievement.icon}
        </div>
        <h3 className={`font-sans text-caption font-semibold ${earned ? "text-text" : "text-text-disabled"}`}>
          {achievement.name}
        </h3>
        <p className="text-meta text-text-muted leading-snug max-w-[160px]">
          {achievement.description}
        </p>
        <div className="flex items-center gap-1.5">
          {earned ? (
            <>
              <Badge variant="success" className="text-[10px]">Earned</Badge>
              <span className="text-meta text-text-disabled">
                {formatDate(achievement.earnedDate!)}
              </span>
            </>
          ) : (
            <Badge variant="secondary" className="text-[10px]">Locked</Badge>
          )}
        </div>
        <span className="text-meta font-medium text-primary">
          +{achievement.reputationBonus} rep
        </span>
      </CardContent>
    </Card>
  )
}

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<AchievementCategory>("milestone")

  const allAchievements = PLACEHOLDER_ACHIEVEMENTS
  const earnedCount = allAchievements.filter((a) => a.earnedDate !== null).length
  const totalCount = allAchievements.length

  const filtered = allAchievements.filter((a) => a.category === activeTab)

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-container-page px-6 pb-24 pt-24">
        <section>
          <h1 className="font-display text-display font-bold tracking-tight text-text">
            Achievements
          </h1>
          <p className="mt-2 text-body text-text-muted">
            Badges earned for quality contributions across the knowledge ecosystem
          </p>
        </section>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-section font-semibold text-text">
                  {earnedCount} / {totalCount}
                </h2>
                <span className="text-caption text-text-muted">Achievements Earned</span>
              </div>
              <Progress value={earnedCount} max={totalCount} className="mt-2" />
            </div>
          </div>
        </section>

        <section className="mt-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AchievementCategory)}>
            <TabsList>
              {CATEGORY_ORDER.map((cat) => {
                const catEarned = allAchievements.filter((a) => a.category === cat && a.earnedDate !== null).length
                const catTotal = allAchievements.filter((a) => a.category === cat).length
                return (
                  <TabsTrigger key={cat} value={cat}>
                    {CATEGORY_LABEL[cat]}
                    <Badge variant="secondary" className="ml-2 text-[10px]">
                      {catEarned}/{catTotal}
                    </Badge>
                  </TabsTrigger>
                )
              })}
            </TabsList>
            {CATEGORY_ORDER.map((cat) => (
              <TabsContent key={cat} value={cat}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((achievement) => (
                    <AchievementBadge key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </div>
    </div>
  )
}
