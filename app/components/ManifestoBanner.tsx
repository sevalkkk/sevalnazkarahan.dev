"use client";

import { useRef } from "react";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ManifestoBanner() {
  const { language } = useLanguage();
  const manifestoRef = useRef<HTMLDivElement>(null);

  // Scroll takibi ile her satırın sağdan ve soldan kayarak ortada hizalanması
  const { scrollYProgress } = useScroll({
    target: manifestoRef,
    offset: ["start end", "end start"],
  });

  // 1. Satır: Soldan görünmeyen alandan gelip ortada durur
  const x1 = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [-260, 0, 0, 260]);
  // 2. Satır: Sağdan görünmeyen alandan gelip ortada durur
  const x2 = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [260, 0, 0, -260]);
  // 3. Satır: Soldan görünmeyen alandan gelip ortada durur
  const x3 = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [-260, 0, 0, 260]);

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.15, 1, 1, 0.15]);

  return (
    <section
      ref={manifestoRef}
      className="relative w-full min-h-[85vh] lg:min-h-screen py-24 sm:py-32 md:py-40 px-4 sm:px-8 md:px-20 flex items-center justify-center overflow-hidden bg-[#0a0a0a] z-10"
    >
      {/* Üstten ve alttan ekstra derin, ipeksi yumuşak geçiş sağlayan simetrik gradient maskeleri */}
      <div className="absolute top-0 inset-x-0 h-56 sm:h-80 md:h-96 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-56 sm:h-80 md:h-96 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent z-20 pointer-events-none" />

      {/* Arka Plan Görseli (Hero ile Birebir Aynı Parlaklık & Netlik) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/hero-bg.jpg"
          alt="Manifesto Background"
          fill
          unoptimized
          className="object-cover object-center scale-105 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/70" />
      </div>

      {/* Manifesto Yazı İçeriği (Her satır sağdan ve soldan kayarak ortada hizalanır) */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full max-w-6xl mx-auto text-center flex flex-col items-center py-6 sm:py-10 will-change-transform"
      >
        <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.38] md:leading-[1.48] text-center text-neutral-400 w-full space-y-3 sm:space-y-4 md:space-y-5">
          {language === "TR" ? (
            <>
              {/* 1. SATIR: Soldan Gelir */}
              <motion.div style={{ x: x1 }} className="will-change-transform">
                <p>
                  Teknoloji bir araç,{" "}
                  <span className="font-medium italic text-white">ölçeklenebilirlik</span>{" "}
                  ise hedeftir.
                </p>
              </motion.div>

              {/* 2. SATIR: Sağdan Gelir */}
              <motion.div style={{ x: x2 }} className="will-change-transform">
                <p>
                  <span className="text-neutral-200 font-normal">Yazılım geliştirme</span> ve{" "}
                  <span className="text-neutral-200 font-normal">süreç analizi</span> disiplinlerini birleştirerek,
                </p>
              </motion.div>

              {/* 3. SATIR: Soldan Gelir */}
              <motion.div style={{ x: x3 }} className="will-change-transform">
                <p>
                  iş akışlarını{" "}
                  <span className="font-medium italic text-white">kusursuz işleyen dijital mimarilere</span>{" "}
                  dönüştürüyorum.
                </p>
              </motion.div>
            </>
          ) : (
            <>
              {/* 1. LINE: Enters from Left */}
              <motion.div style={{ x: x1 }} className="will-change-transform">
                <p>
                  Technology is a tool,{" "}
                  <span className="font-medium italic text-white">scalability</span>{" "}
                  is the goal.
                </p>
              </motion.div>

              {/* 2. LINE: Enters from Right */}
              <motion.div style={{ x: x2 }} className="will-change-transform">
                <p>
                  Bridging{" "}
                  <span className="text-neutral-200 font-normal">software engineering</span> and{" "}
                  <span className="text-neutral-200 font-normal">process analysis</span>,
                </p>
              </motion.div>

              {/* 3. LINE: Enters from Left */}
              <motion.div style={{ x: x3 }} className="will-change-transform">
                <p>
                  I transform workflows into{" "}
                  <span className="font-medium italic text-white">flawlessly functioning digital architectures</span>.
                </p>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
