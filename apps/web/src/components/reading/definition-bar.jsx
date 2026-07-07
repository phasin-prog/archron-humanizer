import { Tag } from "@archron/ui";
export function DefinitionBar({ objectType, definition }) {
    return (<div className="sticky top-14 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-container-page items-start gap-3 px-6 py-3">
        <Tag objectType={objectType.toLowerCase()} label={objectType} className="mt-0.5 shrink-0"/>
        <p className="font-serif text-body text-text-muted leading-relaxed">
          {definition}
        </p>
      </div>
    </div>);
}
