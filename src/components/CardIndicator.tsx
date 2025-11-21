"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { getData as getIKU } from "@/actions/indikatorKinerjaUtamaActions";
import { getData as getIKK } from "@/actions/indikatorKinerjaKunciActions";
import { getData as getIKD } from "@/actions/indikatorKinerjaDaerahActions";

export interface IndicatorCard {
  category: string;
  title: string;
  value?: number | string;
  unit?: string;
  periode?: string;
  year?: number;
}

export const CardIndicator: React.FC<IndicatorCard> = ({ category, title, value, unit, periode, year }) => {
  const bgColor =
    category === "IKU"
      ? "glass-input bg-blue-50 border-blue-500 text-blue-900 ring-8 ring-blue-500"
      : category === "IKK"
      ? "glass-input bg-green-50 border-green-500 text-green-900 ring-8 ring-green-500"
      : category === "IKD"
      ? "glass-input bg-yellow-50 border-yellow-500 text-yellow-900 ring-8 ring-yellow-500"
      : "glass-input bg-gray-50 border-gray-400 text-gray-700 ring-8 ring-gray-500";

  return (
    <div
      className={`rounded-3xl p-6 shadow-sm border-2 text-center w-75 flex-shrink-0 flex flex-col justify-between ${bgColor}`}
    >
      <div className="text-xl font-semibold mb-1">{category}</div>
      <div className="text-ss font-semibold mb-1">{title}</div>
      <div className="text-xl font-bold text-slate-900 mb-2">
        {value != null ? `${Number(value).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit ?? ""}`
    : "Belum ada data"}
      </div>
      <div className="text-sm text-gray-700">{periode && year ? `${periode} ${year}` : ""}</div>
    </div>
  );
};

export const CardIndicatorRow: React.FC = () => {
  const [cards, setCards] = useState<IndicatorCard[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const speed = 0.5; // pixel per frame

  // Ambil realisasi terakhir dari item
  const getLastRealisasi = (item: any) => {
    const years = Object.keys(item.realisasi || {}).map(Number).sort((a, b) => b - a);
    for (const year of years) {
      const periods = ["TW1", "TW2", "TW3", "TW4", "Tahunan"];
      for (let i = periods.length - 1; i >= 0; i--) {
        const p = periods[i];
        const value = item.realisasi[year]?.[p];
        if (value != null) {
          return { year, periode: p, value, unit: item.satuan };
        }
      }
    }
    return null;
  };

  // Proses data jadi IndicatorCard[]
  const processData = (data: Record<string, any>, category: string): IndicatorCard[] => {
    const years = Object.keys(data).map(Number).sort((a, b) => b - a);
    if (!years.length) return [];
    const lastYear = years[0];
    const yearData = data[lastYear] || [];
    return yearData.map((item: any) => {
      const last = getLastRealisasi(item);
      return {
        category,
        title: item?.nama ?? "Tidak ada nama",
        value: last?.value,
        unit: last?.unit,
        periode: last?.periode,
        year: last?.year,
      };
    });
  };

  useEffect(() => {
    async function fetchIndicators() {
      try {
        const [iku, ikk, ikd] = await Promise.all([
          getIKU("indikatorKinerjaUtama"),
          getIKK("indikatorKinerjaKunci"),
          getIKD("indikatorKinerjaDaerah"),
        ]);

        const allCards: IndicatorCard[] = [
          ...processData(iku, "IKU"),
          ...processData(ikk, "IKK"),
          ...processData(ikd, "IKD"),
        ];

        setCards(allCards);
      } catch (e) {
        console.error("Gagal ambil data indikator:", e);
      }
    }
    fetchIndicators();
  }, []);

  // Hitung lebar kontainer
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.scrollWidth / 2); // setengah karena duplikasi
    }
  }, [cards]);

  // Animate marquee terus menerus
  useEffect(() => {
    let frame: number;
    const animate = () => {
      const current = x.get();
      if (containerWidth > 0) {
        const nextX = current - speed <= -containerWidth ? 0 : current - speed;
        x.set(nextX);
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [containerWidth, x]);

  return (
    <div className="overflow-hidden w-full cursor-grab" ref={containerRef}>
      <motion.div
        className="flex gap-4"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -10000, right: 10000 }}
        whileTap={{ cursor: "grabbing" }}
      >
        {[...cards, ...cards].map((card, idx) => (
          <CardIndicator key={idx} {...card} />
        ))}
      </motion.div>
    </div>
  );
};

export default CardIndicatorRow;
