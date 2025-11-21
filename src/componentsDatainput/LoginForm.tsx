"use client";
import React from "react";

type Props = {
  username: string;
  password: string;
  setUsername: (val: string) => void;
  setPassword: (val: string) => void;
  onLogin: () => void;
};

export default function LoginForm({ username, password, setUsername, setPassword, onLogin }: Props) {
  return (
    <div className="glass-box bg-white/20 backdrop-blur-xl rounded-3xl shadow-xl w-full max-w-md p-8 text-white border border-white/30">
      <h1 className="text-3xl font-bold mb-6 text-center tracking-wide">
        SELAMAT DATANG
      </h1>

      <div className="mb-8">
        <label className="block text-white text-sm font-medium mb-2">Username :</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Masukkan username..."
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/20 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-red-500 text-black transition-transform hover:scale-105"
        />
      </div>

      <div className="mb-8">
        <label className="block text-white text-sm font-medium mb-2">Password :</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Masukkan password..."
          className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/20 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-red-500 text-black transition-transform hover:scale-105"
        />
      </div>

      <button
        onClick={onLogin}
        className="glass-box w-30 py-2 mx-auto block rounded-lg bg-white text-gray-900 font-semibold hover:bg-red-500 transition-transform hover:scale-105"
      >
        Login
      </button>
    </div>
  );
}
