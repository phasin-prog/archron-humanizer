export default function CodeBlock({ node }) {
    return (<div className="relative my-4 rounded-lg border bg-surface">
      <div className="flex items-center justify-between px-4 py-1.5 border-b bg-muted/50">
        <span className="text-xs font-mono text-muted-foreground">
          {node.language ?? "text"}
        </span>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-caption font-mono">{node.value}</code>
      </pre>
    </div>);
}
