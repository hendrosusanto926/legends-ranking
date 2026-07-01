"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Plus, Sparkles, Clock, X, Eye, EyeOff } from "lucide-react";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Background } from "@/components/layout/background";

import { Hero } from "@/components/dashboard/hero";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TopThree } from "@/components/dashboard/top-three";
import { RankingTable } from "@/components/table/ranking-table";
import { Filters } from "@/components/table/filters";
import { PlayerModal } from "@/components/player/player-modal";
import { StatsCharts } from "@/components/charts/stats-charts";
import { HonorableMentions } from "@/components/dashboard/honorable-mentions";
import { About } from "@/components/dashboard/about";
import { PlayerComparison } from "@/components/comparison/player-comparison";
import { AIChat } from "@/components/ai/ai-chat";
import { ExportButton } from "@/components/export/export-button";
import { ShareButton } from "@/components/share/share-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getPlayers,
  calculateStats,
  filterPlayers,
  getUniqueValues,
} from "@/lib/players";
import type { Player, FilterState } from "@/types/player";
import type { VisibilityState } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

const COLUMNS_CONFIG: { id: string; label: string }[] = [
  { id: "nationality", label: "Nationality" },
  { id: "position", label: "Pos" },
  { id: "continentalClub", label: "Cont. Club" },
  { id: "continentalNational", label: "Cont. Nat." },
  { id: "worldCup", label: "World Cup" },
  { id: "domesticLeague", label: "Dom. League" },
  { id: "ballonDor", label: "Ballon d'Or" },
  { id: "worldCupRunnerUp", label: "WC RU" },
  { id: "worldCupThirdPlace", label: "WC 3rd" },
  { id: "continentalRunnerUp", label: "Cont. RU" },
  { id: "score", label: "Score" },
];

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    nationality: "",
    position: "",
    minScore: 0,
    maxScore: 0,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayers();
        const sorted = data
          .sort((a, b) => b.score - a.score)
          .map((player, index) => ({ ...player, rank: index + 1 }));
        setPlayers(sorted);
      } catch {
        setError("Failed to load player data");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();

    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");
    if (action === "player-added") setBanner("Player added successfully!");
    else if (action === "player-updated") setBanner("Player updated successfully!");
    else if (action === "player-deleted") setBanner("Player deleted successfully!");

    if (action) {
      const url = new URL(window.location.href);
      url.searchParams.delete("action");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = useMemo(() => calculateStats(players), [players]);
  const filteredPlayers = useMemo(
    () => filterPlayers(players, filters),
    [players, filters]
  );
  const nationalities = useMemo(
    () => getUniqueValues(players, "nationality"),
    [players]
  );
  const positions = useMemo(
    () => getUniqueValues(players, "position"),
    [players]
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-[var(--text-primary)] font-sans">
      <Background />

      <Navigation />

      <main className="relative z-10">
        <Hero />

        {loading ? (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-64 mx-auto mb-3" />
              <Skeleton className="h-5 w-80 mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />
            <TopThree players={players} />

            <section id="rankings" className="py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3">
                    Full{" "}
                    <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                      Rankings
                    </span>
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                    Complete leaderboard of football legends ranked by achievements
                  </p>
                </motion.div>

                <AnimatePresence>
                  {banner && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 flex items-center gap-2 rounded-lg border border-[#FFD700]/20 bg-[#FFD700]/10 px-4 py-3 text-sm text-[#FFD700]"
                    >
                      <Clock className="h-4 w-4 shrink-0" />
                      <span className="flex-1">
                        {banner} Please allow a few seconds for changes to propagate across the site.
                      </span>
                      <button
                        onClick={() => setBanner(null)}
                        className="shrink-0 rounded p-0.5 transition-colors hover:bg-[#FFD700]/20"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mb-4">
                  <Filters
                    filters={filters}
                    onFilterChange={setFilters}
                    nationalities={nationalities}
                    positions={positions}
                  />
                </div>

                <div className="mt-6">
                  <RankingTable
                    players={filteredPlayers}
                    onPlayerClick={setSelectedPlayer}
                    columnVisibility={columnVisibility}
                    onColumnVisibilityChange={setColumnVisibility}
                    actions={
                      <>
                        <Link href="/add-player">
                          <Button variant="secondary" size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" />
                            Add Player
                          </Button>
                        </Link>
                        <Link href="/ai-add-player">
                          <Button variant="ghost" size="sm" className="gap-1.5 text-[#FFD700]">
                            <Sparkles className="h-4 w-4" />
                            AI Quick Add
                          </Button>
                        </Link>
                        <ExportButton players={filteredPlayers} />
                        <ShareButton />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs text-white/60">
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Columns
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {COLUMNS_CONFIG.map((col) => {
                              const isVisible = columnVisibility[col.id] !== false;
                              return (
                                <DropdownMenuItem
                                  key={col.id}
                                  onClick={() =>
                                    setColumnVisibility((prev) => ({
                                      ...prev,
                                      [col.id]: !isVisible,
                                    }))
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className={cn(
                                      "w-3.5 h-3.5 rounded border border-white/30 flex items-center justify-center",
                                      isVisible && "bg-[#FFD700] border-[#FFD700]"
                                    )}
                                  >
                                    {isVisible && (
                                      <EyeOff className="h-2 w-2 text-[#111111]" />
                                    )}
                                  </div>
                                  <span className="capitalize">
                                    {col.label}
                                  </span>
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    }
                  />
                </div>
              </div>
            </section>

            <HonorableMentions />
            <PlayerComparison players={players} />
            <StatsCharts players={filteredPlayers} />
            <About />
          </>
        )}
      </main>

      <Footer />
      <AIChat />

      <PlayerModal
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          variant="default"
          size="icon"
          className="rounded-full shadow-xl shadow-[#FFD700]/20"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}
