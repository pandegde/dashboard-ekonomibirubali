"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { FileCode2, FileSpreadsheet, ArrowLeft, Save, Download, FileInput, Info } from "lucide-react"

// ✅ Import Server Actions (LowDB)
import { saveData, getData } from "@/actions/indikatorKinerjaKunciActions";

// 🎯 Struktur data indikator
interface Indikator {
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

// 🎯 Data indikator (contoh, bisa kamu extend dari Excel)
const indikatorAwal: Indikator[] = [
  {
    id: 1,
    sasaran: "Meningkatnya Pengelolaan Wilayah Pesisir dan Pulau-Pulau Kecil yang lestari dan berkelanjutan",
    nama: "Persentase Pengelolaan Wilayah Pesisir dan Pulau-Pulau Kecil",
    satuan: "Persen",
    target: {
      2025: 30.59,
      2026: 32.50,
      2027: 34.42,
      2028: 36.33,
      2029: 38.24,
      2030: 40.15,
    },
    realisasi: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    capaian: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    validasi: {
      2025: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2026: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2027: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2028: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2029: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2030: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
    },
    keterangan: "(Jumlah Pelaku Usaha Yang Sudah Memiliki KKPRL/Jumlah Seluruh Pelaku Usaha Pemanfaat Ruang Laut)*100% (Data Dasar Pelaku Usaha 2025 = 523)",
  },
  {
    id: 2,
    sasaran: "Meningkatnya Produktivitas Produksi Perikanan Tangkap",
    nama: "Persentase Peningkatan Produksi Perikanan Tangkap",
    satuan: "persen",
    target: {
      2025: 2,
      2026: 2,
      2027: 2,
      2028: 2,
      2029: 2,
      2030: 2,
    },
    realisasi: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    capaian: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    validasi: {
      2025: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2026: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2027: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2028: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2029: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2030: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
    },
    keterangan: "(Jumlah Produksi Perikanan Tangkap Tahun Berjalan - Jumlah Produksi Perikanan Tangkap Tahun Sebelumnnya)/Jumlah Produksi Perikanan Tangkap Tahun Sebelumnnya x 100%",
  },
  {
    id: 3,
    sasaran: "Meningkatnya Produktivitas Perikanan Budidaya",
    nama: "Persentase peningkatan produksi perikanan budidaya",
    satuan: "Persen",
    target: {
      2025: 2,
      2026: 2,
      2027: 2,
      2028: 2,
      2029: 2,
      2030: 2,
    },
    realisasi: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    capaian: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    validasi: {
      2025: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2026: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2027: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2028: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2029: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2030: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
    },
    keterangan: "Jumlah Produksi Perikanan Budidaya Tahun Berjalan - Jumlah Produksi Perikanan Budidaya Tahun Sebelumnnya)/Jumlah Produksi Perikanan Budidaya Tahun Sebelumnnya x 100%",
  },
  {
    id: 4,
    sasaran: "Meningkatnya pengawasan pemanfatan sumber daya kelautan dan perikanan",
    nama: "Persentase Kepatuhan Pelaku Usaha Kelautan dan Perikanan terhadap Ketentuan Peraturan Perundangan yang Berlaku",
    satuan: "Persen",
    target: {
      2025: 5.28,
      2026: 18.96,
      2027: 19.60,
      2028: 20.05,
      2029: 20.54,
      2030: 20.86,
    },
    realisasi: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    capaian: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    validasi: {
      2025: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2026: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2027: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2028: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2029: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2030: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
    },
    keterangan: "Persentase Kepatuhan Pelaku usaha (PKPU) = (KPU/JKPU) x 100%",
  },
  {
    id: 5,
    sasaran: "Meningkatnya Produksi Olahan Hasil Perikanan ",
    nama: "Persentase Peningkatan  produksi olahan hasil perikanan",
    satuan: "Persen",
    target: {
      2025: 2,
      2026: 2,
      2027: 2,
      2028: 2,
      2029: 2,
      2030: 2,
    },
    realisasi: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    capaian: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    validasi: {
      2025: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2026: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2027: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2028: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2029: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2030: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
    },
    keterangan: "(Jumlah Produksi Olahan Hasil Perikanan Tahun Berjalan - Jumlah Produksi Olahan Hasil Perikanan Tahun Sebelumnnya)/Jumlah Produksi Olahan Hasil Perikanan Tahun Sebelumnnya x 100%",
  },
  {
    id: 6,
    sasaran: "Meningkatnya Mutu dan Keamanan Produk Hasil Kelautan dan Perikanan",
    nama: "Persentase peningkatanan mutu dan keamanan Produk Hasil Kelautan dan Perikanan",
    satuan: "Persen",
    target: {
      2025: 2,
      2026: 2,
      2027: 2,
      2028: 2,
      2029: 2,
      2030: 2,
    },
    realisasi: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    capaian: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    validasi: {
      2025: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2026: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2027: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2028: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2029: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2030: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
    },
    keterangan: "(Jumlah uji Tahun n - Jumlah yang di uji Tahun -n)/Jumlah yang di uji tahun -n x 100%",
  },
  {
    id: 7,
    sasaran: "Meningkatnya Pengelolaan Wilayah Pesisir dan Pulau-Pulau Kecil yang lestari dan berkelanjutan",
    nama: "Persentase Pengelolaan Kawasan Konservasi Perairan",
    satuan: "Persen",
    target: {
      2025: 66.67,
      2026: 83.33,
      2027: 100,
      2028: 100,
      2029: 100,
      2030: 100,
},
    realisasi: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    capaian: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    validasi: {
      2025: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2026: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2027: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2028: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2029: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2030: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
    },
    keterangan: "Kawasan Konservasi yang dikelola/Total Kawasan Konservasi*100%",
  },
  {
    id: 8,
    sasaran: "Meningkatnya Kualitas Layanan Penunjang Urusan Pemerintah Daerah Provinsi",
    nama: "Nilai Evaluasi Manajemen Kinerja ",
    satuan: "Nilai",
    target: {
      2025: 82,
      2026: 83,
      2027: 84,
      2028: 85,
      2029: 86,
      2030: 87,
},
    realisasi: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    capaian: {
      2025: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2026: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2027: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2028: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2029: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
      2030: { TW1: null, TW2: null, TW3: null, TW4: null, Tahunan: null },
    },
    validasi: {
      2025: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2026: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2027: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2028: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2029: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
      2030: { TW1: "", TW2: "", TW3: "", TW4: "", Tahunan: "" },
    },
    keterangan: "Nilai Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP) Perangkat Daerah",
  },
];

const years = [2025, 2026, 2027, 2028, 2029, 2030];
const periodes = ["TW1", "TW2", "TW3", "TW4", "Tahunan"];

export default function IndikatorKinerjaKunciForm() {
  const [indikator, setIndikator] = useState<Indikator[]>(indikatorAwal);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedPeriode, setSelectedPeriode] = useState<string>("TW1");
  const router = useRouter();

