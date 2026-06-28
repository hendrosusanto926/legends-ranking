"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-1.5 text-sm text-[#FFD700]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles className="h-4 w-4" />
            Official Ranking Platform
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Football Legends
            <br />
            <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Ranking
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto max-w-2xl text-base sm:text-lg text-white/60 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Ranking based on football achievements, international trophies, club
            success, and individual awards.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Trophy className="h-4 w-4 text-[#FFD700]" />
              Club Success
            </div>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Award className="h-4 w-4 text-[#FFD700]" />
              International Trophies
            </div>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Sparkles className="h-4 w-4 text-[#FFD700]" />
              Individual Awards
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#111111] to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </section>
  );
}
