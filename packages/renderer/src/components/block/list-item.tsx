import type { ComponentProps } from "../../types"

export default function ListItem({ children }: ComponentProps) {
  return <li className="text-body">{children}</li>
}
