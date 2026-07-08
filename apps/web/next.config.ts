import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react",
  },
})

const config: NextConfig = {
  turbopack: {
    root: "../..",
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: [
    "@archron/ui",
    "@archron/renderer",
    "@archron/editor",
    "@archron/graph",
    "@archron/database",
    "@archron/knowledge-engine",
    "@archron/search",
    "@archron/shared",
    "@archron/auth",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "").split(".")[0] ?? "localhost"}.supabase.co`,
      },
      {
        protocol: "https",
        hostname: "pub-*.r2.dev",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.clerk.accounts.dev https://*.supabase.co https://api.resend.com",
              "frame-src 'self' https://*.clerk.accounts.dev",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ]
  },
}

export default withMDX(config)
