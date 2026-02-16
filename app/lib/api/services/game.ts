// Game API service with hardcoded mock data
import type {
  Chest,
  PlayerProgress,
  PlayerActivityData,
  GameProgressResponse,
} from "@/app/types/game";
import {
  mockChests,
  mockPlayerProgress,
  mockGameProgressResponse,
  mockDashboardData,
  mockDashboardPlayers,
  mockPlayerActivityData,
} from "../mockData";

export const gameService = {
  // Get all chests for a session
  getChests: async (sessionId: string) => {
    return {
      success: true,
      data: mockChests,
    };
  },

  // Get a specific chest
  getChest: async (chestId: number, sessionId: string) => {
    const chest = mockChests.find((c) => c.id === chestId);
    if (!chest) {
      return {
        success: false,
        error: "Chest not found",
      };
    }
    return {
      success: true,
      data: chest,
    };
  },

  // Unlock a chest with password verification
  unlockChest: async (
    sessionCode: string,
    boxID: number,
    password: string,
    playerId?: number,
  ) => {
    // Accept any code/password - always unlock regardless of input
    return {
      success: true,
      message: "Success",
      data: {
        unlocked: true,
        boxId: boxID,
        playerId: playerId || 0,
      },
    };
  },

  // Get player progress
  getPlayerProgress: async (sessionId: string) => {
    return {
      success: true,
      data: mockPlayerProgress,
    };
  },

  // Record an attempt
  recordAttempt: async (
    chestId: number,
    playerId: string,
    success: boolean,
  ) => {
    return {
      success: true,
      data: {
        chestId,
        playerId,
        success,
        recordedAt: new Date().toISOString(),
      },
    };
  },

  // Get dashboard data for a session
  getDashboard: async (sessionCode: string) => {
    return {
      success: true,
      data: mockDashboardData,
    };
  },

  // Get all players in a session
  getDashboardPlayers: async (sessionCode: string) => {
    return {
      success: true,
      data: mockDashboardPlayers,
    };
  },

  // Unlock session for players
  unlockSession: async (sessionCode: string) => {
    const updatedData = {
      ...mockDashboardData,
      sessionUnlocked: true,
      sessionUnlockedAt: new Date().toISOString(),
    };
    return {
      success: true,
      data: updatedData,
    };
  },

  // Finish/end a session
  finishSession: async (sessionCode: string) => {
    const updatedData = {
      ...mockDashboardData,
      status: "completed",
    };
    return {
      success: true,
      data: updatedData,
    };
  },

  // Get player activity (statistics and progress)
  getPlayerActivity: async (sessionCode: string, playerId: number | string) => {
    return {
      success: true,
      data: mockPlayerActivityData,
    };
  },

  // Get game progress (boxes, lock types, and session state) for a specific player
  getGameProgress: async (sessionCode: string, playerId?: number | string) => {
    return {
      success: true,
      data: mockGameProgressResponse,
    };
  },

  // Record a player's box attempt
  recordBoxAttempt: async (playerId: number | string, boxId: number) => {
    return {
      success: true,
      data: {
        playerId,
        boxId,
        recordedAt: new Date().toISOString(),
      },
    };
  },

  // Verify password for a box
  verifyBoxPassword: async (
    playerId: number | string,
    padlockPassword: string,
  ) => {
    return {
      success: true,
      data: {
        playerId,
        verified: true,
        message: "Password verified",
      },
    };
  },
};
