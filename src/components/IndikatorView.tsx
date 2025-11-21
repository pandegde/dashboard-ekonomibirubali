"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { FileSpreadsheet, FileCode2, } from "lucide-react";

interface Indikator {
  id: number;
  sasaran?: string; // hanya untuk IKU & IKK
  nama: string;
  satuan: string;
  target: Record<string, number>;
  realisasi: Record<string, Record<string, number | null>>;
  capaian: Record<string, Record<string, number | null>>;
  validasi: Record<string, Record<string, string | null>>;
}

export default function IndikatorView({
  dataByYear,
  jenis, // "IKU" | "IKK" | "IKD"
}: {
  dataByYear: Record<string, Indikator[]>;
  jenis: "IKU" | "IKK" | "IKD";
}) {
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedTw, setSelectedTw] = useState<string>("all");

  const years = [2025, 2026, 2027, 2028, 2029, 2030];
  const periodes = ["TW1", "TW2", "TW3", "TW4", "Tahunan"];

  const tahunData = dataByYear[selectedYear] || [];

  // 🔹 Format capaian (2 angka di belakang koma)
  const formatCapaian = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "-";
    return Number(val).toFixed(2);
  };

  // 🔹 Render teks validasi
  const renderValidasi = (val: string | null | undefined) => {
    if (!val || val.trim() === "") return "-";
    if (val === "*") return "Data Sementara (*)";
    if (val === "valid") return "Valid";
    return val;
  };

  // 🔹 Kelas warna validasi
  const validasiColor = (val: string | null | undefined) => {
    if (!val || val.trim() === "") return "bg-gray-200 text-gray-700";
    if (val === "*") return "bg-yellow-200 text-black";
    if (val === "valid") return "bg-green-200 text-black font-semibold";
    return "bg-gray-100 text-gray-600";
  };

  // === Export PDF ===
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(14);
    doc.text(`Data ${jenis} - Tahun ${selectedYear}`, 40, 40);

    const headers =
      selectedTw === "all"
        ? [
            "No",
            ...(jenis !== "IKD" ? ["Sasaran"] : []),
            "Indikator",
            "Satuan",
            "Target",
            "TW1",
            "TW2",
            "TW3",
            "TW4",
            "Tahunan",
            "Capaian",
            "Validasi",
          ]
        : [
            "No",
            ...(jenis !== "IKD" ? ["Sasaran"] : []),
            "Indikator",
            "Satuan",
            "Target",
            selectedTw,
            "Capaian",
            "Validasi",
          ];

    const rows = tahunData.map((item, idx) => {
      const base = [
        idx + 1,
        ...(jenis !== "IKD" ? [item.sasaran ?? "-"] : []),
        item.nama,
        item.satuan,
        item.target?.[selectedYear] ?? "-",
      ];

      if (selectedTw === "all") {
        return [
          ...base,
          item.realisasi?.[selectedYear]?.["TW1"] ?? "-",
          item.realisasi?.[selectedYear]?.["TW2"] ?? "-",
          item.realisasi?.[selectedYear]?.["TW3"] ?? "-",
          item.realisasi?.[selectedYear]?.["TW4"] ?? "-",
          item.realisasi?.[selectedYear]?.["Tahunan"] ?? "-",
          Object.values(item.capaian?.[selectedYear] || {}).map(formatCapaian).join(", "),
          Object.values(item.validasi?.[selectedYear] || {}).map(renderValidasi).join(", "),
        ];
      } else {
        return [
          ...base,
          item.realisasi?.[selectedYear]?.[selectedTw] ?? "-",
          formatCapaian(item.capaian?.[selectedYear]?.[selectedTw]),
          renderValidasi(item.validasi?.[selectedYear]?.[selectedTw]),
        ];
      }
    });

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 60,
      styles: { fontSize: 8 },
    });

    doc.save(`Data_${jenis}_${selectedYear}_${selectedTw}.pdf`);
  };

  // === Export Excel ===
  const exportExcel = () => {
    const headers =
      selectedTw === "all"
        ? [
            "No",
            ...(jenis !== "IKD" ? ["Sasaran"] : []),
            "Indikator",
            "Satuan",
            "Target",
            "TW1",
            "TW2",
            "TW3",
            "TW4",
            "Tahunan",
            "Capaian",
            "Validasi",
          ]
        : [
            "No",
            ...(jenis !== "IKD" ? ["Sasaran"] : []),
            "Indikator",
            "Satuan",
            "Target",
            selectedTw,
            "Capaian",
            "Validasi",
          ];

    const rows = tahunData.map((item, idx) => {
      const base = [
        idx + 1,
        ...(jenis !== "IKD" ? [item.sasaran ?? "-"] : []),
        item.nama,
        item.satuan,
        item.target?.[selectedYear] ?? "-",
      ];

      if (selectedTw === "all") {
        return [
          ...base,
          item.realisasi?.[selectedYear]?.["TW1"] ?? "-",
          item.realisasi?.[selectedYear]?.["TW2"] ?? "-",
          item.realisasi?.[selectedYear]?.["TW3"] ?? "-",
          item.realisasi?.[selectedYear]?.["TW4"] ?? "-",
          item.realisasi?.[selectedYear]?.["Tahunan"] ?? "-",
          Object.values(item.capaian?.[selectedYear] || {}).map(formatCapaian).join(", "),
          Object.values(item.validasi?.[selectedYear] || {}).map(renderValidasi).join(", "),
        ];
      } else {
        return [
          ...base,
          item.realisasi?.[selectedYear]?.[selectedTw] ?? "-",
          formatCapaian(item.capaian?.[selectedYear]?.[selectedTw]),
          renderValidasi(item.validasi?.[selectedYear]?.[selectedTw]),
        ];
      }
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Data_${jenis}_${selectedYear}`);
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `Data_${jenis}_${selectedYear}_${selectedTw}.xlsx`);
  };

  return (
  <div className="glass-box min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 rounded-3xl">
    <div className="glass-box max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-[#2C416D]">
          Data {jenis} - Tahun {selectedYear}
        </h1>
      </div>

      {/* Filter + Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">

        {/* Kiri: Dropdown Tahun & Periode */}
        <div className="flex flex-wrap items-center gap-4">

          {/* Tahun */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-slate-900">Tahun:</label>
            <Listbox value={selectedYear} onChange={setSelectedYear}>
              <div className="relative">
                <ListboxButton className="glass-box bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-xl font-semibold shadow-md transition-transform hover:scale-105">
                  {selectedYear}
                </ListboxButton>
                <ListboxOptions className="absolute z-[9999] mt-2 w-full max-h-60 overflow-y-auto bg-slate-800/95 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl ring-1 ring-black/20 focus:outline-none">
                  {years.map((th) => (
                    <ListboxOption
                      key={th}
                      value={th}
                      className="px-4 py-2 cursor-pointer text-slate-200 data-[focus]:bg-cyan-600/30 data-[focus]:text-cyan-200 data-[selected]:font-semibold data-[selected]:text-cyan-400"
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
            <label className="font-medium text-slate-900 whitespace-nowrap">Periode:</label>
            <Listbox value={selectedTw} onChange={setSelectedTw}>
              <div className="relative">
                <ListboxButton className="glass-box bg-slate-200 hover:bg-slate-300 px-6 py-2 rounded-xl font-semibold shadow-md transition-transform hover:scale-105">
                  {selectedTw}
                </ListboxButton>
                <ListboxOptions className="absolute z-[9999] mt-2 w-full max-h-60 overflow-y-auto bg-slate-800/95 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl ring-1 ring-black/20 focus:outline-none">
                  {periodes.map((tw) => (
                    <ListboxOption
                      key={tw}
                      value={tw}
                      className="px-4 py-2 cursor-pointer text-slate-300 data-[focus]:bg-cyan-600/30 data-[focus]:text-cyan-200 data-[selected]:font-semibold data-[selected]:text-cyan-400"
                    >
                      {tw}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
        </div>

        {/* Kanan: Tombol Export */}
        <div className="flex gap-3 text-white">
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

      {/* Table */}
      {!tahunData.length ? (
        <p className="text-center text-gray-500 italic">
          Data Belum Tersedia Untuk Tahun {selectedYear}.
        </p>
      ) : (
        <div className="w-full">
          <table className="glass-card w-full border border-slate-600 text-sm text-black bg-white rounded-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <tr>
                <th className="border px-3 py-2">No</th>
                {jenis !== "IKD" && (
                  <th className="border px-3 py-2">Sasaran</th>
                )}
                <th className="border px-3 py-2">Indikator</th>
                <th className="border px-3 py-2">Satuan</th>
                <th className="border px-3 py-2">Target</th>

                {selectedTw === "all" ? (
                  <>
                    <th className="border px-3 py-2">TW1</th>
                    <th className="border px-3 py-2">TW2</th>
                    <th className="border px-3 py-2">TW3</th>
                    <th className="border px-3 py-2">TW4</th>
                    <th className="border px-3 py-2">Tahunan</th>
                  </>
                ) : (
                  <th className="border px-3 py-2">{selectedTw}</th>
                )}

                <th className="border px-3 py-2">Capaian</th>
                <th className="border px-3 py-2">Validasi</th>
              </tr>
            </thead>
            <tbody>
              {tahunData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 text-center">{idx + 1}</td>
                  {jenis !== "IKD" && (
                    <td className="border px-3 py-2">{item.sasaran}</td>
                  )}
                  <td className="border px-3 py-2">{item.nama}</td>
                  <td className="border px-3 py-2 text-center">{item.satuan}</td>
                  <td className="border px-3 py-2 text-center">
                    {item.target?.[selectedYear] ?? "-"}
                  </td>

                  {selectedTw === "all" ? (
                    <>
                      {["TW1","TW2","TW3","TW4","Tahunan"].map((tw) => (
                        <td key={tw} className="border px-3 py-2 text-center">
                          {item.realisasi?.[selectedYear]?.[tw] ?? "-"}
                        </td>
                      ))}
                    </>
                  ) : (
                    <td className="border px-3 py-2 text-center">
                      {item.realisasi?.[selectedYear]?.[selectedTw] ?? "-"}
                    </td>
                  )}

                  <td className="border px-3 py-2 text-center">
                    {selectedTw === "all"
                      ? Object.values(item.capaian?.[selectedYear] || {}).map(
                          (val, i) => (
                            <span
                              key={i}
                              className="block text-xs bg-blue-50 rounded p-1"
                            >
                              {formatCapaian(val)}
                            </span>
                          )
                        )
                      : formatCapaian(item.capaian?.[selectedYear]?.[selectedTw])}
                  </td>

                  <td className="border px-3 py-2 text-center">
                    {selectedTw === "all"
                      ? Object.values(item.validasi?.[selectedYear] || {}).map(
                          (val, i) => (
                            <span
                              key={i}
                              className={`block text-xs rounded p-1 ${validasiColor(val)}`}
                            >
                              {renderValidasi(val)}
                            </span>
                          )
                        )
                      : (
                        <span
                          className={`block text-xs rounded p-1 ${validasiColor(
                            item.validasi?.[selectedYear]?.[selectedTw]
                          )}`}
                        >
                          {renderValidasi(item.validasi?.[selectedYear]?.[selectedTw])}
                        </span>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);
}
