"use client";
import React from "react";
import { motion } from "framer-motion";

type PilarProps = {
  title: string;
  value: string;
  doubleCircle?: boolean;
};

export default function Pilar({ title, value, doubleCircle = false }: PilarProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-[#2C416D] bg-white p-4 shadow-sm">
      <div className="mt-2 text-center">
        <div className="text-sm font-semibold text-[#2C416D]">{title}</div>
        <div className="text-lg font-bold text-[#244261]"></div>
      </div>
      {doubleCircle && (
         <div className="relative w-20 h-20 mt-2 rounded-full border-[3px] border-[#2C416D] flex items-center justify-center">
         <div className="absolute inset-1 rounded-full border-[1px] border-[#2C416D] flex items-center justify-center">
           <span className="text-lg font-bold text-[#244261] leading-none">{value}</span>
         </div>
       </div>
      
      )}
    </div>
  );
}
