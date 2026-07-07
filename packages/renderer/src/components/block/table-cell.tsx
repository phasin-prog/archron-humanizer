import type { ComponentProps } from "../../types"

export default function TableCell({ children }: ComponentProps) {
  return <td className="px-4 py-2 border-r last:border-0">{children}</td>
}
