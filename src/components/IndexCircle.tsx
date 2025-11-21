"use client";
import React from "react";

type Props = {
  value: number | string;
  doubleCircle?: boolean; // tampil 2 lingkaran
  boxSize?: string; // ukuran luar (default w-72 h-72)
};

export default function IndexCircle({
  value,
  doubleCircle = true,
  boxSize = "w-72 h-72",
}: Props) {
  return (
    <div
      className={`
        ${boxSize}
        relative flex items-center justify-center
      `}
    >
      {doubleCircle ? (
        // 🔹 Double Circle
        <div className="w-full h-full rounded-full border-[14px] border-[#2C416D] flex items-center justify-center">
          <div className="w-[98%] h-[98%] rounded-full border-[6px] border-[#2C416D] flex flex-col items-center justify-center">
            <div className="text-sm font-semibold text-[#2C416D] mb-1">
              INDEKS
            </div>
            <div className="text-6xl font-bold text-[#2C416D]">{value}</div>
          </div>
        </div>
      ) : (
        // 🔹 Single Circle
        <div className="w-full h-full rounded-full border-[12px] border-[#2C416D] flex flex-col items-center justify-center">
          <div className="text-sm font-semibold text-[#2C416D] mb-1">INDEKS</div>
          <div className="text-6xl font-bold text-[#2C416D]">{value}</div>
        </div>
      )}
    </div>
  );
}
