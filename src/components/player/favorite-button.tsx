"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import type { Player } from "@/types/player";

interface FavoriteButtonProps {
  player: Player;
  className?: string;
}

export function FavoriteButton({ player, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(player.id);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite({
          id: player.id,
          name: player.name,
          nationality: player.nationality,
          position: player.position,
          score: player.score,
        });
      }}
      className={cn(className)}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all duration-300",
          isFav
            ? "fill-red-500 text-red-500 scale-110"
            : "text-white/40 hover:text-red-400"
        )}
      />
    </Button>
  );
}
