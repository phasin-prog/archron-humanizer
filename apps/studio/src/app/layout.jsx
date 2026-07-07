import { ArchronClerkProvider } from "@archron/auth/client";
import "../../../apps/web/src/styles/globals.css";
export const metadata = {
    title: "ARCHRON Studio",
    description: "Knowledge creation platform",
};
export default function RootLayout({ children }) {
    return (<html lang="th" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ArchronClerkProvider>{children}</ArchronClerkProvider>
      </body>
    </html>);
}
