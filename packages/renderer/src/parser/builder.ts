import type { ASTNode, PipelineContext, PipelineResult, ComponentMap, WikiLinkNode } from "../types"
import { extractWikiLinks, resolveWikiLinks, replaceWikiLinks } from "./wikilink"
import type { WikiLinkResolver } from "../types"

interface Token {
  type: string
  raw: string
  text?: string
  depth?: number
  tokens?: Token[]
  items?: Token[]
  ordered?: boolean
  lang?: string
  href?: string
  title?: string
  [key: string]: unknown
}

function parseTokens(tokens: Token[]): ASTNode[] {
  const ast: ASTNode[] = []

  for (const token of tokens) {
    const node = convertToken(token)
    if (node) {
      ast.push(node)
    }
  }

  return ast
}

function convertToken(token: Token): ASTNode | null {
  const base = {
    position: {
      start: { line: 1, offset: 0 },
      end: { line: 1, offset: 0 },
    },
  }

  switch (token.type) {
    case "heading":
      return {
        ...base,
        type: "heading",
        depth: token.depth ?? 1,
        children: token.tokens ? parseTokens(token.tokens) : [],
      }
    case "paragraph":
      return {
        ...base,
        type: "paragraph",
        children: token.tokens ? parseTokens(token.tokens) : [],
      }
    case "text":
      return {
        ...base,
        type: "text",
        value: token.text ?? token.raw ?? "",
      }
    case "strong":
      return {
        ...base,
        type: "bold",
        children: token.tokens ? parseTokens(token.tokens) : [],
      }
    case "em":
      return {
        ...base,
        type: "italic",
        children: token.tokens ? parseTokens(token.tokens) : [],
      }
    case "del":
      return {
        ...base,
        type: "strikethrough",
        children: token.tokens ? parseTokens(token.tokens) : [],
      }
    case "codespan":
      return {
        ...base,
        type: "code_inline",
        value: token.text ?? token.raw ?? "",
      }
    case "code":
      return {
        ...base,
        type: "code_block",
        value: token.text ?? token.raw ?? "",
        language: token.lang,
      }
    case "blockquote":
      return {
        ...base,
        type: "blockquote",
        children: token.tokens ? parseTokens(token.tokens) : [],
      }
    case "list":
      return {
        ...base,
        type: "list",
        ordered: token.ordered ?? false,
        children: token.items
          ? token.items.map((item: Token) => ({
              ...base,
              type: "list_item" as const,
              children: item.tokens ? parseTokens(item.tokens) : [],
            }))
          : [],
      }
    case "link":
      return {
        ...base,
        type: "link",
        url: token.href ?? "",
        title: token.title,
        children: token.tokens ? parseTokens(token.tokens) : [{ ...base, type: "text", value: token.text ?? token.href ?? "" }],
      }
    case "image":
      return {
        ...base,
        type: "image",
        url: token.href ?? "",
        title: token.title,
        alt: token.text,
      }
    case "hr":
      return {
        ...base,
        type: "horizontal_rule",
      }
    case "table":
      return {
        ...base,
        type: "table",
        children: token.tokens ? parseTokens(token.tokens) : [],
      }
    case "table_row":
      return {
        ...base,
        type: "table_row",
        children: token.tokens ? parseTokens(token.tokens) : [],
      }
    case "table_cell":
      return {
        ...base,
        type: "table_cell",
        children: token.tokens ? parseTokens(token.tokens) : [],
      }
    default:
      if (token.tokens) {
        return {
          ...base,
          type: "paragraph",
          children: parseTokens(token.tokens),
        }
      }
      return {
        ...base,
        type: "text",
        value: token.raw ?? "",
      }
  }
}

