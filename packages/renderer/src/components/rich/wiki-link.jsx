export default function WikiLink({ node }) {
    const wl = node;
    if (!wl.resolvedSlug) {
        return (<span className="text-muted-foreground">
        [[{wl.target}]]
      </span>);
    }
    if (wl.resolvedType === "concept") {
        return (<div className="my-4">
        <div className="rounded-lg border bg-surface p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Concept
          </div>
          <a href={`/${wl.resolvedSlug}`} className="text-card-title font-serif font-semibold text-primary underline underline-offset-2 hover:decoration-primary">
            {wl.alias ?? wl.resolvedTitle ?? wl.target}
          </a>
          {wl.resolvedTitle && wl.alias && (<div className="text-caption text-muted-foreground mt-1">
              {wl.resolvedTitle}
            </div>)}
        </div>
      </div>);
    }
    if (wl.resolvedType === "thinker") {
        return (<div className="my-4">
        <div className="rounded-lg border bg-surface p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Thinker
          </div>
          <a href={`/${wl.resolvedSlug}`} className="text-card-title font-serif font-semibold text-primary underline underline-offset-2 hover:decoration-primary">
            {wl.alias ?? wl.resolvedTitle ?? wl.target}
          </a>
        </div>
      </div>);
    }
    return (<a href={`/${wl.resolvedSlug}`} className="underline underline-offset-2 decoration-primary/40 hover:decoration-primary text-primary transition-colors">
      {wl.alias ?? wl.resolvedTitle ?? wl.target}
    </a>);
}