 // ✅ Load data dari server
   useEffect(() => {
   async function loadData() {
     try {
       // Ambil data dari server
       const result: Record<string, Indikator[]> | null = await getData("indikatorKinerjaKunci");
       if (!result) return;
 
       // Pastikan tahun yang dipilih ada datanya
       const serverIndikator = result[selectedYear] || [];
 
       // Merge dengan indikator awal (biar field target/realisasi/capaian/validasi tetap ada semua tahun)
       const merged = indikatorAwal.map((ind) => {
         const serverInd = serverIndikator.find((s) => s.id === ind.id);
         if (serverInd) {
           return {
             ...ind,
             target: { ...ind.target, [selectedYear]: serverInd.target[selectedYear] },
             realisasi: { ...ind.realisasi, [selectedYear]: serverInd.realisasi[selectedYear] },
             capaian: { ...ind.capaian, [selectedYear]: serverInd.capaian[selectedYear] },
             validasi: { ...ind.validasi, [selectedYear]: serverInd.validasi[selectedYear] },
             keterangan: serverInd.keterangan || ind.keterangan,
           };
         }
         return ind;
       });
 
       setIndikator(merged);
     } catch (err) {
       console.error("❌ Gagal memuat data:", err);
     }
   }
 
   loadData();
 }, [selectedYear]);


