"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "works", "about", "expertise", "contact"];
      const triggerY = window.innerHeight * 0.4;

      let current = "";

      if (window.scrollY < 180) {
        current = "home";
      } else {
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= triggerY && rect.bottom >= triggerY) {
              current = sectionId;
              break;
            }
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      const element = document.getElementById(id);
      if (element) {
        if (id === "contact") {
          // İletişim bölümünün içeriğini (başlık + 'Bana Ulaşın' butonu) Navbar ile ekran dibi arasında tam simetrik olarak ortala
          const contentEl = document.getElementById("contact-content") || element;
          const rect = contentEl.getBoundingClientRect();
          const contentCenter = rect.top + window.pageYOffset + (rect.height / 2);
          const navHeight = 65;
          const visualCenter = navHeight + (window.innerHeight - navHeight) / 2;
          const y = contentCenter - visualCenter;
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        } else {
          const yOffset = -70;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      } else {
        window.location.href = `/#${id}`;
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.75, duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800/60 px-4 sm:px-8 py-3.5 flex items-center justify-between"
      >
        {/* 1. SOL: Logo / Turuncu İkon */}
        <div className="flex items-center">
          <button type="button" onClick={() => scrollTo("home")} className="p-1 cursor-pointer focus:outline-none" aria-label="Go to Home">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#FB4617] rounded-sm shadow-[0_0_10px_rgba(251,70,23,0.5)]"></div>
          </button>
        </div>

        {/* 2. ORTA: Tam Ekran Ortasında Konumlanan 4 Menü Öğesi */}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2 lg:gap-3 text-[13px] lg:text-[14px] font-medium tracking-wide">
          <button
            type="button"
            onClick={() => scrollTo("home")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer select-none ${
              activeSection === "home"
                ? "text-white font-semibold bg-neutral-900 shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
            }`}
          >
            {language === "TR" ? "Anasayfa" : "Home"}
          </button>

          <button
            type="button"
            onClick={() => scrollTo("works")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer select-none ${
              activeSection === "works"
                ? "text-white font-semibold bg-neutral-900 shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
            }`}
          >
            {language === "TR" ? "Projeler" : "Works"}
          </button>

          <button
            type="button"
            onClick={() => scrollTo("about")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer select-none ${
              activeSection === "about"
                ? "text-white font-semibold bg-neutral-900 shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
            }`}
          >
            {language === "TR" ? "Hakkımda" : "About"}
          </button>

          <button
            type="button"
            onClick={() => scrollTo("expertise")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer select-none ${
              activeSection === "expertise"
                ? "text-white font-semibold bg-neutral-900 shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
            }`}
          >
            {language === "TR" ? "Uzmanlık" : "Expertise"}
          </button>
        </nav>

        {/* 3. SAĞ: İletişim Butonu & Dil Anahtarı (TR/EN) & Mobil Menü Hamburger */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3.5">
          {/* TR/ENG Solundaki İletişim Butonu */}
          <button
            type="button"
            onClick={() => scrollTo("contact")}
            className={`hidden md:flex px-4 py-1.5 rounded-full border transition-all duration-300 cursor-pointer select-none items-center gap-1.5 text-xs font-mono tracking-wider shadow-sm active:scale-95 ${
              activeSection === "contact"
                ? "bg-[#FB4617] text-white border-[#FB4617] shadow-[0_0_15px_rgba(251,70,23,0.5)] font-semibold"
                : "border-neutral-700 bg-neutral-900/80 text-neutral-200 hover:text-white hover:border-[#FB4617] hover:bg-[#FB4617]"
            }`}
          >
            <span>{language === "TR" ? "İLETİŞİM" : "CONTACT"}</span>
            <span className="text-xs">↗</span>
          </button>

          {/* Siyah Dil Anahtarı */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="bg-black border border-neutral-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-mono select-none transition-all duration-300 hover:border-neutral-700 shadow-inner cursor-pointer"
            title="Change Language / Dili Değiştir"
          >
            <span
              className={`transition-colors duration-300 ${
                language === "TR"
                  ? "text-[#FB4617] font-bold"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              TR
            </span>
            <span className="text-neutral-700">|</span>
            <span
              className={`transition-colors duration-300 ${
                language === "EN"
                  ? "text-[#FB4617] font-bold"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              EN
            </span>
          </button>

          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white border border-neutral-800 rounded-xl bg-neutral-900/60 focus:outline-none transition-colors"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </motion.header>

      {/* MOBİL MENÜ MODAL / SLIDE-DOWN DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 top-[65px] z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-neutral-800/80 px-6 py-8 md:hidden shadow-2xl flex flex-col gap-6"
          >
            <nav className="flex flex-col gap-5 text-lg font-light tracking-wide">
              <button
                onClick={() => scrollTo("home")}
                className={`text-left transition-colors flex items-center justify-between ${
                  activeSection === "home" ? "text-white font-medium" : "text-neutral-400"
                }`}
              >
                <span>{language === "TR" ? "Anasayfa" : "Home"}</span>
                <span className="text-xs font-mono text-neutral-600">01</span>
              </button>

              <button
                onClick={() => scrollTo("works")}
                className={`text-left transition-colors flex items-center justify-between ${
                  activeSection === "works" ? "text-white font-medium" : "text-neutral-400"
                }`}
              >
                <span>{language === "TR" ? "Projeler" : "Works"}</span>
                <span className="text-xs font-mono text-neutral-600">02</span>
              </button>

              <button
                onClick={() => scrollTo("about")}
                className={`text-left transition-colors flex items-center justify-between ${
                  activeSection === "about" ? "text-white font-medium" : "text-neutral-400"
                }`}
              >
                <span>{language === "TR" ? "Hakkımda" : "About"}</span>
                <span className="text-xs font-mono text-neutral-600">03</span>
              </button>

              <button
                onClick={() => scrollTo("expertise")}
                className={`text-left transition-colors flex items-center justify-between ${
                  activeSection === "expertise" ? "text-white font-medium" : "text-neutral-400"
                }`}
              >
                <span>{language === "TR" ? "Uzmanlık" : "Expertise"}</span>
                <span className="text-xs font-mono text-neutral-600">04</span>
              </button>

              <button
                onClick={() => scrollTo("contact")}
                className={`text-left transition-colors flex items-center justify-between ${
                  activeSection === "contact" ? "text-white font-medium" : "text-neutral-400"
                }`}
              >
                <span>{language === "TR" ? "İletişim" : "Contact"}</span>
                <span className="text-xs font-mono text-neutral-600">05</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}