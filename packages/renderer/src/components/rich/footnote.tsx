import type { ComponentProps } from "../../types"

export default function Footnote({ node }: ComponentProps) {
  const index = node.data?.index as number | undefined
  return (
    <sup>
      <a
        href={`#fn-${index}`}
        id={`fnref-${index}`}
        className="text-xs text-primary no-underline hover:underline"
      >
        [{index ?? "?"}]
      </a>
    </sup>
  )
}
