export const colors = {
  /* Foundation */
  background: "#141821",
  surface: "#1A1F29",
  card: "#202633",
  elevated: "#262D3A",
  border: "#2D3645",
  borderSoft: "#242B36",

  /* Typography */
  text: "#ECEFF4",
  textSecondary: "#C7CDD7",
  textMuted: "#9098A5",
  textDisabled: "#636B78",

  /* Brand */
  accent: "#C49B55",
  accentHover: "#D6AE69",
  accentSoft: "#4F3C20",

  /* Status */
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#38BDF8",

  /* Overlay */
  overlay: "rgba(10, 12, 18, 0.72)",
  shadow: "rgba(0, 0, 0, 0.45)",
} as const

export const domains = {
  psychology: "#34D3F5",
  philosophy: "#A78BFA",
  anthropology: "#FB923C",
  history: "#D97706",
  language: "#10B981",
  mythology: "#DC2626",
  religion: "#8B5CF6",
  science: "#06B6D4",
  symbolism: "#4F46E5",
  art: "#EC4899",
  ai: "#6366F1",
  civilization: "#64748B",
} as const

export const objects = {
  concept: "#38BDF8",
  thinker: "#A78BFA",
  article: "#CBD5E1",
  book: "#FB923C",
  quote: "#94A3B8",
  timeline: "#EAB308",
  guide: "#10B981",
  symbol: "#6366F1",
  collection: "#F472B6",
} as const

export const hero = {
  gradientTop: "#171C25",
  gradientBottom: "#11151D",
  grid: "rgba(255, 255, 255, 0.035)",
  constellation: "rgba(255, 255, 255, 0.08)",
  node: "rgba(255, 255, 255, 0.12)",
  glow: "rgba(196, 155, 85, 0.10)",
} as const

export const motion = {
  fast: 120,
  normal: 220,
  slow: 420,
  ambient: 14000,
} as const

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const

export const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const

export const shadowDepth = [2, 4, 8, 12, 16, 24, 48, 72] as const

export const typography = {
  display: "48px",
  heading: "32px",
  title: "18px",
  body: "16px",
  small: "14px",
  caption: "12px",
} as const

export const fontFamilies = {
  display: `"Playfair Display", "Lora", "Georgia", serif`,
  heading: `"Inter", "system-ui", sans-serif`,
  body: `"Lora", "Source Serif 4", "Georgia", serif`,
  mono: `"JetBrains Mono", "Fira Code", monospace`,
} as const

export type DomainColor = keyof typeof domains
export type ObjectColor = keyof typeof objects
