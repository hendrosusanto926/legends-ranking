"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Globe,
  Star,
  Award,
  Medal,
  Earth,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Background } from "@/components/layout/background";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ShareButton } from "@/components/share/share-button";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  getPlayers,
  slugify,
  ACHIEVEMENT_CONFIG,
} from "@/lib/players";
import type { Player } from "@/types/player";

const ICON_MAP: Record<string, React.ElementType> = {
  Trophy,
  Earth,
  Globe,
  Award,
  Star,
  Medal,
};

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [player, setPlayer] = useState<Player | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await getPlayers();
      const sorted = data.sort((a, b) => b.score - a.score);
      setAllPlayers(sorted);
      const found = sorted.find((p) => slugify(p.name) === slug);
      setPlayer(found || null);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  const similarPlayers = useMemo(() => {
    if (!player) return [];
    return allPlayers
      .filter(
        (p) =>
          p.id !== player.id &&
          (p.position === player.position ||
            Math.abs(p.score - player.score) < 3)
      )
      .slice(0, 4);
  }, [player, allPlayers]);

  const radarData = useMemo(() => {
    if (!player) return [];
    return ACHIEVEMENT_CONFIG.map((config) => ({
      stat: config.label,
      value: player[config.key],
      maxValue: config.maxValue,
    }));
  }, [player]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Background />
        <Navigation />
        <div className="pt-24 px-4 max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-16 w-96" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Background />
        <Navigation />
        <div className="text-center pt-24">
          <Trophy className="h-16 w-16 mx-auto text-white/20 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Player Not Found</h1>
          <p className="text-white/50 mb-6">The player you&apos;re looking for doesn&apos;t exist.</p>
          <Button variant="default" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Background />
      <Navigation />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white/50 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 sm:p-10"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-[#FFD700]/5 to-transparent rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-[#1B5E20]/20 flex items-center justify-center ring-2 ring-[#FFD700]/30">
                  <Trophy className="h-14 w-14 sm:h-20 sm:w-20 text-[#FFD700]" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                      {player.name}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                      <Badge variant="secondary">{player.nationality}</Badge>
                      <Badge variant="gold">{player.position}</Badge>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <ShareButton
                      title={`${player.name} - Football Legends Ranking`}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center md:justify-start gap-8">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-bold text-[#FFD700]">
                      {player.score}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      Overall Score
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-white">
                      {ACHIEVEMENT_CONFIG.reduce(
                        (sum, c) => sum + player[c.key],
                        0
                      )}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      Total Trophies
                    </div>
                  </div>
                </div>

                <div className="flex md:hidden items-center justify-center gap-4 mt-4">
                  <ShareButton
                    title={`${player.name} - Football Legends Ranking`}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">
                Achievements
              </h2>
              <div className="space-y-4">
                {ACHIEVEMENT_CONFIG.map((config, i) => {
                  const Icon = ICON_MAP[config.icon] || Trophy;
                  const value = player[config.key];
                  const percentage = Math.min(
                    (value / config.maxValue) * 100,
                    100
                  );

                  return (
                    <motion.div
                      key={config.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon
                            className="h-3.5 w-3.5"
                            style={{ color: config.color }}
                          />
                          <span className="text-sm text-white/70">
                            {config.label}
                          </span>
                        </div>
                        <span
                          className="text-sm font-bold"
                          style={{ color: config.color }}
                        >
                          {value}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{
                            duration: 0.8,
                            delay: 0.1 + 0.05 * i,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">
                Performance Radar
              </h2>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis
                    dataKey="stat"
                    tick={{
                      fill: "rgba(255,255,255,0.5)",
                      fontSize: 10,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, "auto"]}
                    tick={{
                      fill: "rgba(255,255,255,0.3)",
                      fontSize: 9,
                    }}
                  />
                  <Radar
                    name="Achievements"
                    dataKey="value"
                    stroke="#FFD700"
                    fill="#FFD700"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a2e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "white" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {similarPlayers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Similar Players
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarPlayers.map((p) => (
                  <motion.button
                    key={p.id}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => router.push(`/players/${slugify(p.name)}`)}
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 text-center hover:bg-white/10 transition-all"
                  >
                    <div className="text-sm font-semibold text-white mb-1">
                      {p.name}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-white/50 mb-2">
                      <span>{p.nationality}</span>
                      <span className="text-white/20">|</span>
                      <span>{p.position}</span>
                    </div>
                    <div className="text-lg font-bold text-[#FFD700]">
                      {p.score}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
