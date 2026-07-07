import type { ComponentProps } from "../../types"

export default function Embed({ node }: ComponentProps) {
  return (
    <div className="rounded-lg border bg-surface p-4 my-4 text-center text-muted-foreground text-caption">
      [Embed: {String(node.data?.url ?? "unknown")}]
    </div>
  )
}
