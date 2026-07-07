import type { ComponentProps } from "../../types"

export default function Strikethrough({ children }: ComponentProps) {
  return <del className="line-through decoration-2">{children}</del>
}
