export function formatDate(date: Date): string {
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatYearRange(birth?: string, death?: string): string {
  if (birth && death) return `${birth}–${death}`
  if (birth) return `${birth}–`
  return ""
}

export function isRecent(date: Date, days: number = 7): boolean {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return date.getTime() > cutoff
}
