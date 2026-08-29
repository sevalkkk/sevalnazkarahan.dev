"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectGrid({ initialProjects }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialProjects.map((project) => (
          <motion.div
            key={project.id}
            layoutId={project.id}
            onClick={() => setSelectedId(project.id)}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer bg-slate-50 hover:bg-indigo-50/50 p-6 rounded-2xl border border-slate-200/60 transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            <h3 className="text-xl font-semibold text-slate-800">{project.title}</h3>
            <p className="text-slate-600 text-sm mt-2 line-clamp-2">{project.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags?.map((tag) => (
                <span key={tag} className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Project View Modal */}
      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            {initialProjects
              .filter((p) => p.id === selectedId)
              .map((project) => (
                <motion.div
                  key={project.id}
                  layoutId={project.id}
                  className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-100 relative overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedId(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                  >
                    ✕
                  </button>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{project.title}</h2>
                  <p className="text-slate-600 leading-relaxed my-4">{project.full_description}</p>
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={() => setSelectedId(null)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all"
                    >
                      Close Details
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}