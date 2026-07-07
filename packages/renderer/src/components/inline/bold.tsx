import type { ComponentProps } from "../../types"

export default function Bold({ children }: ComponentProps) {
  return <strong className="font-semibold">{children}</strong>
}
