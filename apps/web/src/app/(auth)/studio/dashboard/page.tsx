import { ContinueWriting } from "@/components/studio/dashboard/continue-writing"
import { QuickActions } from "@/components/studio/dashboard/quick-actions"
import { RecentDrafts } from "@/components/studio/dashboard/recent-drafts"
import { PublishingQueue } from "@/components/studio/dashboard/publishing-queue"
import { ActivityFeed } from "@/components/studio/dashboard/activity-feed"
import { StatsBar } from "@/components/studio/dashboard/stats-bar"
import { StudioBreadcrumbs } from "@/components/studio/breadcrumbs"

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <StudioBreadcrumbs />
      <h1 className="text-page-title font-serif font-bold">Dashboard</h1>
      <section aria-labelledby="continue-writing-heading">
        <h2 id="continue-writing-heading" className="sr-only">Continue Writing</h2>
        <ContinueWriting />
      </section>
      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="sr-only">Quick Actions</h2>
        <QuickActions />
      </section>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RecentDrafts />
          <PublishingQueue />
        </div>
        <aside className="space-y-6">
          <StatsBar />
          <ActivityFeed />
        </aside>
      </div>
    </div>
  )
}
