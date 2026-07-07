export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0
}

export function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function isWithinRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
