"use client";

import { motion } from "framer-motion";
import { Info, MessageCircle, Heart, Code, GitBranch } from "lucide-react";
import { Background } from "@/components/layout/background";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Background />
      <Navigation />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-4">
              About This{" "}
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Project
              </span>
            </h1>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              A premium football analytics platform ranking the greatest players
              in football history.
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/80 backdrop-blur-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FFD700]/10 ring-1 ring-[#FFD700]/20">
                  <Info className="h-5 w-5 text-[#FFD700]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Project Purpose</h2>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This website is a personal project created for football fans and
                discussion purposes. It ranks legendary football players based on
                their achievements, including club success, international trophies,
                and individual awards. The platform aims to provide an elegant,
                data-driven way to explore and compare the greatest players in
                football history.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/80 backdrop-blur-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1B5E20]/20 ring-1 ring-[#1B5E20]/30">
                  <Heart className="h-5 w-5 text-[#4CAF50]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Acknowledgements</h2>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This ranking is inspired by football discussions, statistics, and
                the legacy of players who have shaped the beautiful game. Data
                is gathered from historical records and football databases. The
                ranking methodology is transparent and based on quantifiable
                achievements.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/80 backdrop-blur-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
                  <Code className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Technology Stack</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  "Next.js 15",
                  "TypeScript",
                  "Tailwind CSS",
                  "shadcn/ui",
                  "TanStack Table",
                  "Framer Motion",
                  "Recharts",
                  "Lucide React",
                  "Google Gemini AI",
                ].map((tech) => (
                  <div
                    key={tech}
                    className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-secondary)] text-center"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/80 backdrop-blur-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
                  <GitBranch className="h-5 w-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Future Roadmap</h2>
              </div>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                {[
                  "Expand player database with more legends",
                  "Add head-to-head comparison history",
                  "Interactive timeline of football history",
                  "Community voting and custom rankings",
                  "More detailed player statistics and career timelines",
                  "Mobile app with React Native",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/80 backdrop-blur-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 ring-1 ring-red-500/20">
                  <MessageCircle className="h-5 w-5 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Disclaimer</h2>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This ranking reflects the creator&apos;s personal opinion and is
                not affiliated with FIFA, UEFA, or any official football
                organization. Football opinions are inherently subjective. This
                ranking represents a personal evaluation based on achievements
                and is intended to encourage discussion rather than define an
                absolute measure of greatness.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
