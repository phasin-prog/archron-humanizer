const VARIANT_STYLES = {
    info: "border-l-4 border-primary/60 bg-primary/5 rounded-r-lg p-4 my-4",
    warning: "border-l-4 border-amber-500/60 bg-amber-50 rounded-r-lg p-4 my-4 dark:bg-amber-950/20",
    tip: "border-l-4 border-emerald-500/60 bg-emerald-50 rounded-r-lg p-4 my-4 dark:bg-emerald-950/20",
    note: "border-l-4 border-muted-foreground/30 bg-surface rounded-r-lg p-4 my-4",
};
const ICONS = {
    info: "\u2139",
    warning: "\u26A0",
    tip: "\uD83D\uDCA1",
    note: "\uD83D\uDCDD",
};
export default function Callout({ node, children }) {
    const variant = node.data?.variant ?? "info";
    return (<aside className={VARIANT_STYLES[variant]}>
      <div className="flex gap-3">
        <span className="text-lg" aria-hidden="true">{ICONS[variant]}</span>
        <div>{children}</div>
      </div>
    </aside>);
}
