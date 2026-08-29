"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";

export default function ExpertiseSection() {
  const { language } = useLanguage();

  // Simülatör State'leri
  const [simRunning, setSimRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const logsTR = [
    { time: "00:01", tag: "ARCHITECTURE", msg: "SDD & PDD Mimarisi Doğrulandı — C# Tabanlı Self-Healing REFramework Başlatıldı", statusBadge: "✓ INITIALIZED", badgeColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
    { time: "00:03", tag: "AI & OCR (01)", msg: "UiPath AI Center, ABBYY OCR & Document Understanding: Yapısal Olmayan Belgeler %99.6 Doğrulukla Ayrıştırıldı", statusBadge: "✓ 99.6% MATCH", badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { time: "00:05", tag: "INTEGRATION (02)", msg: "SAP ERP & BOA Core Banking REST/SOAP API Orkestrasyonu Sağlandı — Şifreli SFTP Hatları Aktif", statusBadge: "✓ 200 OK SYNC", badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    { time: "00:07", tag: "DATA OPS (03)", msg: "Büyük Kurumsal Veri Setleri: Optimize SQL & In-Memory LINQ Zincirleriyle Mikrosaniyede İşlendi", statusBadge: "✓ <32ms FAST", badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { time: "00:09", tag: "AGILE UAT (04)", msg: "JIRA Sprint Yaşam Döngüsü & Canlı Paydaş UAT Kabul Testleri Başarıyla Tamamlandı", statusBadge: "✓ COMPLETED", badgeColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/15 font-bold" },
  ];

  const logsEN = [
    { time: "00:01", tag: "ARCHITECTURE", msg: "SDD & PDD Specs Validated — Initializing C#-Based Self-Healing REFramework", statusBadge: "✓ INITIALIZED", badgeColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
    { time: "00:03", tag: "AI & OCR (01)", msg: "UiPath AI Center, ABBYY OCR & Document Understanding: Unstructured Data Extracted with 99.6% Precision", statusBadge: "✓ 99.6% MATCH", badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { time: "00:05", tag: "INTEGRATION (02)", msg: "SAP ERP & BOA Core Banking REST/SOAP API Orchestrated — Encrypted SFTP Tunnels Active", statusBadge: "✓ 200 OK SYNC", badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    { time: "00:07", tag: "DATA OPS (03)", msg: "Enterprise Datasets Processed via Tuned SQL & In-Memory LINQ Lambda Pipelines at Microsecond Latencies", statusBadge: "✓ <32ms FAST", badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { time: "00:09", tag: "AGILE UAT (04)", msg: "JIRA Agile Sprint Lifecycle & Live Stakeholder UAT Sign-Off Completed Successfully", statusBadge: "✓ COMPLETED", badgeColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/15 font-bold" },
  ];

  const logs = language === "TR" ? logsTR : logsEN;

  const runSimulation = () => {
    if (simRunning) return;
    setHasStarted(true);
    setSimRunning(true);
    setSimStep(0);
  };

  useEffect(() => {
    if (simRunning) {
      if (simStep < logs.length - 1) {
        const timer = setTimeout(() => {
          setSimStep((prev) => prev + 1);
        }, 700);
        return () => clearTimeout(timer);
      } else {
        const endTimer = setTimeout(() => {
          setSimRunning(false);
        }, 1200);
        return () => clearTimeout(endTimer);
      }
    }
  }, [simRunning, simStep, logs.length]);

  return (
    <section id="expertise" className="scroll-mt-20 pt-4 sm:pt-6 md:pt-8 pb-20 sm:pb-28 md:pb-36 px-4 sm:px-6 md:px-16 bg-[#0a0a0a] relative overflow-hidden select-none">
      {/* Arka Plan Ortam Parıltıları (Yumuşak Kademeli Maske ile Asla Sert Kesilmez) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[750px] h-[500px] bg-[#FB4617] blur-[180px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[700px] h-[450px] bg-indigo-600 blur-[180px] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-3 sm:space-y-3.5 md:space-y-4 relative z-10">
        
        {/* ÜST BAŞLIK VE CANLI SİSTEM ROZETİ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-neutral-800/80">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FB4617] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FB4617] shadow-[0_0_8px_#FB4617]" />
              </span>
              <span className="text-xs font-mono text-[#FB4617] uppercase tracking-widest font-semibold">
                {language === "TR" ? "// 04. UZMANLIK ALANLARI & TEKNİK YETKİNLİK" : "// 04. CORE EXPERTISE & TECHNICAL CAPABILITIES"}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-light tracking-tight text-white">
              {language === "TR" ? "Yetkinlik Mimarisi & Canlı Laboratuvar" : "Capability Architecture & Live Lab"}
            </h2>
          </div>

          {/* SİSTEM KOKPİT DURUM ETİKETİ */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-950/90 border border-neutral-800 text-xs font-mono self-start sm:self-auto shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-300 font-medium text-[11px]">
              {language === "TR" ? "OTONOM KOKPİT • v3.5 CANLI" : "AUTONOMOUS COCKPIT • v3.5 LIVE"}
            </span>
          </div>
        </div>

        {/* İNTERAKTİF SİSTEM KOKPİTİ & CANLI BOT SİMÜLATÖRÜ */}
        <div className="space-y-3 sm:space-y-3.5">
          {/* Telemetri Sayaçları (Kompakt & Şık) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { metric: "99.8%", labelTR: "Otonom Çalışma Başarısı", labelEN: "Autonomous Execution Success", subTR: "REFramework & Hata Yönetimi", subEN: "REFramework & Exception Handling", color: "#FB4617" },
              { metric: "10x", labelTR: "Süreç Hızlandırma Katsayısı", labelEN: "Process Acceleration Factor", subTR: "SAP, BOA & API Entegrasyonu", subEN: "SAP, BOA & API Integration", color: "#6366f1" },
              { metric: "< 50ms", labelTR: "Veri Ayrıştırma & LINQ Hızı", labelEN: "Data Parsing & LINQ Latency", subTR: "Regex & SQL Optimizasyonu", subEN: "Regex & SQL Optimization", color: "#10b981" },
            ].map((stat, i) => (
              <div key={i} className="p-2.5 sm:p-3 rounded-xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 relative overflow-hidden group shadow-sm hover:border-neutral-700 transition-all">
                <div className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-white flex items-center justify-between">
                  <span>{stat.metric}</span>
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">METRIC 0{i + 1}</span>
                </div>
                <div className="text-xs font-medium text-neutral-200 mt-0.5">{language === "TR" ? stat.labelTR : stat.labelEN}</div>
                <div className="text-[10px] text-neutral-500 font-mono">{language === "TR" ? stat.subTR : stat.subEN}</div>
              </div>
            ))}
          </div>

          {/* Terminal ve Mimari Akış Paneli */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            {/* SOL: Canlı UiPath Simülasyon Terminali */}
            <div className="lg:col-span-8 rounded-2xl bg-black/90 border border-neutral-800 p-3.5 sm:p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden space-y-2.5">
              <div className="space-y-2.5 relative z-10">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FB4617]/80" />
                    <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-neutral-400 ml-1.5">UiPath_Execution_Engine.v3</span>
                    <span className="hidden sm:inline-block text-[9.5px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-500 border border-neutral-800">
                      prod://agent/reframework
                    </span>
                  </div>
                  <button
                    onClick={runSimulation}
                    disabled={simRunning}
                    className={`text-xs font-mono px-3 py-1 rounded-xl border transition-all flex items-center gap-1.5 shadow-md cursor-pointer font-semibold ${
                      simRunning
                        ? "bg-[#FB4617]/20 border-[#FB4617] text-[#FB4617] animate-pulse cursor-wait"
                        : "bg-[#FB4617] hover:bg-[#ff5722] text-white border-[#FB4617] hover:scale-105 active:scale-95"
                    }`}
                  >
                    <span>
                      {simRunning
                        ? (language === "TR" ? "⚡ ÇALIŞIYOR..." : "⚡ RUNNING...")
                        : hasStarted
                        ? (language === "TR" ? "🔄 YENİDEN ÇALIŞTIR" : "🔄 RE-RUN BOT")
                        : (language === "TR" ? "▶ BOT'U ÇALIŞTIR" : "▶ RUN BOT")}
                    </span>
                  </button>
                </div>

                <div className="font-mono text-xs space-y-1.5 min-h-[165px] sm:min-h-[175px] pt-1 flex flex-col justify-center">
                  {!hasStarted ? (
                    <div className="py-5 flex flex-col items-center justify-center text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-base shadow-inner text-[#FB4617]">
                        ⚡
                      </div>
                      <p className="text-neutral-300 font-mono text-xs max-w-sm">
                        {language === "TR"
                          ? "Sistem beklemede. Akışı başlatmak ve canlı işlem günlüklerini izlemek için '▶ BOT'U ÇALIŞTIR' butonuna tıklayın."
                          : "System idle. Click '▶ RUN BOT' to initialize execution and monitor live runtime logs."}
                      </p>
                      <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-2 pt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>STANDBY • REFramework Pipeline Ready</span>
                      </div>
                    </div>
                  ) : (
                    logs.slice(0, simStep + 1).map((log, idx) => {
                      const isCurrentlyActive = simRunning && idx === simStep;

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25 }}
                          className={`flex items-center gap-3 p-2 sm:p-2.5 rounded-lg border transition-all ${
                            isCurrentlyActive
                              ? "bg-[#FB4617]/10 border-[#FB4617]/40 shadow-sm"
                              : "bg-neutral-950/80 border-neutral-900 hover:border-neutral-800"
                          }`}
                        >
                          {/* Sabit Genişlikli Zaman Damgası */}
                          <span className="w-11 shrink-0 text-neutral-500 select-none text-[11px] font-mono">
                            {log.time}
                          </span>

                          {/* Sabit Genişlikli & Ortalanmış Tag Rozeti */}
                          <span className="w-[125px] sm:w-[135px] shrink-0 text-[9px] px-2 py-0.5 rounded font-mono font-semibold bg-[#FB4617]/15 text-[#FB4617] border border-[#FB4617]/35 text-center flex items-center justify-center">
                            {log.tag}
                          </span>

                          {/* Kusursuz Hizalanmış Mesaj Metni */}
                          <span className="flex-1 text-neutral-200 leading-snug text-[11px] font-mono min-w-0 truncate sm:whitespace-normal">
                            {log.msg}
                          </span>

                          {/* Dinamik Durum Rozeti (Her Satır İçin Özel) */}
                          <div className="shrink-0 pl-2">
                            {isCurrentlyActive ? (
                              <span className="text-[#FB4617] text-[10px] font-mono font-semibold animate-pulse flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FB4617] animate-ping" />
                                EXEC...
                              </span>
                            ) : (
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${log.badgeColor} select-none`}>
                                {log.statusBadge}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Terminal Alt Telemetri Çubuğu */}
              <div className="pt-2 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-neutral-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${simRunning ? "bg-amber-400 animate-pulse" : hasStarted ? "bg-emerald-400" : "bg-neutral-500"}`} />
                    {simRunning
                      ? (language === "TR" ? "İŞLENİYOR..." : "PROCESSING...")
                      : hasStarted
                      ? (language === "TR" ? "5/5 AŞAMA TAMAMLANDI" : "5/5 STAGES COMPLETE")
                      : (language === "TR" ? "SİSTEM HAZIR" : "SYSTEM IDLE")}
                  </span>
                  <span className="hidden sm:inline text-neutral-700">|</span>
                  <span className="hidden sm:inline">Thread: C# REFramework</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <span>Hata: <strong className="text-emerald-400">0</strong></span>
                  <span>Doğruluk: <strong className="text-emerald-400">%99.8</strong></span>
                </div>
              </div>
            </div>

            {/* SAĞ: Yetkinlik & Entegrasyon Mimarisi Paneli */}
            <div className="lg:col-span-4 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 p-3.5 sm:p-4 flex flex-col justify-between shadow-2xl space-y-2.5">
              <div className="space-y-1">
                <span className="text-[9.5px] font-mono text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                  {language === "TR" ? "YETKİNLİK VE ENTEGRASYON AĞI" : "CAPABILITY & SYSTEM MATRIX"}
                </span>
                <h3 className="text-sm sm:text-base font-medium text-white tracking-tight">
                  {language === "TR" ? "Uçtan Uca Yetkinlik Mimarisi" : "End-to-End Capability Stack"}
                </h3>
              </div>

              <div className="space-y-1 font-mono text-xs">
                {[
                  { name: "SAP & BOA Core Banking", sub: "REST / SOAP API", icon: "🏦", status: "SYNC", color: "text-emerald-400" },
                  { name: "Document Understanding", sub: "AI Center & OCR", icon: "📄", status: "AI LIVE", color: "text-indigo-400" },
                  { name: "C# & .NET Custom Logic", sub: "Self-Healing Core", icon: "⚙️", status: "ACTIVE", color: "text-amber-400" },
                  { name: "LINQ & SQL High-Speed", sub: "< 50ms In-Memory", icon: "⚡", status: "FAST", color: "text-emerald-400" },
                  { name: "Power BI & Business Intel", sub: "Dataverse & KPI", icon: "🧠", status: "SYNC", color: "text-indigo-400" },
                  { name: "Secure SFTP & ETL Pipeline", sub: "AES-256 Synced", icon: "🔒", status: "SECURE", color: "text-emerald-400" },
                ].map((node, i) => (
                  <div
                    key={i}
                    className="p-1.5 sm:p-2 rounded-lg bg-neutral-950/90 border border-neutral-800/80 flex items-center justify-between text-neutral-300 text-[10.5px] shadow-sm hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs shrink-0">{node.icon}</span>
                      <div className="truncate">
                        <span className="font-medium text-white truncate block text-[11px] leading-tight">{node.name}</span>
                        <span className="text-[9px] text-neutral-500 font-mono block leading-none">{node.sub}</span>
                      </div>
                    </div>
                    <span className={`${node.color} flex items-center gap-1 text-[8.5px] font-semibold font-mono shrink-0 pl-1.5`}>
                      <span className={`w-1 h-1 rounded-full ${node.color === "text-emerald-400" ? "bg-emerald-400" : node.color === "text-indigo-400" ? "bg-indigo-400" : "bg-amber-400"} animate-pulse`} />
                      {node.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-2 rounded-lg bg-neutral-950/80 border border-neutral-800 text-[9.5px] sm:text-[10px] font-mono text-neutral-400 flex items-center justify-between shadow-inner">
                <span>Agile Sprint & PDD/SDD:</span>
                <span className="text-emerald-400 font-bold">
                  {language === "TR" ? "%100 Tamamlandı" : "100% Signed-Off"}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Alt Bölümle Yumuşak Geçiş Sağlayan Degrade Maske */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none z-0" />
    </section>
  );
}
