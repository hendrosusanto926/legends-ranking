"use client";

import { motion } from "framer-motion";
import { Trophy, Info, MessageCircle } from "lucide-react";

export function About() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 sm:p-10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-b from-[#FFD700]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-t from-[#1B5E20]/10 to-transparent rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFD700]/10 ring-1 ring-[#FFD700]/20">
                  <Info className="h-6 w-6 text-[#FFD700]" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    About This{" "}
                    <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                      Ranking
                    </span>
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-white/60 leading-relaxed">
                <p>
                  This website is a personal project created for football fans
                  and discussion purposes.
                </p>
                <p>
                  The ranking is based on football achievements, including club
                  success, international trophies, and individual awards. While
                  statistical accomplishments form the foundation of the
                  ranking, football has always been subjective, and different
                  fans may value achievements differently.
                </p>
                <p>
                  This ranking reflects the creator&apos;s personal opinion and
                  is not affiliated with FIFA, UEFA, or any official football
                  organization.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Trophy className="h-3.5 w-3.5 text-[#FFD700]" />
                  Club Success
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Trophy className="h-3.5 w-3.5 text-[#1B5E20]" />
                  International Trophies
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <MessageCircle className="h-3.5 w-3.5 text-[#FFD700]" />
                  For Discussion
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
