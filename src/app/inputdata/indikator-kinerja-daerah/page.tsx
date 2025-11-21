"use client";

import React from "react";
import IndikatorKinerjaDaerahForm from "@/componentsDatainput/IndikatorKinerjaDaerahForm";

export default function IndikatorKinerjaDaerahPage() {
  return (
    <main className="glass-box rounded-3xl min-h-screen bg-gradient-to-br from-green-50/50 to-emerald-100/50 py-12 px-4">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2C416D]">
            INPUT DATA INDIKATOR KINERJA DAERAH
          </h1>
          <p className="mt-3 text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Silakan isi indikator sesuai dengan target tahunan yang tersedia.
            Masukkan realisasi untuk menghitung capaian secara otomatis.
          </p>
        </div>

        {/* Form utama */}
        <IndikatorKinerjaDaerahForm />
      </div>
    </main>
  );
}
