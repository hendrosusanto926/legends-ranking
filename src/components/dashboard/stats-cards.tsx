"use client";

import { motion } from "framer-motion";
import {
  Users,
  Globe,
  MapPin,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlayerStats } from "@/types/player";

const STAT_CARDS = [
  {
    key: "totalPlayers",
    icon: Users,
    label: "Total Players",
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    key: "countriesRepresented",
    icon: Globe,
    label: "Countries",
    color: "from-green-500/20 to-green-600/10",
    borderColor: "border-green-500/30",
    iconColor: "text-green-400",
  },
  {
    key: "positionsRepresented",
    icon: MapPin,
    label: "Positions",
    color: "from-purple-500/20 to-purple-600/10",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    key: "averageScore",
    icon: TrendingUp,
    label: "Average Score",
    color: "from-orange-500/20 to-orange-600/10",
    borderColor: "border-orange-500/30",
    iconColor: "text-orange-400",
  },
  {
    key: "highestScore",
    icon: ArrowUp,
    label: "Highest Score",
    color: "from-[#FFD700]/20 to-[#FFA500]/10",
    borderColor: "border-[#FFD700]/30",
    iconColor: "text-[#FFD700]",
  },
  {
    key: "lowestScore",
    icon: ArrowDown,
    label: "Lowest Score",
    color: "from-red-500/20 to-red-600/10",
    borderColor: "border-red-500/30",
    iconColor: "text-red-400",
  },
];

interface StatsCardsProps {
  stats: PlayerStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <section id="dashboard" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Dashboard{" "}
            <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Statistics
            </span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base">
            Real-time analytics calculated from player achievement data
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STAT_CARDS.map((card, i) => {
            const Icon = card.icon;
            const value = stats[card.key as keyof PlayerStats];

            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                whileHover={{ scale: 1.03, y: -4 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300",
                  card.borderColor,
                  `bg-gradient-to-br ${card.color}`,
                  "hover:shadow-2xl hover:shadow-black/30"
                )}
              >
                <div className="absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2">
                  <div className="w-full h-full rounded-full bg-white/5 blur-2xl" />
                </div>

                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                      {card.label}
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold text-white">
                      {typeof value === "number"
                        ? Number.isInteger(value)
                          ? value
                          : value.toFixed(2)
                        : value}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "rounded-xl bg-white/10 p-3 backdrop-blur-sm",
                      card.iconColor
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
