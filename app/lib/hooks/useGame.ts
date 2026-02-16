// Custom hook for game state
"use client";

import { useGameStore } from "@/app/lib/store/gameStore";
import { gameService } from "@/app/lib/api/services/game";
import { useCallback } from "react";

export const useGame = () => {
  const {
    chests,
    currentChest,
    playerProgress,
    videoUrl,
    setChests,
    setCurrentChest,
    unlockChest: unlockChestInStore,
    openChest: openChestInStore,
    setPlayerProgress,
    updatePlayerProgress: updatePlayerProgressInStore,
    setVideoUrl,
    reset,
  } = useGameStore();

  const fetchChests = useCallback(
    async (sessionId: string) => {
      try {
        const response = await gameService.getChests(sessionId);
        if (response.success && response.data) {
          setChests(response.data);
        }
        return response;
      } catch {
        return { success: false, error: "Failed to fetch chests" };
      }
    },
    [setChests]
  );

  const unlockChest = useCallback(
    async (chestId: number, playerId: string, code: string) => {
      try {
        const response = await gameService.unlockChest(playerId, chestId, code);
        if (response.success && response.data) {
          unlockChestInStore(chestId, playerId, code);
        }
        return response;
      } catch {
        return { success: false, error: "Failed to unlock chest" };
      }
    },
    [unlockChestInStore]
  );

  const openChest = useCallback(
    (chestId: number) => {
      openChestInStore(chestId);
    },
    [openChestInStore]
  );

  const fetchPlayerProgress = useCallback(
    async (sessionId: string) => {
      try {
        const response = await gameService.getPlayerProgress(sessionId);
        if (response.success && response.data) {
          setPlayerProgress(response.data);
        }
        return response;
      } catch {
        return { success: false, error: "Failed to fetch progress" };
      }
    },
    [setPlayerProgress]
  );

  const updatePlayerProgress = useCallback(
    (playerId: string, updates: Record<string, unknown>) => {
      updatePlayerProgressInStore(playerId, updates);
    },
    [updatePlayerProgressInStore]
  );

  return {
    chests,
    currentChest,
    playerProgress,
    videoUrl,
    fetchChests,
    unlockChest,
    openChest,
    setCurrentChest,
    fetchPlayerProgress,
    updatePlayerProgress,
    setVideoUrl,
    reset,
  };
};
