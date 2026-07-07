// ============================================
// SHARED UTILITIES
// ============================================

import type { ObjectType, UserRole } from "./types"
import { OBJECT_TYPE_LABELS, USER_ROLE_PERMISSIONS, READING_WORDS_PER_MINUTE } from "./constants"

/**
 * Generate a URL-safe slug from a title
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Format a date as a human-readable string
 */
export function formatDate(date: Date | string, _locale: string = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

/**
 * Format a relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string, _locale: string = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? "s" : ""} ago`
  if (diffMonth > 0) return `${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`
  if (diffWeek > 0) return `${diffWeek} week${diffWeek > 1 ? "s" : ""} ago`
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`
  return "Just now"
}

/**
 * Estimate reading time in minutes from word count
 */
export function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / READING_WORDS_PER_MINUTE))
}

/**
 * Count words in markdown text
 */
export function countWords(markdown: string): number {
  return markdown
    .replace(/[#*`>[\]()~\-_|!]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number, ellipsis: string = "..."): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - ellipsis.length) + ellipsis
}

/**
 * Get label for object type
 */
export function getObjectTypeLabel(type: ObjectType): string {
  return OBJECT_TYPE_LABELS[type] || type
}

/**
 * Check if user has permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = USER_ROLE_PERMISSIONS[role]
  return permissions.includes(permission as any)
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastCall >= ms) {
      lastCall = now
      fn.apply(this, args)
    }
  }
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target
  const source = sources.shift()
  if (!source) return target

  for (const key in source) {
    const targetValue = target[key]
    const sourceValue = source[key]

    if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
      if (!targetValue || typeof targetValue !== "object") {
        target[key] = {} as any
      }
      deepMerge(target[key], sourceValue)
    } else {
      target[key] = sourceValue as any
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * Generate a random ID
 */
export function generateId(prefix: string = ""): string {
  const random = Math.random().toString(36).substring(2, 15)
  const timestamp = Date.now().toString(36)
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const re = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return re.test(slug)
}

/**
 * Extract excerpt from markdown content
 */
export function extractExcerpt(markdown: string, maxLength: number = 160): string {
  const plain = markdown
    .replace(/^#+\s+/gm, "")
    .replace(/[*_~`[\]()]/g, "")
    .replace(/\n+/g, " ")
    .trim()
  return truncate(plain, maxLength)
}
