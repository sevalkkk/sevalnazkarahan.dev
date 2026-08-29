"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeaderStats() {
  const [stats, setStats] = useState({ views: 0, projects: 0 });

  useEffect(() => {
    // Record view and fetch totals on initial page load
    async function initStats() {
      const res = await fetch("/api/analytics", { method: "POST" });
      const data = await res.json();
      setStats(data);
    }
    initStats();
  }, []);

  return (
    <div className="flex gap-6 justify-center my-8">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-100 text-center"
      >
        <span className="text-3xl font-extrabold text-indigo-600">{stats.views}</span>
        <p className="text-xs text-slate-500 font-medium mt-1">Total Visitors</p>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-100 text-center"
      >
        <span className="text-3xl font-extrabold text-indigo-600">{stats.projects}</span>
        <p className="text-xs text-slate-500 font-medium mt-1">Completed Works</p>
      </motion.div>
    </div>
  );
}