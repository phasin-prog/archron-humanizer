import { ContinueWriting } from "@/components/studio/dashboard/continue-writing";
import { QuickActions } from "@/components/studio/dashboard/quick-actions";
import { RecentDrafts } from "@/components/studio/dashboard/recent-drafts";
import { PublishingQueue } from "@/components/studio/dashboard/publishing-queue";
import { ActivityFeed } from "@/components/studio/dashboard/activity-feed";
import { StatsBar } from "@/components/studio/dashboard/stats-bar";
export default function DashboardPage() {
    return (<div className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-page-title font-serif font-bold">Dashboard</h1>
      <ContinueWriting />
      <QuickActions />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RecentDrafts />
          <PublishingQueue />
        </div>
        <div className="space-y-6">
          <StatsBar />
          <ActivityFeed />
        </div>
      </div>
    </div>);
}
