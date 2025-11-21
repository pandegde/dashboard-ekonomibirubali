"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Typing text animasi realistis dengan caret
const TypingText = ({ text, speed = 30 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index === text.length) clearInterval(typingInterval);
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  useEffect(() => {
    const caretInterval = setInterval(() => {
      setShowCaret((prev) => !prev);
    }, 500);
    return () => clearInterval(caretInterval);
  }, []);

  return (
    <div className="text-black md:text-lg max-w-2xl mx-auto text-center font-mono min-h-[80px]">
      {displayedText}
      <span className="inline-block w-[1ch]">{showCaret ? "|" : " "}</span>
    </div>
  );
};

export default function HomePage() {
  // Shimmer warna cahaya bergerak
  const [lightColor, setLightColor] = useState("#ffffff");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    let hue = 180;
    const interval = setInterval(() => {
      hue += 0.5;
      if (hue > 360) hue = 0;
      setLightColor(`hsl(${hue}, 90%, 75%)`);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const enableSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setSoundEnabled(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#1e2a3b]">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/asset/backgroundvid.mp4" type="video/mp4" />
      </video>

      {/* Tombol nyalakan suara */}
      {!soundEnabled && (
        <button
          onClick={enableSound}
          className="absolute bottom-6 right-6 z-20 bg-white/20 hover:bg-white px-4 py-2 rounded-lg shadow-md"
        >
          🔊 
        </button>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50"></div>

      {/* Content */}
      <motion.div
        className="relative w-full max-w-[1400px] p-8 flex flex-col items-center gap-6 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* 3 Logo */}
        <motion.div
          className="flex items-center gap-7 mb-0"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Image src="/asset/logoBali.png" alt="Logo Bali" width={100} height={100} />
          <Image src="/asset/logodkp.png" alt="Logo DKP" width={150} height={150} />
          <Image src="/asset/LogoKKP.png" alt="Logo KKP" width={100} height={100} />
        </motion.div>

        {/* Box utama */}
        <motion.div
          className="glass-box bg-white/50 rounded-2xl shadow-xl p-8 flex flex-col border border-white items-center gap-6 text-center relative overflow-hidden min-h-[220px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-700 to-indigo-700 bg-clip-text text-transparent">
            EKONOMI BIRU PROVINSI BALI
          </h1>

          {/* Teks mengetik */}
          <TypingText text="Nangun Sat Kerthi Loka Bali melalui pola pembangunan Semesta Berencana dalam Bali Era Baru" />

          {/* Tombol HOME */}
          <motion.a
            href="/dashboard"
            className="glass-box text-white bg-gradient-to-r from-cyan-500 to-blue-800 hover:from-red-400 hover:to-red-800 px-6 py-2 rounded-xl font-light shadow-md hover:shadow-cyan-400/30 transition-transform hover:scale-105"
            animate={{ y: [0, -10, 0], opacity: [0.8, 1, 0.8], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
          >
            HOME
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
