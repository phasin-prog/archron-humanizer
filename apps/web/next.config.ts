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
        hostname: "*.supabase.co",
      },
    ],
  },
}

export default withMDX(config)
