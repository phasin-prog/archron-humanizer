import type { ComponentType } from "react"

export function useMDXComponents(): Record<string, ComponentType<any>> {
  return {
    h1: (props) => <h1 className="text-page-title font-heading text-text-heading" {...props} />,
    h2: (props) => <h2 className="text-section font-heading text-text-heading" {...props} />,
    h3: (props) => <h3 className="text-card-title font-heading text-text-heading" {...props} />,
    p: (props) => <p className="text-body leading-relaxed text-text-body" {...props} />,
    a: (props) => <a className="text-accent underline decoration-accent-subtle underline-offset-4 hover:text-accent-hover" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 space-y-2" {...props} />,
    ol: (props) => <ol className="list-decimal pl-6 space-y-2" {...props} />,
    li: (props) => <li className="text-body" {...props} />,
    blockquote: (props) => <blockquote className="border-l-4 border-accent pl-4 italic text-text-secondary" {...props} />,
    code: (props) => <code className="bg-bg-elevated px-1.5 py-0.5 rounded font-mono text-caption" {...props} />,
    pre: (props) => <pre className="bg-bg-elevated p-4 rounded-lg overflow-x-auto font-mono text-caption" {...props} />,
  }
}
