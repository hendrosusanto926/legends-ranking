"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Background } from "@/components/layout/background";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { slugify } from "@/lib/players";
import type { FavoritePlayer } from "@/types/player";

function loadFavorites(): FavoritePlayer[] {
  try {
    const stored = localStorage.getItem("football-legends-favorites");
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoritePlayer[]>(loadFavorites);

  const removeFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      localStorage.setItem("football-legends-favorites", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen">
      <Background />
      <Navigation />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white mb-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Rankings
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Your{" "}
                <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                  Favorites
                </span>
              </h1>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </motion.div>

          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Heart className="h-16 w-16 mx-auto text-white/20 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                No favorites yet
              </h2>
              <p className="text-white/50 mb-6">
                Start adding players to your favorites by clicking the heart icon
                on any player.
              </p>
              <Link href="/">
                <Button variant="default">Browse Rankings</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites
                .sort((a, b) => b.score - a.score)
                .map((player, i) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 hover:bg-white/10 transition-all"
                  >
                    <Link
                      href={`/players/${slugify(player.name)}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white">
                            {player.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                            <span>{player.nationality}</span>
                            <span className="text-white/20">|</span>
                            <Badge variant="secondary" className="text-[10px]">
                              {player.position}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-[#FFD700]">
                          {player.score}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => removeFavorite(player.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </button>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
