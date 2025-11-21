"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export default function LogicModelHeader() {
  const items = [
    { title: "Visi", content: "Nangun  Sat Kerthi Loka Bali melalui Pola Pembangunan Semesta Berencana dalam Bali Era Baru" },
    { title: "Misi ke-12", content: "Mewujudkan kedaulatan pangan, meningkatkan nilai tambah, daya saing pertanian, dan meningkatkan kesejahteraan petani, serta memastikan terpenuhinya kebutuhan sandang- papan bagi kehidupan Krama Bali" },
    { title: "Core Business", content: "Membantu Gubernur melaksanakan urusan pemerintahan bidang kelautan dan perikanan yang menjadi kewenangan Provinsi, serta melaksanakan tugas dekonsentrasi sampai dengan dibentuknya Sekretariat Gubernur sebagai Wakil Pemerintah Pusat dan melaksanakan tugas pembantuan sesuai bidang tugasnya" },
    { title: "Isu Strategis", content: [
      "Belum optimalnya kapasitas sentra-sentra produksi kelautan dan perikanan yang memiliki komoditas unggulan",
      "Belum optimalnya pangsa pasar (market share) produk perikanan di pasar luar negeri",
      "Belum optimalnya peran sektor kelautan dan perikanan dalam menunjang pendapatan daerah",
      "Belum optimalnya pengembangan teknologi pengolahan/pengawet ikan dalam memenuhi tuntutan konsumen",
      "Penurunan kualitas ekosistem pesisir dan laut serta dampak perubahan iklim",
    ]},
  ];
  
  const logicModel =[
    "impact",
    "Outcome",
    "Intermediate Outcome",
    "Immidiate Outcome",
    "Output"
  ];

  return (
    <div className="w-full overflow-x-auto">
      {/*Baris Kotak Visi Misi dll*/}
      <div className="flex gap-2 min-w-[600px] cursor-pointer break-words mb-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 bg-white shadow-md rounded-2xl p-3 max-w-[auto] border border-gray-200 flex flex-col break-words whitespace-normal"
          >
            <h3 className="text-lg font-bold text-[#2C416D] mb-2">
              {item.title}
            </h3>
            {Array.isArray(item.content) ? (
              <ul className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                {item.content.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-justify text-sm text-gray-600">{item.content}</p>
            )}
          </div>
        ))}
      </div>
      {/*Logic Model Horizontal*/}
      
        <div className="flex items-center gap-4 flex-wrap mb-4">
          {logicModel.map((step, idx) => {
            const bgColors = ["bg-gray-100", "bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-pink-100"];
            const bgColor = bgColors[idx % bgColors.length]; // warna berbeda tiap kotak

            return (
              <React.Fragment key={idx}>
                <div
                  className={`flex-1 ${bgColor} border border-gray-500 text-blue-800 font-semibold p-5 rounded-xl shadow-md min-w-[180px] text-center`}
                >
                  {step}
                </div>
                {idx !== logicModel.length - 1 && <ArrowRight className="w-6 h-6 text-gray-400" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
  );
}
