import type { Metadata } from "next"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "ARCHRON",
  description: "A human knowledge platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <main id="main-content" className="mx-auto max-w-container-page px-4">
          {children}
        </main>
      </body>
    </html>
  )
}
