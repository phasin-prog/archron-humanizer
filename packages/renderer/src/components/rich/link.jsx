export default function Link({ node, children }) {
    const url = node.url ?? "#";
    const isExternal = url.startsWith("http");
    return (<a href={url} className="underline underline-offset-2 decoration-primary/40 hover:decoration-primary text-primary transition-colors" target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
      {children}
    </a>);
}
