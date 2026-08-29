"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorStar() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Snappier, smooth delayed spring physics (fast & responsive floating follower)
  const springConfig = { damping: 24, stiffness: 130, mass: 0.65 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on devices with a mouse/pointer
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("[role='button']")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!mounted) return null;

  return (
    <motion.div
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isHovered ? 1.4 : 1,
        rotate: isHovered ? 45 : 0,
      }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.25, ease: "easeOut" },
        rotate: { duration: 0.4, ease: "easeOut" },
      }}
      className="fixed top-0 left-0 pointer-events-none z-[999998] hidden md:block select-none will-change-transform"
    >
      {/* GLOWING ORANGE 4-POINT STAR */}
      <div className="relative flex items-center justify-center">
        {/* Soft Ambient Glow Halo */}
        <div className="absolute w-8 h-8 rounded-full bg-[#FB4617]/30 blur-md pointer-events-none" />

        {/* 4-Point Star Sparkle SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-[#FB4617] drop-shadow-[0_0_8px_rgba(251,70,23,0.85)] relative z-10"
        >
          <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
        </svg>
      </div>
    </motion.div>
  );
}
