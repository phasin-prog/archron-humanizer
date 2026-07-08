import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let _db = null;
let _queryClient = null;

function getDb() {
    if (_db) return _db;
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is required");
    }
    _queryClient = postgres(DATABASE_URL, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
    });
    _db = drizzle(_queryClient, { schema });
    return _db;
}

export const db = new Proxy({}, {
    get(_target, prop) {
        const target = getDb();
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
    },
});
