import { readFileSync } from "fs";
import { join } from "path";
export function readTrigger(name) {
    const filePath = join(__dirname, `${name}.sql`);
    return readFileSync(filePath, "utf-8");
}
export const TRIGGER_NAMES = ["functions", "register", "indexes", "seed"];
