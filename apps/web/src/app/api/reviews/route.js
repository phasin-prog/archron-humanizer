import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@archron/auth";
const PLACEHOLDER_PENDING = [
    { id: "rev-001", title: "The Persona in Daily Life", slug: "persona-daily-life", objectType: "article", authorName: "Elena R.", submittedAt: "2026-07-05T00:00:00Z" },
    { id: "rev-002", title: "Freud and Jung: A Reconsideration", slug: "freud-jung-reconsideration", objectType: "article", authorName: "David T.", submittedAt: "2026-07-03T00:00:00Z" },
    { id: "rev-003", title: "Collective Unconscious in Eastern Thought", slug: "collective-unconscious-eastern", objectType: "article", authorName: "Clara W.", submittedAt: "2026-06-28T00:00:00Z" },
    { id: "rev-004", title: "The Self as Archetype", slug: "self-as-archetype", objectType: "concept", authorName: "Maria K.", submittedAt: "2026-06-25T00:00:00Z" },
];
const PLACEHOLDER_COMPLETED = [
    { id: "rev-010", title: "Anima and Animus in Practice", slug: "anima-animus-practice", objectType: "article", authorName: "Elena R.", decision: "approved", completedAt: "2026-07-04T00:00:00Z" },
    { id: "rev-009", title: "The Archetype of the Mother", slug: "archetype-mother", objectType: "concept", authorName: "David T.", decision: "approved", completedAt: "2026-07-02T00:00:00Z" },
    { id: "rev-008", title: "Synchronicity Explained", slug: "synchronicity-explained", objectType: "article", authorName: "Clara W.", decision: "revision", completedAt: "2026-06-30T00:00:00Z" },
    { id: "rev-007", title: "Alchemy and Psychology", slug: "alchemy-psychology", objectType: "article", authorName: "Maria K.", decision: "approved", completedAt: "2026-06-28T00:00:00Z" },
    { id: "rev-006", title: "The Wizard Archetype", slug: "wizard-archetype", objectType: "symbol", authorName: "Elena R.", decision: "approved", completedAt: "2026-06-25T00:00:00Z" },
    { id: "rev-005", title: "Jung's Typology", slug: "jungs-typology", objectType: "theory", authorName: "David T.", decision: "approved", completedAt: "2026-06-20T00:00:00Z" },
];
const REVIEW_STATS = {
    totalReviews: 30,
    acceptanceRate: 83,
    averageReviewTime: 2.4,
    thisMonth: 5,
    pendingCount: 4,
};
export async function GET(request) {
    const { userId } = await getAuth();
    if (!userId) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
    const offset = Number(searchParams.get("offset")) || 0;
    if (status === "pending") {
        const items = PLACEHOLDER_PENDING.slice(offset, offset + limit);
        return NextResponse.json({ pending: items, total: PLACEHOLDER_PENDING.length, limit, offset });
    }
    if (status === "completed") {
        const items = PLACEHOLDER_COMPLETED.slice(offset, offset + limit);
        return NextResponse.json({ completed: items, total: PLACEHOLDER_COMPLETED.length, limit, offset });
    }
    return NextResponse.json({
        pending: PLACEHOLDER_PENDING.slice(0, limit),
        completed: PLACEHOLDER_COMPLETED.slice(0, limit),
        stats: REVIEW_STATS,
        limit,
    });
}
