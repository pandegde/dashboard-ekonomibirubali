"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Pilar from "./Pilar";
import IndexCircle from "./IndexCircle";
import LogoCard from "./LogoCard";
import { getData } from "@/actions/ekonomiBiruActions";

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
  title: string;
  subPilar: SubPilar[];
  weight?: number;
  adjustmentFactor?: number;
}

export default function LeftPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    ekonomi: 0,
    lingkungan: 0,
    sosial: 0,
    total: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const raw = await getData("ekonomiBiru");
        if (!raw || typeof raw !== "object") return;

        // 🔹 Ambil tahun terbaru
        const years = Object.keys(raw).map(Number).sort((a, b) => a - b);
        const latestYear = years[years.length - 1];
        const entries = raw[latestYear] || [];

        // 🔹 Bangun struktur Pilar → Subpilar → Indikator
        const pilarMap = new Map<string, Pilar>();
        entries.forEach((e: any) => {
          const pilarKey = e.pilar;
          if (!pilarMap.has(pilarKey)) {
            pilarMap.set(pilarKey, {
              title: pilarKey,
              subPilar: [],
              weight: Number(e.pilarWeight ?? 1),
              adjustmentFactor: Number(e.pilarAdjustmentFactor ?? 1),
            });
          }
          const pilar = pilarMap.get(pilarKey)!;

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

        // 🔹 Rumus perhitungan sama seperti DataView
        const calcSubPilar = (sub: SubPilar) => {
          const total = sub.indikator.reduce(
            (sum, i) => sum + i.standarizedValue * (i.weight ?? 1),
            0
          );
          return total * (sub.adjustmentFactor ?? 1);
        };

        const calcPilar = (p: Pilar) => {
          const total = p.subPilar.reduce(
            (sum, s) => sum + calcSubPilar(s) * (s.weight ?? 1),
            0
          );
          return total * (p.adjustmentFactor ?? 1);
        };

        const pilarValues: Record<string, number> = {};
        let totalSum = 0;

        pilarMap.forEach((p, key) => {
          const value = calcPilar(p);
          pilarValues[key.toLowerCase()] = value;
          totalSum += value * (p.weight ?? 1);
        });

        const totalAdjFactor = 0.59273736443683; // sesuai DataView
        const total = totalSum * totalAdjFactor;

        // 🔹 Simpan hasil
        setData({
          ekonomi: pilarValues["pilar ekonomi"] ?? 0,
          lingkungan: pilarValues["pilar lingkungan"] ?? 0,
          sosial: pilarValues["pilar sosial"] ?? 0,
          total,
        });
      } catch (err) {
        console.error("Gagal memuat data ekonomi biru:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full text-center text-gray-400 p-6">
        Memuat data ekonomi biru...
      </div>
    );
  }

  return (
    <div className="w-full flex">
      {/* Kolom kiri: Logo + Total Index */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="transition-transform hover:scale-105"
        >
          <LogoCard boxSize="w-60 h-25" />
        </button>

        {/* 🔵 Total Indeks */}
        <IndexCircle value={data.total.toFixed(2)} />
      </div>

      {/* Kolom kanan: Nilai Pilar */}
      <motion.div
        animate={{
          width: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden flex flex-col gap-4 ml-8"
      >
        <Pilar
          title="PILAR EKONOMI"
          value={data.ekonomi.toFixed(2)}
          doubleCircle
        />
        <Pilar
          title="PILAR LINGKUNGAN"
          value={data.lingkungan.toFixed(2)}
          doubleCircle
        />
        <Pilar
          title="PILAR SOSIAL"
          value={data.sosial.toFixed(2)}
          doubleCircle
        />
      </motion.div>
    </div>
  );
}
