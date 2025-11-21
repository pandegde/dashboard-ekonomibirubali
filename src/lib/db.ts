// src/lib/db.ts
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { mkdirSync } from "fs";

const dbDir = path.join(process.cwd(), "data", "db");
mkdirSync(dbDir, { recursive: true });

export function createDB<T>(fileName: string, defaultData: T) {
  const file = path.join(dbDir, fileName);
  const adapter = new JSONFile<T>(file);
  const db = new Low<T>(adapter, defaultData);
  return db;
}
