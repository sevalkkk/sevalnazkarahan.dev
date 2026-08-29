"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function ContactPage() {
  const { language, toggleLanguage } = useLanguage();
  
  // Akış Durumları
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [status, setStatus] = useState("idle"); // "idle" | "sending_otp" | "verifying" | "success" | "rate_limited" | "error"
  const [feedbackMessage, setFeedbackMessage] = useState("");
  
  // Form Verileri ve Doğrulama
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [otpCode, setOtpCode] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 dakika (300 sn)

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title =
        language === "TR"
          ? "Seval Naz Karahan | İletişim & Yetkilendirme"
          : "Seval Naz Karahan | Contact & Verification";
    }
  }, [language]);

  // Geri Sayım Sayacı
  useEffect(() => {
    let timer;
    if (step === "otp" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Sahte / Geçici (Disposable) e-posta sağlayıcıları listesi
  const DISPOSABLE_EMAIL_DOMAINS = new Set([
    "mailinator.com",
    "tempmail.com",
    "temp-mail.org",
    "10minutemail.com",
    "guerrillamail.com",
    "trashmail.com",
    "yopmail.com",
    "sharklasers.com",
    "dispostable.com",
    "getairmail.com",
    "fakemailgenerator.com",
    "burnermail.io",
    "throwawaymail.com",
    "crazymailing.com",
    "nada.ltd",
    "tempail.com",
    "mytemp.email",
    "mohmal.com",
  ]);

  const FAKE_PATTERNS = [
    /^test@test/i,
    /^asdasd@/i,
    /^qwe@/i,
    /^abc@xyz/i,
    /^123@/i,
    /^aaa@/i,
    /^admin@admin/i,
    /^user@example/i,
    /^noone@/i,
  ];

  const validateEmail = (emailStr) => {
    if (!emailStr || typeof emailStr !== "string") return false;
    const cleanEmail = emailStr.trim().toLowerCase();

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(cleanEmail)) return false;

    if (cleanEmail.includes("..") || cleanEmail.startsWith(".") || cleanEmail.endsWith(".")) return false;

    const parts = cleanEmail.split("@");
    if (parts.length !== 2) return false;

    const [userPart, domainPart] = parts;
    if (userPart.length < 2 || domainPart.length < 3) return false;

    const domainParts = domainPart.split(".");
    if (domainParts.length < 2) return false;

    const tld = domainParts[domainParts.length - 1];
    if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) return false;

    if (DISPOSABLE_EMAIL_DOMAINS.has(domainPart)) return false;

    for (const pattern of FAKE_PATTERNS) {
      if (pattern.test(cleanEmail)) return false;
    }

    return true;
  };

  // 1. ADIM: E-POSTA DOĞRULAMA KODU İSTEME (SEND OTP)
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setStatus("sending_otp");
    setFeedbackMessage("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const message = formData.message.trim();

    if (name.length < 2) {
      setStatus("error");
      setFeedbackMessage(
        language === "TR"
          ? "Lütfen adınızı ve soyadınızı eksiksiz girin."
          : "Please enter your full name."
      );
      return;
    }

    if (message.length < 5) {
      setStatus("error");
      setFeedbackMessage(
        language === "TR"
          ? "Lütfen mesajınızı biraz daha detaylandırın (en az 5 karakter)."
          : "Please enter a detailed message (at least 5 characters)."
      );
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setFeedbackMessage(
        language === "TR"
          ? "Girdiğiniz e-posta adresi geçersiz veya sahte görünüyor. Lütfen gerçek ve aktif bir kurumsal/kişisel e-posta adresi girin (örn: adiniz@sirket.com veya adiniz@gmail.com)."
          : "Invalid email address. Please provide a real and active email (e.g. name@company.com or name@gmail.com)."
      );
      return;
    }

    // 24 Saatlik Yerel Limit Kontrolü
    const rateLimitKey = `portfolio_contact_limit_${email}`;
    const RATE_LIMIT_MS = 24 * 60 * 60 * 1000;
    if (typeof window !== "undefined") {
      const lastSentStr = localStorage.getItem(rateLimitKey);
      if (lastSentStr) {
        const lastSent = parseInt(lastSentStr, 10);
        const elapsed = Date.now() - lastSent;
        if (!isNaN(lastSent) && elapsed < RATE_LIMIT_MS) {
          const remainingHours = Math.max(1, Math.ceil((RATE_LIMIT_MS - elapsed) / (1000 * 60 * 60)));
          setStatus("rate_limited");
          setFeedbackMessage(
            language === "TR"
              ? `Bu e-posta adresiyle (${email}) son 24 saat içinde zaten bir mesaj ilettiniz. Yeni bir mesaj gönderebilmeniz için kalan süre: ${remainingHours} saat.`
              : `You have already sent a message from this email (${email}) in the last 24 hours. Please wait ${remainingHours} hour(s).`
          );
          return;
        }
      }
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_otp",
          name: name,
          email: email,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success && data.token) {
        setVerificationToken(data.token);
        setTimeLeft(300);
        setStep("otp");
        setStatus("idle");
        setFeedbackMessage(
          language === "TR"
            ? `6 haneli doğrulama kodu ${email} adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.`
            : `6-digit verification code sent to ${email}. Please check your inbox.`
        );
      } else if (res.status === 429 || data.error === "rate_limited") {
        setStatus("rate_limited");
        setFeedbackMessage(data.messageTR || "Bu e-posta ile son 24 saat içinde zaten mesaj gönderildi.");
      } else {
        setStatus("error");
        setFeedbackMessage(data.messageTR || "Doğrulama kodu gönderilemedi. Lütfen e-posta adresinizi kontrol edin.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setFeedbackMessage(
        language === "TR"
          ? "Sunucu bağlantı hatası oluştu. Lütfen tekrar deneyin."
          : "Connection error occurred. Please try again."
      );
    }
  };

  // 2. ADIM: OTP KODUNU DOĞRULA VE MESAJI İLET (VERIFY & SEND)
  const handleVerifyAndSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setStatus("error");
      setFeedbackMessage(
        language === "TR"
          ? "Lütfen 6 haneli doğrulama kodunu eksiksiz girin."
          : "Please enter the complete 6-digit verification code."
      );
      return;
    }

    if (timeLeft <= 0) {
      setStatus("error");
      setFeedbackMessage(
        language === "TR"
          ? "Doğrulama kodunun süresi dolmuş. Lütfen 'Yeni Kod İste' butonuna tıklayın."
          : "Verification code has expired. Please request a new one."
      );
      return;
    }

    setStatus("verifying");
    setFeedbackMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_and_send",
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          message: formData.message.trim(),
          otp: otpCode.trim(),
          token: verificationToken,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        // 24 Saatlik Mührü Kaydet
        const rateLimitKey = `portfolio_contact_limit_${formData.email.trim().toLowerCase()}`;
        if (typeof window !== "undefined") {
          localStorage.setItem(rateLimitKey, Date.now().toString());
        }
        setStatus("success");
        setFeedbackMessage(
          language === "TR"
            ? "✓ E-posta adresiniz başarıyla doğrulandı ve mesajınız Seval Naz Karahan'a iletildi! En kısa sürede sizinle iletişime geçeceğim."
            : "✓ Your email has been successfully verified and delivered to Seval Naz Karahan! I will get back to you soon."
        );
        setFormData({ name: "", email: "", message: "" });
        setOtpCode("");
      } else {
        setStatus("error");
        setFeedbackMessage(
          language === "TR"
            ? data.messageTR || "Doğrulama kodu hatalı veya süresi dolmuş. Lütfen kontrol edip tekrar deneyin."
            : data.messageEN || "Invalid verification code. Please check and try again."
        );
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setFeedbackMessage(
        language === "TR"
          ? "Bağlantı hatası oluştu. Lütfen tekrar deneyin."
          : "Connection error occurred. Please try again."
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
            className={`transition-colors duration-300 ${
              language === "TR" ? "text-[#FB4617] font-bold" : "text-neutral-500 hover:text-white"
            }`}
          >
            TR
          </span>
          <span className="text-neutral-700">|</span>
          <span
            className={`transition-colors duration-300 ${
              language === "EN" ? "text-[#FB4617] font-bold" : "text-neutral-500 hover:text-white"
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
              {language === "TR" ? "// İLETİŞİM & DOĞRULANMIŞ İŞ BİRLİĞİ" : "// GET IN TOUCH & VERIFIED INQUIRY"}
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
              <span className="text-[#FB4617]">🔒</span>
              <span className="text-neutral-300">
                {language === "TR" ? "E-Posta Sahipliği Doğrulama Korumalı (OTP)" : "Email Ownership Verified (OTP Protection)"}
              </span>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: İki Aşamalı Güvenli Form Kutusu */}
        <div className="lg:col-span-6">
          <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl space-y-4 sm:space-y-5 relative">

            {step === "form" ? (
              /* AŞAMA 1: BİLGİ GİRİŞİ */
              <form onSubmit={handleRequestOtp} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-2">
                    {language === "TR" ? "Adınız Soyadınız" : "Your Full Name"}
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === "TR" ? "Adınızı girin..." : "Enter your name..."}
                    className="w-full bg-[#0d0d0d] border border-neutral-800 rounded-xl px-4 py-3 sm:py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FB4617] transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono text-neutral-400">
                      {language === "TR" ? "E-posta Adresiniz (Doğrulama Yapılacaktır)" : "Your Email (Will Be Verified)"}
                    </label>
                    <span className="text-[10px] font-mono text-[#FB4617]">🔒 6 Haneli Onay</span>
                  </div>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={language === "TR" ? "Sürecinizden veya iş birliği fikrinizden bahsedin..." : "Describe your process or project..."}
                    className="w-full bg-[#0d0d0d] border border-neutral-800 rounded-xl px-4 py-3 sm:py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FB4617] transition-colors resize-none"
                  />
                </div>

                <button
                  disabled={status === "sending_otp"}
                  type="submit"
                  className="w-full py-3.5 sm:py-4 rounded-xl bg-[#FB4617] hover:bg-[#e03d12] text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-[#FB4617]/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {status === "sending_otp" ? (
                    <>
                      <span className="animate-spin text-base">⏳</span>
                      <span>{language === "TR" ? "Doğrulama Kodu Gönderiliyor..." : "Sending Verification Code..."}</span>
                    </>
                  ) : (
                    <>
                      <span>🔒</span>
                      <span>{language === "TR" ? "Doğrulama Kodu İste & Devam Et" : "Request Verification Code & Continue"}</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* AŞAMA 2: 6 HANELİ OTP KODU GİRİŞİ */
              <form onSubmit={handleVerifyAndSubmit} className="space-y-5">
                <div className="text-center space-y-2 border-b border-neutral-800/80 pb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FB4617]/10 text-[#FB4617] text-2xl mb-1">
                    📩
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {language === "TR" ? "E-Posta Sahipliğini Doğrulayın" : "Verify Email Ownership"}
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                    {language === "TR" ? (
                      <>
                        <strong className="text-[#FB4617]">{formData.email}</strong> adresinize 6 haneli bir güvenlik kodu gönderdik. Mesajınızın iletilmesi için lütfen kodu girin.
                      </>
                    ) : (
                      <>
                        We sent a 6-digit security code to <strong className="text-[#FB4617]">{formData.email}</strong>. Enter it below to verify and deliver your message.
                      </>
                    )}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono text-neutral-300">
                      {language === "TR" ? "6 Haneli Onay Kodu" : "6-Digit Security Code"}
                    </label>
                    <span className={`text-xs font-mono font-bold ${timeLeft < 60 ? "text-rose-400 animate-pulse" : "text-[#FB4617]"}`}>
                      ⏱️ {formatTime(timeLeft)}
                    </span>
                  </div>
                  <input
                    required
                    type="text"
                    maxLength={6}
                    autoFocus
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full bg-[#0d0d0d] border-2 border-neutral-800 rounded-xl px-4 py-3.5 text-center text-2xl tracking-[8px] sm:tracking-[12px] font-mono text-white placeholder-neutral-700 focus:outline-none focus:border-[#FB4617] transition-all"
                  />
                </div>

                <div className="space-y-2.5">
                  <button
                    disabled={status === "verifying" || timeLeft <= 0 || otpCode.length !== 6}
                    type="submit"
                    className="w-full py-3.5 sm:py-4 rounded-xl bg-[#FB4617] hover:bg-[#e03d12] text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-[#FB4617]/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {status === "verifying" ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>{language === "TR" ? "Doğrulanıyor ve İletiliyor..." : "Verifying & Delivering..."}</span>
                      </>
                    ) : (
                      <>
                        <span>✓</span>
                        <span>{language === "TR" ? "Kodu Onayla & Mesajı Gönder" : "Verify Code & Send Message"}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("form");
                        setStatus("idle");
                        setFeedbackMessage("");
                      }}
                      className="text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      ← {language === "TR" ? "Bilgileri Düzenle" : "Edit Info"}
                    </button>

                    <button
                      type="button"
                      disabled={status === "sending_otp"}
                      onClick={handleRequestOtp}
                      className="text-xs font-mono text-[#FB4617] hover:underline transition-colors cursor-pointer disabled:opacity-50"
                    >
                      ↻ {language === "TR" ? "Kodu Tekrar Gönder" : "Resend Code"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* GERİ BİLDİRİM KUTULARI */}
            {status === "success" && (
              <div className="bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 p-4 rounded-xl text-xs font-mono text-center space-y-1">
                <div className="text-lg">✓</div>
                <div>{feedbackMessage}</div>
              </div>
            )}
            {status === "rate_limited" && (
              <div className="bg-amber-950/50 border border-amber-500/50 text-amber-300 p-4 rounded-xl text-xs font-mono text-center space-y-1">
                <div className="text-lg">⏳</div>
                <div>{feedbackMessage}</div>
              </div>
            )}
            {status === "error" && (
              <div className="bg-rose-950/50 border border-rose-500/50 text-rose-300 p-4 rounded-xl text-xs font-mono text-center space-y-1">
                <div className="text-lg">✕</div>
                <div>{feedbackMessage}</div>
              </div>
            )}
          </div>
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