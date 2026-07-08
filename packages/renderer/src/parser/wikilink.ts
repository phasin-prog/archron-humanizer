import type { ResolvedLink, WikiLinkResolver } from "../types"

const WIKI_LINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

export function extractWikiLinks(markdown: string): string[] {
  const links: string[] = []
  let match: RegExpExecArray | null

  WIKI_LINK_REGEX.lastIndex = 0
  while ((match = WIKI_LINK_REGEX.exec(markdown)) !== null) {
    if (match[1]) {
      links.push(match[1].trim())
    }
  }

  return [...new Set(links)]
}

export function replaceWikiLinks(
  markdown: string,
  resolvedLinks: Map<string, ResolvedLink>
): string {
  WIKI_LINK_REGEX.lastIndex = 0
  return markdown.replace(WIKI_LINK_REGEX, (_match, target: string, alias?: string) => {
    const cleanTarget = target.trim()
    const resolved = resolvedLinks.get(cleanTarget)

    if (!resolved || resolved.status !== "published") {
      return `[[${cleanTarget}${alias ? `|${alias}` : ""}]]`
    }

    const label = alias?.trim() || resolved.title
    const href = `/${resolved.slug}`

    return `[${label}](${href})`
  })
}

export async function resolveWikiLinks(
  targets: string[],
  resolver: WikiLinkResolver
): Promise<Map<string, ResolvedLink>> {
  const resolved = new Map<string, ResolvedLink>()
  const results = await Promise.allSettled(targets.map(t => resolver(t)))

  for (let i = 0; i < targets.length; i++) {
    const result = results[i]
    const target = targets[i]

    if (result && result.status === "fulfilled" && target) {
      const link = result.value
      if (link) {
        resolved.set(target, link)
      }
    }
  }

  return resolved
}
