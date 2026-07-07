import { readFileSync } from "fs"
import { join } from "path"

export function readTrigger(name: string): string {
  const filePath = join(__dirname, `${name}.sql`)
  return readFileSync(filePath, "utf-8")
}

export const TRIGGER_NAMES = ["functions", "register", "indexes", "seed"] as const

export type TriggerName = (typeof TRIGGER_NAMES)[number]
