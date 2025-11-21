"use client";

import React from "react";
import IndeksEkonomiBiruForm from "@/componentsDatainput/IndeksEkonomiBiruForm";

export default function IndeksEkonomiBiru() {
  return (
    <main className="glass-box rounded-3xl min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-100/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2C416D]">
            INPUT DATA INDEKS EKONOMI BIRU
          </h1>
          <p className="mt-3 text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Silakan isi indikator sesuai dengan Pilar, Sub Pilar, dan Indikator
            yang tersedia. Hasil perhitungan akan muncul secara otomatis.
          </p>
        </div>

        <IndeksEkonomiBiruForm />

      </div>
    </main>
  );
}
