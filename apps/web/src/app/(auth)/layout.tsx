import { requireRole } from "@archron/auth"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("member")
  return <>{children}</>
}
