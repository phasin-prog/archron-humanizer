import createMDX from "@next/mdx";
const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
        providerImportSource: "@mdx-js/react",
    },
});
const config = {
    pageExtensions: ["ts", "tsx", "md", "mdx"],
    transpilePackages: [
        "@archron/ui",
        "@archron/renderer",
        "@archron/editor",
        "@archron/graph",
    ],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.supabase.co",
            },
        ],
    },
};
export default withMDX(config);
