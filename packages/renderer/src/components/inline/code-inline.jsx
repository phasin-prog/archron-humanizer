export default function CodeInline({ node }) {
    return (<code className="rounded bg-muted px-1 py-0.5 text-caption font-mono text-[0.875em]">
      {node.value}
    </code>);
}
