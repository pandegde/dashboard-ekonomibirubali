"use client";

import { motion } from "framer-motion";
import { Menu, Home, Settings, Database, Network, FolderInput, ShipWheel } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // ✅ pakai auth context

type SidebarProps = {
  isOpen: boolean;
  toggle: () => void;
};

export default function Sidebar({ isOpen, toggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth(); // ✅ cek user login

  return (
    <motion.aside
      animate={{ width: isOpen ? 240 : 72 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="glass-box flex flex-col min-h-screen bg-slate-900 backdrop-blur-2xl text-white shadow-xl border border-slate-800/60 rounded-2xl overflow-hidden"

    >
      {/* HEADER */}
      <div className="glass-box flex items-center justify-between p-4 border-b border-slate-800/60">
        {isOpen && (
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
            MENU
          </h1>
        )}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className="glass-input p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 transition-colors border border-slate-700 "
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Menu size={22} />
          </motion.div>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className=" flex-1 mt-8 space-y-10 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900/30">
        <SidebarItem
          href="/dashboard"
          icon={<Home size={25} />}
          label="Home"
          isOpen={isOpen}
          active={pathname.startsWith("/dashboard")}
        />
        <SidebarItem
          href="/data"
          icon={<Database size={25} />}
          label="Data IBEI"
          isOpen={isOpen}
          active={pathname.startsWith("/data")}
        />
        <SidebarItem
          href="/logicmodel"
          icon={<Network size={25} />}
          label="Logic Model"
          isOpen={isOpen}
          active={pathname.startsWith("/logicmodel")}
        />
        <SidebarItem
          href="/indikatorkinerja"
          icon={<ShipWheel size={25} />}
          label="Indikator Kinerja"
          isOpen={isOpen}
          active={pathname.startsWith("/indikatorkinerja")}
        />

        {/* ✅ Menu Input Data hanya tampil kalau sudah login */}
        {user && (
          <SidebarItem
            href="/inputdata"
            icon={<FolderInput size={25} />}
            label="Input Data"
            isOpen={isOpen}
            active={pathname.startsWith("/inputdata")}
          />
        )}
      </nav>
    </motion.aside>
  );
}

function SidebarItem({
  href,
  icon,
  label,
  isOpen,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-100
        ${
        active
        ? "bg-cyan-700/30 text-cyan-100 font-light"
            : "text-slate-300 hover:bg-slate-700 hover:text-cyan-200 transition-transform hover:scale-105"
        }`}
    >
      <div
        className={`flex items-center justify-center min-w-[40px] ${
          active ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-300"
        }`}
      >
        {icon}
      </div>
      {isOpen && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
    </Link>
  );
}
