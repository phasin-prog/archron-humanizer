const STYLES = {
    1: "text-display font-serif font-bold tracking-tight",
    2: "text-page-title font-serif font-semibold",
    3: "text-section font-serif font-semibold",
    4: "text-card-title font-sans font-semibold",
    5: "text-body font-sans font-medium",
    6: "text-caption font-sans font-medium uppercase tracking-wider",
};
export default function Heading({ node, children }) {
    const depth = node.depth ?? 1;
    const Tag = `h${Math.min(Math.max(depth, 1), 6)}`;
    const className = STYLES[depth] ?? STYLES[6];
    return <Tag className={className}>{children}</Tag>;
}
