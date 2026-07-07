# Plugin System

The Renderer supports plugins for extensibility. Plugins hook into the pipeline at specific stages.

## Plugin Hook Points

```
Tokenizer → AST → Knowledge Resolver → Component Resolver → Layout Resolver → React
    │           │            │                   │                  │            │
    └───plugins──┴────plugins┴────plugins───────┴────plugins────────┴────plugins─┘
```

## Plugin Interface

```typescript
interface RendererPlugin {
  name: string
  version: string
  
  // Hook into pipeline stages
  onTokenize?: (tokens: Token[]) => Token[]
  onBuildAST?: (ast: ASTNode) => ASTNode
  onResolveKnowledge?: (node: ASTNode, engine: KnowledgeEngine) => ASTNode
  onResolveComponent?: (node: ASTNode, registry: ComponentRegistry) => ComponentType
  onResolveLayout?: (object: KnowledgeObject, layouts: LayoutRegistry) => LayoutComponent
  onRender?: (element: ReactElement) => ReactElement
  
  // Register custom wikilink types
  registerWikilinks?: WikilinkDefinition[]
  
  // Register custom components
  registerComponents?: ComponentRegistration[]
  
  // Register custom layouts
  registerLayouts?: LayoutRegistration[]
}
```

## Planned Plugins

| Plugin | Stage | Description |
|--------|-------|-------------|
| Mermaid | Tokenizer → AST | Convert ` ```mermaid ` blocks to Mermaid diagram AST |
| Math / LaTeX | Tokenizer → AST | Convert `$...$` and `$$...$$` to Math AST nodes |
| Footnote | AST | Collect and render footnotes |
| Audio | Component | Audio player component for `[[audio:slug]]` |
| Video | Component | Video embed component for `[[video:slug]]` |
| PDF | Component | PDF viewer for `[[pdf:slug]]` |
| Quiz | Component | Interactive quiz component |
| Flashcards | Component | Flashcard study component |
| Table of Contents | Layout | Auto-generate TOC for long articles |
| Syntax Highlight | Component | Code block syntax highlighting |

## Plugin Rules

- Plugins are registered at build time, not runtime
- Plugins cannot modify the Knowledge Engine or Database
- A failed plugin must not break the render — graceful fallback required
- Plugin order is deterministic — specified in the plugin array
- Custom plugins can be written per-project but are not loaded from user input
