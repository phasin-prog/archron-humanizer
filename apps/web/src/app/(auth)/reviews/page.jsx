"use client";
import { useState } from "react";
import { Card, CardContent, Badge, Button, } from "@archron/ui";
const MOCK_PENDING_REVIEWS = [
    { id: "1", title: "The Shadow in Contemporary Cinema", author: "Elena Voss", dateSubmitted: "2026-07-05", status: "pending", type: "Articles" },
    { id: "2", title: "Nietzsche and the Übermensch", author: "Marcus Chen", dateSubmitted: "2026-07-04", status: "pending", type: "Articles" },
    { id: "3", title: "Jungian Approaches to Trauma", author: "Sofia Reyes", dateSubmitted: "2026-07-02", status: "pending", type: "Articles" },
    { id: "4", title: "Archetypal Patterns in Myth", author: "Takeshi Yamamoto", dateSubmitted: "2026-06-30", status: "pending", type: "Concepts" },
];
const MOCK_COMPLETED_REVIEWS = [
    { id: "5", title: "Introduction to Analytical Psychology", author: "James Walker", dateSubmitted: "2026-06-20", status: "approved", dateCompleted: "2026-06-23", type: "Articles" },
    { id: "6", title: "The Ego and the Self", author: "Amina Diallo", dateSubmitted: "2026-06-15", status: "approved", dateCompleted: "2026-06-18", type: "Concepts" },
    { id: "7", title: "Freud and Beyond", author: "Liam O'Brien", dateSubmitted: "2026-06-10", status: "rejected", dateCompleted: "2026-06-14", type: "Books" },
    { id: "8", title: "Symbols of Transformation", author: "Nina Petrov", dateSubmitted: "2026-06-05", status: "approved", dateCompleted: "2026-06-08", type: "Articles" },
    { id: "9", title: "Dream Interpretation Methods", author: "Raj Kapoor", dateSubmitted: "2026-05-28", status: "revision", dateCompleted: "2026-06-01", type: "Articles" },
    { id: "10", title: "Collective Memory and Culture", author: "Yuki Tanaka", dateSubmitted: "2026-05-20", status: "approved", dateCompleted: "2026-05-24", type: "Articles" },
];
function statusVariant(status) {
    switch (status) {
        case "approved": return "success";
        case "pending": return "warning";
        case "revision": return "default";
        case "rejected": return "destructive";
    }
}
export default function ReviewsPage() {
    const [pendingExpanded, setPendingExpanded] = useState(true);
    const [completedExpanded, setCompletedExpanded] = useState(true);
    const totalReviews = MOCK_COMPLETED_REVIEWS.length;
    const approvedCount = MOCK_COMPLETED_REVIEWS.filter((r) => r.status === "approved").length;
    const acceptanceRate = totalReviews > 0 ? Math.round((approvedCount / totalReviews) * 100) : 0;
    const avgReviewDays = MOCK_COMPLETED_REVIEWS
        .filter((r) => r.dateCompleted)
        .reduce((sum, r) => {
        const days = (new Date(r.dateCompleted).getTime() - new Date(r.dateSubmitted).getTime()) / (1000 * 60 * 60 * 24);
        return sum + days;
    }, 0) / (totalReviews || 1);
    return (<div className="min-h-screen">
      <div className="mx-auto max-w-container-page px-6 pb-24">
        <section className="pt-24">
          <h1 className="font-display text-display font-bold tracking-tight text-text">
            Reviews
          </h1>
          <p className="mt-2 text-body text-text-muted">
            Review dashboard — manage your content review workflow
          </p>
        </section>

        <section className="mt-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center py-5">
                <span className="font-display text-display font-bold text-text">{totalReviews}</span>
                <span className="text-caption text-text-muted">Total Reviews</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center py-5">
                <span className="font-display text-display font-bold text-text">{acceptanceRate}%</span>
                <span className="text-caption text-text-muted">Acceptance Rate</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center py-5">
                <span className="font-display text-display font-bold text-text">
                  {avgReviewDays > 0 ? Math.round(avgReviewDays * 10) / 10 : "-"}
                </span>
                <span className="text-caption text-text-muted">Avg Review Time (days)</span>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-12">
          <button type="button" onClick={() => setPendingExpanded(!pendingExpanded)} className="mb-4 flex w-full items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <h2 className="font-serif text-section font-semibold text-text">
                Pending Reviews
              </h2>
              <Badge variant="warning">{MOCK_PENDING_REVIEWS.length}</Badge>
            </div>
            <span className="text-caption text-text-muted">
              {pendingExpanded ? "Collapse" : "Expand"}
            </span>
          </button>

          {pendingExpanded && (<div className="space-y-2">
              {MOCK_PENDING_REVIEWS.length === 0 && (<Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-body text-text-muted">No pending reviews</p>
                  </CardContent>
                </Card>)}
              {MOCK_PENDING_REVIEWS.map((review) => (<Card key={review.id} className="transition-colors duration-[var(--motion-normal)] hover:border-primary/30">
                  <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="shrink-0">{review.type}</Badge>
                        <p className="truncate font-serif text-body font-medium text-text">
                          {review.title}
                        </p>
                      </div>
                      <p className="mt-1 text-caption text-text-muted">
                        by {review.author} — submitted {review.dateSubmitted}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2 self-end sm:self-center">
                      <Button size="sm" variant="secondary">View</Button>
                      <Button size="sm" variant="default">Review</Button>
                    </div>
                  </CardContent>
                </Card>))}
            </div>)}
        </section>

        <section className="mt-10">
          <button type="button" onClick={() => setCompletedExpanded(!completedExpanded)} className="mb-4 flex w-full items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <h2 className="font-serif text-section font-semibold text-text">
                Completed Reviews
              </h2>
              <Badge variant="secondary">{MOCK_COMPLETED_REVIEWS.length}</Badge>
            </div>
            <span className="text-caption text-text-muted">
              {completedExpanded ? "Collapse" : "Expand"}
            </span>
          </button>

          {completedExpanded && (<div className="space-y-2">
              {MOCK_COMPLETED_REVIEWS.map((review) => (<Card key={review.id} className="transition-colors duration-[var(--motion-normal)] hover:border-primary/30">
                  <CardContent className="flex items-center justify-between py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-serif text-body font-medium text-text">
                          {review.title}
                        </p>
                        <Badge variant={statusVariant(review.status)} className="shrink-0 capitalize">
                          {review.status}
                        </Badge>
                      </div>
                      <p className="text-caption text-text-disabled">
                        {review.author} — completed {review.dateCompleted}
                      </p>
                    </div>
                  </CardContent>
                </Card>))}
            </div>)}
        </section>
      </div>
    </div>);
}
