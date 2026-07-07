export default function Footnote({ node }) {
    const index = node.data?.index;
    return (<sup>
      <a href={`#fn-${index}`} id={`fnref-${index}`} className="text-xs text-primary no-underline hover:underline">
        [{index ?? "?"}]
      </a>
    </sup>);
}
