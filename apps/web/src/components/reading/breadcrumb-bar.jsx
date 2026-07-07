import { Breadcrumbs, BreadcrumbItem, BreadcrumbSeparator, Tag } from "@archron/ui";
export function BreadcrumbBar({ segments, objectType }) {
    return (<div className="flex items-center justify-between gap-4 px-6 py-3">
      <Breadcrumbs>
        {segments.map((segment, i) => (<div key={i} className="flex items-center gap-1.5">
            <BreadcrumbItem href={segment.href} isCurrent={i === segments.length - 1}>
              {segment.label}
            </BreadcrumbItem>
            {i < segments.length - 1 && <BreadcrumbSeparator />}
          </div>))}
      </Breadcrumbs>
      {objectType && (<Tag objectType={objectType.toLowerCase()} label={objectType}/>)}
    </div>);
}
