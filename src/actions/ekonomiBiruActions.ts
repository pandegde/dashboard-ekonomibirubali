"use server";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

// -------------------------------------------------------
// 1️⃣ Interface (struktur data yang digunakan)
// -------------------------------------------------------
export interface EkonomiBiruEntry {
  id: string;                        // ID unik indikator
  pilar: string;                     // Nama pilar (misalnya: Ekonomi, Sosial, Lingkungan)
  pilarWeight?: number;              // Bobot pilar
  pilarAdjustmentFactor?: number;    // Faktor penyesuaian pilar

  subPilar: string;                  // Nama subpilar
  subWeight?: number;                // Bobot subpilar
  subAdjustmentFactor?: number;      // Faktor penyesuaian subpilar

  indikator: string;                 // Nama indikator
  indikatorWeight?: number;          // Bobot indikator
  nilai: number | null;              // Nilai aktual indikator
  standar: number | null;            // Nilai standarized indikator

  keterangan?: string;               // Catatan tambahan (opsional)
}

// -------------------------------------------------------
// 2️⃣ Inisialisasi database JSON
// -------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "../data/ekonomiBiru.json");

type Database = {
  ekonomiBiru: Record<string, EkonomiBiruEntry[]>; // data per tahun
  [key: string]: any;
};

const adapter = new JSONFile<Database>(file);
const db = new Low(adapter, { ekonomiBiru: {} });

// -------------------------------------------------------
// 3️⃣ Inisialisasi database
// -------------------------------------------------------
async function initDB() {
  await db.read();
  db.data ||= { ekonomiBiru: {} };
}

// -------------------------------------------------------
// 4️⃣ Ambil data
// -------------------------------------------------------
export async function getData(key = "ekonomiBiru") {
  await initDB();
  return db.data?.[key] || {};
}

// -------------------------------------------------------
// 5️⃣ Simpan data per tahun
// -------------------------------------------------------
export async function saveData(year: string, payload: EkonomiBiruEntry[]) {
  await initDB();

  if (!db.data!.ekonomiBiru) db.data!.ekonomiBiru = {};

  db.data!.ekonomiBiru[year] = payload; // replace data tahun
  await db.write();

  return { ok: true, year, count: payload.length };
}
