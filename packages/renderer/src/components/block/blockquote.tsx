import type { ComponentProps } from "../../types"

export default function Blockquote({ children }: ComponentProps) {
  return (
    <blockquote className="border-l-4 border-primary/30 pl-4 py-1 my-4 text-muted-foreground italic">
      {children}
    </blockquote>
  )
}