export function tokenize(markdown: string): Token[] {
  const lines = markdown.split("\n")
  const tokens: Token[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    const hrMatch = line.match(/^(?:---|\*\*\*|___)\s*$/)
    const codeBlockMatch = line.match(/^```(\w*)$/)
    const blockquoteMatch = line.match(/^>\s?(.*)$/)
    const orderedListMatch = line.match(/^(\d+)\.\s+(.+)$/)
    const unorderedListMatch = line.match(/^[-*+]\s+(.+)$/)

    if (headingMatch) {
      tokens.push({
        type: "heading",
        raw: line,
        depth: headingMatch[1].length,
        tokens: parseInline(headingMatch[2]),
      })
    } else if (hrMatch) {
      tokens.push({ type: "hr", raw: line })
    } else if (codeBlockMatch) {
      const lang = codeBlockMatch[1]
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      tokens.push({
        type: "code",
        raw: codeLines.join("\n"),
        text: codeLines.join("\n"),
        lang: lang || undefined,
      })
    } else if (blockquoteMatch) {
      const quoteLines: string[] = [blockquoteMatch[1]]
      i++
      while (i < lines.length) {
        const qMatch = lines[i].match(/^>\s?(.*)$/)
        if (!qMatch) break
        quoteLines.push(qMatch[1])
        i++
      }
      i--
      const quoteTokens = tokenize(quoteLines.join("\n"))
      tokens.push({
        type: "blockquote",
        raw: quoteLines.join("\n"),
        tokens: quoteTokens,
      })
    } else if (orderedListMatch) {
      const items: Token[] = []
      while (i < lines.length) {
        const olMatch = lines[i].match(/^(\d+)\.\s+(.+)$/)
        if (!olMatch) break
        items.push({
          type: "list_item",
          raw: olMatch[2],
          tokens: parseInline(olMatch[2]),
          text: olMatch[2],
        })
        i++
      }
      i--
      tokens.push({ type: "list", raw: "list", ordered: true, items })
    } else if (unorderedListMatch) {
      const items: Token[] = []
      while (i < lines.length) {
        const ulMatch = lines[i].match(/^[-*+]\s+(.+)$/)
        if (!ulMatch) break
        items.push({
          type: "list_item",
          raw: ulMatch[1],
          tokens: parseInline(ulMatch[1]),
          text: ulMatch[1],
        })
        i++
      }
      i--
      tokens.push({ type: "list", raw: "list", ordered: false, items })
    } else if (line.trim().length === 0) {
      tokens.push({ type: "space", raw: line })
    } else {
      const paragraphLines: string[] = [line]
      i++
      while (i < lines.length && lines[i].trim().length > 0 && !lines[i].match(/^(#{1,6}\s|```|>\s?|[-*+]\s|\d+\.\s|---$)/)) {
        paragraphLines.push(lines[i])
        i++
      }
      i--
      const paraText = paragraphLines.join("\n").trim()
      tokens.push({
        type: "paragraph",
        raw: paraText,
        tokens: parseInline(paraText),
        text: paraText,
      })
    }
    i++
  }

  return tokens
}

function parseInline(text: string): Token[] {
  const tokens: Token[] = []

  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|~~(.+?)~~|`(.+?)`|!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]*)\]\(([^)]+)\))/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plainText = text.slice(lastIndex, match.index)
      if (plainText) {
        tokens.push({ type: "text", raw: plainText, text: plainText })
      }
    }

    if (match[2]) {
      tokens.push({ type: "strong", raw: match[0], tokens: parseInline(match[2]) })
    } else if (match[3]) {
      tokens.push({ type: "strong", raw: match[0], tokens: parseInline(match[3]) })
    } else if (match[4]) {
      tokens.push({ type: "em", raw: match[0], tokens: parseInline(match[4]) })
    } else if (match[5]) {
      tokens.push({ type: "del", raw: match[0], tokens: parseInline(match[5]) })
    } else if (match[6]) {
      tokens.push({ type: "codespan", raw: match[0], text: match[6] })
    } else if (match[7] !== undefined && match[8] !== undefined) {
      tokens.push({ type: "image", raw: match[0], href: match[8], title: "", text: match[7] })
    } else if (match[9] !== undefined && match[10] !== undefined) {
      tokens.push({ type: "link", raw: match[0], href: match[10], title: "", text: match[9], tokens: [{ type: "text", raw: match[9], text: match[9] }] })
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex)
    tokens.push({ type: "text", raw: remaining, text: remaining })
  }

  return tokens.length > 0 ? tokens : [{ type: "text", raw: text, text }]
}

export function buildAST(markdown: string): ASTNode {
  const tokens = tokenize(markdown)
  return {
    type: "root",
    children: parseTokens(tokens),
    position: {
      start: { line: 1, offset: 0 },
      end: { line: markdown.split("\n").length, offset: 0 },
    },
  }
}

export async function enrichAST(
  ast: ASTNode,
  resolvedLinks: Map<string, { slug: string; title: string; objectType: string; status: string }>
): Promise<ASTNode> {
  function walk(node: ASTNode): ASTNode {
    if (node.type === "wiki_link") {
      const wikiNode = node as WikiLinkNode
      const resolved = resolvedLinks.get(wikiNode.target)
      if (resolved && resolved.status === "published") {
        return {
          ...wikiNode,
          type: "link",
          url: `/${resolved.slug}`,
          title: wikiNode.alias || resolved.title,
          resolvedSlug: resolved.slug,
          resolvedTitle: resolved.title,
          resolvedType: resolved.objectType,
          children: [{ type: "text", value: wikiNode.alias || resolved.title, position: wikiNode.position }],
        }
      }
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map(walk),
      }
    }

    return node
  }

  return walk(ast)
}

