"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  onClick?: () => void;
};

export default function BoxInput({ title, description, onClick }: Props) {
  return (
    <div
      className="glass-box bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer drop-shadow-lg w-full max-w-sm"
      onClick={onClick}
    >
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        {description && (
          <p className="text-slate-300 text-sm">{description}</p>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <ArrowRight className="text-white w-6 h-6" />
      </div>
    </div>
  );
}