  // 🎯 Handle input realisasi
  const handleInput = (id: number, year: number, periode: string, value: string) => {
    const realisasi = value === "" ? null :  parseFloat(value);
    setIndikator((prev) =>
      prev.map((ind) => {
        if (ind.id === id) {
          const capaian = realisasi ? (realisasi / ind.target[year]) * 100 : null;
          return {
            ...ind,
            realisasi: {
              ...ind.realisasi,
              [year]: { ...ind.realisasi[year], [periode]: realisasi || null },
            },
            capaian: {
              ...ind.capaian,
              [year]: { ...ind.capaian[year], [periode]: capaian },
            },
          };
        }
        return ind;
      })
    );
  };

// ✅ Toggle checkbox
const handleValidasi = (
  id: number,
  year: number,
  periode: string,
  value: string
) => {
  setIndikator((prev)=>
    prev.map((ind) => {
      if (ind.id === id) {
        const current = ind.validasi [year]?.[periode] || null;
        const update = current === value ? null : value;
        return {
          ...ind,
          validasi: {
            ...ind.validasi,
            [year]: {
              ...ind.validasi[year],
              [periode]: update
            },
          },
        };
      }
      return ind;
    })
  );
};

// ✅ IMPORT EXCEL (Versi Aman & Lengkap)
const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      if (!rows || rows.length < 2) {
        alert("⚠️ File Excel kosong atau tidak valid.");
        return;
      }

      // 🔍 Validasi header
      const header = rows[0].map((h: any) => h?.toString().trim());
      const expectedHeader = [
        "Sasaran",
        "Indikator",
        "Satuan",
        "Target",
        `Realisasi ${selectedPeriode}`,
        `Capaian ${selectedPeriode}`,
        "Validasi",
      ];

      const isHeaderValid =
        expectedHeader.every((h, idx) => header[idx] === h) &&
        header.length >= expectedHeader.length;

      if (!isHeaderValid) {
        alert(
          `⚠️ Format Excel tidak sesuai.\nPastikan urutan kolom seperti berikut:\n\n${expectedHeader.join(
            " | "
          )}`
        );
        return;
      }

      // 🔄 Clone data indikator
      const imported = JSON.parse(JSON.stringify(indikator));
      const errorRows: string[] = [];

      rows.slice(1).forEach((row: any[], rowIndex) => {
        const [sasaran, nama, satuan, target, realisasi, capaian, validasi] = row;
        if (!sasaran || !nama || !satuan) return;

        const ind = imported.find(
          (i: Indikator) =>
            i.sasaran.trim() === sasaran.trim() &&
            i.nama.trim() === nama.trim() &&
            i.satuan.trim() === satuan.trim()
        );

        if (!ind) {
          errorRows.push(`Baris ${rowIndex + 2}: Indikator "${nama}" tidak ditemukan.`);
          return;
        }

        // 🔢 Update target (optional)
        const numTarget = parseFloat(target);
        if (!isNaN(numTarget)) ind.target[selectedYear] = numTarget;

        // 🔢 Update realisasi
        const numRealisasi = parseFloat(realisasi);
        if (!isNaN(numRealisasi)) {
          ind.realisasi[selectedYear][selectedPeriode] = numRealisasi;

          // Hitung capaian otomatis
          if (ind.target[selectedYear]) {
            ind.capaian[selectedYear][selectedPeriode] =
              (numRealisasi / ind.target[selectedYear]) * 100;
          }
        }

        // 🔤 Validasi
        if (validasi) ind.validasi[selectedYear][selectedPeriode] = validasi.toString();
      });

      setIndikator(imported);

