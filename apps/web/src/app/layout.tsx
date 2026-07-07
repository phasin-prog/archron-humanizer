import type { Metadata } from "next"
import { ArchronClerkProvider } from "@archron/auth/client"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "ARCHRON — Understanding Humanity Through Knowledge",
  description: "A human knowledge platform that organizes, connects, and transforms multidisciplinary knowledge about human beings into an interconnected knowledge ecosystem.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-background text-text font-sans antialiased">
        <ArchronClerkProvider>
          {children}
        </ArchronClerkProvider>
      </body>
    </html>
  )
}
