"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function WorksSection() {
  const { language } = useLanguage();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lockedId, setLockedId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Works alanından çıkıldığında (özellikle Hakkımda / #about alanı ekranda göründüğü an) kartı ve sabitlemeyi anında kaldır
  useEffect(() => {
    const handleScrollOrLeave = () => {
      if (!lockedId && !hoveredId) return;

      // 1. Hakkımda (#about) alanı ekranda göründüğü ilk anda kartı anında yok et
      const aboutEl = document.getElementById("about");
      if (aboutEl) {
        const aboutRect = aboutEl.getBoundingClientRect();
        if (aboutRect.top <= window.innerHeight - 50) {
          setLockedId(null);
          setHoveredId(null);
          return;
        }
      }

      // 2. Üstten Home bölümüne çıkıldığında
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top > 120) {
          setLockedId(null);
          setHoveredId(null);
        }
      }
    };

    window.addEventListener("scroll", handleScrollOrLeave, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollOrLeave);
  }, [lockedId, hoveredId]);

  useEffect(() => {
    // #about bölümünü gözlemleyen IntersectionObserver (ilk pikselde anında tetiklenir)
    const aboutEl = document.getElementById("about");
    let aboutObserver: IntersectionObserver | null = null;

    if (aboutEl) {
      aboutObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setLockedId(null);
            setHoveredId(null);
          }
        },
        { root: null, threshold: 0 }
      );
      aboutObserver.observe(aboutEl);
    }

    // Works alanının kendi observer'ı
    let worksObserver: IntersectionObserver | null = null;
    if (sectionRef.current) {
      worksObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            setLockedId(null);
            setHoveredId(null);
          }
        },
        { root: null, threshold: 0.05 }
      );
      worksObserver.observe(sectionRef.current);
    }

    return () => {
      if (aboutObserver) aboutObserver.disconnect();
      if (worksObserver) worksObserver.disconnect();
    };
  }, []);

  const worksList = [
    {
      id: "01",
      titleTR: "Cross-Platform Veri Orkestrasyonu",
      titleEN: "Cross-Platform Data Orchestration",
      tagTR: "API, Scraping & SAP Entegrasyonu",
      tagEN: "API, Scraping & SAP Integration",
      year: "2024",
      image: "/projects/project-1.jpg",
      bulletsTR: [
        "İnteraktif Vergi Dairesi, Meyer (Geçiş Kontrol) ve SAP gibi birbirinden bağımsız sistemleri web scraping ve API yöntemleriyle uçtan uca entegre ettim.",
        "PDF ve Excel verilerini sınıflandırma algoritmalarıyla işleyerek manuel veri girişindeki hataları minimize ettim ve verilerin sisteme hatasız aktarımını sağladım.",
        "SAP otomasyonu ile muhasebe süreçlerindeki iş yükünü hafifleterek operasyonların yöneticilere düzenli raporlanmasını ve izlenebilirliğini mümkün kıldım."
      ],
      bulletsEN: [
        "Integrated disparate systems including Interactive Tax Office, Meyer Access Control, and SAP using web scraping and REST APIs.",
        "Processed PDF and Excel datasets with custom classification algorithms, eliminating manual data entry errors and ensuring 100% accurate data ingestion.",
        "Automated SAP accounting workflows to reduce operational workload and provide executives with regular automated reporting."
      ],
    },
    {
      id: "02",
      titleTR: "Bilişsel Veri Çıkarma Ağı",
      titleEN: "Cognitive Data Extraction Network",
      tagTR: "UiPath AI Center & OCR Doküman Mimarisi",
      tagEN: "UiPath AI Center & OCR Document Architecture",
      year: "2025",
      image: "/projects/project-2.jpg",
      bulletsTR: [
        "Yapısal olmayan faturalardan veri çıkarma sürecinde OCR, UiPath AI Center ve Document Understanding (DU) teknolojilerini entegre ederek manuel işlemleri ortadan kaldırdım.",
        "AI Center üzerinden yönetilen yapay zeka tabanlı özel sınıflandırma (classification) modellerini kullanarak sistemin veri doğruluk seviyesini önemli ölçüde artırdım.",
        "İstisna durumlarını (exception) otomatik olarak tespit eden kural setleri oluşturup raporlayarak hata oranını düşürdüm ve süreç maliyetlerinde ciddi tasarruf sağladım."
      ],
      bulletsEN: [
        "Eliminated manual data entry by integrating OCR, UiPath AI Center, and Document Understanding (DU) across unstructured invoice streams.",
        "Trained and deployed custom AI Center machine learning classification models, significantly elevating extraction accuracy.",
        "Engineered automated exception handling rule-sets and auditing pipelines to slash operational processing costs."
      ],
    },
    {
      id: "03",
      titleTR: "Finansal Operasyon Orkestrasyonu",
      titleEN: "Financial Operations Orchestration",
      tagTR: "Ana Bankacılık Tabanlı Otonom Mutabakat ve İşlem Sistemi",
      tagEN: "Core Banking Reconciliation & Transactions",
      year: "2024",
      image: "/projects/project-3.jpg",
      bulletsTR: [
        "Ana bankacılık altyapısı üzerinde çalışan kritik finansal süreçleri uçtan uca otomatize ettim.",
        "Dış kaynaklardan gelen hesap ekstrelerindeki kompleks yatırım ve fon hareketlerinin net tutar hesaplamalarını gerçekleştirerek, finansal işlem ve transfer süreçlerine hatasız veri aktarımı sağladım.",
        "Hesap bakiyesi mutabakatlarını SQL üzerinden çapraz sorgularla çekip analiz ederek iş birimlerine Excel Pivot formatında otonom raporlar sundum."
      ],
      bulletsEN: [
        "Automated mission-critical financial workflows operating on enterprise core banking infrastructure end-to-end.",
        "Calculated net values for complex investment and mutual fund transactions from external statements, routing validated records into banking transaction pipelines.",
        "Engineered SQL cross-queries to pull account reconciliation data, delivering autonomous Excel Pivot reporting to business units."
      ],
    },
    {
      id: "04",
      titleTR: "Akıllı ERP Veri Analitiği",
      titleEN: "Intelligent ERP Data Analytics",
      tagTR: "Yapay Zeka Destekli SAP İstisna & Süreç Otomasyonu",
      tagEN: "AI-Powered SAP Exception & Process Automation",
      year: "2025",
      image: "/projects/project-4.jpg",
      bulletsTR: [
        "SAP ERP sistemi ile sorunsuz entegrasyon kurarak verilerin otomatik alınmasını sağladım ve veri işleme sürecini büyük ölçüde hızlandırdım.",
        "Bilişsel servisleri ve veri doğrulama algoritmalarını kullanarak veri analizlerini daha doğru hale getirdim ve şirketin operasyonel maliyetlerini azalttım.",
        "SAP verileri üzerinde gelişmiş analizler yaparak Power BI ve Excel araçlarıyla kullanıcı dostu dashboard'lar ve özelleştirilmiş raporlar oluşturdum."
      ],
      bulletsEN: [
        "Built seamless SAP ERP integration pipelines for automated data ingestion, drastically accelerating transaction processing speed.",
        "Applied cognitive services and data validation algorithms to enhance accuracy and minimize corporate operational overhead.",
        "Conducted deep analytics on SAP enterprise data, authoring custom interactive Power BI and Excel dashboards."
      ],
    },
    {
      id: "05",
      titleTR: "Çift Yönlü Veri Senkronizasyonu",
      titleEN: "Bi-Directional Data Synchronization",
      tagTR: "SFTP & SQL Tabanlı ETL Mimarisi",
      tagEN: "SFTP & SQL-Based ETL Architecture",
      year: "2024",
      image: "/projects/project-5.jpg",
      bulletsTR: [
        "Ortak ağ yolları ve güvenli SFTP sunucularındaki yapılandırılmamış metin (.txt) dosyalarını iş kurallarına göre ayrıştıran (parsing) sağlam bir ETL altyapısı kurdum.",
        "İşlenen verilerin SQL veri tabanlarına otomatik olarak eklenmesini ve istenilen format kurallarına dönüştürülerek tekrar SFTP'ye yüklenmesini sağladım.",
        "Veri tabanı ve dosya sunucuları arasındaki çift yönlü aktarımı güvenli protokollerle hatasız bir şekilde otomatize ettim."
      ],
      bulletsEN: [
        "Architected a resilient ETL infrastructure parsing unstructured text (.txt) files from shared drives and secure SFTP servers according to complex business rules.",
        "Automated SQL database ingestion and data transformation, re-encrypting and publishing formatted outputs back to SFTP endpoints.",
        "Ensured zero-data-loss bi-directional sync across file servers and database engines through enterprise secure protocols."
      ],
    },
    {
      id: "06",
      titleTR: "Merkezi İş Akışı ve Analitik Mimarisi",
      titleEN: "Centralized Workflow & Analytics",
      tagTR: "Dataverse, Power Apps & Power BI Mimarisi",
      tagEN: "Dataverse, Power Apps & Power BI Ecosystem",
      year: "2025",
      image: "/projects/project-6.jpg",
      bulletsTR: [
        "SharePoint, Dataverse ve Power Automate gibi platformları birbirine entegre ederek dağınık süreçleri tek bir merkezi iş akışında topladım.",
        "Manuel olarak saatler alan işlemleri Power Apps ile geliştirilen uygulamalar üzerinden dakikalara indirgeyerek ekiplerin zaman kayıplarını minimuma indirdim.",
        "Power BI entegrasyonu ile süreçlerden elde edilen verileri anlamlandırarak yöneticilere derinlemesine veri analitiği içgörüleri sundum."
      ],
      bulletsEN: [
        "Integrated SharePoint, Dataverse, and Power Automate platforms to unify fragmented enterprise operations into a centralized workflow.",
        "Streamlined manual multi-hour tasks into streamlined minutes via intuitive Power Apps custom applications.",
        "Delivered deep executive intelligence and interactive KPIs by integrating real-time workflow telemetry into Power BI."
      ],
    },
    {
      id: "07",
      titleTR: "Otonom Doküman Ayrıştırma Motoru",
      titleEN: "Autonomous Document Splitting Engine",
      tagTR: "Akıllı Metin Analizi & Bulut Dosya Yönetimi",
      tagEN: "Smart Text Parsing & Cloud Storage Sync",
      year: "2024",
      image: "/projects/project-7.jpg",
      bulletsTR: [
        "Müşteri ihtiyaçlarına uygun olarak belirlenmiş anahtar kelimelere veya spesifik sayfa aralıklarına göre PDF dosyalarını otomatik analiz edip ayıran bir çözüm sağladım.",
        "Büyük PDF dosyalarını manuel ayırma iş yükünü tamamen ortadan kaldırarak operasyonel süreçlerde devasa bir zaman tasarrufu elde ettim.",
        "Bölünen PDF dosyalarını otomatik olarak bulut (Cloud) depolama hizmetlerine yükleyen sistem entegrasyonu ile iş süreçlerini ve erişilebilirliği hızlandırdım."
      ],
      bulletsEN: [
        "Engineered an automated PDF parsing solution that splits massive document bundles based on intelligent keyword matching or page ranges.",
        "Eliminated the intensive operational burden of manual document sorting, saving hundreds of labor hours.",
        "Integrated automated cloud storage synchronization for parsed assets, accelerating downstream document retrieval."
      ],
    },
    {
      id: "08",
      titleTR: "Dinamik Risk ve Gözlem Mimarisi",
      titleEN: "Dynamic Risk & Compliance Monitoring",
      tagTR: "REST API & SQL Çapraz Sorgu Alarm Sistemi",
      tagEN: "REST API & SQL Cross-Query Alert System",
      year: "2025",
      image: "/projects/project-8.jpg",
      bulletsTR: [
        "Müşterilerin gecikmiş ödemeleri, vadesi dolan poliçeleri ve kur kaynaklı teminat açıkları için ana bankacılık sistemleri üzerinden günlük taramalar yapan otonom bir risk takip sistemi kurdum.",
        "Entegrasyon API raporlarını analiz ederek ve harici kurumsal servis verilerini SQL'deki mevcut kayıtlarla eşleştirerek dinamik e-posta bildirim akışları tasarladım.",
        "Olası sistem uyumsuzluklarını belirlenen iş kuralları çerçevesinde tespit edip veri tabanlarını otomatik olarak güncelleyerek veri tutarlılığını garanti altına aldım."
      ],
      bulletsEN: [
        "Constructed an autonomous risk monitoring system scanning core banking systems daily for delinquent payments, expiring policies, and collateral currency margins.",
        "Designed dynamic SMTP alarm dispatchers by cross-analyzing integration API reports with SQL records and enterprise service registries.",
        "Enforced data consistency by auto-detecting system discrepancies and executing rule-based database updates."
      ],
    },
  ];

  const handleProjectGridClick = (id: string) => {
    if (lockedId !== null && lockedId !== id) {
      return;
    }

    if (lockedId === id) {
      setLockedId(null);
    } else {
      setLockedId(id);
      setHoveredId(null);
    }
  };

  const activeProject = worksList.find((w) => w.id === (lockedId || hoveredId));

  return (
    <section ref={sectionRef} id="works" className="scroll-mt-20 pt-4 sm:pt-6 md:pt-8 pb-24 sm:pb-32 md:pb-40 px-4 sm:px-6 md:px-16 relative z-30 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        
        {/* 1. ÜST BAŞLIK ALANI */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FB4617] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FB4617] shadow-[0_0_8px_#FB4617]" />
              </span>
              <span className="text-xs font-mono text-[#FB4617] uppercase tracking-widest font-semibold">
                {language === "TR" ? "// 02. SEÇİLMİŞ PROJELER" : "// 02. SELECTED WORKS"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight">
              {language === "TR" ? (
                <>
                  Seçilmiş <span className="font-semibold text-white">Projelerim</span>
                </>
              ) : (
                <>
                  Recently <span className="font-semibold text-white">Selected Works</span>
                </>
              )}
            </h2>
          </div>
          <div className="text-xs font-mono text-neutral-400 self-start sm:self-end">
            (UiPath & RPA Ecosystem)
          </div>
        </div>

        {/* 2. GENİŞ YATAY AYIRICI ÇİZGİ */}
        <div className="w-full h-0.5 bg-neutral-800 rounded-full my-3 sm:my-4" />

        {/* 3. İKİ SÜTUNLU DÜZEN: SOLDA METİN & 3D VURGU, SAĞDA 8 PROJE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start relative">
          
          {/* SOL SÜTUN */}
          <div className="lg:col-span-3 flex flex-col justify-start h-full py-1">
            <div className="text-xs font-mono text-neutral-400 tracking-wider">
              {language === "TR" ? "/Otomasyon Çözümleri/" : "/Automation Solutions/"}
            </div>
          </div>

          {/* SAĞ SÜTUN (8 PROJE LİSTESİ) */}
          <div 
            onMouseLeave={() => {
              if (lockedId === null) setHoveredId(null);
            }}
            className="lg:col-span-9 flex flex-col divide-y divide-neutral-800/80"
          >
            {worksList.map((work) => {
              const isLocked = lockedId === work.id;
              const isOtherLocked = lockedId !== null && lockedId !== work.id;
              const isOpen = lockedId !== null ? isLocked : hoveredId === work.id;
              const currentTitle = language === "TR" ? work.titleTR : work.titleEN;
              const currentTag = language === "TR" ? work.tagTR : work.tagEN;
              const currentBullets = language === "TR" ? work.bulletsTR : work.bulletsEN;

              return (
                <div
                  key={work.id}
                  className={`flex flex-col transition-all duration-300 ${
                    isOtherLocked ? "opacity-25 pointer-events-none select-none grayscale cursor-not-allowed" : "opacity-100"
                  }`}
                >
                  <div
                    onMouseEnter={() => {
                      if (lockedId === null) setHoveredId(work.id);
                    }}
                    onClick={() => handleProjectGridClick(work.id)}
                    className={`group relative flex items-center justify-between py-2.5 sm:py-3 lg:py-3.5 transition-all duration-300 ${
                      isOtherLocked 
                        ? "cursor-not-allowed" 
                        : isLocked 
                          ? "border-[#FB4617] cursor-pointer" 
                          : "cursor-pointer hover:border-[#FB4617]/50"
                    }`}
                  >
                    {/* ID & BAŞLIK */}
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 min-w-0">
                      <span className={`text-xs sm:text-sm font-mono transition-colors shrink-0 ${
                        isLocked ? "text-[#FB4617] font-bold" : "text-neutral-400"
                      }`}>
                        ({work.id})
                      </span>
                      <span className={`text-sm sm:text-base md:text-lg font-light tracking-normal transition-all duration-300 truncate ${
                        isLocked
                          ? "text-[#FB4617] font-normal translate-x-1.5"
                          : "group-hover:translate-x-1 group-hover:text-[#FB4617]"
                      }`}>
                        {currentTitle}
                      </span>
                    </div>

                    {/* YIL & MOBİL OK */}
                    <div className="flex items-center gap-3 sm:gap-6 shrink-0 ml-4">
                      <span className={`text-xs sm:text-sm font-mono ${
                        isLocked ? "text-white font-medium" : "text-neutral-400"
                      }`}>
                        {work.year}
                      </span>
                      <span className="text-xs text-neutral-600 md:hidden">
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {/* MOBİL İÇİN GENİŞLEYEN KART */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden pb-4"
                      >
                        <div
                          onClick={(e) => {
                            if (isLocked) {
                              e.stopPropagation();
                              setLockedId(null);
                            }
                          }}
                          className={`rounded-2xl bg-[#0e0e14] p-4 flex flex-col gap-3.5 border shadow-xl ${
                            isLocked ? "border-[#FB4617] ring-1 ring-[#FB4617]/40 cursor-pointer" : "border-neutral-800"
                          }`}
                        >
                          {/* Mobil Mockup */}
                          <div className="relative w-full h-44 rounded-xl overflow-hidden border border-neutral-800">
                            <Image
                              src={work.image}
                              alt={currentTitle}
                              fill
                              unoptimized
                              className="object-cover object-center"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="text-[10px] font-mono text-[#FB4617] font-semibold uppercase">
                              {currentTag}
                            </div>
                            <h4 className="text-sm font-medium text-white">
                              {currentTitle}
                            </h4>
                            <ul className="space-y-1.5 text-xs text-neutral-300 font-light leading-relaxed">
                              {currentBullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-2">
                                  <span className="text-[#FB4617] text-xs shrink-0">▸</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. SÜREÇ SAYACI & 3D TURUNCU VURGU (ÜST VE ALT YAZILARA GENİŞ & TAM EŞİT MESAFEDE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center mt-28 sm:mt-36 md:mt-48 mb-0">
          {/* SOL: 3D Turuncu Geometrik Vurgu (Seçilmiş Projelerim / Sol Kolon ile Birebir Aynı Hizada) */}
          <div className="hidden lg:flex items-center lg:col-span-3 opacity-85">
            <div className="w-24 h-16 relative flex items-center gap-1.5">
              <div className="w-6 h-10 bg-[#FB4617]/80 rounded-sm transform -skew-y-12 border border-[#FB4617]" />
              <div className="w-6 h-14 bg-[#FB4617] rounded-sm transform -skew-y-6 shadow-lg shadow-[#FB4617]/30" />
              <div className="w-6 h-8 bg-[#FB4617]/60 rounded-sm transform skew-y-12 border border-[#FB4617]/50" />
            </div>
          </div>

          {/* SAĞ: 25+ Sayaç Kutusu (Proje Başlıklarıyla Tam Aynı Hizada) */}
          <div className="lg:col-span-9 flex justify-start items-center">
            <div className="relative group p-[1px] rounded-2xl bg-gradient-to-b from-neutral-700/50 via-neutral-800/30 to-transparent hover:from-[#FB4617]/70 hover:to-[#FB4617]/20 transition-all duration-500 shadow-xl">
              <div className="absolute -inset-1 bg-[#FB4617]/15 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative bg-[#111111]/95 backdrop-blur-xl border border-neutral-800/90 rounded-[18px] px-7 sm:px-9 py-4 sm:py-5 flex items-center gap-5 sm:gap-7 text-left transition-all duration-300">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono drop-shadow-[0_0_18px_rgba(251,70,23,0.4)]">
                    25
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[#FB4617]">+</span>
                </div>

                <div className="w-px h-10 bg-neutral-800 shrink-0" />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FB4617] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FB4617]"></span>
                    </span>
                    <span className="text-[10px] sm:text-[10.5px] font-mono tracking-widest text-[#FB4617] uppercase font-semibold">
                      {language === "TR" ? "OTOMASYON & SÜREÇ" : "AUTOMATION & PROCESS"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-light text-neutral-200 tracking-normal">
                    {language === "TR" ? "Uçtan Uca Geliştirilen Süreç Sayısı" : "End-to-End Developed Processes"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MASAÜSTÜ FLOATING DETAY KARTI (EKRANDA HER ZAMAN KUSURSUZ VE TAM GÖRÜNÜR) */}
      <AnimatePresence mode="wait">
        {activeProject && (
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, scale: 0.94, x: 50 }}
            animate={{
              opacity: 1,
              scale: lockedId ? 1.02 : 1,
              x: 0,
            }}
            exit={{ opacity: 0, scale: 0.94, x: 40, transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(e) => {
              if (lockedId) {
                e.stopPropagation();
                setLockedId(null);
              }
            }}
            className={`hidden md:flex fixed right-[3vw] lg:right-[6vw] xl:right-[10vw] top-[72px] md:top-[78px] lg:top-[82px] w-[360px] lg:w-[390px] xl:w-[410px] rounded-2xl bg-[#0e0e14]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden z-[999] p-3.5 lg:p-4 flex-col gap-2.5 border will-change-transform ${
              lockedId
                ? "border-[#FB4617] ring-2 ring-[#FB4617]/50 shadow-[0_15px_60px_rgba(251,70,23,0.35)] pointer-events-auto cursor-pointer"
                : "border-neutral-700/80 shadow-2xl pointer-events-none"
            }`}
          >
            {/* ÜST BAŞLIK VE KİLİT GÖSTERGESİ */}
            <div className="flex items-center justify-between text-[11px] font-mono pb-1.5 border-b border-neutral-800/80">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FB4617] animate-pulse" />
                <span className="text-[#FB4617] font-semibold tracking-wider truncate max-w-[280px]">
                  {activeProject.id} // {language === "TR" ? activeProject.tagTR : activeProject.tagEN}
                </span>
              </div>
              <span className="text-neutral-400 font-mono text-[10px] shrink-0">{activeProject.year}</span>
            </div>

            {/* BİLGİSAYAR / LAPTOP MOCKUP ÇERÇEVESİ */}
            <div className="relative rounded-xl bg-neutral-950 p-1.5 border border-neutral-800 shadow-inner group-hover:border-neutral-700 transition-colors">
              {/* Laptop Ekran Üst Kenarı ve Kamera Noktası */}
              <div className="flex items-center justify-center pb-0.5">
                <span className="w-1 h-1 rounded-full bg-neutral-700 shadow-inner" />
              </div>

              {/* Laptop Ekranı İçindeki Görsel */}
              <div className="relative w-full h-28 lg:h-32 rounded-lg overflow-hidden border border-neutral-800/90 shadow-md">
                <Image
                  src={activeProject.image}
                  alt={language === "TR" ? activeProject.titleTR : activeProject.titleEN}
                  fill
                  unoptimized
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
              </div>

              {/* Laptop Alt Menteşe / Klavye Çizgisi */}
              <div className="w-12 h-0.5 bg-neutral-800 rounded-full mx-auto mt-1 opacity-80" />
            </div>

            {/* PROJE BİLGİLERİ & DETAYLI MADDELER */}
            <div className="space-y-1.5 text-left">
              <h4 className="text-xs sm:text-[13.5px] font-semibold text-white tracking-tight leading-snug">
                {language === "TR" ? activeProject.titleTR : activeProject.titleEN}
              </h4>

              <ul className="space-y-1 text-[10.5px] lg:text-[11px] text-neutral-300 font-light leading-relaxed">
                {(language === "TR" ? activeProject.bulletsTR : activeProject.bulletsEN).map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-1.5">
                    <span className="text-[#FB4617] text-[10px] leading-none mt-0.5 shrink-0 font-bold">
                      ▸
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ALT DURUM & SABİTLEME İPUCU */}
            <div className="pt-1.5 border-t border-neutral-800/80 flex items-center justify-between text-[9.5px] font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {language === "TR" ? "Canlıda Doğrulandı" : "Verified in Production"}
              </span>
              <span className="text-neutral-500">
                {lockedId
                  ? (language === "TR" ? "📌 Sabitlendi (Kapatmak için tıkla)" : "📌 Pinned (Click to close)")
                  : (language === "TR" ? "Sabitlemek için tıkla" : "Click to pin")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}