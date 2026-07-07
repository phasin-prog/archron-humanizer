"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent, Button, Badge, NotificationIcon, CheckIcon, } from "@archron/ui";
import { FileText, Globe, Trophy, MessageCircle, AtSign, ArrowUp, ThumbsUp, } from "lucide-react";
const NOTIFICATION_ICON = {
    review_requested: FileText,
    content_published: Globe,
    achievement_earned: Trophy,
    comment_received: MessageCircle,
    mention: AtSign,
    level_up: ArrowUp,
    review_decision: ThumbsUp,
};
const NOTIFICATION_LABEL = {
    review_requested: "Review Requested",
    content_published: "Content Published",
    achievement_earned: "Achievement Earned",
    comment_received: "Comment Received",
    mention: "Mention",
    level_up: "Level Up",
    review_decision: "Review Decision",
};
const PLACEHOLDER_NOTIFICATIONS = [
    {
        id: "1",
        type: "review_requested",
        title: "New article awaits your review",
        body: "\"The Structure of the Unconscious\" by dr.somsak is ready for review. Your expertise in analytical psychology is needed.",
        timestamp: "2026-07-07T10:30:00Z",
        read: false,
    },
    {
        id: "2",
        type: "achievement_earned",
        title: "Knowledge Builder achieved",
        body: "You published your 10th article. +30 reputation points awarded.",
        timestamp: "2026-07-07T09:15:00Z",
        read: false,
    },
    {
        id: "3",
        type: "comment_received",
        title: "New comment on your article",
        body: "Dr. Anong commented on \"Archetypes and the Collective\": \"Excellent synthesis of Jung's later work on the anima.\"",
        timestamp: "2026-07-06T16:45:00Z",
        read: false,
    },
    {
        id: "4",
        type: "content_published",
        title: "Your concept is now published",
        body: "\"Individuation\" has passed review and is now live on the platform.",
        timestamp: "2026-07-06T14:20:00Z",
        read: true,
    },
    {
        id: "5",
        type: "mention",
        title: "You were mentioned in an article",
        body: "Krittika mentioned your work in \"Modern Applications of Jungian Theory\".",
        timestamp: "2026-07-06T11:10:00Z",
        read: true,
    },
    {
        id: "6",
        type: "level_up",
        title: "Level 5 reached",
        body: "Your reputation now exceeds 500 points. New privileges unlocked: Suggest featured content.",
        timestamp: "2026-07-05T08:50:00Z",
        read: true,
    },
    {
        id: "7",
        type: "review_decision",
        title: "Review decision: Approved",
        body: "Your article \"The Shadow in Thai Literature\" has been approved and published.",
        timestamp: "2026-07-05T08:00:00Z",
        read: true,
    },
    {
        id: "8",
        type: "content_published",
        title: "Your book reference is live",
        body: "\"Man and His Symbols\" by Carl Jung has been catalogued and published.",
        timestamp: "2026-07-04T15:30:00Z",
        read: true,
    },
];
function groupByDate(notifications) {
    const groups = new Map();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    for (const n of notifications) {
        const d = new Date(n.timestamp);
        let key;
        if (d.toDateString() === today.toDateString()) {
            key = "Today";
        }
        else if (d.toDateString() === yesterday.toDateString()) {
            key = "Yesterday";
        }
        else {
            key = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        }
        const existing = groups.get(key);
        if (existing) {
            existing.push(n);
        }
        else {
            groups.set(key, [n]);
        }
    }
    return groups;
}
function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}
export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(PLACEHOLDER_NOTIFICATIONS);
    const unreadCount = notifications.filter((n) => !n.read).length;
    const grouped = groupByDate(notifications);
    function markRead(id) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }
    function markAllRead() {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
    return (<div className="min-h-screen">
      <div className="mx-auto max-w-container-page px-6 pb-24 pt-24">
        <section className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-display font-bold tracking-tight text-text">
              Notifications
            </h1>
            {unreadCount > 0 && (<p className="mt-1 text-caption text-text-muted">
                {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
              </p>)}
          </div>
          {unreadCount > 0 && (<Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckIcon size="sm" className="mr-1.5"/>
              Mark all read
            </Button>)}
        </section>

        {notifications.length === 0 ? (<section className="mt-16 flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
            <NotificationIcon size="xl" className="text-text-disabled"/>
            <p className="mt-4 text-body text-text-muted">No notifications</p>
            <p className="mt-1 text-caption text-text-disabled">
              You are all caught up
            </p>
          </section>) : (<section className="mt-8 space-y-8">
            {Array.from(grouped.entries()).map(([dateLabel, items]) => (<div key={dateLabel}>
                <h2 className="mb-3 font-mono text-meta font-medium text-text-muted">
                  {dateLabel}
                </h2>
                <div className="space-y-2">
                  {items.map((notification) => {
                    const Icon = NOTIFICATION_ICON[notification.type];
                    return (<Card key={notification.id} className={`cursor-pointer border-border transition-colors hover:border-primary/20 ${!notification.read ? "border-l-2 border-l-primary bg-primary/5" : ""}`} onClick={() => markRead(notification.id)}>
                        <CardHeader className="flex flex-row items-start gap-3 pb-3">
                          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${!notification.read
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-text-muted"}`}>
                            <Icon className="h-4 w-4"/>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className={`font-sans text-caption font-semibold ${!notification.read ? "text-text" : "text-text-muted"}`}>
                                {notification.title}
                              </h3>
                              <div className="flex items-center gap-2 shrink-0">
                                {!notification.read && (<div className="h-2 w-2 rounded-full bg-primary"/>)}
                                <span className="whitespace-nowrap text-meta text-text-disabled">
                                  {formatTime(notification.timestamp)}
                                </span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="mt-1">
                              {NOTIFICATION_LABEL[notification.type]}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pl-[44px]">
                          <p className="text-caption text-text-muted leading-relaxed">
                            {notification.body}
                          </p>
                        </CardContent>
                      </Card>);
                })}
                </div>
              </div>))}
          </section>)}
      </div>
    </div>);
}
