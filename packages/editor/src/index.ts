export interface EditorCommand {
  id: string
  name: string
  label: string
  shortcut: string
  handler: (state: EditorState) => EditorState
}

export interface ValidationRule {
  id: string
  name: string
  description: string
  test: (markdown: string) => ValidationResult | null
}

export interface ValidationResult {
  ruleId: string
  message: string
  severity: "error" | "warning" | "info"
  line?: number
  column?: number
  autoFix?: string
}

export interface EditorState {
  markdown: string
  selection: { start: number; end: number }
  objectType: string
  status: "draft" | "review" | "published" | "archived"
  title: string
  slug: string
  tags: string[]
  validations: ValidationResult[]
  lastSaved: string | null
  wordCount: number
}

export interface SlashCommand {
  id: string
  trigger: string
  label: string
  description: string
  snippet: string
  category: "formatting" | "media" | "content" | "object" | "special"
}

export const BUILT_IN_SLASH_COMMANDS: SlashCommand[] = [
  {
    id: "heading-1",
    trigger: "h1",
    label: "Heading 1",
    description: "Insert a level 1 heading",
    snippet: "# ${1:Heading}",
    category: "formatting",
  },
  {
    id: "heading-2",
    trigger: "h2",
    label: "Heading 2",
    description: "Insert a level 2 heading",
    snippet: "## ${1:Heading}",
    category: "formatting",
  },
  {
    id: "heading-3",
    trigger: "h3",
    label: "Heading 3",
    description: "Insert a level 3 heading",
    snippet: "### ${1:Heading}",
    category: "formatting",
  },
  {
    id: "bold",
    trigger: "bold",
    label: "Bold",
    description: "Insert bold text",
    snippet: "**${1:text}**",
    category: "formatting",
  },
  {
    id: "italic",
    trigger: "italic",
    label: "Italic",
    description: "Insert italic text",
    snippet: "*${1:text}*",
    category: "formatting",
  },
  {
    id: "strikethrough",
    trigger: "strike",
    label: "Strikethrough",
    description: "Insert strikethrough text",
    snippet: "~~${1:text}~~",
    category: "formatting",
  },
  {
    id: "code-inline",
    trigger: "code",
    label: "Inline Code",
    description: "Insert inline code",
    snippet: "`${1:code}`",
    category: "formatting",
  },
  {
    id: "code-block",
    trigger: "codeblock",
    label: "Code Block",
    description: "Insert a code block",
    snippet: "```${1:language}\n${2:code}\n```",
    category: "formatting",
  },
  {
    id: "blockquote",
    trigger: "quote",
    label: "Blockquote",
    description: "Insert a blockquote",
    snippet: "> ${1:quote}",
    category: "formatting",
  },
  {
    id: "bullet-list",
    trigger: "list",
    label: "Bullet List",
    description: "Insert a bullet list",
    snippet: "- ${1:item1}\n- ${2:item2}\n- ${3:item3}",
    category: "formatting",
  },
  {
    id: "ordered-list",
    trigger: "numbered",
    label: "Numbered List",
    description: "Insert a numbered list",
    snippet: "1. ${1:item1}\n2. ${2:item2}\n3. ${3:item3}",
    category: "formatting",
  },
  {
    id: "link",
    trigger: "link",
    label: "Link",
    description: "Insert a hyperlink",
    snippet: "[${1:label}](${2:url})",
    category: "formatting",
  },
  {
    id: "image",
    trigger: "image",
    label: "Image",
    description: "Insert an image",
    snippet: "![${1:alt}](${2:url})",
    category: "media",
  },
  {
    id: "wikilink",
    trigger: "wikilink",
    label: "Wikilink",
    description: "Link to another knowledge object",
    snippet: "[[${1:target}]]",
    category: "object",
  },
  {
    id: "callout",
    trigger: "callout",
    label: "Callout",
    description: "Insert an info callout box",
    snippet: "> [!info]\n> ${1:content}",
    category: "content",
  },
  {
    id: "hr",
    trigger: "hr",
    label: "Horizontal Rule",
    description: "Insert a horizontal rule",
    snippet: "---",
    category: "formatting",
  },
  {
    id: "table",
    trigger: "table",
    label: "Table",
    description: "Insert a table",
    snippet: "| ${1:Header} | ${2:Header} |\n| --- | --- |\n| ${3:Cell} | ${4:Cell} |",
    category: "formatting",
  },
]

export function createInitialState(overrides: Partial<EditorState> = {}): EditorState {
  return {
    markdown: "",
    selection: { start: 0, end: 0 },
    objectType: "article",
    status: "draft",
    title: "",
    slug: "",
    tags: [],
    validations: [],
    lastSaved: null,
    wordCount: 0,
    ...overrides,
  }
}

export function validateMarkdown(markdown: string, rules: ValidationRule[]): ValidationResult[] {
  const results: ValidationResult[] = []

  for (const rule of rules) {
    const result = rule.test(markdown)
    if (result) {
      results.push(result)
    }
  }

  return results
}

export function countWords(markdown: string): number {
  return markdown
    .replace(/[#*`>[\]()~\-_|!]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length
}

export function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200))
}
