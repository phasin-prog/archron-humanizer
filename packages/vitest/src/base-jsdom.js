import { defineConfig } from "vitest/config";
export const baseJsdom = defineConfig({
    esbuild: {
        jsx: "automatic",
        jsxImportSource: "react",
    },
    test: {
        globals: true,
        environment: "jsdom",
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        setupFiles: ["@archron/vitest/setup-jsdom"],
        coverage: {
            provider: "v8",
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/**/*.test.{ts,tsx}", "src/**/index.ts", "src/**/*.d.ts"],
            reporter: ["text", "html", "lcov"],
        },
    },
});
