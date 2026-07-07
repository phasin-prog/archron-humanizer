interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <h1
        className={`font-display ${sizeClasses[size]} font-bold tracking-tight text-text`}
      >
        ARCHRON
      </h1>
      <p className="mt-1 font-serif text-body font-light tracking-wide text-text-muted">
        Understanding Humanity Through Knowledge
      </p>
    </div>
  )
}
