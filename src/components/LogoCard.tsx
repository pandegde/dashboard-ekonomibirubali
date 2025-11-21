"use client";
import React from "react";
import Image from "next/image";
import { ChevronsRightIcon } from "lucide-react";

type Props = {
  boxSize?: string;
};

export default function LogoCard({ boxSize = "w-full" }: Props) {
  return (
    <div
      className={`${boxSize} bg-white rounded-2xl border-2 border-[#2C416D] flex items-center justify-center shadow-sm p-4 relative cursor-pointer`}
    >
      {/* Konten tengah */}
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/asset/logoBali.png"
          alt="Logo Provinsi Bali"
          width={50}
          height={50}
          className="object-contain"
        />
        <span className="text-sm font-semibold text-[#2C416D]">
          IBEI
        </span>
      </div>

      {/* Icon panah di kanan */}
      <ChevronsRightIcon className="w-10 h-10 text-[#2C416D] absolute right-4" />
    </div>
  );
}
