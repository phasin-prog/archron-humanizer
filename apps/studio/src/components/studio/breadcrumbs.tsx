import { Breadcrumbs, BreadcrumbItem, BreadcrumbSeparator } from "@archron/ui"

export function StudioBreadcrumbs() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/studio">Studio</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem isCurrent>Dashboard</BreadcrumbItem>
    </Breadcrumbs>
  )
}