      // 💬 Notifikasi hasil
      if (errorRows.length > 0) {
        alert(
          `⚠️ Import selesai dengan beberapa catatan:\n\n${errorRows
            .slice(0, 10)
            .join("\n")}${errorRows.length > 10 ? "\n...dan lainnya" : ""}`
        );
      } else {
        alert("✅ Data berhasil diimpor dari Excel!");
      }
    } catch (err) {
      console.error("❌ Error saat membaca Excel:", err);
      alert("❌ Terjadi kesalahan saat memproses file Excel.");
    }
  };

  reader.readAsArrayBuffer(file);
};

// ✅ DOWNLOAD TEMPLATE EXCEL
const downloadTemplateExcel = () => {
  const wsData: any[][] = [
    ["Sasaran", "Indikator", "Satuan", "Target", `Realisasi ${selectedPeriode}`, `Capaian ${selectedPeriode}`, "Validasi"],
  ];

  indikator.forEach((ind) => {
    wsData.push([
      ind.sasaran,
      ind.nama,
      ind.satuan,
      ind.target[selectedYear],
      "", // realisasi kosong, user isi sendiri
      "", // capaian otomatis
      "", // validasi manual
    ]);
  });

  wsData.push([
    "",
    "",
    "",
    "",
    "",
    "",
    "Catatan: Isi hanya kolom Realisasi. Kolom capaian & validasi otomatis saat import.",
  ]);

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template_IKK");

  // Lebar kolom
  ws["!cols"] = [
    { wch: 45 },
    { wch: 35 },
    { wch: 10 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
  ];

  // Header style (kalau pakai xlsx-style / xlsx-js-style)
  const headerCells = ["A1", "B1", "C1", "D1", "E1", "F1", "G1"];
  headerCells.forEach((cell) => {
    if (!ws[cell]) return;
    ws[cell].s = {
      fill: { fgColor: { rgb: "1E3A8A" } },
      font: { color: { rgb: "FFFFFF" }, bold: true },
      alignment: { horizontal: "center" },
    };
  });

  XLSX.writeFile(wb, `Template_IKK_${selectedYear}_${selectedPeriode}.xlsx`);
};


// 🎯 Simpan data ke API (server-side)
const handleSave = async () => {
  try {
    // langsung simpan array indikator untuk tahun terpilih
    const payload: Indikator[] = 
    indikator.map((ind) => ({
      ...ind,
      target: { ...ind.target },
      realisasi: { ...ind.realisasi },
      capaian: { ...ind.capaian },
      validasi: { ...ind.validasi },
      keterangan: ind.keterangan || "",
    }));

    const res = await saveData(String(selectedYear), payload);

    if (res.ok) {
      alert(`✅ Data indikator tahun ${selectedYear} berhasil disimpan!`);
    } else {
      alert("❌ Gagal menyimpan data.");
    }
  } catch (err) {
    console.error("❌ Gagal simpan data:", err);
    alert("❌ Terjadi kesalahan saat menyimpan data.");
  }
};

  // 🎯 Export ke Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      indikator.map((ind) => ({
        Sasaran: ind.sasaran,
        Indikator: ind.nama,
        Satuan: ind.satuan,
        Target: ind.target[selectedYear],
        [`Realisasi ${selectedPeriode}`]: ind.realisasi[selectedYear]?.[selectedPeriode] ?? "-",
        [`Capaian ${selectedPeriode}`]: ind.capaian[selectedYear]?.[selectedPeriode]
          ? ind.capaian[selectedYear]?.[selectedPeriode]?.toFixed(2) + "%"
          : "-",
          Validasi: ind.validasi[selectedYear]?.[selectedPeriode] || "-",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data IKK");
    XLSX.writeFile(wb, `IKK_${selectedYear}.xlsx`);
  };

  // 🎯 Export ke PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Indikator Kinerja Kunci - ${selectedYear} (${selectedPeriode})`, 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Sasaran", "Indikator", "Satuan", "Target", "Realisasi", "Capaian", "Validasi"]],
      body: indikator.map((ind) => [
        ind.sasaran,
        ind.nama,
        ind.satuan,
        ind.target[selectedYear],
        ind.realisasi[selectedYear]?.[selectedPeriode] ?? "-",
        ind.capaian[selectedYear]?.[selectedPeriode]
          ? ind.capaian[selectedYear]?.[selectedPeriode]?.toFixed(2) + "%"
          : "-",
          ind.validasi[selectedYear]?.[selectedPeriode] || "-",
      ]),
    });
    doc.save(`IKK_${selectedYear}_${selectedPeriode}.pdf`);
  };

    /* Helper - letakkan di atas komponen atau di file yg sama */
