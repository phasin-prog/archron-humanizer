import type { PipelinePlugin } from "../pipeline"

export interface PluginRegistry {
  plugins: Map<string, PipelinePlugin>
  register: (name: string, plugin: PipelinePlugin) => void
  get: (name: string) => PipelinePlugin | undefined
  list: () => string[]
  remove: (name: string) => void
}

export function createPluginRegistry(initialPlugins: Record<string, PipelinePlugin> = {}): PluginRegistry {
  const plugins = new Map(Object.entries(initialPlugins))

  return {
    plugins,
    register(name: string, plugin: PipelinePlugin): void {
      plugins.set(name, plugin)
    },
    get(name: string): PipelinePlugin | undefined {
      return plugins.get(name)
    },
    list(): string[] {
      return Array.from(plugins.keys())
    },
    remove(name: string): void {
      plugins.delete(name)
    },
  }
}
