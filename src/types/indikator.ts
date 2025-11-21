// src/types/indikator.ts
export type Indikator = {
  id: string;                    // ID indikator unik
  label: string;                 // Nama indikator
  rawValue: number;              // Nilai aktual
  standarizedValue: number;      // Nilai hasil standarisasi
  weight?: number;               // Bobot indikator
  keterangan?: string;           // Catatan opsional
};

// 🟢 Struktur data utama untuk disimpan di LowDB
export interface EkonomiBiruEntry {
  id: string;                        // ID unik indikator
  pilar: string;                     // Nama pilar
  pilarWeight?: number;              // Bobot pilar
  pilarAdjustmentFactor?: number;    // Faktor penyesuaian pilar

  subPilar: string;                  // Nama subpilar
  subWeight?: number;                // Bobot subpilar
  subAdjustmentFactor?: number;      // Faktor penyesuaian subpilar

  indikator: string;                 // Nama indikator
  indikatorWeight?: number;          // Bobot indikator

  nilai: number | null;              // Nilai aktual
  standar: number | null;            // Nilai standarized
  keterangan?: string;               // Catatan tambahan (opsional)
}

// 🧩 Struktur internal (untuk tampilan dan perhitungan)
export interface SubPilar {
  id: string;
  title: string;
  indikator: Indikator[];
  weight?: number;
  adjustmentFactor?: number;
}

export interface Pilar {
  id: string;
  title: string;
  subPilar: SubPilar[];
  weight?: number;
  adjustmentFactor?: number;
  color?: string;
}

// 🧠 Fungsi konversi dari data LowDB → struktur Pilar/SubPilar/Indikator
export function normalizeEkonomiBiru(entries: EkonomiBiruEntry[]): Pilar[] {
  const pilarMap = new Map<string, Pilar>();

  entries.forEach((e) => {
    if (!pilarMap.has(e.pilar)) {
      pilarMap.set(e.pilar, {
        id: e.pilar,
        title: e.pilar,
        subPilar: [],
        weight: e.pilarWeight ?? 1,
        adjustmentFactor: e.pilarAdjustmentFactor ?? 1,
      });
    }

    const pilar = pilarMap.get(e.pilar)!;

    let sub = pilar.subPilar.find((s) => s.title === e.subPilar);
    if (!sub) {
      sub = {
        id: e.subPilar,
        title: e.subPilar,
        indikator: [],
        weight: e.subWeight ?? 1,
        adjustmentFactor: e.subAdjustmentFactor ?? 1,
      };
      pilar.subPilar.push(sub);
    }

    sub.indikator.push({
      id: e.id,
      label: e.indikator,
      rawValue: e.nilai ?? 0,
      standarizedValue: e.standar ? (e.nilai ?? 0) / e.standar : 0,
      weight: e.indikatorWeight ?? 1,
      keterangan: e.keterangan ?? "",
    });
  });

  return Array.from(pilarMap.values());
}