const getColorClasses = (color: string) => {
  // sesuaikan mapping warna yang dipakai (pastikan warna ada di tailwind)
  const map: Record<string, { bg: string; hoverBg: string; text: string }> = {
    blue: { bg: "bg-blue-50", hoverBg: "hover:bg-blue-100", text: "text-blue-800" },
    green: { bg: "bg-green-50", hoverBg: "hover:bg-green-100", text: "text-green-800" },
    yellow: { bg: "bg-yellow-50", hoverBg: "hover:bg-yellow-100", text: "text-yellow-800" },
    gray: { bg: "bg-gray-50", hoverBg: "hover:bg-gray-100", text: "text-gray-800" },
    cyan: { bg: "bg-cyan-50", hoverBg: "hover:bg-cyan-100", text: "text-cyan-800" },
    indigo: { bg: "bg-indigo-50", hoverBg: "hover:bg-indigo-100", text: "text-indigo-800" },
    red: { bg: "bg-red-50", hoverBg: "hover:bg-red-100", text: "text-red-800" },
    slate: { bg: "bg-slate-50", hoverBg: "hover:bg-slate-100", text: "text-slate-800" },
    // tambahkan sesuai kebutuhan
  };

  return map[color] ?? map["gray"];
};


return (
<div className="flex justify-center">
  <div className="glass-box min-h-screen w-full max-w-7xl mx-auto bg-slate-900 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl text-white space-y-10 py-10 px-4">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        {/* Judul */}
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">
          Form Indikator Kinerja Kunci
        </h2>

        {/* Dropdowns dan Tombol Aksi */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tahun */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-white">Tahun:</label>
            <Listbox value={selectedYear} onChange={setSelectedYear}>
              <div className="relative">
                <ListboxButton className="glass-box bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-slate-400/30 transition-transform hover:scale-105">
                  {selectedYear}
                </ListboxButton>
                <ListboxOptions className="absolute z-[9999] mt-2 w-full max-h-60 overflow-y-auto bg-slate-800/95 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl ring-1 ring-black/20 focus:outline-none">
                  {years.map((th) => (
                    <ListboxOption
                      key={th}
                      value={th}
                      className="px-4 py-2 cursor-pointer text-slate-300 data-[focus]:bg-cyan-600/30 data-[focus]:text-cyan-200 data-[selected]:font-semibold data-[selected]:text-cyan-400"
                    >
                      {th}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>

          {/* Periode */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-white whitespace-nowrap">Periode:</label>
            <Listbox value={selectedPeriode} onChange={setSelectedPeriode}>
              <div className="relative">
                <ListboxButton className="glass-box bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-slate-400/30 transition-transform hover:scale-105">
                  {selectedPeriode}
                </ListboxButton>
                <ListboxOptions className="absolute z-[9999] mt-2 w-full max-h-60 overflow-y-auto bg-slate-800/95 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl ring-1 ring-black/20 focus:outline-none">
                  {periodes.map((pr) => (
                    <ListboxOption
                      key={pr}
                      value={pr}
                      className="px-4 py-2 cursor-pointer text-slate-300 data-[focus]:bg-cyan-600/30 data-[focus]:text-cyan-200 data-[selected]:font-semibold data-[selected]:text-cyan-400"
                    >
                      {pr}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>

          {/* Tombol Import Excel */}
          <div>
            <button
              onClick={() => document.getElementById("importExcelInput")?.click()}
              className="glass-box flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-slate-400/30 transition-transform hover:scale-105"
            >
              <FileInput size={18} /> Import Excel
            </button>
            <input
              id="importExcelInput"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImportExcel}
              className="hidden"
            />
          </div>

          {/* Tombol Download Form */}
          <button
            onClick={downloadTemplateExcel}
            className="glass-box gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:to-indigo-600 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-indigo-400/30 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Download size={18} /> Download Form
          </button>
        </div>
      </div>

      {/* TABEL INPUT */}
      <div className="overflow-x-auto">
        <table className="w-full border border-slate-600 text-sm text-black bg-white rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <tr>
              <th className="border p-2">SASARAN</th>
              <th className="border p-2">INDIKATOR</th>
              <th className="border p-2">SATUAN</th>
              <th className="border p-2">TARGET</th>
              <th className="border p-2">REALISASI {selectedPeriode}</th>
              <th className="border p-2">CAPAIAN {selectedPeriode} (%)</th>
              <th className="border p-2">VALIDASI</th>
            </tr>
          </thead>

          <tbody>
            {indikator.map((ind) => (
              <tr key={ind.id} className="hover:bg-slate-100">
                <td className="border p-2">{ind.sasaran}</td>

                {/* Indikator + Tooltip */}
                <td className="border p-2">
                  <div className="flex items-center gap-2">
                    <span>{ind.nama}</span>
                    {ind.keterangan && (
                      <div className="relative group inline-block">
                        <Info className="w-5 h-5 text-cyan-500 cursor-pointer" />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-3 py-2 w-56 text-center shadow-lg z-10">
                          {ind.keterangan}
                        </div>
                      </div>
                    )}
                  </div>
                </td>

                <td className="border p-2 text-center">{ind.satuan}</td>
                <td className="border p-2 text-center">{ind.target[selectedYear]}</td>

                {/* Input Realisasi */}
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    value={ind.realisasi[selectedYear]?.[selectedPeriode] ?? ""}
                    onChange={(e) =>
                      handleInput(ind.id, selectedYear, selectedPeriode, e.target.value)
                    }
                    className="w-24 p-1 border border-slate-400 rounded-3xl text-center focus:outline-none focus:ring-2 focus:ring-cyan-400 text-black"
                  />
                </td>

                <td className="border p-2 text-center">
                  {ind.capaian[selectedYear]?.[selectedPeriode]
                    ? `${ind.capaian[selectedYear][selectedPeriode].toFixed(2)}%`
                    : "-"}
                </td>

                {/* Validasi */}
                <td className="border p-2 text-sm">
                  <div className="flex flex-col gap-1 text-slate-800">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={ind.validasi[selectedYear]?.[selectedPeriode] === "*"}
                        onChange={() =>
                          handleValidasi(ind.id, selectedYear, selectedPeriode, "*")
                        }
                      />
                      (*) Data Sementara
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={ind.validasi[selectedYear]?.[selectedPeriode] === "valid"}
                        onChange={() =>
                          handleValidasi(ind.id, selectedYear, selectedPeriode, "valid")
                        }
                      />
                      ✅ Data Validasi
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOMBOL AKSI */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={handleSave}
            className="glass-box flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:to-blue-600 px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-cyan-400/30 transition-transform hover:scale-105"
          >
            <Save size={18} /> Simpan
          </button>
          <button
            onClick={exportPDF}
            className="glass-box flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:to-pink-600 px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-pink-400/30 transition-transform hover:scale-105"
          >
            <FileCode2 size={18} /> Export PDF
          </button>
          <button
            onClick={exportExcel}
            className="glass-box flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:to-emerald-600 px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-emerald-400/30 transition-transform hover:scale-105"
          >
            <FileSpreadsheet size={18} /> Export Excel
          </button>
          <button
            onClick={() => router.back()}
            className="glass-box flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-slate-400/30 transition-transform hover:scale-105"
          >
            <ArrowLeft size={18} /> Kembali
          </button>
      </div>
    </div>
  </div>
  );
}