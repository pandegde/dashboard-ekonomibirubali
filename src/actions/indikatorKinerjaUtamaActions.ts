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
  sasaran: string;
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
const file = path.join(__dirname, "../data/indikatorKinerjaUtama.json");

// Struktur utama database
type Database = {
  indikatorKinerjaUtama: Record<string, Indikator[]>; // data per tahun
  [key: string]: any; // agar bisa diakses dengan key string
};

const adapter = new JSONFile<Database>(file);
const db = new Low(adapter, { indikatorKinerjaUtama: {} });

// -------------------------------------------------------
// 3️⃣ Fungsi inisialisasi DB
// -------------------------------------------------------
async function initDB() {
  await db.read();
  db.data ||= { indikatorKinerjaUtama: {} };
}

// -------------------------------------------------------
// 4️⃣ Ambil data berdasarkan key (default: "indikatorKinerjaUtama")
// -------------------------------------------------------
export async function getData(key = "indikatorKinerjaUtama") {
  await initDB();
  return db.data?.[key] || {};
}

// -------------------------------------------------------
// 5️⃣ Simpan data per tahun
// -------------------------------------------------------
export async function saveData(year: string, payload: Indikator[]) {
  await initDB();

  if (!db.data!.indikatorKinerjaUtama) db.data!.indikatorKinerjaUtama = {};

  // Menyimpan data untuk tahun tertentu
  db.data!.indikatorKinerjaUtama[year] = payload;

  await db.write();
  return { ok: true, year, count: payload.length };
}
