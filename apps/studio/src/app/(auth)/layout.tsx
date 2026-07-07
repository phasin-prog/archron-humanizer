import { requireRole } from "@archron/auth"
import { Sidebar } from "@/components/studio/sidebar"
import { Header } from "@/components/studio/header"

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireRole("writer")

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={auth.user} />
        <main className="flex-1 overflow-y-auto bg-muted/5">{children}</main>
      </div>
    </div>
  )
}