export interface ParseOptions {
  resolver?: WikiLinkResolver
}

export async function parseMarkdown(
  markdown: string,
  options: ParseOptions = {}
): Promise<PipelineResult> {
  const context: PipelineContext = {
    sourceMarkdown: markdown,
    resolvedLinks: new Map(),
    errors: [],
    metadata: {
      wordCount: 0,
      readingTime: 0,
      headingCount: 0,
      linkCount: 0,
      wikiLinkCount: 0,
      imageCount: 0,
      calloutCount: 0,
    },
  }

  const wikiLinks = extractWikiLinks(markdown)
  context.metadata.wikiLinkCount = wikiLinks.length

  const resolvedLinks = options.resolver
    ? await resolveWikiLinks(wikiLinks, options.resolver)
    : new Map()

  context.resolvedLinks = resolvedLinks

  const processedMarkdown = replaceWikiLinks(markdown, resolvedLinks)
  const ast = buildAST(processedMarkdown)
  const enrichedAst = await enrichAST(ast, resolvedLinks)

  computeMetadata(enrichedAst, context.metadata)

  const html = renderToHtml(enrichedAst)

  return {
    ast: enrichedAst,
    html,
    components: {},
    context,
    errors: context.errors,
  }
}

function computeMetadata(node: ASTNode, meta: PipelineContext["metadata"]): void {
  if (node.type === "heading") meta.headingCount++
  if (node.type === "link") meta.linkCount++
  if (node.type === "wiki_link") meta.wikiLinkCount++
  if (node.type === "image") meta.imageCount++
  if (node.type === "callout") meta.calloutCount++

  if (node.type === "text" && node.value) {
    meta.wordCount += node.value.split(/\s+/).filter(Boolean).length
  }

  if (node.children) {
    for (const child of node.children) {
      computeMetadata(child, meta)
    }
  }

  meta.readingTime = Math.max(1, Math.ceil(meta.wordCount / 200))
}

function renderToHtml(node: ASTNode): string {
  switch (node.type) {
    case "root":
      return node.children ? node.children.map(renderToHtml).join("\n") : ""
    case "heading":
      return `<h${node.depth}>${node.children ? node.children.map(renderToHtml).join("") : ""}</h${node.depth}>`
    case "paragraph":
      return `<p>${node.children ? node.children.map(renderToHtml).join("") : ""}</p>`
    case "text":
      return escapeHtml(node.value ?? "")
    case "bold":
      return `<strong>${node.children ? node.children.map(renderToHtml).join("") : ""}</strong>`
    case "italic":
      return `<em>${node.children ? node.children.map(renderToHtml).join("") : ""}</em>`
    case "strikethrough":
      return `<del>${node.children ? node.children.map(renderToHtml).join("") : ""}</del>`
    case "code_inline":
      return `<code>${escapeHtml(node.value ?? "")}</code>`
    case "code_block":
      return `<pre><code${node.language ? ` class="language-${node.language}"` : ""}>${escapeHtml(node.value ?? "")}</code></pre>`
    case "blockquote":
      return `<blockquote>${node.children ? node.children.map(renderToHtml).join("\n") : ""}</blockquote>`
    case "list": {
      const tag = node.ordered ? "ol" : "ul"
      return `<${tag}>${node.children ? node.children.map(renderToHtml).join("") : ""}</${tag}>`
    }
    case "list_item":
      return `<li>${node.children ? node.children.map(renderToHtml).join("") : ""}</li>`
    case "link":
      return `<a href="${escapeHtml(node.url ?? "")}"${node.title ? ` title="${escapeHtml(node.title)}"` : ""}>${node.children ? node.children.map(renderToHtml).join("") : node.title || node.url}</a>`
    case "image":
      return `<img src="${escapeHtml(node.url ?? "")}" alt="${escapeHtml(node.alt ?? "")}"${node.title ? ` title="${escapeHtml(node.title)}"` : ""} />`
    case "horizontal_rule":
      return `<hr />`
    case "table":
      return `<table>${node.children ? node.children.map(renderToHtml).join("") : ""}</table>`
    case "table_row":
      return `<tr>${node.children ? node.children.map(renderToHtml).join("") : ""}</tr>`
    case "table_cell":
      return `<td>${node.children ? node.children.map(renderToHtml).join("") : ""}</td>`
    case "wiki_link": {
      const w = node as WikiLinkNode
      const label = w.alias || w.target
      return w.resolvedSlug
        ? `<a href="/${w.resolvedSlug}">${escapeHtml(label)}</a>`
        : `<span class="broken-link">${escapeHtml(label)}</span>`
    }
    default:
      return node.children ? node.children.map(renderToHtml).join("") : ""
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
