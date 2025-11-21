"use client";

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import { Indikator } from "@/types/indikator";
import { motion, AnimatePresence } from "framer-motion";
import autoTable from "jspdf-autotable";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { FileCode2, FileSpreadsheet, ArrowLeft, Save, Download, FileInput, Info } from "lucide-react"


// ✅ Import Server Actions (LowDB)
import { getData, saveData } from "@/actions/ekonomiBiruActions";
// ✅ Import type EkonomiBiruEntry
import type { EkonomiBiruEntry } from "@/actions/ekonomiBiruActions";


type SubPilar = {
  id: string;
  title: string;
  indikator: Indikator[];
  weight?: number;              //bobot subpilar
  adjustmentFactor?: number;    //faktor penyesuaian subpilar
};

type Pilar = {
  id: string;
  title: string;
  color: string;
  subPilar: SubPilar[];
  weight?: number;              //bobot pilar
  adjustmentFactor?: number;    //faktor penyesuaian pilar
};

export default function IndeksEkonomiBiruForm() {
  const router = useRouter();
  const tahunOptions = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  const [dataByYear, setDataByYear] = useState<Record<number, Pilar[]>>({});
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [pilarList, setPilarList] = useState<Pilar[]>([]);
  const [openPilar, setOpenPilar] = useState<string | null>(null);



  // ----------------- Muat data dari Server Actions -----------------
  useEffect(() => {
    async function loadData() {
      try {
        const result: Record<string, EkonomiBiruEntry[]> | null = await getData("ekonomiBiru");
        if (!result) return;
  
        const normalized: Record<number, Pilar[]> = {};
        const pilarColors: Record<string, string> = {
          "Pilar Ekonomi": "blue",
          "Pilar Lingkungan": "green",
          "Pilar Sosial": "yellow",
        };
  
        const initialPilarList = getInitialPilarList();
  
        // 🧩 Helper agar selaras dengan handleSave
        const pickValue = (input: number | undefined, fallback: number | undefined) =>
          input && input !== 1 ? input : fallback ?? 1;
  
        for (const [year, entries] of Object.entries(result)) {
          const pilarMap: Record<string, Pilar> = {};
  
          entries.forEach((e) => {
            const initPilar = initialPilarList.find((ip) => ip.title === e.pilar);
            const pilarKey = initPilar?.id ?? e.pilar;
  
            let p = pilarMap[pilarKey];
            if (!p) {
              p = {
                id: pilarKey,
                title: e.pilar,
                color: pilarColors[e.pilar] ?? "gray",
                weight: pickValue((e as any).pilarWeight, initPilar?.weight),
                adjustmentFactor: pickValue((e as any).pilarAdjustmentFactor, initPilar?.adjustmentFactor),
                subPilar: [],
              };
              pilarMap[pilarKey] = p;
            }
  
            const initSub = initPilar?.subPilar.find((s) => s.title === e.subPilar);
            const subKey = initSub?.id ?? e.subPilar;
  
            let sub = p.subPilar.find((s) => s.id === subKey);
            if (!sub) {
              sub = {
                id: subKey,
                title: e.subPilar,
                indikator: [],
                weight: pickValue((e as any).subWeight, initSub?.weight),
                adjustmentFactor: pickValue((e as any).subAdjustmentFactor, initSub?.adjustmentFactor),
              };
              p.subPilar.push(sub);
            }
  
            const initInd = initSub?.indikator.find((ii) => ii.label === e.indikator);
            const indikatorId = initInd?.id ?? e.indikator;
  
            sub.indikator.push({
              id: indikatorId,
              label: e.indikator,
              rawValue: e.nilai ?? 0,
              standarizedValue: standardize(indikatorId, e.nilai ?? 0),
              weight: pickValue((e as any).indikatorWeight, initInd?.weight),
              keterangan: e.keterangan ?? "",
            });
          });
  
          normalized[Number(year)] = Object.values(pilarMap);
        }
  
        setDataByYear(normalized);
        setPilarList(normalized[selectedYear] ?? getInitialPilarList());
      } catch (err) {
        console.error("❌ Gagal memuat data:", err);
      }
    }
  
    loadData();
  }, [selectedYear]);
  


// --------------------------------------------------------------------

   // Fungsi standarisasi sesuai tabel Excel
   const standardize = (indikatorId: string, raw: number) => {
    if (!raw || raw <= 0) return 0;

    switch (indikatorId) {
      // Ekonomi
      case "pdrb": // %
        return raw / 1
      case "akuakultur": // ton → ratus ribu ton
        return raw / 100000
      case "tambak": // ton → ratus ribu ton
        return raw / 100000
      case "produksi": // ton → ratus ribu ton
        return raw / 100000
      case "rumputlaut": // ton → ratus ribu ton
        return raw / 100000

      case "eksporolahan": // ton → puluh ribu ton
        return raw / 10000
      case "garam": // ton → puluh ribu ton
        return raw / 10000
      case "kapalpenangkap": // juta unit → ribu unit
        return raw / 1000

      case "angkutanlaut": // juta ton → puluh juta ton
        return raw / 1000000000
      case "penumpang": // ribu orang → ratus ribu orang
        return raw / 100000
      case "penumpangstrategis":
        return raw / 100000
      case "eksporperikanan":
        return raw / 10000
      case "kontribusdiekspor":
        return raw / 1
      case "eksporhidup":
        return raw / 10000

      case "wisatabahari":
        return raw / 10
      case "wisatatirta":
        return raw / 10

      case "kapaltangkap":
        return raw / 100

      case "pelelanganikan":
        return raw / 1
      
      // Lingkungan
      case "terumbu":
        return raw / 1
      case "lamun":
        return raw / 1
      case "mangrove":
        return raw / 1
      case "desaTPS":
        return raw / 10
      case "tempatbuangair":
        return raw / 10
      case "rehabilitasi":
        return raw / 10
      case "kawasan":
        return raw / 1000000
      case "sampahlaut":
        return raw / 1
      case "sampahdarat":
        return raw / 1
      
      case "listriksurya":
        return raw / 1
      case "hasillistriksurya":
        return raw / 1
      case "listrikair":
        return raw / 100
      case "hasillistrikair":
        return raw / 100
    
      // Sosial
      case "nelayan":
        return raw / 10000
      case "pekerjaperempuan":
        return raw / 10000
      case "PKH":
        return raw / 1

      case "lulusan":
        return raw / 100
      case "pelatihan":
        return raw / 100
      case "SMK":
        return raw / 10
      case "pendidikanSMA":
        return raw / 1
      case "pendidikanijazah":
        return raw / 1
      case "PIP":
        return raw / 1

      case "kalori":
        return raw / 10
      case "protein":
        return raw / 1
      case "pekerja":
        return raw / 1
      case "kemiskinan":
        return raw / 1

      default:
        return raw;
    }
  };

  const getInitialPilarList = (): Pilar[] => [
    {
      id: "ekonomi",
      title: "Pilar Ekonomi",
      color: "blue",
      weight: 0.5625,
      adjustmentFactor: 0.5078,
      subPilar: [
        {
          id: "perikanan",
          title: "Subpilar Perikanan Tangkap & Budidaya",
          weight: 0.3468,
          adjustmentFactor: 2.09737521529731,
          indikator: [
            { id: "pdrb", label: "Peran sektor perikanan dalam PDB (%)", rawValue: 0, standarizedValue: 0, weight: 0.2134},
            { id: "akuakultur", label: "Volume produksi akuakultur laut (Ton)", rawValue: 0, standarizedValue: 0, weight: 0.5512},
            { id: "tambak", label: "Volume produksi budidaya tambak (Ton)", rawValue: 0, standarizedValue: 0, weight: 0.5306},
            { id: "produksi", label: "Volume produksi perikanan (Ton)", rawValue: 0, standarizedValue: 0, weight: 0.1280},
            { id: "rumputlaut", label: "Volume produksi budidaya rumput laut (Ton)", rawValue: 0, standarizedValue: 0, weight: 0.5939},
          ],
        },
        {
          id: "industri",
          title: "Subpilar Industri Berbasis Kelautan",
          weight: 0.5391,
          adjustmentFactor: 1.18875,
          indikator: [
            { id: "eksporolahan", label: "Volume ekspor ikan olahan (Ton)", rawValue: 0, standarizedValue: 0, weight: 0.5772},
            { id: "garam", label: "Volume produksi garam (Ton)", rawValue: 0, standarizedValue: 0, weight: 0.6389},
            { id: "kapalpenangkap", label: "Jumlah perahu/kapal penangkap ikan (Unit)", rawValue: 0, standarizedValue: 0, weight: 0.5085},
          ],
        },
        {
          id: "perdagangan",
          title: "Subpilar Perdagangan, Transportasi dan Logistik",
          weight: 0.4414,
          adjustmentFactor: 1.50284854705617,
          indikator: [
            { id: "angkutanlaut", label: "Volume angkutan laut (Ton)", rawValue: 0, standarizedValue: 0, weight: 0.0254},
            { id: "penumpang", label: "Jumlah penumpang angkutan laut (Orang)", rawValue: 0, standarizedValue: 0, weight: 0.3969},
            { id: "penumpangstrategis", label: "Jumlah penumpang angkutan laut di 25 pelabuhan strategis (Orang)", rawValue: 0, standarizedValue: 0, weight: 0.5105},
            { id: "eksporperikanan", label: "Volume ekspor perikanan (Ton)", rawValue: 0, standarizedValue: 0, weight: 0.4419},
            { id: "kontribusdiekspor", label: "Kontribusi ekspor produk perikanan terhadap total ekspor (%)", rawValue: 0, standarizedValue: 0, weight: 0.3429},
            { id: "eksporhidup", label: "Volume ekspor perikanan hidup dan segar (Ton)", rawValue: 0, standarizedValue: 0, weight: 0.5180},
          ],
        },
        {
          id: "pariwisata",
          title: "Subpilar Pariwisata Berbasis Kelautan",
          weight: 0.5052,
          adjustmentFactor: 5.3975,
          indikator: [
            { id: "wisatabahari", label: "Jumlah wisata bahari (Titik)", rawValue: 0, standarizedValue: 0, weight: 0.7071},
            { id: "wisatatirta", label: "Jumlah usaha/perusahaan wisata tirta komersial (Usaha)", rawValue: 0, standarizedValue: 0, weight: 0.7071},
          ],
        },
        {
          id: "teknologi",
          title: "Subpilar Teknologi",
          weight: 0.0929,
          adjustmentFactor: 3.384,
          indikator: [
            { id: "kapaltangkap", label: "Jumlah kapal perikanan tangkap laut - kapal motor > 30 GT(Unit)", rawValue: 0, standarizedValue: 0, weight: 1},
          ],
        },
        {
          id: "tatakelola",
          title: "Subpilar Tatakelola",
          weight: 0.3611,
          adjustmentFactor: 1.26576923076923, 
          indikator: [
            { id: "pelelanganikan", label: "Jumlah pelabuhan perikanan dengan Tempat Pelelangan Ikan (Pelabuhan)", rawValue: 0, standarizedValue: 0, weight: 1},
          ],
        },
      ],
    },
    {
      id: "lingkungan",
      title: "Pilar Lingkungan",
      color: "green",
      weight: 0.6371,
      adjustmentFactor: 1.09453,
      subPilar: [
        {
          id: "konservasi",
          title: "Subpilar Kualitas Sumber Daya dan Konservasi Laut",
          weight: 0.7071,
          adjustmentFactor: 0.792882109684679,
          indikator: [
            { id: "terumbu", label: "Kawasan terumbu karang berkualitas baik (%)", rawValue: 0, standarizedValue: 0, weight: 0.0921},
            { id: "lamun", label: "Kawasan lamun berkualitas baik (%)", rawValue: 0, standarizedValue: 0, weight: 0.2119},
            { id: "mangrove", label: "Kawasan hutan mangrove berkualitas baik (%)", rawValue: 0, standarizedValue: 0, weight: 0.0078},
            { id: "desaTPS", label: "Jumlah desa pesisir dengan tempat pembuangan sampah (Desa)", rawValue: 0, standarizedValue: 0, weight: 0.4625},
            { id: "tempatbuangair", label: "Jumlah desa pesisir dengan tempat buang air besar (Desa)", rawValue: 0, standarizedValue: 0, weight: 0.5129},
            { id: "rehabilitasi", label: "Penanaman/rehabilitasi hutan mangrove, rawa, dan lahan gambut (Ha)", rawValue: 0, standarizedValue: 0, weight: 0.1677},
            { id: "kawasan", label: "Luas kawasan konservasi perairan (Ha)", rawValue: 0, standarizedValue: 0, weight: 0.5439},
            { id: "sampahlaut", label: "Inversed Jumlah Sampah dibuang di Laut (gr/m^2)", rawValue: 0, standarizedValue: 0, weight: 0.3674},
            { id: "sampahdarat", label: "Inversed Jumlah Sampah dibuang di darat (Ton/Tahun)", rawValue: 0, standarizedValue: 0, weight: 0.1029},
          ],
        },
        {
          id: "energi",
          title: "Subpilar Energi Terbaharukan",
          weight: 0.7071,
          adjustmentFactor: 1.7165,
          indikator: [
            { id: "listriksurya", label: "Kapasitas terpasang Pembangkit Listrik Tenaga Surya (MW)", rawValue: 0, standarizedValue: 0, weight: 0.4902},
            { id: "hasillistriksurya", label: "Listrik yang dihasilkan oleh Pembangkit Listrik Tenaga Surya (GWh)",rawValue: 0, standarizedValue: 0, weight: 0.4837},
            { id: "listrikair", label: "Kapasitas terpasang Pembangkit Listrik Tenaga Air (MW)", rawValue: 0, standarizedValue: 0, weight: 0.5299},
            { id: "hasillistrikair", label: "Listrik yang dihasilkan oleh Pembangkit Listrik Tenaga Air (GWh)", rawValue: 0, standarizedValue: 0, weight: 0.4948},
          ],
        },
      ],
    },
    {
      id: "sosial",
      title: "Pilar Sosial",
      color: "yellow",
      weight: 0.5269,
      adjustmentFactor: 0.7554,
      subPilar: [
        {
          id: "kesejahteraan",
          title: "Subpilar Kesejahteraan",
          weight: 0.2535,
          adjustmentFactor: 8.11434316334437,
          indikator: [
            { id: "nelayan", label: "Jumlah nelayan dan pembudidaya ikan (Orang)", rawValue: 0, standarizedValue: 0, weight: 0.1043},
            { id: "pekerjaperempuan", label: "Jumlah pekerja perempuan di sektor perikanan (Orang)", rawValue: 0, standarizedValue: 0, weight: 0.1043},
            { id: "PKH", label: "Inversed persentase keluarga sektor perikanan penerima Program Keluarga Harapan (%)", rawValue: 0, standarizedValue: 0, weight: 0.9891},
          ],
        },
        {
          id: "pendidikan",
          title: "Subpilar Pendidikan",
          weight: 0.1911,
          adjustmentFactor: 3.2841,
          indikator: [
            { id: "lulusan", label: "Jumlah lulusan sekolah perikanan (Orang)", rawValue: 0, standarizedValue: 0, weight: 0.3357 },
            { id: "pelatihan", label: "Jumlah peserta pelatihan perikanan (Orang)", rawValue: 0, standarizedValue: 0, weight: 0.3936 },
            { id: "SMK", label: "Jumlah SMK kemaritiman (Sekolah)", rawValue: 0, standarizedValue: 0, weight: 0.5108 },
            { id: "pendidikanSMA", label: "Persentase penduduk sektor perikanan dengan pendidikan terakhir SMA atau sederajat (%)", rawValue: 0, standarizedValue: 0, weight: 0.4845 },
            { id: "pendidikanijazah", label: "Persentase penduduk di sektor perikanan dengan ijazah minimal SMA atau sederajat (%)", rawValue: 0, standarizedValue: 0, weight: 0.4816 },
            { id: "PIP", label: "Inversed Persentase penduduk di sektor perikanan penerima Program Indonesia Pintar (%)", rawValue: 0, standarizedValue: 0, weight: 0.0695 },
          ],
        },
        {
          id: "kesehatan",
          title: "Subpilar Kesehatan",
          weight: 0.9483,
          adjustmentFactor: 5.6630285600693,
          indikator: [
            { id: "kalori", label: "Rata-rata konsumsi kalori ikan per kapita (kkal/hari)", rawValue: 0, standarizedValue: 0, weight: 0.6073 },
            { id: "protein", label: "Rata-rata konsumsi protein dari ikan per kapita (kkal/hari)", rawValue: 0, standarizedValue: 0, weight: 0.5942 },
            { id: "pekerja", label: "Persentase penduduk bekerja di sektor perikanan yang memiliki jaminan kesehatan (%)", rawValue: 0, standarizedValue: 0, weight: 0.5266 },
            { id: "kemiskinan", label: "Inversed Persentase Penduduk Pesisir yang Hidup di Bawah Garis Kemiskinan (%)", rawValue: 0, standarizedValue: 0, weight: 0.0289 },
          ],
        },
      ],
    },
  ];


const currentPilarList = dataByYear[selectedYear] || getInitialPilarList();

const updatePilarList = (newList: Pilar[]) => {
  setDataByYear((prev) => ({ ...prev, [selectedYear]: newList }));
};

const togglePilar = (id: string) => {
  if (openPilar === id) {
    setOpenPilar(null);
    return;
  }

  setOpenPilar(id);

  // Scroll halus ke posisi pilar yang baru dibuka, dengan offset header
  setTimeout(() => {
    const el = document.getElementById(`pilar-${id}`);
    if (el) {
      const headerOffset = 80; // tinggi header/dropdown di atas
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      // Scroll manual dengan durasi (misal: 200ms)
      const startY = window.scrollY;
      const distance = offsetPosition - startY;
      const duration = 50; // <=== ubah di sini untuk mempercepat/lambatkan (ms)
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        window.scrollTo(0, startY + distance * ease);

        if (elapsed < duration) requestAnimationFrame(animateScroll);
      };

      requestAnimationFrame(animateScroll);
    }
  }, 100);
};


  // Update rawValue + hitung standarizedValue
  const handleChange = (
    pilarId: string,
    subPilarId: string,
    indikatorId: string,
    newRawValue: number
  ) => {
    setPilarList(
      pilarList.map((p) =>
        p.id === pilarId
          ? {
              ...p,
              subPilar: p.subPilar.map((s) =>
                s.id === subPilarId
                  ? {
                      ...s,
                      indikator: s.indikator.map((i) =>
                        i.id === indikatorId
                          ? {
                              ...i,
                              rawValue: newRawValue,
                              standarizedValue: standardize(
                                indikatorId,
                                newRawValue
                              ),
                            }
                          : i
                      ),
                    }
                  : s
              ),
            }
          : p
      )
    );
  };

