"use client";
import React from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  

  return (
    <header className="w-full flex items-center justify-between gap-4 px-auto py-2 mb-4">
      {/* LEFT: Banner area */}
      <div className="flex items-center gap-4">
        {/* Kotak judul */}
        <div className="glass-box hidden md:flex items-center gap-4 bg-slate-800 backdrop-blur-xl border border-slate-700/60 rounded-2xl px-6 py-4 shadow-lg">
          {/* Text */}
          <div>
            <div className="text-lg font-semibold text-cyan-400">
              KELAUTAN DAN PERIKANAN
            </div>
            <div className="text-xs text-slate-300 opacity-90">
              DASHBOARD EKONOMI BIRU PROVINSI BALI
            </div>
          </div>

          {/* Logo di kanan teks */}
          <div className="relative w-14 h-14">
            <Image
              src="/asset/logodkp.png"
              alt="Logo DKP"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Search box */}
        <div className="flex items-center gap-2 bg-white border border-slate-700/60 rounded-full px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-cyan-500 transition-all">
          <input
            className="bg-transparent outline-none w-56 md:w-96 text-sm text-black placeholder:text-slate-400"
            placeholder="Search..."
            aria-label="Search"
          />
          <button className="p-2 rounded-full hover:bg-slate-700 transition-colors text-slate-500 hover:text-cyan-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35"
              />
              <circle
                cx="11"
                cy="11"
                r="6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* RIGHT: Login / Logout */}
      <div className="flex items-center gap-4">
        {!user ? (
          <button
            onClick={() => router.push("/login")}
            className="glass-box px-4 py-2 bg-slate-800/70 border border-slate-700 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-red-500 transition-all duration-200 transform hover:scale-105"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-800">
              Hi, <span className="text-cyan-400">{user.username}</span>
            </span>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="glass-box px-4 py-2 bg-red-600/80 border border-red-700 rounded-lg text-sm font-medium text-white hover:bg-red-600 hover:text-slate-900 transition-all duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
