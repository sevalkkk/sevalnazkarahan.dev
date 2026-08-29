"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function ContactPage() {
  const { language, toggleLanguage } = useLanguage();
  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "success" | "rate_limited" | "error"
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title =
        language === "TR"
          ? "Seval Naz Karahan | İletişim"
          : "Seval Naz Karahan | Contact";
    }
  }, [language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setFeedbackMessage("");
    const formElement = e.target;
    const formData = new FormData(formElement);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setFeedbackMessage(
          language === "TR"
            ? data.messageTR || "Mesajınız başarıyla iletildi! En kısa sürede yanıtlayacağım."
            : data.messageEN || "Your message has been sent successfully! I will reply soon."
        );
        formElement.reset();
      } else if (res.status === 429 || data.error === "rate_limited") {
        setStatus("rate_limited");
        setFeedbackMessage(
          language === "TR"
            ? data.messageTR || "Bu e-posta adresiyle son 24 saat içinde zaten bir mesaj gönderdiniz."
            : data.messageEN || "You have already sent a message from this email in the last 24 hours."
        );
      } else {
        setStatus("error");
        setFeedbackMessage(
          language === "TR"
            ? data.messageTR || "Bir hata oluştu, lütfen tekrar deneyin."
            : data.messageEN || "An error occurred, please try again."
        );
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setFeedbackMessage(
        language === "TR"
          ? "Bağlantı hatası oluştu. Lütfen doğrudan e-posta ile ulaşın."
          : "Connection error occurred. Please contact directly via email."
      );
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen selection:bg-white/20 selection:text-white py-8 sm:py-12 px-4 sm:px-6 md:px-16 flex flex-col justify-between relative overflow-hidden">

      {/* Arka plan yumuşak gradyan ışıklandırma */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#FB4617]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Üst Kısım: Geri Dönüş Linki ve Dil Anahtarı */}
      <div className="max-w-7xl mx-auto w-full z-10 flex items-center justify-between">
        <Link
          href="/?from_contact=1#contact"
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("return_to_contact", "true");
            }
          }}
          className="text-xs font-mono text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-2 border border-neutral-800 bg-neutral-900/50 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full cursor-pointer hover:border-purple-500/50"
        >
          ← {language === "TR" ? "Bana Ulaşın Alanına Dön" : "Back to Contact Section"}
        </Link>

        {/* Siyah Dil Anahtarı */}
        <button
          onClick={toggleLanguage}
          className="bg-black border border-neutral-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-mono select-none transition-all duration-300 hover:border-neutral-700 shadow-inner cursor-pointer"
          title="Change Language / Dili Değiştir"
        >
          <span
            className={`transition-colors duration-300 ${language === "TR"
                ? "text-[#FB4617] font-bold"
                : "text-neutral-500 hover:text-white"
              }`}
          >
            TR
          </span>
          <span className="text-neutral-700">|</span>
          <span
            className={`transition-colors duration-300 ${language === "EN"
                ? "text-[#FB4617] font-bold"
                : "text-neutral-500 hover:text-white"
              }`}
          >
            EN
          </span>
        </button>
      </div>

      {/* Orta Kısım: Form ve Bilgiler */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10 my-auto py-8 sm:py-12">

        {/* Sol Taraf: Başlık ve Bilgiler */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FB4617] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FB4617] shadow-[0_0_8px_#FB4617]" />
            </span>
            <span className="text-xs font-mono text-[#FB4617] uppercase tracking-widest font-semibold block">
              {language === "TR" ? "// İLETİŞİM & İŞ BİRLİĞİ" : "// GET IN TOUCH"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.1]">
            {language === "TR" ? (
              <>
                Süreçlerinizi Birlikte <br />
                <span className="font-semibold text-white">Otonomlaştıralım</span>
              </>
            ) : (
              <>
                Let's Automate <br />
                <span className="font-semibold text-white">Your Workflows</span>
              </>
            )}
          </h1>

          <p className="text-neutral-400 font-light max-w-md text-sm sm:text-base leading-relaxed">
            {language === "TR"
              ? "UiPath Otomasyon projeleri, kurumsal süreç analizi (PDD/SDD), yapay zeka destekli belge işleme veya kariyer fırsatları için bana dilediğiniz zaman ulaşabilirsiniz."
              : "Feel free to contact me for enterprise UiPath Automation development, process architecture (PDD/SDD), Document Understanding, or collaboration opportunities."}
          </p>

          <div className="space-y-3.5 pt-2 sm:pt-4 text-xs font-mono text-neutral-300">
            <div className="flex items-center gap-3">
              <span className="text-neutral-500">📧</span>
              <a href="mailto:sevalnazkarahan@gmail.com" className="hover:text-white transition-colors underline underline-offset-4 break-all">
                sevalnazkarahan@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-neutral-500">🔗</span>
              <a
                href="https://www.linkedin.com/in/seval-naz-karahan-188525210/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FB4617] hover:underline"
              >
                linkedin.com/in/seval-naz-karahan ↗
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#FB4617]">📍</span>
              <span>{language === "TR" ? "İzmir / Türkiye • Global / Uzaktan Çalışmaya Açık" : "Izmir / Türkiye • Available for Remote / Global Work"}</span>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Form Kutusu */}
        <div className="lg:col-span-6">
          <form onSubmit={handleSubmit} className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl space-y-4 sm:space-y-5 relative">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">
                {language === "TR" ? "Adınız Soyadınız" : "Your Full Name"}
              </label>
              <input
                required
                name="name"
                type="text"
                placeholder={language === "TR" ? "Adınızı girin..." : "Enter your name..."}
                className="w-full bg-[#0d0d0d] border border-neutral-800 rounded-xl px-4 py-3 sm:py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FB4617] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">
                {language === "TR" ? "E-posta Adresiniz" : "Your Work Email"}
              </label>
              <input
                required
                name="email"
                type="email"
                placeholder="ad@sirket.com"
                className="w-full bg-[#0d0d0d] border border-neutral-800 rounded-xl px-4 py-3 sm:py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FB4617] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">
                {language === "TR" ? "Mesajınız / Otomasyon İhtiyacınız" : "Your Message / Automation Scope"}
              </label>
              <textarea
                required
                name="message"
                rows={4}
                placeholder={language === "TR" ? "Sürecinizden veya iş birliği fikrinizden bahsedin..." : "Describe your process or project..."}
                className="w-full bg-[#0d0d0d] border border-neutral-800 rounded-xl px-4 py-3 sm:py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FB4617] transition-colors resize-none"
              />
            </div>

            <button
              disabled={status === "sending"}
              type="submit"
              className="w-full py-3.5 sm:py-4 rounded-xl bg-[#FB4617] hover:bg-[#e03d12] text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-[#FB4617]/20 disabled:opacity-50 cursor-pointer"
            >
              {status === "sending"
                ? (language === "TR" ? "İletiliyor..." : "Sending...")
                : (language === "TR" ? "Mesaj Gönder" : "Send Message")}
            </button>

            {status === "success" && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs font-mono text-center flex items-center justify-center gap-2">
                <span>✓</span>
                <span>{feedbackMessage}</span>
              </div>
            )}
            {status === "rate_limited" && (
              <div className="bg-amber-950/40 border border-amber-500/40 text-amber-300 px-4 py-3 rounded-xl text-xs font-mono text-center flex items-center justify-center gap-2">
                <span>⏳</span>
                <span>{feedbackMessage}</span>
              </div>
            )}
            {status === "error" && (
              <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 px-4 py-3 rounded-xl text-xs font-mono text-center flex items-center justify-center gap-2">
                <span>✕</span>
                <span>{feedbackMessage}</span>
              </div>
            )}
          </form>
        </div>

      </div>

      {/* Alt Footer Bilgi */}
      <div className="max-w-7xl mx-auto w-full z-10 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-neutral-500 pt-6 border-t border-neutral-900 gap-2 sm:gap-0">
        <div>
          {language === "TR"
            ? "©2026 SEVAL NAZ KARAHAN — OTOMASYON MÜHENDİSİ & İŞ ANALİSTİ"
            : "©2026 SEVAL NAZ KARAHAN — AUTOMATION ENGINEER & BUSINESS ANALYST"}
        </div>
        <div>{language === "TR" ? "İZMİR, TÜRKİYE" : "IZMIR, TÜRKİYE"}</div>
      </div>

    </div>
  );
}