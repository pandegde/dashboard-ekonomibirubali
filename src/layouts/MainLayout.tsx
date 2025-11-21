"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast"; // ✅ Toaster global

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative min-h-screen w-full bg-slate-900 backdrop-blur-2xl flex items-center border border-slate-800/60 justify-center p-4 overflow-hidden">
      <div
        className="bg-white relative rounded-3xl shadow-lg inner-depth w-full max-w-full p-4 sm:p-6 md:p-8 bg-cover bg-center animate-wave-diagonal"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('/asset/bgMain.png')",
        }}
      >

        <div className="w-full h-full flex flex-col">
          {/* ✅ Header */}
          <Header />

          <div className="flex flex-1 rounded-3xl bg-gray-50/75 text-gray-900 shadow-lg border border-gray-200/70 overflow-hidden mt-2">
            {/* ✅ Sidebar */}
            <Sidebar isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />

            {/* ✅ Main Content */}
            <main className="flex-1 overflow-y-auto p-2">{children}</main>
          </div>

          {/* ✅ Global Toaster (notifikasi) */}
          <Toaster position="top-right" reverseOrder={false} />

        </div>
        <div className="text-center mt-10 text-gray-500 text-sm">
          © {new Date().getFullYear()} Dashboard IBEI Provinsi Bali. Semua Hak Dilindungi.
        </div>
      </div>
    </div>
  );
}
