"use client";

import React from "react";
import IndikatorKinerjaKunciForm from "@/componentsDatainput/IndikatorKinerjaKunciForm";

export default function IndikatorKinerjaKunci() {
  return (
    <main className="glass-box rounded-3xl min-h-screen bg-gradient-to-br from-orange-50/50 to-orange-100/50 py-12 px-4">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2C416D]">
            INPUT DATA INDIKATOR KINERJA KUNCI
          </h1>
          <p className="mt-3 text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Silakan isi indikator sesuai dengan target tahunan yang tersedia.
            Masukkan realisasi untuk menghitung capaian secara otomatis.
          </p>
        </div>

        {/* Form utama */}
        <IndikatorKinerjaKunciForm />
      </div>
    </main>
  );
}
