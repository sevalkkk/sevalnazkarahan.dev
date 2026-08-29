"use client";

import { motion } from "framer-motion";

export default function Marquee() {
  const item = (
    <span className="flex items-center gap-6">
      <span>Seval Naz Karahan</span>
      <span className="inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-white/40 text-white/60 text-xl md:text-3xl font-light">
        ©
      </span>
      <span>Türkiye</span>
      <span className="inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-white/40 text-white/60 text-xl md:text-3xl font-light">
        ©
      </span>
    </span>
  );

  return (
    <div className="w-full bg-[#4F46E5] py-6 md:py-10 overflow-hidden whitespace-nowrap flex select-none">
      <motion.div
        className="flex gap-6 text-6xl sm:text-7xl md:text-9xl font-medium tracking-tight text-white items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 65, // Süre 65 saniyeye çıkarıldı (son derece yavaş ve sakin kayar)
        }}
      >
        <div className="flex items-center gap-6">
          {item}
          {item}
          {item}
          {item}
        </div>
        <div className="flex items-center gap-6">
          {item}
          {item}
          {item}
          {item}
        </div>
      </motion.div>
    </div>
  );
}