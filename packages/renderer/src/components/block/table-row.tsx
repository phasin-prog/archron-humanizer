import type { ComponentProps } from "../../types"

export default function TableRow({ children }: ComponentProps) {
  return <tr className="border-b last:border-0">{children}</tr>
}
