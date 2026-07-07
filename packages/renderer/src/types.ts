import type { ReactNode } from "react"

export interface ASTNode {
  type: ASTNodeType
  children?: ASTNode[]
  value?: string
  depth?: number
  language?: string
  ordered?: boolean
  url?: string
  title?: string
  alt?: string
  data?: Record<string, unknown>
  position: { start: { line: number; offset: number }; end: { line: number; offset: number } }
}

export type ASTNodeType =
  | "root"
  | "heading"
  | "paragraph"
  | "text"
  | "bold"
  | "italic"
  | "strikethrough"
  | "code_inline"
  | "code_block"
  | "blockquote"
  | "list"
  | "list_item"
  | "link"
  | "image"
  | "horizontal_rule"
  | "table"
  | "table_row"
  | "table_cell"
  | "wiki_link"
  | "callout"
  | "footnote"
  | "embed"

export interface WikiLinkNode extends ASTNode {
  type: "wiki_link"
  target: string
  alias?: string
  resolvedSlug?: string
  resolvedTitle?: string
  resolvedType?: string
}

export interface PipelineContext {
  sourceMarkdown: string
  objectId?: string
  resolvedLinks: Map<string, ResolvedLink>
  errors: PipelineError[]
  metadata: PipelineMetadata
}

export interface ResolvedLink {
  slug: string
  title: string
  objectType: string
  status: string
}

export interface PipelineError {
  line: number
  column: number
  message: string
  severity: "warning" | "error"
}

export interface PipelineMetadata {
  wordCount: number
  readingTime: number
  headingCount: number
  linkCount: number
  wikiLinkCount: number
  imageCount: number
  calloutCount: number
}

export interface PipelineResult {
  ast: ASTNode
  html: string
  components: ComponentMap
  context: PipelineContext
  errors: PipelineError[]
}

export type ComponentMap = Record<string, React.ComponentType<ComponentProps>>

export interface ComponentProps {
  node: ASTNode
  children?: ReactNode
  context?: PipelineContext
  [key: string]: unknown
}

export type WikiLinkResolver = (target: string) => Promise<ResolvedLink | null>
