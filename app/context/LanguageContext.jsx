"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio_language");
      if (saved === "TR" || saved === "EN") {
        return saved;
      }
    }
    return "TR";
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language === "TR" ? "tr" : "en";
      document.title =
        language === "TR"
          ? "Seval Naz Karahan | Otomasyon Mühendisi & İş Analisti"
          : "Seval Naz Karahan | Automation Engineer & Business Analyst";
      try {
        localStorage.setItem("portfolio_language", language);
      } catch (e) {
        console.error(e);
      }
    }
  }, [language]);

  const toggleLanguage = () => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      setLanguage((prev) => {
        const next = prev === "TR" ? "EN" : "TR";
        try {
          localStorage.setItem("portfolio_language", next);
        } catch (e) {
          console.error(e);
        }
        return next;
      });
      requestAnimationFrame(() => {
        window.scrollTo({ top: currentScrollY, behavior: "instant" });
      });
      setTimeout(() => {
        window.scrollTo({ top: currentScrollY, behavior: "instant" });
      }, 20);
    } else {
      setLanguage((prev) => (prev === "TR" ? "EN" : "TR"));
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}