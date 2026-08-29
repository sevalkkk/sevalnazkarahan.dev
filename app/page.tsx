"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import WorksSection from "./components/WorksSection";
import AboutSection from "./components/AboutSection";
import ManifestoBanner from "./components/ManifestoBanner";
import ExpertiseSection from "./components/ExpertiseSection";
import Link from "next/link";
import { useLanguage } from "./context/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";

import SplashScreen from "./components/SplashScreen";

export default function Home() {
  const { language } = useLanguage();
  const [introDone, setIntroDone] = useState(false);
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      if (
        sessionStorage.getItem("return_to_contact") === "true" ||
        window.location.search.includes("from_contact") ||
        window.location.hash === "#contact"
      ) {
        return false;
      }
    }
    return true;
  });
  const [visitorCount, setVisitorCount] = useState(0);
  const hasFetchedVisitor = useRef(false);

  // İletişimden dönüşte Home sayfasını hiç göstermeden ANINDA ve simetrik ortalanmış olarak İletişim alanına konumlanma
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }

      const isFromContact =
        sessionStorage.getItem("return_to_contact") === "true" ||
        window.location.search.includes("from_contact") ||
        window.location.hash === "#contact";

      if (isFromContact) {
        sessionStorage.removeItem("return_to_contact");
        setShowSplash(false);
        setIntroDone(true);

        const positionToContact = () => {
          const contentEl = document.getElementById("contact-content") || document.getElementById("contact");
          if (contentEl) {
            const rect = contentEl.getBoundingClientRect();
            const contentCenter = rect.top + window.pageYOffset + (rect.height / 2);
            const navHeight = 65;
            const visualCenter = navHeight + (window.innerHeight - navHeight) / 2;
            const y = contentCenter - visualCenter;
            window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
          }
        };

        positionToContact();
        requestAnimationFrame(positionToContact);
        setTimeout(positionToContact, 30);

        if (window.location.search || window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      } else {
        // Contact alanından gelinmediği TÜM durumlarda (sayfa yenileme F5, hangi bölümde olunursa olunsun):
        // Her zaman ilk açılış ekranı olan turuncu karşılama alanı gelir, ardından Home sayfasına döner.
        setShowSplash(true);
        setIntroDone(false);

        window.scrollTo({ top: 0, behavior: "instant" });
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    }
  }, []);

  // Tarayıcı sekme başlığını Seval Naz Karahan olarak ayarla
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title =
        language === "TR"
          ? "Seval Naz Karahan | Otomasyon Mühendisi"
          : "Seval Naz Karahan | Automation Engineer";
    }
  }, [language]);

  useEffect(() => {
    if (hasFetchedVisitor.current) return;
    hasFetchedVisitor.current = true;

    async function handleVisitor() {
      try {
        let deviceId = localStorage.getItem("portfolio_device_id");
        if (!deviceId) {
          deviceId = "dev_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
          localStorage.setItem("portfolio_device_id", deviceId);
        }

        const alreadyCounted = localStorage.getItem("portfolio_has_counted") === "true";

        let response: Response;
        if (!alreadyCounted) {
          localStorage.setItem("portfolio_has_counted", "true");
          response = await fetch(`/api/visitor?t=${Date.now()}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deviceId }),
            cache: "no-store",
          });
        } else {
          response = await fetch(`/api/visitor?t=${Date.now()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          });
        }

        if (response.ok) {
          const data = await response.json();
          if (typeof data.count === "number") {
            setVisitorCount(data.count);
          }
        }
      } catch (error) {
        console.error("Ziyaretçi sayacı yüklenemedi:", error);
      }
    }

    handleVisitor();

    // Sayfaya her odaklanıldığında veya sekme yenilendiğinde en taze canlı sayıyı çek
    const handleFocus = () => {
      fetch(`/api/visitor?t=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (typeof data?.count === "number") {
            setVisitorCount(data.count);
          }
        })
        .catch(() => {});
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const bannerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  });
  // Sayfa aşağı kaydırıldıkça aşağı, yukarı kaydırıldıkça yukarı süzülüp mor alandan kaybolma (Benjamin Hoang Fiziği)
  const bannerYTranslate = useTransform(scrollYProgress, [0, 1], [-80, 120]);

  const footerBannerRef = useRef(null);
  const { scrollYProgress: footerScrollProgress } = useScroll({
    target: footerBannerRef,
    offset: ["start end", "end start"],
  });
  const footerYTranslate = useTransform(footerScrollProgress, [0, 1], [-80, 120]);

  // Contact Alanı İçin Tam Merkezde En Büyük (Peak 1.05x) Olan, Aşağı veya Yukarı Kaydırdıkça Küçülen Parabolik Scroll Fiziği
  const contactRef = useRef(null);
  const { scrollYProgress: contactScrollProgress } = useScroll({
    target: contactRef,
    offset: ["start end", "end start"],
  });
  const contactScale = useTransform(contactScrollProgress, [0, 0.5, 1], [0.6, 1.05, 0.6]);
  const contactOpacity = useTransform(contactScrollProgress, [0, 0.25, 0.5, 0.75, 1], [0.2, 0.9, 1, 0.9, 0.2]);
  const contactY = useTransform(contactScrollProgress, [0, 0.5, 1], [60, 0, -60]);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen selection:bg-white/20 selection:text-white overflow-x-hidden relative">

      {/* AÇILIŞ SPLASH SCREEN ANIMASYONU (Sadece ilk girişte gösterilir, geri dönüşlerde gösterilmez) */}
      {showSplash && <SplashScreen onComplete={() => setIntroDone(true)} />}

      <Navbar />

      {/* 1. HOME SECTION */}
      <section id="home" className="min-h-[82vh] sm:min-h-[85vh] pt-20 sm:pt-24 md:pt-26 pb-4 sm:pb-6 px-4 sm:px-6 md:px-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/hero-bg.jpg"
            alt="Hero Background"
            fill
            priority
            unoptimized
            className="object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10 text-center lg:text-left my-auto">
          {/* AVATAR / PROFILE CARD REVEAL (SEÇİLMİŞ PROJELER İLE TAM AYNI SOL HİZADA) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 1.8,
              duration: 0.75,
              type: "spring",
              stiffness: 180,
              damping: 18,
            }}
            className="lg:col-span-4 flex justify-start items-center"
          >
            <div
              className="relative w-full max-w-[240px] sm:max-w-[260px] lg:max-w-[280px] aspect-[4/5] bg-neutral-900/85 backdrop-blur-sm rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl group select-none"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              style={{
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
            >
              <Image
                src="/profile.jpg"
                alt="Seval Naz Karahan"
                fill
                priority
                unoptimized
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 pointer-events-none" />

              {/* Görünmez Koruma Katmanı (Sağ tık, indirme, kopyalama ve uzun basmayı engeller) */}
              <div
                className="absolute inset-0 z-20 select-none pointer-events-auto"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />

              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex justify-between items-center text-[10px] sm:text-xs font-mono text-neutral-300 z-30 pointer-events-none select-none">
                <span>SEVAL NAZ KARAHAN</span>
                <span>©2022—2026</span>
              </div>
            </div>
          </motion.div>

          {/* HEADLINE & ABOUT TAG REVEAL (YATAYDA GENİŞLETİLMİŞ VE DENGELENMİŞ) */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4 flex flex-col items-center lg:items-start justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.5, ease: "easeOut" }}
              className="flex items-center gap-2.5"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FB4617] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FB4617] shadow-[0_0_8px_#FB4617]" />
              </span>
              <span className="text-xs font-mono text-[#FB4617] uppercase tracking-widest font-semibold block">
                {language === "TR" ? "// OTOMASYON MÜHENDİSİ & İŞ ANALİSTİ" : "// AUTOMATION ENGINEER & BUSINESS ANALYST"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 2.0,
                duration: 0.8,
                type: "spring",
                stiffness: 150,
                damping: 18,
              }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] font-light tracking-tight leading-[1.12] w-full max-w-none"
            >
              {language === "TR" ? (
                <>
                  Ben <span className="font-semibold text-white">Seval Naz Karahan</span>, <br />
                  Türkiye merkezli bir <span className="font-semibold text-white">Otomasyon Mühendisi & İş Analistiyim.</span>
                </>
              ) : (
                <>
                  I'm <span className="font-semibold text-white">Seval Naz Karahan</span>, <br />
                  an <span className="font-semibold text-white">Automation Engineer & Business Analyst</span> based in Türkiye.
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1, duration: 0.6, ease: "easeOut" }}
              className="text-xs sm:text-sm md:text-base text-neutral-400 font-light max-w-2xl leading-relaxed"
            >
              {language === "TR"
                ? "3 yılı aşkın deneyimimle; süreç analizi, gereksinim toplama (PDD/ODD/TDD), paydaş yönetimi ve UiPath tabanlı uçtan uca kurumsal RPA süreçleri geliştiriyorum."
                : "With 3+ years of experience delivering end-to-end process analysis, requirements discovery (PDD/ODD/TDD), stakeholder management, and scalable UiPath enterprise RPA solutions."}
            </motion.p>
          </div>
        </div>

        {/* BOTTOM METADATA BAR REVEAL */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.5, ease: "easeOut" }}
          className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-mono text-neutral-400 relative z-10 pt-2 sm:pt-4"
        >
          <div>/ 2026 /</div>
          <div>Scroll down</div>
        </motion.div>
      </section>

      {/* HOME & WORKS ARASINDAKİ KAYAN BANNER */}
      <section className="relative w-full bg-[#0a0a0a] pt-8 sm:pt-12 md:pt-16 pb-32 sm:pb-40 md:pb-48 overflow-hidden z-10">
        {/* Üst ve alt ipeksi geçiş örtüleri */}
        <div className="absolute top-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20 pointer-events-none" />

        <div
          ref={bannerRef}
          className="relative w-full bg-[#110c26] text-indigo-100 py-14 sm:py-18 md:py-24 lg:py-28 overflow-hidden"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
          }}
        >
          <motion.div style={{ y: bannerYTranslate }} className="flex whitespace-nowrap overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 38 }}
              className="flex items-center gap-6 sm:gap-12 text-[13vw] sm:text-[11vw] md:text-[9.5vw] lg:text-[8.5vw] font-medium leading-none tracking-[-0.05em] select-none pr-6 sm:pr-12 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] [text-shadow:_0_4px_30px_rgba(0,0,0,0.7),_0_2px_8px_rgba(0,0,0,0.85),_0_0_45px_rgba(99,102,241,0.3)]"
            >
              <span className="flex items-center gap-6 sm:gap-12 shrink-0" lang={language === "TR" ? "tr" : "en"}>
                <span>Seval Naz Karahan</span>
                <span className="text-indigo-300/90 font-light text-[0.88em]">©</span>
                <span>{language === "TR" ? "Otomasyon Mühendisi & İş Analisti" : "Automation Engineer & Business Analyst"}</span>
                <span className="text-indigo-400 text-[0.55em]">•</span>
              </span>
              <span className="flex items-center gap-6 sm:gap-12 shrink-0" lang={language === "TR" ? "tr" : "en"}>
                <span>Seval Naz Karahan</span>
                <span className="text-indigo-300/90 font-light text-[0.88em]">©</span>
                <span>{language === "TR" ? "Otomasyon Mühendisi & İş Analisti" : "Automation Engineer & Business Analyst"}</span>
                <span className="text-indigo-400 text-[0.55em]">•</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. WORKS SECTION */}
      <WorksSection />

      {/* 3. ABOUT SECTION (HAKKIMDA) */}
      <AboutSection />

      {/* 4. MANIFESTO BANNER (YAZI) */}
      <ManifestoBanner />

      {/* 5. EXPERTISE & METHODOLOGY SECTION (UZMANLIK) */}
      <ExpertiseSection />

      {/* 6. CONTACT SECTION */}
      <section ref={contactRef} id="contact" className="scroll-mt-20 py-28 sm:py-36 md:py-48 px-4 sm:px-6 md:px-16 bg-[#0a0a0a] flex items-center justify-center text-center relative z-10 overflow-hidden">
        {/* Üstten ve alttan ekstra derin, ipeksi yumuşak geçiş gradient maskeleri */}
        <div className="absolute top-0 inset-x-0 h-56 sm:h-80 md:h-96 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-56 sm:h-80 md:h-96 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent z-20 pointer-events-none" />

        {/* Arka Plan Görseli (Hero & Manifesto ile Birebir Aynı Parlaklık & Netlik) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Contact Section Background"
            fill
            unoptimized
            className="object-cover object-center scale-105 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/70" />
        </div>

        <motion.div
          id="contact-content"
          style={{ scale: contactScale, opacity: contactOpacity, y: contactY }}
          className="max-w-5xl mx-auto space-y-8 sm:space-y-12 relative z-10 will-change-transform origin-center"
        >
          <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.15] text-neutral-100 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            {language === "TR" ? (
              <>
                Süreçlerinizi otonom hale <br />
                getirmeye hazır mısınız? <br />
                <span className="text-neutral-400">Birlikte</span>{" "}
                <span className="text-[#FB4617]">inşa edelim!</span>
              </>
            ) : (
              <>
                Ready to automate your <br />
                enterprise processes? <br />
                <span className="text-neutral-400">Let's build</span>{" "}
                <span className="text-[#FB4617]">together!</span>
              </>
            )}
          </h2>

          <div className="pt-2 sm:pt-6 flex justify-center">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0px 1.5px rgba(168, 85, 247, 0.45), 0 0 15px 2px rgba(147, 51, 234, 0.3)",
                  "0 0 0px 2.5px rgba(192, 132, 252, 0.95), 0 0 35px 8px rgba(168, 85, 247, 0.7), 0 0 55px 15px rgba(126, 34, 206, 0.35)",
                  "0 0 0px 1.5px rgba(168, 85, 247, 0.45), 0 0 15px 2px rgba(147, 51, 234, 0.3)",
                ],
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-full relative group transition-all duration-300 hover:shadow-[0_0_35px_rgba(168,85,247,0.6)]"
            >
              {/* Arka plan hızlı nefes alan mor parıltı aurası */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.85, 0.3],
                  scale: [0.96, 1.06, 0.96],
                }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 group-hover:from-purple-500 group-hover:via-indigo-500 group-hover:to-purple-500 blur-md pointer-events-none -z-10 transition-colors duration-300"
              />

              <Link
                href="/contact"
                className="px-7 sm:px-9 py-4 sm:py-4.5 rounded-full border border-purple-500/70 hover:border-white hover:bg-white hover:ring-2 hover:ring-white/60 text-xs sm:text-sm font-mono tracking-wider transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-2xl hover:scale-105 active:scale-95 bg-[#0a0a0a]/90 hover:backdrop-blur-xl cursor-pointer relative z-10 font-medium overflow-hidden"
              >
                <span className="text-white group-hover:text-black group-hover:scale-110 group-hover:font-bold transition-all duration-300 transform origin-center inline-block">
                  {language === "TR" ? "BANA ULAŞIN" : "GET IN TOUCH"}
                </span>
                <span className="text-purple-300 group-hover:text-black group-hover:scale-125 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 transform font-bold inline-block">
                  ↗
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 5. "LET'S CONNECT" / "İLETİŞİME GEÇİN" KAYAN BANNER VE FOOTER ALANI */}
      <section className="relative w-full bg-[#0a0a0a] pt-6 sm:pt-8 pb-10 sm:pb-14 overflow-hidden z-20">
        {/* Üst ve alt ipeksi geçiş örtüleri */}
        <div className="absolute top-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20 pointer-events-none" />

        <div
          ref={footerBannerRef}
          className="relative w-full bg-[#110c26] text-indigo-100 py-14 sm:py-18 md:py-24 lg:py-28 overflow-hidden mb-10 sm:mb-14"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
          }}
        >
          <motion.div style={{ y: footerYTranslate }} className="flex whitespace-nowrap overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 72 }}
              className="flex items-center gap-6 sm:gap-12 text-[13vw] sm:text-[11vw] md:text-[9.5vw] lg:text-[8.5vw] font-medium leading-none tracking-[-0.05em] select-none pr-6 sm:pr-12 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] [text-shadow:_0_4px_30px_rgba(0,0,0,0.7),_0_2px_8px_rgba(0,0,0,0.85),_0_0_45px_rgba(99,102,241,0.3)]"
            >
              <span className="flex items-center gap-6 sm:gap-12 shrink-0" lang={language === "TR" ? "tr" : "en"}>
                <span>{language === "TR" ? "İletişime Geçin" : "Let's Connect"}</span>
                <span className="text-indigo-300/90 font-light text-[0.88em]">©</span>
                <span>{language === "TR" ? "Otomasyon Mimarisi" : "Automation Architecture"}</span>
                <span className="text-indigo-400 text-[0.55em]">•</span>
                <span>{language === "TR" ? "İletişime Geçin" : "Let's Connect"}</span>
                <span className="text-indigo-300/90 font-light text-[0.88em]">©</span>
                <span>{language === "TR" ? "İş Analizi" : "Business Analysis"}</span>
                <span className="text-indigo-400 text-[0.55em]">•</span>
                <span>{language === "TR" ? "İletişime Geçin" : "Let's Connect"}</span>
                <span className="text-indigo-300/90 font-light text-[0.88em]">©</span>
                <span>{language === "TR" ? "Otonom Süreçler" : "Autonomous Processes"}</span>
                <span className="text-indigo-400 text-[0.55em]">•</span>
              </span>
              <span className="flex items-center gap-6 sm:gap-12 shrink-0" lang={language === "TR" ? "tr" : "en"}>
                <span>{language === "TR" ? "İletişime Geçin" : "Let's Connect"}</span>
                <span className="text-indigo-300/90 font-light text-[0.88em]">©</span>
                <span>{language === "TR" ? "Otomasyon Mimarisi" : "Automation Architecture"}</span>
                <span className="text-indigo-400 text-[0.55em]">•</span>
                <span>{language === "TR" ? "İletişime Geçin" : "Let's Connect"}</span>
                <span className="text-indigo-300/90 font-light text-[0.88em]">©</span>
                <span>{language === "TR" ? "İş Analizi" : "Business Analysis"}</span>
                <span className="text-indigo-400 text-[0.55em]">•</span>
                <span>{language === "TR" ? "İletişime Geçin" : "Let's Connect"}</span>
                <span className="text-indigo-300/90 font-light text-[0.88em]">©</span>
                <span>{language === "TR" ? "Otonom Süreçler" : "Autonomous Processes"}</span>
                <span className="text-indigo-400 text-[0.55em]">•</span>
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* YENİ NESİL KUSURSUZ HİZALI 4 SÜTUNLU PREMIUM FOOTER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 space-y-12 sm:space-y-14 relative z-10 pt-4">

          {/* ÜST KATMAN: 4 SÜTUNLU KUSURSUZ HİZALI IZGARA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-10 border-b border-neutral-800/80">

            {/* Sütun 1: İsim & Unvan & Kısa Özet */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#FB4617] rounded-sm shadow-[0_0_8px_rgba(251,70,23,0.6)]" />
                <span className="text-sm font-semibold text-white tracking-tight">SEVAL NAZ KARAHAN</span>
              </div>
              <p className="text-neutral-400 leading-relaxed font-sans text-xs">
                {language === "TR"
                  ? "Uçtan Uca Kurumsal Otomasyon Mühendisliği, REFramework & Süreç Analizi."
                  : "End-to-End Enterprise Automation Engineering, REFramework & Process Analysis."}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{language === "TR" ? "Global / Uzaktan Çalışmaya Açık" : "Available for Remote / Global"}</span>
              </div>
            </div>

            {/* Sütun 2: Yetkinlik & Eğitim */}
            <div className="space-y-3.5">
              <span className="text-[11px] uppercase tracking-widest text-[#FB4617] font-semibold block">
                {language === "TR" ? "// EĞİTİM & SERTİFİKA" : "// EDUCATION & CERTS"}
              </span>
              <ul className="space-y-2.5 text-neutral-300 text-xs">
                <li className="flex flex-col">
                  <span className="text-white font-medium">Pamukkale Üniversitesi</span>
                  <span className="text-neutral-500 text-[11px]">{language === "TR" ? "Bilgisayar Mühendisliği" : "B.S. Computer Engineering"}</span>
                </li>
                <li className="flex flex-col pt-0.5">
                  <span className="text-white font-medium">UiPath Certified</span>
                  <span className="text-neutral-500 text-[11px]">{language === "TR" ? "Otomasyon & RPA Çözümleri" : "Automation & RPA Solutions"}</span>
                </li>
              </ul>
            </div>

            {/* Sütun 3: Hızlı Navigasyon */}
            <div className="space-y-3.5">
              <span className="text-[11px] uppercase tracking-widest text-[#FB4617] font-semibold block">
                {language === "TR" ? "// HIZLI ERİŞİM" : "// NAVIGATION"}
              </span>
              <ul className="space-y-2 text-neutral-300 text-xs">
                <li>
                  <a href="#home" className="hover:text-[#FB4617] transition-colors flex items-center gap-1.5">
                    <span className="text-[#FB4617]">→</span>
                    <span>{language === "TR" ? "Anasayfa" : "Home"}</span>
                  </a>
                </li>
                <li>
                  <a href="#works" className="hover:text-[#FB4617] transition-colors flex items-center gap-1.5">
                    <span className="text-[#FB4617]">→</span>
                    <span>{language === "TR" ? "Seçilmiş Projeler (08)" : "Selected Works (08)"}</span>
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#FB4617] transition-colors flex items-center gap-1.5">
                    <span className="text-[#FB4617]">→</span>
                    <span>{language === "TR" ? "Teknoloji Yörüngesi" : "Tech Orbit"}</span>
                  </a>
                </li>
                <li>
                  <a href="#expertise" className="hover:text-[#FB4617] transition-colors flex items-center gap-1.5">
                    <span className="text-[#FB4617]">→</span>
                    <span>{language === "TR" ? "Uzmanlık & Simülatör" : "Expertise & Lab"}</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Sütun 4: İletişim & Konum */}
            <div className="space-y-3.5">
              <span className="text-[11px] uppercase tracking-widest text-[#FB4617] font-semibold block">
                {language === "TR" ? "// İLETİŞİM" : "// CONTACT & SOCIAL"}
              </span>
              <div className="space-y-2 text-neutral-300 text-xs">
                <a
                  href="mailto:sevalnazkarahan@gmail.com"
                  className="hover:text-white transition-colors underline underline-offset-4 block truncate"
                >
                  sevalnazkarahan@gmail.com
                </a>
                <a
                  href="https://www.linkedin.com/in/seval-naz-karahan-188525210/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FB4617] hover:underline flex items-center gap-1 font-semibold pt-1"
                >
                  <span>LinkedIn {language === "TR" ? "Profili" : "Profile"}</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

          </div>

          {/* ALT KATMAN: CANLI METRİKLER & TELİF HAKLARI */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-mono">

            {/* Sol: Konum & Canlı Ziyaretçi */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-neutral-500">📍</span>
                <span>{language === "TR" ? "İzmir / Türkiye" : "Izmir / Türkiye"}</span>
              </div>
              <div className="w-px h-3.5 bg-neutral-800" />
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-neutral-400">
                  {language === "TR" ? "Toplam Ziyaretçi:" : "Total Visitors:"}
                </span>
                <span className="text-white font-bold">{visitorCount > 0 ? visitorCount : "..."}</span>
              </div>
            </div>

            {/* Sağ: Telif Hakları */}
            <div className="text-center sm:text-right text-neutral-500">
              {language === "TR"
                ? "©2026 SEVAL NAZ KARAHAN • TÜM HAKLARI SAKLIDIR"
                : "©2026 SEVAL NAZ KARAHAN • ALL RIGHTS RESERVED"}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}