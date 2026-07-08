import type { ReactNode } from "react"
import React from "react"
import type { ASTNode, PipelineContext, PipelineResult, ComponentMap, ComponentProps, WikiLinkResolver } from "../types"
import { parseMarkdown } from "../parser"
import { createComponentRegistry } from "../registry"

export interface PipelineOptions {
  resolver?: WikiLinkResolver
  components?: ComponentMap
  plugins?: { name: string; handler: PipelinePlugin }[]
}

export interface PipelinePlugin {
  beforeParse?: (markdown: string) => string | Promise<string>
  afterParse?: (result: PipelineResult) => PipelineResult | Promise<PipelineResult>
  transformAST?: (node: ASTNode, context: PipelineContext) => ASTNode | Promise<ASTNode>
  renderOverride?: (node: ASTNode, props: ComponentProps) => ReactNode | null
}

export class RenderPipeline {
  private components: ComponentMap
  private plugins: Map<string, PipelinePlugin>
  private resolver?: WikiLinkResolver

  constructor(options: PipelineOptions = {}) {
    this.resolver = options.resolver
    this.components = options.components ?? createComponentRegistry()
    this.plugins = new Map()

    if (options.plugins) {
      for (const plugin of options.plugins) {
        this.plugins.set(plugin.name, plugin.handler)
      }
    }
  }

  registerComponent(type: string, component: React.ComponentType<ComponentProps>): void {
    this.components[type] = component
  }

  registerPlugin(name: string, handler: PipelinePlugin): void {
    this.plugins.set(name, handler)
  }

  removePlugin(name: string): void {
    this.plugins.delete(name)
  }

  setResolver(resolver: WikiLinkResolver): void {
    this.resolver = resolver
  }

  async render(markdown: string): Promise<PipelineResult> {
    let processedMarkdown = markdown

    for (const plugin of this.plugins.values()) {
      if (plugin.beforeParse) {
        processedMarkdown = await plugin.beforeParse(processedMarkdown)
      }
    }

    let result = await parseMarkdown(processedMarkdown, { resolver: this.resolver })

    for (const plugin of this.plugins.values()) {
      if (plugin.afterParse) {
        result = await plugin.afterParse(result)
      }
    }

    result.components = this.components

    return result
  }

  renderToReact(ast: ASTNode, context: PipelineContext): ReactNode {
    return this.renderNodeToReact(ast, context)
  }

  private renderNodeToReact(node: ASTNode, context: PipelineContext): ReactNode {
    const type = node.type

    for (const plugin of this.plugins.values()) {
      if (plugin.renderOverride) {
        const override = plugin.renderOverride(node, { node, context })
        if (override !== null) return override
      }
    }

    const Component = this.components[type]

    if (Component) {
      const props: ComponentProps = { node, context }
      if (node.children) {
        props.children = node.children.map((child, i) =>
          React.createElement(
            React.Fragment,
            { key: i },
            this.renderNodeToReact(child, context)
          )
        )
      }
      return React.createElement(Component, props)
    }

    return node.children
      ? node.children.map((child, i) =>
          React.createElement(
            React.Fragment,
            { key: i },
            this.renderNodeToReact(child, context)
          )
        )
      : null
  }

  async renderMarkdown(markdown: string): Promise<{ ast: ASTNode; html: string; reactNode: ReactNode; context: PipelineContext }> {
    const result = await this.render(markdown)
    const reactNode = this.renderToReact(result.ast, result.context)
    return { ast: result.ast, html: result.html, reactNode, context: result.context }
  }
}
