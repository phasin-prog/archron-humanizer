import React from "react"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/50 ${className ?? ""}`}
      {...props}
    />
  )
}

export function DraftCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <div className="flex items-center gap-2 mt-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow">
      <Skeleton className="h-6 w-16 mb-1" />
      <Skeleton className="h-4 w-24 mb-1" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}
