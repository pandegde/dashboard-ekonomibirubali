"use server";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

// -------------------------------------------------------
// 1️⃣ Interface sesuai struktur di form.tsx
// -------------------------------------------------------
export interface Indikator {
  id: number;
  nama: string;
  satuan: string;
  target: Record<number, number>;
  realisasi: Record<number, Record<string, number | null>>;
  capaian: Record<number, Record<string, number | null>>;
  validasi: Record<number, Record<string, string | null>>;
  keterangan?: string;
}

// ------------------------------------------------------
// 2️⃣ Inisialisasi database JSON
// -------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "../data/indikatorKinerjaDaerah.json");

// Struktur utama database
type Database = {
  indikatorKinerjaDaerah: Record<string, Indikator[]>; // data per tahun
  [key: string]: any; // agar bisa diakses dengan key string
};

const adapter = new JSONFile<Database>(file);
const db = new Low(adapter, { indikatorKinerjaDaerah: {} });

// -------------------------------------------------------
// 3️⃣ Fungsi inisialisasi DB
// -------------------------------------------------------
async function initDB() {
  await db.read();
  db.data ||= { indikatorKinerjaDaerah: {} };
}

// -------------------------------------------------------
// 4️⃣ Ambil data berdasarkan key (default: "indikatorKinerjaDaerah")
// -------------------------------------------------------
export async function getData(key = "indikatorKinerjaDaerah") {
  await initDB();
  return db.data?.[key] || {};
}

// -------------------------------------------------------
// 5️⃣ Simpan data per tahun
// -------------------------------------------------------
export async function saveData(year: string, payload: Indikator[]) {
  await initDB();

  if (!db.data!.indikatorKinerjaDaerah) db.data!.indikatorKinerjaDaerah = {};

  // Menyimpan data untuk tahun tertentu
  db.data!.indikatorKinerjaDaerah[year] = payload;

  await db.write();
  return { ok: true, year, count: payload.length };
}
