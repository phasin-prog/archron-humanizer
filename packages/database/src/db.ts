import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

export type DB = ReturnType<typeof drizzle<typeof schema>>

let _db: DB | null = null
let _queryClient: ReturnType<typeof postgres> | null = null

function getDb(): DB {
  if (_db) return _db

  const DATABASE_URL = process.env.DATABASE_URL
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required")
  }

  _queryClient = postgres(DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })

  _db = drizzle(_queryClient, { schema })
  return _db
}

export const db = new Proxy({} as DB, {
  get(_target, prop) {
    const target = getDb() as unknown as Record<string | symbol, unknown>
    const value = target[prop as keyof typeof target]
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(target)
      : value
  },
})
