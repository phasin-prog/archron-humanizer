import { mergeConfig } from "vitest/config"
import { baseJsdom } from "@archron/vitest/base-jsdom"

export default mergeConfig(baseJsdom, {})
