import { cn } from "../lib/utils"

export interface IconBoxProps {
  icon: React.ReactNode
  size?: "sm" | "md" | "lg"
  variant?: "default" | "knowledge" | "featured" | "success"
  className?: string
  onClick?: () => void
}

export function IconBox({
  icon,
  size = "md",
  variant = "default",
  className,
  onClick,
}: IconBoxProps) {
  return (
    <div
      className={cn(
        // Base styles
        "flex items-center justify-center rounded-[var(--radius-md)] border border-border bg-card transition-all duration-[var(--motion-normal)] cursor-pointer",
        // Size variants
        size === "sm" && "h-12 w-12",
        size === "md" && "h-16 w-16",
        size === "lg" && "h-20 w-20",
        // Semantic variants
        variant === "knowledge" && "border-secondary hover:border-secondary-hover hover:bg-[var(--color-secondary-soft)]",
        variant === "featured" && "border-accent hover:border-accent-hover hover:bg-[var(--color-accent-soft)]",
        variant === "success" && "border-knowledge hover:border-knowledge hover:bg-[var(--color-knowledge-soft)]",
        // Default hover
        variant === "default" && "hover:border-primary hover:bg-elevated hover:shadow-[0_4px_12px_rgba(95,141,206,0.08)]",
        // Active state
        "active:scale-[0.98]",
        className,
      )}
      onClick={onClick}
    >
      <div className="text-text transition-colors duration-[var(--motion-fast)] [.archron-icon-box:hover_&]:text-primary">
        {icon}
      </div>
    </div>
  )
}
