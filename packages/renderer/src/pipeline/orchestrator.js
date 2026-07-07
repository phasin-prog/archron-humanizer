import React from "react";
import { parseMarkdown } from "../parser";
import { createComponentRegistry } from "../registry";
import { createPluginRegistry } from "../plugins";
export class RenderPipeline {
    components;
    plugins;
    resolver;
    constructor(options = {}) {
        this.resolver = options.resolver;
        this.components = options.components ?? createComponentRegistry();
        this.plugins = new Map();
        if (options.plugins) {
            for (const plugin of options.plugins) {
                this.plugins.set(plugin.name, plugin.handler);
            }
        }
    }
    registerComponent(type, component) {
        this.components[type] = component;
    }
    registerPlugin(name, handler) {
        this.plugins.set(name, handler);
    }
    removePlugin(name) {
        this.plugins.delete(name);
    }
    setResolver(resolver) {
        this.resolver = resolver;
    }
    async render(markdown) {
        let processedMarkdown = markdown;
        for (const plugin of this.plugins.values()) {
            if (plugin.beforeParse) {
                processedMarkdown = await plugin.beforeParse(processedMarkdown);
            }
        }
        let result = await parseMarkdown(processedMarkdown, { resolver: this.resolver });
        for (const plugin of this.plugins.values()) {
            if (plugin.afterParse) {
                result = await plugin.afterParse(result);
            }
        }
        result.components = this.components;
        return result;
    }
    renderToReact(ast, context) {
        return this.renderNodeToReact(ast, context);
    }
    renderNodeToReact(node, context) {
        const type = node.type;
        for (const plugin of this.plugins.values()) {
            if (plugin.renderOverride) {
                const override = plugin.renderOverride(node, { node, context });
                if (override !== null)
                    return override;
            }
        }
        const Component = this.components[type];
        if (Component) {
            const props = { node, context };
            if (node.children) {
                props.children = node.children.map((child, i) => React.createElement(React.Fragment, { key: i }, this.renderNodeToReact(child, context)));
            }
            return React.createElement(Component, props);
        }
        return node.children
            ? node.children.map((child, i) => React.createElement(React.Fragment, { key: i }, this.renderNodeToReact(child, context)))
            : null;
    }
    async renderMarkdown(markdown) {
        const result = await this.render(markdown);
        const reactNode = this.renderToReact(result.ast, result.context);
        return { ast: result.ast, html: result.html, reactNode, context: result.context };
    }
}
