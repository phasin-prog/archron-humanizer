import type { ComponentProps } from "../../types"

export default function Text({ node }: ComponentProps) {
  return <span>{node.value}</span>
}
