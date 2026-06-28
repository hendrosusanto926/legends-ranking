"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Player } from "@/types/player";

const MEDAL_CONFIG = [
  {
    place: 1,
    icon: Crown,
    label: "Legendary",
    bg: "from-[#FFD700]/20 via-[#FFA500]/10 to-transparent",
    border: "border-[#FFD700]",
    glow: "shadow-[0_0_30px_rgba(255,215,0,0.3)]",
    text: "text-[#FFD700]",
    medalColor: "text-[#FFD700]",
    scale: 1.05,
  },
  {
    place: 2,
    icon: Medal,
    label: "Elite",
    bg: "from-[#C0C0C0]/20 via-[#A0A0A0]/10 to-transparent",
    border: "border-[#C0C0C0]",
    glow: "shadow-[0_0_20px_rgba(192,192,192,0.2)]",
    text: "text-[#C0C0C0]",
    medalColor: "text-[#C0C0C0]",
    scale: 1,
  },
  {
    place: 3,
    icon: Medal,
    label: "World Class",
    bg: "from-[#CD7F32]/20 via-[#B8860B]/10 to-transparent",
    border: "border-[#CD7F32]",
    glow: "shadow-[0_0_20px_rgba(205,127,50,0.2)]",
    text: "text-[#CD7F32]",
    medalColor: "text-[#CD7F32]",
    scale: 1,
  },
];

interface TopThreeProps {
  players: Player[];
}

export function TopThree({ players }: TopThreeProps) {
  const top3 = players.slice(0, 3);

  if (top3.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Top{" "}
            <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              3 Legends
            </span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base">
            The highest-ranked football legends of all time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {top3.map((player, index) => {
            const config = MEDAL_CONFIG[index];
            const Icon = config.icon;
            const isFirst = index === 0;

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                whileHover={{ scale: config.scale }}
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 text-center",
                  config.border,
                  `bg-gradient-to-b ${config.bg}`,
                  config.glow,
                  isFirst && "md:-mt-8"
                )}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl" />

                <div className="relative z-10 space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.4 + 0.2 * index }}
                    className="flex justify-center"
                  >
                    <div
                      className={cn(
                        "rounded-full p-4 bg-white/10 backdrop-blur-sm",
                        isFirst ? "ring-2 ring-[#FFD700] ring-offset-2 ring-offset-[#111111]" : ""
                      )}
                    >
                      <Icon className={cn("h-8 w-8 md:h-10 md:w-10", config.medalColor)} />
                    </div>
                  </motion.div>

                  <div className="space-y-1">
                    <p className={cn("text-xs font-semibold uppercase tracking-widest", config.text)}>
                      {isFirst ? "#1 LEGENDARY" : `#${index + 1} ${config.label}`.toUpperCase()}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {player.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-center gap-3 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5 text-white/40" />
                      {player.nationality}
                    </span>
                    <span className="text-white/20">|</span>
                    <span>{player.position}</span>
                  </div>

                  <div className={cn("text-3xl sm:text-4xl font-bold", config.text)}>
                    {player.score}
                    <span className="text-sm font-normal text-white/40 ml-1">pts</span>
                  </div>

                  {isFirst && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                      className="flex justify-center"
                    >
                      <span className="inline-flex items-center gap-1 text-xs text-[#FFD700]/60">
                        <Star className="h-3 w-3" />
                        Greatest of All Time
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
