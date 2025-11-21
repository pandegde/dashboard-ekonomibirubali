"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // ✅ ambil context
import LoginForm from "@/componentsDatainput/LoginForm";

export default function LoginPage() {
  const { login } = useAuth(); // ✅ pakai context
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      login(username); // ✅ update context & simpan cookie di dalam context
      router.push("/inputdata"); // redirect ke halaman proteksi
    } else {
      alert("Isi username dan password terlebih dahulu!");
    }
  };

  return (
    <div className="glass-box rounded-2xl min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="flex flex-col items-center gap-6">
        {/* Logo Section */}
        <div className="flex gap-6 justify-center">
          <img src="/asset/logoBali.png" alt="Logo Bali" className="w-20 h-20 object-contain" />
          <img src="/asset/logodkp.png" alt="Logo DKP" className="w-20 h-20 object-contain" />
          <img src="/asset/LogoKKP.png" alt="Logo KKP" className="w-20 h-20 object-contain" />
        </div>

        {/* Form login */}
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          onLogin={handleLogin}
        />
      </div>
    </div>
  );
}
