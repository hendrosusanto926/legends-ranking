"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Globe,
  Star,
  Award,
  Medal,
  Earth,
  Scale,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Background } from "@/components/layout/background";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ACHIEVEMENT_CONFIG } from "@/lib/players";

const ICON_MAP: Record<string, React.ElementType> = {
  Trophy,
  Earth,
  Globe,
  Award,
  Star,
  Medal,
  Sparkles,
};

const METHODOLOGY_ITEMS = [
  {
    key: "continentalClub",
    title: "Continental Club",
    description:
      "UEFA Champions League, Copa Libertadores, or equivalent continental club competition titles. Winning the premier club competition in a continent demonstrates excellence against the best clubs across multiple domestic leagues.",
    weight: "High - Multiple winners receive cumulative credit",
  },
  {
    key: "continentalNational",
    title: "Continental National",
    description:
      "UEFA European Championship, Copa AmÃƒÂ©rica, AFC Asian Cup, or equivalent continental national team competition titles. Winning a continental tournament showcases dominance against other nations in the same region.",
    weight: "High - Major international achievement",
  },
  {
    key: "worldCup",
    title: "FIFA World Cup",
    description:
      "The pinnacle of international football. Winning the FIFA World Cup is the highest achievement in the sport, representing global supremacy. Each World Cup victory carries significant weight in the ranking.",
    weight: "Very High - The ultimate football achievement",
  },
  {
    key: "domesticLeague",
    title: "Domestic League",
    description:
      "National league titles won in any top-tier domestic competition. Uses milestone scoring instead of counting every title: 1-4 titles earns +1, 5-8 titles earns +1.5, 9+ titles earns +2.",
    weight: "Milestone-based scoring",
  },
  {
    key: "ballonDor",
    title: "Ballon d'Or",
    description:
      "The most prestigious individual award in football, given annually to the best player in the world. At least one Ballon d'Or win earns a flat +1 point bonus.",
    weight: "Flat bonus: +1 point",
  },
  {
    key: "worldCupRunnerUp",
    title: "World Cup Runner-up",
    description:
      "Finishing as runner-up in the FIFA World Cup is a significant achievement. Each runner-up appearance earns +1.5 points.",
    weight: "+1.5 per appearance",
  },
  {
    key: "worldCupThirdPlace",
    title: "World Cup Third Place",
    description:
      "Finishing in third place at the World Cup shows consistent high performance at the international level. Each third-place finish earns +0.75 points.",
    weight: "+0.75 per finish",
  },
  {
    key: "continentalRunnerUp",
    title: "Continental Runner-up",
    description:
      "Finishing as runner-up in a continental tournament (UEFA Euro, Copa AmÃƒÂ©rica, etc.). Each runner-up appearance earns +0.75 points.",
    weight: "+0.75 per appearance",
  },
];

const POINT_SYSTEM = [
  { icon: "Trophy", label: "Continental Club Champion", points: "+1.5", per: "per title" },
  { icon: "Earth", label: "Continental National Champion", points: "+1.75", per: "per title" },
  { icon: "Medal", label: "Continental National Runner-up", points: "+0.75", per: "per appearance" },
  { icon: "Globe", label: "FIFA World Cup Champion", points: "+2", per: "per title" },
  { icon: "Medal", label: "FIFA World Cup Runner-up", points: "+1.5", per: "per appearance" },
  { icon: "Medal", label: "FIFA World Cup Third Place", points: "+0.75", per: "per finish" },
  { icon: "Award", label: "Domestic League", points: "1\u20132", per: "milestone scoring" },
  { icon: "Star", label: "Ballon d'Or", points: "+1", per: "flat bonus" },
];

export default function MethodologyPage() {
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
              Ranking{" "}
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Methodology
              </span>
            </h1>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Understanding how we calculate and rank football legends
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/80 backdrop-blur-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FFD700]/10 ring-1 ring-[#FFD700]/20">
                  <Scale className="h-5 w-5 text-[#FFD700]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Ranking Methodology</h2>
              </div>

              <div className="mb-6 text-[var(--text-secondary)] leading-relaxed">
                <p>
                  Each player&apos;s final score is calculated by summing points
                  across eight achievement categories. Each category uses a
                  specific point value per title, appearance, or milestone as
                  detailed below.
                </p>
              </div>

              {/* Point System Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {POINT_SYSTEM.map((item) => {
                  const Icon = ICON_MAP[item.icon] || Trophy;
                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center gap-4 hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ring-1 ring-white/10 shrink-0">
                        <Icon className="h-5 w-5 text-white/80" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {item.label}
                        </p>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-lg font-bold text-[#FFD700]">
                            {item.points}
                          </span>
                          <span className="text-xs text-[var(--text-secondary)]">
                            {item.per}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Domestic League Milestone */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-600/10 ring-1 ring-white/10">
                    <Award className="h-4 w-4 text-yellow-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Domestic League â€” Milestone Scoring</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { range: "1\u20134 titles", points: "+1 point" },
                    { range: "5\u20138 titles", points: "+1.5 points" },
                    { range: "9+ titles", points: "+2 points" },
                  ].map((tier) => (
                    <div key={tier.range} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-center">
                      <p className="text-xs text-[var(--text-secondary)] mb-1">{tier.range}</p>
                      <p className="text-base font-bold text-[#FFD700]">{tier.points}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ballon d'Or & Major Bonus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-pink-600/10 ring-1 ring-white/10">
                      <Star className="h-4 w-4 text-rose-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Ballon d'Or</h3>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">
                    At least one Ballon d'Or win
                  </p>
                  <p className="text-lg font-bold text-[#FFD700]">+1 point</p>
                </div>

                <div className="rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/[0.03] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 ring-1 ring-[#FFD700]/30">
                      <Sparkles className="h-4 w-4 text-[#FFD700]" />
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Major Achievement Bonus</h3>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">
                    Won all five major achievements<span className="block text-[10px] text-white/40 mt-0.5">Continental Club · Continental National · World Cup · Domestic League · Ballon d'Or</span>
                  </p>
                  <p className="text-lg font-bold text-[#FFD700]">+5 points</p>
                </div>
              </div>
            </motion.div>

            {METHODOLOGY_ITEMS.map((item, i) => {
              const Icon = ICON_MAP[
                ACHIEVEMENT_CONFIG.find((c) => c.key === item.key)?.icon || "Trophy"
              ];

              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + 0.1 * i }}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/80 backdrop-blur-xl p-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--bg-surface)] ring-1 ring-[var(--border-color)]">
                      {Icon && <Icon className="h-6 w-6 text-[#FFD700]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                        {item.description}
                      </p>
                      <div className="inline-flex items-center gap-1.5 text-xs text-[#FFD700]/70 bg-[#FFD700]/5 px-2.5 py-1 rounded-full">
                        <Star className="h-3 w-3" />
                        {item.weight}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/80 backdrop-blur-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                  <BookOpen className="h-5 w-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Important</h2>
              </div>
              <div className="space-y-3 text-[var(--text-secondary)] leading-relaxed">
                <p>
                  <strong className="text-[var(--text-primary)]">This ranking is based on major career achievements rather than individual statistics.</strong>{" "}
                  The methodology is intentionally simplified to compare players across different eras, positions, and competitions.
                </p>
                <p>
                  The ranking represents the creator&apos;s personal opinion and is designed to encourage discussion rather than establish an absolute truth.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
