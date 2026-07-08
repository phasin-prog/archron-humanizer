import type { Metadata } from "next"
import { ArchronClerkProvider } from "@archron/auth/client"
import "@/assets/globals.css"

export const metadata: Metadata = {
  title: "ARCHRON Studio",
  description: "Knowledge creation platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ArchronClerkProvider>{children}</ArchronClerkProvider>
      </body>
    </html>
  )
}
