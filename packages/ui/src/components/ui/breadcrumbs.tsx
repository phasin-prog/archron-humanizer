import React from "react"
import { cn } from "../../lib/utils"

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  separator?: React.ReactNode
}

export function Breadcrumbs({
  className,
  children,
  ...props
}: BreadcrumbsProps): React.ReactElement {
  return (
    <nav
      className={cn("flex items-center", className)}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="flex items-center gap-1.5 text-sm">
        {children}
      </ol>
    </nav>
  )
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  href?: string
  isCurrent?: boolean
}

export function BreadcrumbItem({
  className,
  href,
  isCurrent,
  children,
  ...props
}: BreadcrumbItemProps): React.ReactElement {
  return (
    <li className={cn("flex items-center gap-1.5", className)} {...props}>
      {href && !isCurrent ? (
        <a
          href={href}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {children}
        </a>
      ) : (
        <span
          className={cn(
            "text-muted-foreground",
            isCurrent && "text-foreground font-medium"
          )}
        >
          {children}
        </span>
      )}
    </li>
  )
}

export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function BreadcrumbSeparator({
  className,
  children,
  ...props
}: BreadcrumbSeparatorProps): React.ReactElement {
  return (
    <li>
      <span
        className={cn("text-muted-foreground select-none", className)}
        aria-hidden="true"
        {...props}
      >
        {children ?? "/"}
      </span>
    </li>
  )
}
