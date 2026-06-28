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
};

const METHODOLOGY_ITEMS = [
  {
    key: "contributionClub",
    title: "Contribution Club",
    description:
      "UEFA Champions League, Copa Libertadores, or equivalent continental club competition titles. Winning the premier club competition in a continent demonstrates excellence against the best clubs across multiple domestic leagues.",
    weight: "High - Multiple winners receive cumulative credit",
  },
  {
    key: "contributionNational",
    title: "Contribution National",
    description:
      "UEFA European Championship, Copa América, AFC Asian Cup, or equivalent continental national team competition titles. Winning a continental tournament showcases dominance against other nations in the same region.",
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
      "National league titles won in any top-tier domestic competition. Consistency over a full season is rewarded, with each title contributing incrementally to the player's overall score.",
    weight: "Medium - Rewards sustained excellence",
  },
  {
    key: "ballonDor",
    title: "Ballon d'Or",
    description:
      "The most prestigious individual award in football, given annually to the best player in the world. Multiple Ballon d'Or wins indicate sustained dominance at the highest level.",
    weight: "Very High - Individual excellence recognition",
  },
  {
    key: "worldCupRunnerUp",
    title: "World Cup Runner-up",
    description:
      "Finishing as runner-up in the FIFA World Cup is a significant achievement, demonstrating the ability to reach the final of the world's biggest tournament.",
    weight: "Medium - Recognition of deep tournament run",
  },
  {
    key: "worldCupThirdPlace",
    title: "World Cup Third Place",
    description:
      "Finishing in third place at the World Cup shows consistent high performance at the international level.",
    weight: "Low-Medium - Solid achievement",
  },
  {
    key: "continentalRunnerUp",
    title: "Continental Runner-up",
    description:
      "Finishing as runner-up in a continental tournament (UEFA Euro, Copa América, etc.) demonstrates high-level performance against regional competition.",
    weight: "Low-Medium - Recognition of continental success",
  },
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
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FFD700]/10 ring-1 ring-[#FFD700]/20">
                  <Scale className="h-5 w-5 text-[#FFD700]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">How Scoring Works</h2>
              </div>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                <p>
                  Each player&apos;s total score is calculated by summing their
                  achievements across eight categories. Each category reflects a
                  specific type of accomplishment:
                </p>
                <p>
                  <strong className="text-[var(--text-primary)]">Score = </strong>
                  Contribution Club + Contribution National + World Cup + Domestic
                  League + Ballon d&apos;Or + World Cup Runner-up + World Cup
                  Third Place + Continental Runner-up
                </p>
                <p>
                  Each achievement is counted equally per occurrence, meaning a
                  player who wins multiple league titles or Champions Leagues
                  receives cumulative credit. The raw count approach ensures
                  transparency and objectivity.
                </p>
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
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">A Note on Subjectivity</h2>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                While this ranking is based on quantifiable achievements,
                football evaluation is ultimately subjective. Different fans,
                cultures, and eras value different accomplishments. This ranking
                is intended to encourage discussion and celebrate the rich
                history of football rather than define an absolute hierarchy of
                greatness. We acknowledge that many legendary players could be
                ranked differently depending on personal criteria and
                preferences.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
