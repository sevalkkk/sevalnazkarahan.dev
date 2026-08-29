"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutSection() {
  const { language } = useLanguage();
  const [pinnedNode, setPinnedNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Hakkımda alanından çıkıldığında (aşağı veya yukarı kaydırıldığında) sabitlenen kartı otomatik kaldır
  useEffect(() => {
    const handleScrollOrLeave = () => {
      if (pinnedNode === null && hoveredNode === null) return;
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      // Hakkımda alanı ekran görüş alanından yukarı veya aşağı çıktığında sabitlemeyi sıfırla
      if (rect.bottom < 60 || rect.top > window.innerHeight - 60) {
        setPinnedNode(null);
        setHoveredNode(null);
      }
    };

    window.addEventListener("scroll", handleScrollOrLeave, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollOrLeave);
  }, [pinnedNode, hoveredNode]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setPinnedNode(null);
          setHoveredNode(null);
        }
      },
      { root: null, threshold: 0.05 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 6 Düğümün Tam Simetrik Açıları (90°, 30°, 330°, 270°, 210°, 150°)
  const nodes = [
    {
      id: "csharp-dotnet",
      name: "C# & .NET",
      sub: "Self-Healing Logic",
      icon: "⚙️",
      color: "#FB4617",
      metric: "Resilient Logic",
      descTR: "Beklenmedik istisnaları anında yakalayan, kendi kendini toparlayabilen C# kütüphaneleri ve kurumsal dayanıklı REFramework mimarisi.",
      descEN: "Enterprise-grade bot architectures built with custom C# libraries and fail-safe, self-healing REFramework patterns.",
      angle: 90, // Üst İkon
    },
    {
      id: "business-intelligence",
      name: "Business Intelligence",
      sub: "Power BI & Dataverse",
      icon: "🧠",
      color: "#a855f7",
      metric: "Smart Analytics",
      descTR: "Robotların ürettiği operasyonel verileri anlamlandırarak yöneticiler için Power BI dashboard'larına ve Dataverse/Power Apps merkezi iş akışlarına dönüştürme.",
      descEN: "Transforming automated workflow telemetry into executive Power BI analytics dashboards and unified Dataverse & Power Apps systems.",
      angle: 30, // Sağ Üst İkon
    },
    {
      id: "secure-etl",
      name: "Secure ETL Pipelines",
      sub: "SFTP & SQL Synced",
      icon: "🔒",
      color: "#06b6d4",
      metric: "End-to-End SSL",
      descTR: "Ortak ağ yolları ve güvenli SFTP sunucuları üzerinden çift yönlü SQL senkronizasyonu ve otomatik SMTP raporlama.",
      descEN: "Bi-directional SQL database synchronization and automated SMTP reporting over encrypted SFTP tunnels.",
      angle: 330, // Sağ Alt İkon
    },
    {
      id: "sap-core-banking",
      name: "SAP & Core Banking",
      sub: "API Orchestrated",
      icon: "🏦",
      color: "#6366f1",
      metric: "API Connected",
      descTR: "SAP ERP ve kurumsal ana bankacılık (BOA) sistemlerine güvenli REST/SOAP API ağ geçitleriyle uçtan uca otonom erişim.",
      descEN: "Seamless autonomous integration into SAP ERP and core banking (BOA) systems via secure REST/SOAP APIs.",
      angle: 270, // Alt İkon
    },
    {
      id: "linq-regex",
      name: "LINQ & Regex",
      sub: "Ultra-Low Latency",
      icon: "⚡",
      color: "#10b981",
      metric: "<18ms Latency",
      descTR: "Milyonlarca satırlık büyük veri setlerini optimize SQL sorguları, LINQ lambda filtreleri ve ileri düzey Regex ile milisaniyelerde işleme.",
      descEN: "High-speed parsing and transformation of enterprise data tables leveraging tuned SQL queries, LINQ, and advanced Regex engines.",
      angle: 210, // Sol Alt İkon
    },
    {
      id: "doc-understanding",
      name: "Document Understanding",
      sub: "AI Center & ABBYY OCR",
      icon: "📄",
      color: "#f59e0b",
      metric: "99.6% Accuracy",
      descTR: "Yapısal olmayan faturaları, makbuzları ve taranmış PDF'leri UiPath AI Center ve ABBYY OCR ile otomatik sınıflandırıp ayrıştıran akıllı modeller.",
      descEN: "Intelligent document processing workflows integrating UiPath AI Center and ABBYY OCR for automated invoice classification and extraction.",
      angle: 150, // Sol Üst İkon
    },
  ];

  // Geometrik Merkez ve Yarıçap (max-w-7xl ile Tam Uyumlu)
  const centerX = 290;
  const centerY = 265;
  const radius = 200;
  const targetRightX = 990; // max-w-7xl sağ sınırıyla tam hizalı
  const targetRightY = 265; // Çember merkeziyle tam aynı düşey hizada

  // Aktif düğüm: Sabitlenmişse o, değilse hover olan
  const activeNodeIndex = pinnedNode !== null ? pinnedNode : hoveredNode;
  const activeNodeData = activeNodeIndex !== null ? nodes[activeNodeIndex] : null;

  // Hover olan düğümün çemberdeki kalkış noktası
  const originStartX =
    activeNodeData !== null
      ? centerX + Math.cos((activeNodeData.angle * Math.PI) / 180) * radius
      : centerX;
  const originStartY =
    activeNodeData !== null
      ? centerY - Math.sin((activeNodeData.angle * Math.PI) / 180) * radius
      : centerY;

  const handleTogglePin = (index: number) => {
    if (pinnedNode === index) {
      setPinnedNode(null);
      setHoveredNode(null);
    } else {
      setPinnedNode(index);
      setHoveredNode(index);
    }
  };

  return (
    <section ref={sectionRef} id="about" className="scroll-mt-20 pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 md:pb-8 px-4 sm:px-6 md:px-16 bg-[#0a0a0a] relative overflow-hidden select-none">
      {/* Arka Plan Atmosferik Parıltılar (Yumuşak Kademeli Maske ile Asla Sert Kesilmez) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#FB4617] blur-[190px] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-8 md:space-y-10 relative z-10">

        {/* ÜST MİNİMALİST BAŞLIK */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FB4617] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FB4617] shadow-[0_0_8px_#FB4617]" />
              </span>
              <span className="text-xs font-mono text-[#FB4617] uppercase tracking-widest font-semibold">
                {language === "TR" ? "// 03. OTONOM TEKNOLOJİ YÖRÜNGESİ" : "// 03. AUTONOMOUS TECH ORBIT"}
              </span>
            </div>
            <p className="text-sm text-neutral-400 font-light">
              {language === "TR"
                ? "Kutucuğa sol tıklayarak sabitleyebilirsiniz. "
                : "Left-click to pin a card."}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {pinnedNode !== null && (
              <button
                onClick={() => setPinnedNode(null)}
                className="text-xs font-mono text-[#FB4617] px-3.5 py-1.5 rounded-full bg-[#FB4617]/10 border border-[#FB4617]/40 flex items-center gap-1.5 hover:bg-[#FB4617]/25 transition-all cursor-pointer shadow-[0_0_15px_rgba(251,70,23,0.3)] animate-pulse"
              >
                <span>📌</span>
                <span>{language === "TR" ? "SABİTİ KALDIR" : "UNPIN"}</span>
              </button>
            )}
            <div className="text-xs font-mono text-neutral-400 px-3.5 py-1.5 rounded-full bg-neutral-950/80 border border-neutral-800 flex items-center gap-2">
              <span className="text-[#FB4617]">●</span>
              <span>{language === "TR" ? "6 KUSURSUZ DÜĞÜM" : "6 BALANCED NODES"}</span>
            </div>
          </div>
        </div>

        {/* MASAÜSTÜ YÖRÜNGE SAHNESİ (lg ve üzeri) */}
        <div className="hidden lg:block relative h-[530px] w-full max-w-7xl mx-auto overflow-visible">

          {/* ÇEMBER VE YÖRÜNGE HALKALARI */}
          <div
            style={{
              left: `${centerX}px`,
              top: `${centerY}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
          >
            {/* 1. Dış Kesikli Yörünge Çemberi (Radius = 200px, Çap = 400px) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
              className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-neutral-800/90"
            />

            {/* 2. İç Yörünge Çemberi */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              className="absolute w-[240px] h-[240px] rounded-full border border-neutral-800/50"
            />

            {/* MERKEZ BOT ÇEKİRDEĞİ */}
            <div className="relative z-20 w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-gradient-to-tr from-black via-neutral-950 to-neutral-900 border-2 border-[#FB4617] shadow-[0_0_45px_rgba(251,70,23,0.35)] flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 rounded-full bg-[#FB4617]/10 animate-ping opacity-75" />
              <span className="text-2xl">🤖</span>
              <span className="text-[10px] font-mono font-bold text-white tracking-widest mt-0.5">BOT CORE</span>
              <span className="text-[8px] font-mono text-[#FB4617]">v3.5 LIVE</span>
            </div>
          </div>

          {/* ÇEMBERDEKİ 6 KUTUCUK */}
          {nodes.map((node, i) => {
            const isActive = activeNodeIndex === i;
            const isPinned = pinnedNode === i;
            const isDimmed = pinnedNode !== null && pinnedNode !== i;
            const angleRad = (node.angle * Math.PI) / 180;
            const nodeX = centerX + Math.cos(angleRad) * radius;
            const nodeY = centerY - Math.sin(angleRad) * radius;

            return (
              <div
                key={node.id}
                style={{
                  left: `${nodeX}px`,
                  top: `${nodeY}px`,
                  transform: "translate(-50%, -50%)",
                }}
                className={`absolute z-30 transition-all duration-400 ${isDimmed ? "pointer-events-none" : "pointer-events-auto"
                  }`}
              >
                <motion.button
                  onClick={() => handleTogglePin(i)}
                  disabled={isDimmed}
                  onMouseEnter={() => {
                    if (pinnedNode === null) setHoveredNode(i);
                  }}
                  onMouseLeave={() => {
                    if (pinnedNode === null) setHoveredNode(null);
                  }}
                  whileHover={!isDimmed ? { scale: 1.06 } : {}}
                  whileTap={!isDimmed ? { scale: 0.96 } : {}}
                  transition={{ type: "spring", stiffness: 240, damping: 22 }}
                  className={`p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl border transition-all duration-500 flex items-center gap-2.5 shadow-xl w-[170px] sm:w-[185px] h-[56px] select-none text-left ${isDimmed
                      ? "opacity-20 grayscale brightness-50 border-neutral-900 bg-black/80 cursor-not-allowed"
                      : isPinned
                        ? "opacity-100 bg-neutral-900 border-[#FB4617] ring-2 ring-[#FB4617] shadow-[0_0_30px_rgba(251,70,23,0.6)] scale-105 cursor-pointer"
                        : isActive
                          ? "opacity-100 bg-neutral-900 border-white ring-2 ring-[#FB4617] shadow-[0_0_25px_rgba(251,70,23,0.4)] cursor-pointer"
                          : "opacity-100 bg-neutral-950/95 border-neutral-800/90 hover:border-neutral-500 shadow-xl cursor-pointer"
                    }`}
                >
                  <span className="text-xl shrink-0">{node.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] sm:text-xs font-semibold text-white tracking-tight leading-tight truncate">
                      {node.name}
                    </div>
                    <div className="text-[9px] sm:text-[9.5px] font-mono text-neutral-400 leading-tight truncate mt-0.5">
                      {node.sub}
                    </div>
                  </div>
                </motion.button>
              </div>
            );
          })}

          {/* SAĞ PANEL: AKTİF DÜĞÜM VEYA GENEL BAKIŞ KARTI (HER ZAMAN DENGELİ & DOLU) */}
          <AnimatePresence mode="wait">
            {activeNodeData ? (
              <motion.div
                key={activeNodeData.id}
                initial={{
                  left: `${originStartX}px`,
                  top: `${originStartY}px`,
                  x: "-50%",
                  y: "-50%",
                  scale: 0.35,
                  opacity: 0,
                }}
                animate={{
                  left: `${targetRightX}px`,
                  top: `${targetRightY}px`,
                  x: "-50%",
                  y: "-50%",
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  left: `${originStartX}px`,
                  top: `${originStartY}px`,
                  x: "-50%",
                  y: "-50%",
                  scale: 0.35,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.72,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`absolute w-[480px] lg:w-[520px] rounded-3xl bg-neutral-900/95 backdrop-blur-3xl border shadow-[0_25px_70px_rgba(0,0,0,0.9)] p-7 sm:p-8 space-y-4 text-left z-50 pointer-events-none overflow-hidden ${pinnedNode !== null
                    ? "border-[#FB4617] ring-1 ring-[#FB4617]/50 shadow-[0_0_40px_rgba(251,70,23,0.25)]"
                    : "border-neutral-700/90"
                  }`}
              >
                {/* Kart İçi Spot Işık Parıltısı */}
                <div
                  className="absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl opacity-35 pointer-events-none"
                  style={{ backgroundColor: activeNodeData.color }}
                />

                {/* SABİTLENDİĞİNDE SAĞ ÜST KÖŞEDE BELİREN RAPTİYE İKONU */}
                <AnimatePresence>
                  {pinnedNode !== null && (
                    <motion.div
                      initial={{ scale: 0, rotate: -35, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, rotate: -35, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 20 }}
                      className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-[#FB4617]/20 border border-[#FB4617]/60 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(251,70,23,0.4)] pointer-events-none"
                    >
                      📌
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between relative z-10 pr-8">
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-md shrink-0">
                      {activeNodeData.icon}
                    </span>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                        {activeNodeData.name}
                      </h3>
                      <p className="text-xs font-mono text-neutral-400">
                        {activeNodeData.sub}
                      </p>
                    </div>
                  </div>

                  <span
                    className="text-xs font-mono px-3 py-1 rounded-full font-semibold border shadow-sm shrink-0"
                    style={{
                      color: activeNodeData.color,
                      borderColor: `${activeNodeData.color}50`,
                      backgroundColor: `${activeNodeData.color}20`,
                    }}
                  >
                    {activeNodeData.metric}
                  </span>
                </div>

                <p className="text-sm text-neutral-200 font-light leading-relaxed pt-1 relative z-10">
                  {language === "TR" ? activeNodeData.descTR : activeNodeData.descEN}
                </p>

                <div className="pt-3.5 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-400 relative z-10">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {language === "TR" ? "Canlı Akış Senkronize" : "Live Pipeline Synchronized"}
                  </span>
                  <span className="text-white font-semibold">{language === "TR" ? "%100 Doğrulandı" : "100% Verified"}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="standby-overview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  left: `${targetRightX}px`,
                  top: `${targetRightY}px`,
                  x: "-50%",
                  y: "-50%",
                  scale: 1,
                  opacity: 1,
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute w-[480px] lg:w-[520px] rounded-3xl bg-neutral-900/70 backdrop-blur-2xl border border-neutral-800/90 shadow-2xl p-7 sm:p-8 space-y-4 text-left z-20 pointer-events-none overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-md shrink-0">
                      🤖
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium text-white tracking-tight">
                        {language === "TR" ? "Otonom Bot Mimarisi" : "Autonomous Bot Architecture"}
                      </h3>
                      <p className="text-xs font-mono text-[#FB4617]">
                        {language === "TR" ? "Yörünge Kontrol Paneli" : "Orbit Command Center"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>6 MODÜL HAZIR</span>
                  </span>
                </div>

                <p className="text-sm text-neutral-300 font-light leading-relaxed">
                  {language === "TR"
                    ? "Kurumsal seviyedeki UiPath RPA, C# ve yapay zeka entegrasyonlarını birbirine bağlayan 6 temel mimari sütun. Detaylı teknik özellikleri ve optimizasyon metriklerini incelemek için yörüngedeki kutucukların üzerine gelin veya sabitlemek için tıklayın."
                    : "6 core architectural pillars interconnecting enterprise-grade UiPath RPA, C#, and AI pipelines. Hover over or click any orbit node to inspect deep-dive technical specs and live system metrics."}
                </p>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>{language === "TR" ? "Etkileşim:" : "Interaction:"}</span>
                  <span className="text-neutral-300">
                    {language === "TR" ? "Hover ile İncele / Tıkla Sabitle" : "Hover to Inspect / Click to Pin"}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* MOBİL & TABLET DOKUNMATİK YÖRÜNGE GÖRÜNÜMÜ (< lg) */}
        <div className="lg:hidden space-y-4 sm:space-y-6">
          {/* Merkez Bot Kartı */}
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-black to-neutral-900 border-2 border-[#FB4617] flex items-center justify-center text-lg shadow-[0_0_20px_rgba(251,70,23,0.3)]">
                🤖
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white font-mono">BOT CORE • v3.5 LIVE</h3>
                <p className="text-[11px] font-mono text-neutral-400">
                  {language === "TR" ? "6 Otonom Teknoloji Düğümü" : "6 Autonomous Tech Nodes"}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#FB4617] px-2.5 py-1 rounded-full bg-[#FB4617]/10 border border-[#FB4617]/30">
              {language === "TR" ? "DOKUN & İNCELE" : "TAP & VIEW"}
            </span>
          </div>

          {/* 6'lı Düğüm Grid'i */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {nodes.map((node, i) => {
              const isSelected = activeNodeIndex === i;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleTogglePin(i)}
                  className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3 shadow-md cursor-pointer ${
                    isSelected
                      ? "bg-neutral-900 border-[#FB4617] ring-2 ring-[#FB4617]/50 shadow-[0_0_25px_rgba(251,70,23,0.3)]"
                      : "bg-neutral-950/90 border-neutral-800/90 hover:border-neutral-700"
                  }`}
                >
                  <span className="text-xl sm:text-2xl shrink-0 p-2 rounded-xl bg-black border border-neutral-800">{node.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-white truncate">{node.name}</div>
                    <div className="text-[10px] font-mono text-neutral-400 truncate mt-0.5">{node.sub}</div>
                  </div>
                  <span className="text-xs font-mono font-bold shrink-0" style={{ color: node.color }}>
                    {node.metric}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Aktif Seçilen Düğümün Detay Kartı (Mobil/Tablet) */}
          <AnimatePresence mode="wait">
            {activeNodeData && (
              <motion.div
                key={activeNodeData.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.3 }}
                className="p-5 sm:p-6 rounded-2xl bg-neutral-900/95 border border-[#FB4617] ring-1 ring-[#FB4617]/50 shadow-2xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-black border border-neutral-800">{activeNodeData.icon}</span>
                    <div>
                      <h4 className="text-base font-semibold text-white">{activeNodeData.name}</h4>
                      <p className="text-xs font-mono text-neutral-400">{activeNodeData.sub}</p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-mono px-2.5 py-1 rounded-full font-semibold border"
                    style={{
                      color: activeNodeData.color,
                      borderColor: `${activeNodeData.color}50`,
                      backgroundColor: `${activeNodeData.color}20`,
                    }}
                  >
                    {activeNodeData.metric}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 font-light leading-relaxed">
                  {language === "TR" ? activeNodeData.descTR : activeNodeData.descEN}
                </p>
                <div className="pt-2.5 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {language === "TR" ? "Canlı Akış Senkronize" : "Live Pipeline Synchronized"}
                  </span>
                  <span className="text-neutral-300 font-semibold">%100 Verified</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}