// ✅ Hitung nilai SubPilar: (Σ (indikator × weight)) × adjustmentFactor
const calculateSubPilar = (sub: SubPilar): number => {
  if (!sub?.indikator || sub.indikator.length === 0) return 0;

  // Σ(Standarized × Weight)
  const indikatorSum = sub.indikator.reduce(
    (total, i) => total + (i.standarizedValue ?? 0) * (i.weight ?? 0),
    0
  );

  // (Σ(Indikator × Weight)) × Adjustment Factor
  return indikatorSum * (sub.adjustmentFactor ?? 1);
};

// ✅ Hitung nilai Pilar: (Σ (SubPilar × weight)) × adjustmentFactor
const calculatePilar = (p: Pilar): number => {
  if (!p?.subPilar || p.subPilar.length === 0) return 0;

  // Σ(SubPilar × Weight)
  const subPilarSum = p.subPilar.reduce(
    (total, s) => total + calculateSubPilar(s) * (s.weight ?? 0),
    0
  );

  // (Σ(SubPilar × Weight)) × Adjustment Factor
  return subPilarSum * (p.adjustmentFactor ?? 1);
};

// ✅ Hitung total Indeks: (Σ (Pilar × weight)) × adjustmentFactor
const calculateTotal = (list: Pilar[], totalAdjustmentFactor = 1): number => {
  if (!Array.isArray(list) || list.length === 0) return 0;

  // Σ(Pilar × Weight)
  const totalSum = list.reduce(
    (acc, p) => acc + calculatePilar(p) * (p.weight ?? 1),
    0
  );

  // (Σ(Pilar × Weight)) × Adjustment Factor
  return totalSum * totalAdjustmentFactor;
};

