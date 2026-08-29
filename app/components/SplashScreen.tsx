"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const { language } = useLanguage();
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const holdTimer = setTimeout(() => {
      setStage(2);
    }, 1000);

    const exitTimer = setTimeout(() => {
      setStage(3);
    }, 1700);

    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2550);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const nameText = "Seval Naz Karahan";
  const roleText =
    language === "TR"
      ? "Automation Engineer & Business Analyst"
      : "Automation Engineer & Business Analyst";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[999999] pointer-events-auto select-none overflow-hidden flex items-center justify-center bg-transparent"
        >
          {/* TOP ORANGE SHUTTER */}
          <motion.div
            initial={{ y: "0%" }}
            animate={stage === 3 ? { y: "-100%" } : { y: "0%" }}
            transition={{
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute top-0 left-0 right-0 h-[50.5%] bg-[#FB4617] origin-top z-10"
          />

          {/* BOTTOM ORANGE SHUTTER */}
          <motion.div
            initial={{ y: "0%" }}
            animate={stage === 3 ? { y: "100%" } : { y: "0%" }}
            transition={{
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute bottom-0 left-0 right-0 h-[50.5%] bg-[#FB4617] origin-bottom z-10"
          />

          {/* CENTER CONTENT CONTAINER */}
          <div className="relative z-20 flex flex-col items-center justify-center px-4">
            
            {/* LOGO & TRADEMARK WRAPPER */}
            <motion.div
              initial={{ scale: 3.5, opacity: 1, y: 0 }}
              animate={
                stage === 3
                  ? {
                      scale: 4,
                      y: -260,
                      opacity: 0,
                      transition: {
                        duration: 0.75,
                        ease: [0.76, 0, 0.24, 1],
                      },
                    }
                  : {
                      scale: 1,
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 1.0,
                        ease: [0.96, -0.02, 0.38, 1.01],
                      },
                    }
              }
              className="flex items-start justify-center gap-1.5 md:gap-3"
            >
              <div className="flex items-center justify-center overflow-visible">
                {nameText.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0.001, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.09 + index * 0.025,
                      duration: 0.45,
                      type: "spring",
                      bounce: 0.25,
                      stiffness: 220,
                      damping: 16,
                    }}
                    className="text-2xl sm:text-3xl md:text-[38px] font-medium tracking-[-0.04em] text-white inline-block origin-bottom"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>

              <motion.span
                initial={{ opacity: 0.001, y: -15, scale: 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.4,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 238,
                  damping: 30,
                  mass: 1,
                }}
                className="text-sm sm:text-base md:text-[20px] font-normal text-white/90 leading-none select-none -mt-0.5 sm:-mt-1"
              >
                ®
              </motion.span>
            </motion.div>

            {/* SUBTITLE / ROLE */}
            <motion.div
              initial={{ opacity: 0.001, scale: 0.6, y: 25 }}
              animate={
                stage === 3
                  ? {
                      opacity: 0,
                      scale: 1.2,
                      y: 260,
                      transition: {
                        duration: 0.75,
                        ease: [0.76, 0, 0.24, 1],
                      },
                    }
                  : {
                      opacity: 0.85,
                      scale: 1,
                      y: 0,
                      transition: {
                        delay: 0.6,
                        duration: 0.6,
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 1,
                      },
                    }
              }
              className="mt-1.5 md:mt-2 overflow-hidden"
            >
              <p className="text-xs sm:text-[14px] md:text-[15px] font-normal tracking-tight text-white/80 text-center">
                {roleText}
              </p>
            </motion.div>
          </div>

          {/* CORNER BADGES */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={stage === 3 ? { opacity: 0 } : { opacity: 0.75 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute bottom-6 left-8 text-[11px] font-mono text-white/70 tracking-widest uppercase hidden sm:block z-20"
          >
            TÜRKİYE, İZMİR
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={stage === 3 ? { opacity: 0 } : { opacity: 0.75 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute bottom-6 right-8 text-[11px] font-mono text-white/70 tracking-widest hidden sm:block z-20"
          >
            / 2026 /
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
