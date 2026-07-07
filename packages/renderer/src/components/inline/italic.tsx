import type { ComponentProps } from "../../types"

export default function Italic({ children }: ComponentProps) {
  return <em className="italic">{children}</em>
}