// ✅ Hasil per pilar
const pilarScores = pilarList.map((p) => ({
  id: p.id,
  title: p.title,
  score: calculatePilar(p),
  color: p.color,
}));

// ✅ Adjustment Factor total indeks (bisa disesuaikan dari data)
const totalAdjustmentFactor = 0.59273736443683;
const totalIndeks = calculateTotal(pilarList, totalAdjustmentFactor);


// ✅ EXPORT PDF
const exportPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Laporan Indeks Ekonomi Biru - Tahun ${selectedYear}`, 10, 15);

  const tableData: any[] = [];

  pilarList.forEach((p) => {
    tableData.push([`📘 ${p.title}`, "", "", "", ""]);
    p.subPilar.forEach((s) => {
      tableData.push([`  ↳ ${s.title}`, "", "", "", ""]);
      s.indikator.forEach((i) => {
        tableData.push([
          "",
          `• ${i.label}`,
          i.rawValue?.toString() ?? "-",
          i.standarizedValue?.toFixed(3) ?? "0.000",
          i.weight?.toString() ?? "-",
        ]);
      });
    });
    tableData.push([
      "",
      "Subtotal Pilar",
      "",
      calculatePilar(p).toFixed(3),
      "",
    ]);
    tableData.push(["", "", "", "", ""]); // spasi antar pilar
  });

  tableData.push(["", "TOTAL INDEKS", "", totalIndeks.toFixed(3), ""]);

  autoTable(doc, {
    head: [["Pilar/Subpilar", "Indikator", "Nilai Asli", "Standarisasi", "Weight"]],
    body: tableData,
    startY: 25,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [25, 118, 210] },
  });

  doc.save(`IndeksEkonomiBiru_${selectedYear}.pdf`);
};

// ✅ EXPORT EXCEL
const exportExcel = () => {
  const wsData: any[][] = [
    ["Pilar", "Subpilar", "Indikator", "Nilai Asli", "Standarisasi", "Weight"],
  ];

  pilarList.forEach((p) => {
    p.subPilar.forEach((s) => {
      s.indikator.forEach((i) => {
        wsData.push([
          p.title,
          s.title,
          i.label,
          i.rawValue ?? "",
          i.standarizedValue?.toFixed(3) ?? "",
          i.weight ?? "",
        ]);
      });
    });
    wsData.push(["", "", `Subtotal ${p.title}`, "", calculatePilar(p).toFixed(3), ""]);
    wsData.push(["", "", "", "", "", ""]); // pemisah antar pilar
  });

  wsData.push(["", "", "TOTAL INDEKS", "", totalIndeks.toFixed(3), ""]);

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Indeks_${selectedYear}`);

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([excelBuffer]), `IndeksEkonomiBiru_${selectedYear}.xlsx`);
};


