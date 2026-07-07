import type { ComponentProps } from "../../types"

export default function Image({ node }: ComponentProps) {
  return (
    <figure className="my-6">
      <img src={node.url} alt={node.alt ?? ""} className="rounded-lg w-full" />
      {node.title && (
        <figcaption className="text-caption text-muted-foreground mt-2 text-center">
          {node.title}
        </figcaption>
      )}
    </figure>
  )
}
