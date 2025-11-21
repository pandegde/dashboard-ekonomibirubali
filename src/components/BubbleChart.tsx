"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getData } from "@/actions/ekonomiBiruActions";
import { ChevronLeft, ChevronRight } from "lucide-react";


type Indicator = {
  name: string;
  rawValue: number;
  standardized: number;
  unit: string;
};

export default function BubbleChart() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  // Ambil data ekonomi biru
    useEffect(() => {
      async function fetchData() {
        try {
          const data = await getData("ekonomiBiru");
          if (!data) return;

          const flattened = Object.entries(data)
            .flatMap(([pilar, items]: [string, any]) =>
              items
                .filter((d: any) => d.indikator)
                .map((d: any) => {
                  // Pisahkan satuan dari nama indikator
                  const match = d.indikator.match(/^(.*?)\s*\((.*?)\)$/);
                  const name = match ? match[1].trim() : d.indikator.trim();
                  const unit = match ? match[2].trim() : d.unit || "";

                  return {
                    name,
                    rawValue: parseFloat(d.nilai) || 0,
                    standardized: parseFloat(d.standar) || 0,
                    unit,
                    category: pilar.toLowerCase(), // simpan nama pilar
                  };
                })
            );

          setIndicators(flattened);
        } catch (e) {
          console.error("Gagal ambil data:", e);
        }
      }
      fetchData();
    }, []);



  // Auto-slide
  useEffect(() => {
    if (indicators.length === 0) return;
    const interval = setInterval(() => handleNext(), 3000);
    return () => clearInterval(interval);
  }, [indicators]);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % indicators.length);
  };
  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + indicators.length) % indicators.length);
  };

  // Ambil 11 indikator (tengah + 5 kiri + 5 kanan)
  const visibleIndicators: Indicator[] = [];
  for (let i = -5; i <= 5; i++) {
    visibleIndicators.push(
      indicators[(startIndex + i + indicators.length) % indicators.length]
    );
  }

  // Posisi bubble — tetap seperti versi kamu
  const positions = [
    { x: -260, scale: 0.1, z: 1 },
    { x: -245, scale: 0.2, z: 2 },
    { x: -215, scale: 0.4, z: 3 },
    { x: -170, scale: 0.6, z: 4 },
    { x: -110, scale: 0.8, z: 5 },
    { x: 0, scale: 1.5, z: 6 },
    { x: 110, scale: 0.8, z: 5 },
    { x: 170, scale: 0.6, z: 4 },
    { x: 215, scale: 0.4, z: 3 },
    { x: 245, scale: 0.2, z: 2 },
    { x: 260, scale: 0.1, z: 1 },
  ];

  if (indicators.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500">
        Memuat data indikator ekonomi biru...
      </div>
    );
  }

  const getBubbleColor = (category: string) => {
    switch (category) {
      case "ekonomi":
        return "border-yellow-600 text-yellow-700 bg-yellow-50";
      case "sosial":
        return "border-green-600 text-green-700 bg-green-50";
      case "lingkungan":
        return "border-blue-600 text-blue-700 bg-blue-50";
      default:
        return "border-gray-400 text-gray-700 bg-gray-50";
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 border-2 border-slate-700/80 rounded-3xl shadow-lg flex flex-col items-center">
      <p className="text-base sm:text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg mb-4 text-center">
        INDIKATOR INDEKS EKONOMI BIRU
      </p>

      {/* Bubble Container */}
      <div className="glass-box relative w-full h-72 flex items-center justify-center overflow-hidden">
        {visibleIndicators.map(
          (ind, idx) =>
            ind && (
              <motion.div
                  key={ind.name}
                  layout
                  animate={{
                    x: positions[idx].x,
                    scale: positions[idx].scale,
                    opacity: 1,
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  className="absolute flex items-center justify-center text-blue-900"
                  style={{
                    width: 140,
                    height: 140,
                    zIndex: positions[idx].z,
                  }}
                >
                  {/* Outer circle */}
                  <div className="w-full h-full rounded-full border-[6px] border-[#2C416D] flex items-center justify-center bg-white">
                    {/* Inner circle */}
                    <div className="w-[97%] h-[97%] rounded-full border-[3px] border-[#2C416D] flex flex-col items-center justify-center ">
                      <div className="text-[11px] sm:text-xs font-semibold leading-tight">
                        {ind.rawValue.toLocaleString("id-ID")} <span className="text-gray-500">{ind.unit}</span>
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-gray-500 mt-1">
                        standarized: {ind.standardized.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </motion.div>
            )
        )}
      </div>

{/* Nama indikator tengah */}
<p
  className="font-semibold text-gray-800 mt-6 text-center leading-tight"
  style={{
    whiteSpace: "nowrap",
    transformOrigin: "center center",
    transform: `scale(${
      visibleIndicators[5]?.name?.length > 60
        ? 0.9
        : 1
    })`,
    transition: "transform 0.3s ease",
  }}
>
  {visibleIndicators[5]?.name}
</p>


      {/* Tombol navigasi */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePrev}
          className="glass-box flex items-center gap-2 text-slate-200 bg-gradient-to-r from-red-500 to-pink-500 hover:to-pink-600 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-pink-400/30 transition-transform hover:scale-105"
        >
          <ChevronLeft size={20} />
          <span>Prev</span>
        </button>
        <button
          onClick={handleNext}
          className="glass-box flex items-center gap-2 text-slate-200 bg-gradient-to-r from-red-500 to-pink-500 hover:to-pink-600 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-pink-400/30 transition-transform hover:scale-105"
        >
          <span>Next</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
