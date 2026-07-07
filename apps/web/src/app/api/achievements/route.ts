import { NextResponse } from "next/server"
import { getAuth } from "@archron/auth"

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

interface AchievementResponse {
  achievements: Achievement[]
  summary: {
    total: number
    earned: number
    byCategory: Record<AchievementCategory, { total: number; earned: number }>
  }
}

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

export async function GET() {
  const { userId } = await getAuth()
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const categories: AchievementCategory[] = ["milestone", "quality", "domain", "community"]

  const byCategory = Object.fromEntries(
    categories.map((cat) => {
      const items = PLACEHOLDER_ACHIEVEMENTS.filter((a) => a.category === cat)
      return [
        cat,
        {
          total: items.length,
          earned: items.filter((a) => a.earnedDate !== null).length,
        },
      ]
    })
  ) as AchievementResponse["summary"]["byCategory"]

  const earned = PLACEHOLDER_ACHIEVEMENTS.filter((a) => a.earnedDate !== null).length

  return NextResponse.json({
    achievements: PLACEHOLDER_ACHIEVEMENTS,
    summary: {
      total: PLACEHOLDER_ACHIEVEMENTS.length,
      earned,
      byCategory,
    },
  })
}
