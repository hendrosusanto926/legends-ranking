"use client";

import { useState, useCallback } from "react";
import type { FavoritePlayer } from "@/types/player";

const STORAGE_KEY = "football-legends-favorites";

function loadFavorites(): FavoritePlayer[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // localStorage not available
  }
  return [];
}

function saveFavorites(favorites: FavoritePlayer[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // localStorage not available
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePlayer[]>(loadFavorites);

  const doAddFavorite = useCallback((player: FavoritePlayer) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === player.id)) return prev;
      const updated = [...prev, player];
      saveFavorites(updated);
      return updated;
    });
  }, []);

  const doRemoveFavorite = useCallback((playerId: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.id !== playerId);
      saveFavorites(updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (playerId: number) => {
      return favorites.some((f) => f.id === playerId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (player: FavoritePlayer) => {
      if (isFavorite(player.id)) {
        doRemoveFavorite(player.id);
      } else {
        doAddFavorite(player);
      }
    },
    [isFavorite, doRemoveFavorite, doAddFavorite]
  );

  return {
    favorites,
    isLoaded: true,
    addFavorite: doAddFavorite,
    removeFavorite: doRemoveFavorite,
    isFavorite,
    toggleFavorite,
  };
}
