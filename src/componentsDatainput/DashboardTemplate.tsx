"use client";
import React from "react";
import BoxInput from "./BoxInput";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // ✅ ambil context

export default function DashboardTemplate() {
  const router = useRouter();
  const { user } = useAuth(); // ✅ ambil user yang login

  const handleClick = (path: string) => {
    router.push(`/inputdata/${path}`);
  };

  return (
    <div className="glass-box bg-white/10 backdrop-blur-xl rounded-3xl drop-shadow-lg w-full max-w-5xl p-8 text-white border border-white/20 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Selamat Datang, {user?.username || "Guest"}!
        </h1>
      </div>

      {/* Grid Box Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BoxInput
          title="Input Data Indeks Ekonomi Biru"
          description="masukkan data indeks terbaru"
          onClick={() => handleClick("indeks-ekonomi-biru")}
        />
        <BoxInput
          title="Input Data Indikator Kinerja Daerah"
          description="masukkan data indikator kinerja daerah"
          onClick={() => handleClick("indikator-kinerja-daerah")}
        />
        <BoxInput
          title="Input Data Indikator Kinerja Utama"
          description="masukkan data indikator kinerja utama"
          onClick={() => handleClick("indikator-kinerja-utama")}
        />
        <BoxInput
          title="Input Data Indikator Kinerja Kunci"
          description="masukkan data indikator kinerja kunci"
          onClick={() => handleClick("indikator-kinerja-kunci")}
        />
        <BoxInput
          title="New features coming soon !!!"
          description="masukkan data..."
          onClick={() => handleClick("")}
        />
        <BoxInput
          title="New features coming soon !!!"
          description="masukkan data..."
          onClick={() => handleClick("")}
        />
      </div>
    </div>
  );
}
