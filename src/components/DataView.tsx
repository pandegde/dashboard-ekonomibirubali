"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileSpreadsheet, FileCode2, } from "lucide-react";
import { EkonomiBiruEntry } from "@/types/indikator";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";

// Struktur internal DataView
interface IndikatorItem {
  id: string;
  label: string;
  rawValue: number;
  standarizedValue: number;
  weight: number;
}

interface SubPilar {
  id: string;
  title: string;
  indikator: IndikatorItem[];
  weight?: number;
  adjustmentFactor?: number;
}

interface Pilar {
  id: string;
  title: string;
  color: string;
  subPilar: SubPilar[];
  weight?: number;
  adjustmentFactor?: number;
}

interface DataViewProps {
  dataByYear: Record<number, EkonomiBiruEntry[]>;
}

export default function DataView({ dataByYear }: DataViewProps) {
  const tahunOptions = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
const [selectedYear, setSelectedYear] = useState<number>(2024);

  const [tahunData, setTahunData] = useState<Pilar[]>([]);

  // 🧩 Konversi EkonomiBiruEntry → Pilar[]
  useEffect(() => {
    const entries = dataByYear[selectedYear] || [];
    const pilarMap = new Map<string, Pilar>();

    const pilarColors: Record<string, string> = {
      "Pilar Ekonomi": "blue",
      "Pilar Lingkungan": "green",
      "Pilar Sosial": "yellow",
    };

    entries.forEach((e: any) => {
      if (!pilarMap.has(e.pilar)) {
        pilarMap.set(e.pilar, {
          id: String(e.pilar),
          title: e.pilar,
          color: pilarColors[e.pilar] ?? "gray",
          subPilar: [],
          weight: Number(e.pilarWeight ?? 1),
          adjustmentFactor: Number(e.pilarAdjustmentFactor ?? 1),
        });
      }

      const pilar = pilarMap.get(e.pilar)!;

      let sub = pilar.subPilar.find((s) => s.title === e.subPilar);
      if (!sub) {
        sub = {
          id: String(e.subPilar),
          title: e.subPilar,
          indikator: [],
          weight: Number(e.subWeight ?? 1),
          adjustmentFactor: Number(e.subAdjustmentFactor ?? 1),
        };
        pilar.subPilar.push(sub);
      }

      sub.indikator.push({
        id: String(e.id ?? `${e.pilar}-${e.subPilar}-${e.indikator}`),
        label: e.indikator,
        rawValue: Number(e.nilai ?? e.rawValue ?? 0),
        standarizedValue: Number(
          e.standarizedValue ??
          e.standardizedValue ??
          e.standar ??
          0
        ),
        weight: Number(e.indikatorWeight ?? e.weight ?? 1),
      });
    });

    setTahunData(Array.from(pilarMap.values()));
  }, [selectedYear, dataByYear]);


  // 🔢 Fungsi Perhitungan Sama dengan Form
  const calculateSubPilar = (sub: SubPilar) => {
    const indikatorSum = sub.indikator.reduce(
      (sum, i) => sum + (i.standarizedValue ?? 0) * (i.weight ?? 1),
      0
    );
    return indikatorSum * (sub.adjustmentFactor ?? 1);
  };

  const calculatePilar = (p: Pilar) => {
    const subSum = p.subPilar.reduce(
      (sum, s) => sum + calculateSubPilar(s) * (s.weight ?? 1),
      0
    );
    return subSum * (p.adjustmentFactor ?? 1);
  };

  const calculateTotal = (list: Pilar[]) => {
    const totalSum = list.reduce(
      (sum, p) => sum + calculatePilar(p) * (p.weight ?? 1),
      0
    );
    const totalAdjustmentFactor = 0.59273736443683;
    return totalSum * totalAdjustmentFactor;
  };

  const totalIndeks = calculateTotal(tahunData);

  // 📄 Export PDF
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    doc.setFontSize(16);
    doc.text(`Indeks Ekonomi Biru - Tahun ${selectedYear}`, 40, 40);
    let y = 70;

    tahunData.forEach((p) => {
      const pScore = calculatePilar(p);
      doc.setFontSize(14);
      doc.text(`${p.title} — ${pScore.toFixed(3)}`, 40, y);
      y += 25;

      p.subPilar.forEach((s) => {
        const subScore = calculateSubPilar(s);
        doc.setFontSize(12);
        doc.text(`• ${s.title} (${subScore.toFixed(3)})`, 60, y);
        y += 10;

        autoTable(doc, {
          startY: y + 5,
          head: [["Indikator", "Nilai Asli", "Standarisasi", "Bobot"]],
          body: s.indikator.map((i) => [
            i.label,
            i.rawValue,
            i.standarizedValue.toFixed(3),
            i.weight,
          ]),
          theme: "striped",
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [25, 118, 210], textColor: 255 },
          margin: { left: 80 },
        });

        y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : y + 30;
      });
      y += 15;
    });

    doc.text(
      `Total Indeks Ekonomi Biru ${selectedYear}: ${totalIndeks.toFixed(3)}`,
      40,
      y + 20
    );

    doc.save(`IndeksEkonomiBiru_${selectedYear}.pdf`);
  };

  // 📊 Export Excel
  const exportExcel = () => {
    const rows: any[] = [];
    tahunData.forEach((p) => {
      rows.push([`Pilar: ${p.title}`, "", "", calculatePilar(p)]);
      p.subPilar.forEach((s) => {
        rows.push(["", `Subpilar: ${s.title}`, "", calculateSubPilar(s)]);
        s.indikator.forEach((i) => {
          rows.push([
            "",
            "",
            i.label,
            i.rawValue,
            i.standarizedValue,
            i.weight,
          ]);
        });
      });
      rows.push([]);
    });

    rows.push(["", "", "Total Indeks", totalIndeks]);

    const ws = XLSX.utils.aoa_to_sheet([
      ["Pilar", "Subpilar", "Indikator", "Raw", "Standarisasi", "Bobot"],
      ...rows,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Indeks_${selectedYear}`);
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `IndeksEkonomiBiru_${selectedYear}.xlsx`);
  };

const [openSubPilar, setOpenSubPilar] = useState<string | null>(null);

const toggleSubPilar = (id: string) => {
  setOpenSubPilar((prev) => (prev === id ? null : id));

  // scroll ke elemen jika membuka
  if (openSubPilar !== id) {
    // delay sedikit agar DOM render animasi
    setTimeout(() => {
      const el = document.getElementById(`subpilar-${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }
};




  return (
    <div className="glass-box min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 text-white p-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto space-y-10"
      >
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            INDEKS EKONOMI BIRU
          </h2>

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

            <button
              onClick={exportPDF}
              className="glass-box flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:to-pink-600 px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-pink-400/30 transition-transform hover:scale-105"
            >
              <FileCode2 size={16} /> PDF
            </button>

            <button
              onClick={exportExcel}
              className="glass-box flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:to-emerald-600 px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-emerald-400/30 transition-transform hover:scale-105"
            >
              <FileSpreadsheet size={16} /> Excel
            </button>
          </div>
        </div>

        {/* DATA */}
        {tahunData.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-box h-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg space-y-4"
          >
            <div className="flex items-center gap-2 text-cyan-300">
              <h3 className="text-2xl font-bold">{p.title} — </h3>
                <span className="glass-card py-2 px-4 bg-white/20 text-2xl font-bold transition-transform hover:scale-105">
                  {calculatePilar(p).toFixed(3)}
                </span>
            </div>
            

            <div className="text-sm text-slate-300">
              Weight: <b>{p.weight}</b> | Adjustment Factor:{" "}
              <b>{p.adjustmentFactor}</b>
            </div>

          {p.subPilar.map((s) => {
            const isOpen = openSubPilar === s.id;
            return (
              <div
                key={s.id}
                className="glass-box bg-slate-900/20 hover:bg-slate-900 hover:shadow-slate-400/10 border border-slate-700 rounded-xl p-5 space-y-4 transition-all"
              >
                {/* Header Subpilar (klik untuk toggle) */}
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => toggleSubPilar(s.id)}
                >
                  <div className="flex items-center gap-2 text-indigo-300">
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-cyan-400" />
                    )}
                    <h4 className="text-lg font-semibold">{s.title} - </h4>
                    <span className="glass-card py-1 px-3 bg-white/20 text-cyan-400 font-bold text-base rounded-lg transition-transform hover:scale-105">
                      {calculateSubPilar(s).toFixed(3)}
                    </span>
                  </div>
                </div>

                {/* Info subpilar */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    className="overflow-visible"
                  >
                    <div className="text-xs text-slate-400 mt-2 mb-4">
                      Weight: <b>{s.weight}</b> | Adjustment:{" "}
                      <b>{s.adjustmentFactor}</b>
                    </div>

                    {/* Table indikator */}
                    <table className="glass-card w-full border border-slate-600 text-sm text-black bg-white rounded-xl overflow-hidden">
                      <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white items">
                        <tr >
                          <th className="border border-slate-600 px-3 py-2 text-center">
                            Indikator
                          </th>
                          <th className="border border-slate-600 px-3 py-2 text-center">
                            Nilai Asli
                          </th>
                          <th className="border border-slate-600 px-3 py-2 text-center">
                            Standarisasi
                          </th>
                          <th className="border border-slate-600 px-3 py-2 text-center">
                            Bobot
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.indikator.map((i) => (
                          <tr
                            key={i.id}
                            className="hover:bg-slate-700/30 transition-colors"
                          >
                            <td className="border border-slate-700 px-3 py-1">
                              {i.label}
                            </td>
                            <td className="border border-slate-700 px-3 py-1 text-center">
                              {i.rawValue}
                            </td>
                            <td className="border border-slate-700 px-3 py-1 text-center">
                              {i.standarizedValue.toFixed(3)}
                            </td>
                            <td className="border border-slate-700 px-3 py-1 text-center">
                              {i.weight}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </div>
            );
          })}
          </motion.div>
        ))}

        {/* TOTAL */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-box mt-10 text-center bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl py-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-white/90">
            Total Indeks Ekonomi Biru {selectedYear}
          </h3>
          <p className="text-4xl font-extrabold text-white">
            {totalIndeks.toFixed(3)}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
