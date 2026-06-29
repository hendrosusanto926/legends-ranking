"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  ArrowRight,
  Swords,
  Search,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Flag } from "@/lib/flags";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import { ACHIEVEMENT_CONFIG } from "@/lib/players";
import type { Player } from "@/types/player";

interface PlayerComparisonProps {
  players: Player[];
}

export function PlayerComparison({ players }: PlayerComparisonProps) {
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");

  const filtered1 = useMemo(
    () =>
      players.filter(
        (p) =>
          p.name.toLowerCase().includes(search1.toLowerCase()) &&
          p.id !== player2?.id
      ),
    [players, search1, player2]
  );

  const filtered2 = useMemo(
    () =>
      players.filter(
        (p) =>
          p.name.toLowerCase().includes(search2.toLowerCase()) &&
          p.id !== player1?.id
      ),
    [players, search2, player1]
  );

  const radarData = useMemo(() => {
    if (!player1 || !player2) return [];
    return ACHIEVEMENT_CONFIG.map((config) => ({
      key: config.key,
      stat: config.label,
      [player1.name.split(" ").pop() || "P1"]: player1[config.key],
      [player2.name.split(" ").pop() || "P2"]: player2[config.key],
      fullLabel: config.label,
    }));
  }, [player1, player2]);

  const barData = useMemo(() => {
    if (!player1 || !player2) return [];
    return [
      {
        name: "Overall Score",
        [player1.name]: player1.score,
        [player2.name]: player2.score,
      },
      ...ACHIEVEMENT_CONFIG.map((config) => ({
        name: config.label,
        [player1.name]: player1[config.key],
        [player2.name]: player2[config.key],
      })),
    ];
  }, [player1, player2]);

  const getWinner = (val1: number, val2: number): "p1" | "p2" | "tie" => {
    if (val1 > val2) return "p1";
    if (val2 > val1) return "p2";
    return "tie";
  };

  const renderPlayerSearch = (
    label: string,
    player: Player | null,
    search: string,
    setSearch: (v: string) => void,
    filtered: Player[],
    setPlayer: (p: Player | null) => void,
    color: string
  ) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-white/60">
        <Trophy className="h-4 w-4" style={{ color }} />
        <span>{label}</span>
      </div>

      {player ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
        >
          <div className="text-lg font-bold text-white mb-1">{player.name}</div>
          <div className="flex items-center justify-center gap-2 text-xs text-white/50 mb-3">
            <span><Flag country={player.nationality} /> {player.nationality}</span>
            <span className="text-white/20">|</span>
            <Badge variant="secondary" className="text-[10px]">
              {player.position}
            </Badge>
          </div>
          <div className="text-2xl font-bold text-[#FFD700]">
            {player.score}
            <span className="text-xs font-normal text-white/40 ml-1">pts</span>
          </div>
          <button
            onClick={() => {
              setPlayer(null);
              setSearch("");
            }}
            className="mt-2 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Change player
          </button>
        </motion.div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}...`}
            className="pl-9 text-sm"
          />
          {search && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-white/10 bg-[#1a1a2e] shadow-xl z-20 max-h-48 overflow-y-auto"
            >
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPlayer(p);
                    setSearch("");
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <span className="font-medium">{p.name}</span>
                  <span className="text-white/30 text-xs ml-2">
                    <Flag country={p.nationality} /> {p.nationality} • {p.position} • {p.score}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section id="comparison" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Player{" "}
            <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Comparison
            </span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base">
            Compare two football legends head-to-head
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 md:gap-8 items-start">
          {renderPlayerSearch(
            "Player 1",
            player1,
            search1,
            setSearch1,
            filtered1,
            setPlayer1,
            "#FFD700"
          )}

          <div className="flex items-center justify-center py-4 md:py-0">
            <motion.div
              animate={{ scale: player1 && player2 ? 1 : 0.8 }}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full",
                player1 && player2
                  ? "bg-[#FFD700]/20 text-[#FFD700]"
                  : "bg-white/5 text-white/20"
              )}
            >
              <Swords className="h-6 w-6" />
            </motion.div>
          </div>

          {renderPlayerSearch(
            "Player 2",
            player2,
            search2,
            setSearch2,
            filtered2,
            setPlayer2,
            "#4CAF50"
          )}
        </div>

        {player1 && player2 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 space-y-8"
          >
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setPlayer1(null);
                  setPlayer2(null);
                  setSearch1("");
                  setSearch2("");
                }}
                className="text-xs text-white/40 hover:text-white/70 transition-colors px-4 py-2 rounded-lg border border-white/10 hover:border-white/20"
              >
                Clear Comparison
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#FFD700]" />
                  Radar Comparison
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                      dataKey="fullLabel"
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, "auto"]}
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }}
                    />
                    <Radar
                      name={player1.name.split(" ").pop()}
                      dataKey={player1.name.split(" ").pop() || "P1"}
                      stroke="#FFD700"
                      fill="#FFD700"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name={player2.name.split(" ").pop()}
                      dataKey={player2.name.split(" ").pop() || "P2"}
                      stroke="#4CAF50"
                      fill="#4CAF50"
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
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-[#FFD700]" />
                  Achievement Comparison
                </h3>
                <div className="space-y-3">
                  {ACHIEVEMENT_CONFIG.map((config) => {
                    const val1 = player1[config.key];
                    const val2 = player2[config.key];
                    const winner = getWinner(val1, val2);

                    return (
                      <div key={config.key} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "font-medium",
                                winner === "p1"
                                  ? "text-[#FFD700]"
                                  : "text-white/50"
                              )}
                            >
                              {val1}
                            </span>
                            <span className="text-white/30">{config.label}</span>
                            <span
                              className={cn(
                                "font-medium",
                                winner === "p2"
                                  ? "text-[#4CAF50]"
                                  : "text-white/50"
                              )}
                            >
                              {val2}
                            </span>
                          </div>
                          {winner !== "tie" && (
                            <ArrowRight
                              className={cn(
                                "h-3 w-3",
                                winner === "p1"
                                  ? "text-[#FFD700]"
                                  : "text-[#4CAF50]"
                              )}
                            />
                          )}
                        </div>
                        <div className="flex gap-1">
                          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${(val1 / Math.max(val1, val2, 1)) * 100}%`,
                                backgroundColor:
                                  winner === "p1" ? "#FFD700" : "rgba(255,255,255,0.2)",
                              }}
                            />
                          </div>
                          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${(val2 / Math.max(val1, val2, 1)) * 100}%`,
                                backgroundColor:
                                  winner === "p2" ? "#4CAF50" : "rgba(255,255,255,0.2)",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Overall Score</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#FFD700]">
                          {player1.score}
                        </span>
                        <ArrowRight className="h-3 w-3 text-white/30" />
                        <span className="font-bold text-[#4CAF50]">
                          {player2.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Medal className="h-4 w-4 text-[#FFD700]" />
                Score Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a2e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "white" }}
                  />
                  <Bar
                    dataKey={player1.name}
                    fill="#FFD700"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={30}
                  />
                  <Bar
                    dataKey={player2.name}
                    fill="#4CAF50"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {!player1 && !player2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
              <Search className="h-8 w-8 text-white/20" />
            </div>
            <p className="text-white/30 text-sm">
              Search and select two players above to compare
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