// ✅ IMPORT EXCEL (Versi Aman dan Lengkap)
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

      // 🔍 Validasi header (pastikan sesuai format template)
      const header = rows[0].map((h: any) => h?.toString().trim());
      const expectedHeader = [
        "Pilar",
        "Subpilar",
        "Indikator",
        "Nilai Asli",
        "Standarisasi",
        "Weight",
      ];

      const isHeaderValid =
        expectedHeader.every((h, idx) => header[idx] === h) &&
        header.length >= expectedHeader.length;

      if (!isHeaderValid) {
        alert(
          "⚠️ Format Excel tidak sesuai.\nPastikan urutan kolom seperti berikut:\n\nPilar | Subpilar | Indikator | Nilai Asli | Standarisasi | Weight"
        );
        return;
      }

      // 🔄 Clone data asli biar tidak merusak state langsung
      const imported = JSON.parse(JSON.stringify(pilarList));
      const errorRows: string[] = [];

      rows.slice(1).forEach((row: any[], rowIndex) => {
        const [pilarName, subName, indikatorName, rawValue] = row;

        if (!pilarName || !subName || !indikatorName) return;

        const pilar = imported.find(
          (p: any) => p.title.trim() === pilarName.trim()
        );
        if (!pilar) {
          errorRows.push(`Baris ${rowIndex + 2}: Pilar "${pilarName}" tidak ditemukan`);
          return;
        }

        const sub = pilar.subPilar.find(
          (s: any) => s.title.trim() === subName.trim()
        );
        if (!sub) {
          errorRows.push(`Baris ${rowIndex + 2}: Subpilar "${subName}" tidak ditemukan`);
          return;
        }

        const indikator = sub.indikator.find(
          (i: any) => i.label.trim() === indikatorName.trim()
        );
        if (!indikator) {
          errorRows.push(`Baris ${rowIndex + 2}: Indikator "${indikatorName}" tidak ditemukan`);
          return;
        }

        const numericValue = parseFloat(rawValue);
        if (isNaN(numericValue)) {
          errorRows.push(`Baris ${rowIndex + 2}: Nilai Asli tidak valid (${rawValue})`);
          return;
        }

        // ✅ Update nilai indikator
        indikator.rawValue = numericValue;
        indikator.standarizedValue = standardize(indikator.id, numericValue);
      });

      setPilarList(imported);

      // 💬 Hasil import
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
  // Header kolom
  const wsData: any[][] = [
    ["Pilar", "Subpilar", "Indikator", "Nilai Asli", "Standarisasi", "Weight"],
  ];

  // Isi otomatis dari struktur pilarList
  pilarList.forEach((p) => {
    p.subPilar.forEach((s) => {
      s.indikator.forEach((i) => {
        wsData.push([
          p.title,
          s.title,
          i.label,
          "", // kosong agar user bisa isi sendiri
          "", // standarisasi otomatis nanti saat import
          i.weight ?? "",
        ]);
      });
    });
    wsData.push(["", "", "", "", "", ""]); // baris kosong pemisah antar pilar
  });

  // Tambahkan catatan di akhir
  wsData.push([
    "",
    "",
    "Catatan:",
    "Isi hanya kolom 'Nilai Asli'. Kolom lain akan dihitung otomatis.",
  ]);

  // Buat worksheet & workbook
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template_Indeks");

  // Lebar kolom otomatis
  const colWidths = [
    { wch: 20 },
    { wch: 25 },
    { wch: 40 },
    { wch: 15 },
    { wch: 15 },
    { wch: 10 },
  ];
  ws["!cols"] = colWidths;

  // Tambahkan warna pada header
  const headerCells = ["A1", "B1", "C1", "D1", "E1", "F1"];
  headerCells.forEach((cell) => {
    if (!ws[cell]) return;
    ws[cell].s = {
      fill: { fgColor: { rgb: "1E3A8A" } }, // warna biru tua
      font: { color: { rgb: "FFFFFF" }, bold: true },
      alignment: { horizontal: "center" },
    };
  });

  // Simpan file
  XLSX.writeFile(wb, "Template_Indeks_Ekonomi_Biru.xlsx");
};


 // ----------------- Fungsi Simpan ----------------
 const handleSave = async () => {
  try {
    const payload: EkonomiBiruEntry[] = [];
    const initialPilarList = getInitialPilarList(); // ambil struktur default

    // 🧩 Helper function untuk memilih weight / adjustment factor
    const pickValue = (input: number | undefined, fallback: number | undefined) =>
      input && input !== 1 ? input : fallback ?? 1;

    pilarList.forEach((p) => {
      const initPilar = initialPilarList.find((ip) => ip.title === p.title);

      p.subPilar.forEach((s) => {
        const initSub = initPilar?.subPilar.find((is) => is.title === s.title);

        s.indikator.forEach((i) => {
          const initInd = initSub?.indikator.find((ii) => ii.label === i.label);

          payload.push({
            id: `${p.id}-${s.id}-${i.id}`,
            pilar: p.title,
            pilarWeight: pickValue(p.weight, initPilar?.weight),
            pilarAdjustmentFactor: pickValue(p.adjustmentFactor, initPilar?.adjustmentFactor),

            subPilar: s.title,
            subWeight: pickValue(s.weight, initSub?.weight),
            subAdjustmentFactor: pickValue(s.adjustmentFactor, initSub?.adjustmentFactor),

            indikator: i.label,
            indikatorWeight: pickValue(i.weight, initInd?.weight),
            nilai: i.rawValue ?? null,

            standar:
              i.standarizedValue ??
              (typeof standardize === "function"
                ? standardize(i.id, i.rawValue)
                : null),

            keterangan: (i as any)?.keterangan ?? "",
          });
        });
      });
    });

    console.log("🟢 Saving payload:", JSON.stringify(payload, null, 2));
    const res = await saveData(String(selectedYear), payload);

    if (res?.ok) {
      alert(`✅ Data tahun ${selectedYear} berhasil disimpan!`);
    } else {
      alert("❌ Gagal menyimpan data.");
    }
  } catch (err) {
    console.error("❌ Gagal simpan data:", err);
    alert("⚠️ Terjadi kesalahan saat menyimpan data.");
  }
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
  <div className="glass-box min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-10 rounded-3xl">
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        {/* Judul di kiri */}
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">
          Indeks Ekonomi Biru
        </h2>

            {/* Kanan: Dropdown + Import Excel */}
            <div className="flex items-center gap-3">
              {/* Dropdown Tahun */}
              <Listbox value={selectedYear} onChange={setSelectedYear}>
                <div className="relative">
                  <ListboxButton className="glass-box bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-slate-400/30 flex items-center transition-transform hover:scale-105">
                    {selectedYear}
                  </ListboxButton>

                  <ListboxOptions
                    className="absolute z-[9999] mt-2 w-full max-h-60 overflow-y-auto 
                              bg-slate-800/95 backdrop-blur-md rounded-xl border border-slate-700/50 
                              shadow-2xl ring-1 ring-black/20 focus:outline-none"
                  >
                    {tahunOptions.map((th) => (
                      <ListboxOption
                        key={th}
                        value={th}
                        className="px-4 py-2 cursor-pointer text-slate-300
                                  data-[focus]:bg-cyan-600/30 data-[focus]:text-cyan-200
                                  data-[selected]:font-semibold data-[selected]:text-cyan-400"
                      >
                        {th}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>

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

          {/* Tombol Download Template Excel */}
          <button
            onClick={downloadTemplateExcel}
            className="glass-box gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:to-indigo-600 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-indigo-400/30 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Download size={18} /> Download Form
          </button>
        </div>
      </div>


        {/* FORM */}
        <div className="space-y-6">
          {pilarList.map((p) => (
            <motion.div
              key={p.id}
              id={`pilar-${p.id}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`
                glass-card backdrop-blur-xl bg-slate-800/40 border border-slate-700/60 
                rounded-2xl shadow-lg overflow-hidden 
                transition-transform duration-100
                ${openPilar === p.id 
                  ? "scale-100" 
                  : "hover:scale-103 hover:bg-slate-900 hover:shadow-slate-400/10"
                }
              `}
            >
              {/* HEADER PILAR */}
              <button
                onClick={() => togglePilar(p.id)}
                className={`w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-${p.color}-600/40 to-${p.color}-800/30 hover:from-${p.color}-500/50 rounded-t-xl transition`}
              >
                <span className="text-lg font-semibold tracking-wide">{p.title}</span>
                <span className="text-sm opacity-80">
                  {openPilar === p.id ? "▲ Tutup" : "▼ Buka"}
                </span>
              </button>

              {/* ANIMASI KONTEN PILAR */}
              <AnimatePresence initial={false}>
                {openPilar === p.id && (
                  <motion.div
                    key={`content-${p.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    className="overflow-visible"
                  >
                    <div className="p-6 space-y-6">
                      {/* Info Pilar */}
                      <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 shadow-inner">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-cyan-300">Info Pilar</p>

                          {/* Tooltip Pilar */}
                            <div className="relative group inline-block">
                              {/* Ikon Info */}
                              <Info className="w-5 h-5 text-cyan-400 cursor-pointer" />
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-3 py-2 w-56 text-center shadow-lg z-10">
                              (Σ Subpilar × Weight Sub Pilar) × Adjustment Factor Pilar
                            </div>
                          </div>
                        </div>
                        <p>Weight: <b>{p.weight}</b></p>
                        <p>Adjustment Factor: <b>{p.adjustmentFactor}</b></p>
                      </div>

                      {/* SUBPILAR */}
                      {p.subPilar.map((s) => (
                        <div
                          key={s.id}
                          className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4 hover:bg-slate-800/50 transition-colors"
                        >
                          <h4 className="text-md font-semibold text-cyan-200 flex items-center gap-2">
                            {s.title}

                            {/* Tooltip Subpilar */}
                            <div className="relative group inline-block">
                              {/* Ikon Info */}
                              <Info className="w-5 h-5 text-cyan-400 cursor-pointer" />
                              <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-3 py-2 w-56 text-center shadow-lg z-10">
                                (Σ Indikator Standarisasi × Weight Indikator) × Adjustment Factor Sub Pilar
                              </div>
                            </div>
                          </h4>

                          <div className="text-xs text-slate-400 mb-2">
                            Weight: <b>{s.weight}</b> | Adjustment: <b>{s.adjustmentFactor}</b>
                          </div>

                          {s.indikator.map((i) => (
                            <div key={i.id} className="flex flex-col gap-1">
                              <label className="text-sm text-slate-300">{i.label}</label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="number"
                                  value={i.rawValue === 0 ? "" : i.rawValue}
                                  placeholder="0"
                                  onFocus={(e) => {
                                    if (e.target.value === "0") e.target.value = "";
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value === "") handleChange(p.id, s.id, i.id, 0);
                                  }}
                                  onChange={(e) => {
                                    const val =
                                      e.target.value === "" ? 0 : parseFloat(e.target.value);
                                    handleChange(p.id, s.id, i.id, val || 0);
                                  }}
                                  className="glass-input w-36 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none px-3 py-2 shadow-sm"
                                />
                                <span className="text-sm text-green-300">
                                  Standarisasi: <b>{i.standarizedValue?.toFixed(3) ?? "0.000"}</b>
                                </span>
                                <span className="text-xs text-slate-400">
                                  weight: {i.weight}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      {/* PREVIEW */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-10 text-center space-y-6"
      >
        <h3 className="text-2xl font-bold text-cyan-400">
          Hasil Perhitungan {selectedYear}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pilarScores.map((p) => (
            <div
              key={p.id}
              className="glass-box rounded-2xl bg-slate-800/60 border border-slate-700 shadow-lg p-5 transition-all"
            >
              <p className="text-sm text-slate-400">{p.title}</p>
              <p className="text-3xl font-extrabold text-white">
                {p.score.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="glass-box mt-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl py-6 px-8 shadow-xl transition-all">
          <h4 className="text-sm text-white/90">Total Indeks Ekonomi Biru</h4>
          <p className="text-4xl font-extrabold text-white drop-shadow-lg">
            {totalIndeks.toFixed(2)}
          </p>
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
      </motion.div>
    </div>
  </div>
);
}
