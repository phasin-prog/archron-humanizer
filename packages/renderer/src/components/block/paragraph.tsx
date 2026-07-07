import type { ComponentProps } from "../../types"

export default function Paragraph({ children }: ComponentProps) {
  return <p className="text-body leading-relaxed mb-4 last:mb-0">{children}</p>
}
