// Game Store using Zustand
import { create } from "zustand";
import type { Chest, PlayerProgress } from "@/app/types/game";

interface GameState {
  chests: Chest[];
  currentChest: number | null;
  playerProgress: PlayerProgress[];
  videoUrl: string | null;

  // Actions
  setChests: (chests: Chest[]) => void;
  setCurrentChest: (chestId: number | null) => void;
  unlockChest: (chestId: number, playerId: string, code: string) => void;
  openChest: (chestId: number) => void;
  setPlayerProgress: (progress: PlayerProgress[]) => void;
  updatePlayerProgress: (
    playerId: string,
    updates: Partial<PlayerProgress>
  ) => void;
  setVideoUrl: (url: string | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  chests: [],
  currentChest: null,
  playerProgress: [],
  videoUrl: null,

  setChests: (chests) => set({ chests }),

  setCurrentChest: (chestId) => set({ currentChest: chestId }),

  unlockChest: (chestId, playerId, code) => {
    const chests = get().chests;
    const updatedChests = chests.map((chest) =>
      chest.id === chestId
        ? {
            ...chest,
            status: "unlocked" as const,
            code,
            unlockedBy: playerId,
            unlockedAt: new Date().toISOString(),
          }
        : chest
    );
    set({ chests: updatedChests });
  },

  openChest: (chestId) => {
    const chests = get().chests;
    const updatedChests = chests.map((chest) =>
      chest.id === chestId ? { ...chest, status: "opened" as const } : chest
    );
    set({ chests: updatedChests });
  },

  setPlayerProgress: (progress) => set({ playerProgress: progress }),

  updatePlayerProgress: (playerId, updates) => {
    const progress = get().playerProgress;
    const updatedProgress = progress.map((p) =>
      p.playerId === playerId ? { ...p, ...updates } : p
    );
    set({ playerProgress: updatedProgress });
  },

  setVideoUrl: (url) => set({ videoUrl: url }),

  reset: () =>
    set({
      chests: [],
      currentChest: null,
      playerProgress: [],
      videoUrl: null,
    }),
}));
