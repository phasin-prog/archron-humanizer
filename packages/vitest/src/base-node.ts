import { defineConfig } from "vitest/config"

export const baseNode = defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/index.ts", "src/**/*.d.ts"],
      reporter: ["text", "html", "lcov"],
    },
  },
})
