import type { ComponentType } from "react"
import type { ComponentMap, ComponentProps } from "../types"
import { DEFAULT_COMPONENTS as defaults } from "../components"

export function createComponentRegistry(): ComponentMap {
  return { ...defaults }
}

export type ComponentRegistry = Map<string, ComponentType<ComponentProps>>
