export default function List({ node, children }) {
    if (node.ordered) {
        return <ol className="list-decimal pl-6 my-4 space-y-1">{children}</ol>;
    }
    return <ul className="list-disc pl-6 my-4 space-y-1">{children}</ul>;
}
