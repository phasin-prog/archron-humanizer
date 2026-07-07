import type { ComponentType } from "react"
import type { ComponentMap, ComponentProps } from "../types"

const DEFAULT_COMPONENTS: ComponentMap = {}

export function createComponentRegistry(): ComponentMap {
  return { ...DEFAULT_COMPONENTS }
}

export type ComponentRegistry = Map<string, ComponentType<ComponentProps>>
