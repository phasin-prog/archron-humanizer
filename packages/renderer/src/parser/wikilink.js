const WIKI_LINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
export function extractWikiLinks(markdown) {
    const links = [];
    let match;
    WIKI_LINK_REGEX.lastIndex = 0;
    while ((match = WIKI_LINK_REGEX.exec(markdown)) !== null) {
        links.push(match[1].trim());
    }
    return [...new Set(links)];
}
export function replaceWikiLinks(markdown, resolvedLinks) {
    WIKI_LINK_REGEX.lastIndex = 0;
    return markdown.replace(WIKI_LINK_REGEX, (fullMatch, target, alias) => {
        const cleanTarget = target.trim();
        const resolved = resolvedLinks.get(cleanTarget);
        if (!resolved || resolved.status !== "published") {
            return `[[${cleanTarget}${alias ? `|${alias}` : ""}]]`;
        }
        const label = alias?.trim() || resolved.title;
        const href = `/${resolved.slug}`;
        return `[${label}](${href})`;
    });
}
export async function resolveWikiLinks(targets, resolver) {
    const resolved = new Map();
    const results = await Promise.allSettled(targets.map(t => resolver(t)));
    for (let i = 0; i < targets.length; i++) {
        const result = results[i];
        if (result.status === "fulfilled" && result.value) {
            resolved.set(targets[i], result.value);
        }
    }
    return resolved;
}
