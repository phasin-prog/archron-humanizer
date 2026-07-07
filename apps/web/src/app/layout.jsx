import { ArchronClerkProvider } from "@archron/auth/client";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import "@/styles/globals.css";
export const metadata = {
    title: "ARCHRON — Understanding Humanity Through Knowledge",
    description: "A human knowledge platform that organizes, connects, and transforms multidisciplinary knowledge about human beings into an interconnected knowledge ecosystem.",
};
export default function RootLayout({ children }) {
    return (<html lang="th" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-background text-text font-sans antialiased">
        <ArchronClerkProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <BottomNav />
        </ArchronClerkProvider>
      </body>
    </html>);
}
