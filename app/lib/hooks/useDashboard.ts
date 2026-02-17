// Custom hook for dashboard data management
"use client";

import { useState, useCallback, useRef } from "react";
import { gameService } from "@/app/lib/api/services/game";

export interface DashboardPlayer {
  id: string;
  playerId?: string;
  name: string;
  playerName?: string;
  email?: string;
  activeRiddle?: number;
  riddleAccess?: number;
  attempt?: number;
  attempts?: number;
  solved: boolean | string;
}

export interface DashboardData {
  gameSessionId?: number;
  sessionCode?: string;
  status?: string;
  playersJoined?: number;
  sessionUnlocked?: boolean;
  sessionCreated?: string;
  sessionUnlockedAt?: string;
  sessionStarted?: string;
  sessionDuration?: number;
  playersProgress?: DashboardPlayer[];
}

// Helper function to compare data equality
const isDataEqual = (
  oldData: DashboardData | null,
  newData: DashboardData,
): boolean => {
  if (!oldData) return false;
  return (
    oldData.gameSessionId === newData.gameSessionId &&
    oldData.status === newData.status &&
    oldData.sessionUnlocked === newData.sessionUnlocked &&
    oldData.playersJoined === newData.playersJoined &&
    oldData.sessionDuration === newData.sessionDuration
  );
};

const isPlayersEqual = (
  oldPlayers: DashboardPlayer[],
  newPlayers: DashboardPlayer[],
): boolean => {
  if (oldPlayers.length !== newPlayers.length) return false;
  return oldPlayers.every((oldPlayer, index) => {
    const newPlayer = newPlayers[index];
    if (!newPlayer) return false;

    return (
      oldPlayer.id === newPlayer.id &&
      oldPlayer.playerId === newPlayer.playerId &&
      oldPlayer.name === newPlayer.name &&
      oldPlayer.playerName === newPlayer.playerName &&
      oldPlayer.activeRiddle === newPlayer.activeRiddle &&
      oldPlayer.riddleAccess === newPlayer.riddleAccess &&
      oldPlayer.attempt === newPlayer.attempt &&
      oldPlayer.attempts === newPlayer.attempts &&
      oldPlayer.solved === newPlayer.solved &&
      oldPlayer.email === newPlayer.email
    );
  });
};

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [players, setPlayers] = useState<DashboardPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Use refs to track previous data without triggering re-renders
  const previousDataRef = useRef<DashboardData | null>(null);
  const previousPlayersRef = useRef<DashboardPlayer[]>([]);

  // Fetch dashboard data
  const fetchDashboard = useCallback(
    async (sessionCode: string, isBackgroundFetch = false) => {
      // Only show loading state if not a background fetch (polling)
      if (!isBackgroundFetch) {
        setLoading(true);
      }
      setError(null);
      try {
        const response = await gameService.getDashboard(sessionCode);

        if (response.success && response.data) {
          // The API response structure from backend is:
          // {success: true, data: {data: {gameSession: {...}, playersProgress: [...]}}}
          // OR {success: true, data: {gameSession: {...}, playersProgress: [...]}}
          let fullData = response.data as Record<string, unknown>;

          // Unwrap nested data if it exists
          if ((fullData as Record<string, unknown>)?.data) {
            fullData = (fullData as Record<string, unknown>).data as Record<
              string,
              unknown
            >;
          }

          // Extract the dashboard data (gameSession)
          const dashData =
            (fullData as Record<string, unknown>)?.gameSession || fullData;

          // Only update state if data has actually changed
          const newDashData = dashData as DashboardData;
          if (!isDataEqual(previousDataRef.current, newDashData)) {
            setDashboardData(newDashData);
            previousDataRef.current = newDashData;
          }

          // Extract players from playersProgress (should be at same level as gameSession)
          const playersData =
            (fullData as Record<string, unknown>)?.playersProgress || [];

          if (Array.isArray(playersData) && playersData.length > 0) {
            const mappedPlayers: DashboardPlayer[] = (
              playersData as Record<string, unknown>[]
            ).map((p: Record<string, unknown>) => ({
              id: String(p.playerId || p.id || `player-${Math.random()}`),
              playerId: String(p.playerId || p.id || ""),
              name: String(p.playerName || p.name || ""),
              playerName: String(p.playerName || p.name || ""),
              email: String(p.email || ""),
              activeRiddle:
                Number(p.activeBox || p.riddleAccess || p.activeRiddle || 0) ||
                undefined,
              riddleAccess:
                Number(p.activeBox || p.riddleAccess || p.activeRiddle || 0) ||
                undefined,
              attempt: Number(p.attempt || p.attempts || 0) || undefined,
              attempts: Number(p.attempt || p.attempts || 0) || undefined,
              solved: String(p.solved || "-"),
            }));

            // Only update if players list has changed
            if (!isPlayersEqual(previousPlayersRef.current, mappedPlayers)) {
              setPlayers(mappedPlayers);
              previousPlayersRef.current = mappedPlayers;
            }
          } else {
            // Only update if we had players before
            if (previousPlayersRef.current.length > 0) {
              setPlayers([]);
              previousPlayersRef.current = [];
            }
          }
        } else {
          const errorMsg =
            (response as any)?.error || "Failed to fetch dashboard data";
          // Only set error if not a background fetch
          if (!isBackgroundFetch) {
            setError(errorMsg);
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        // Only set error if not a background fetch
        if (!isBackgroundFetch) {
          setError(errorMsg);
        }
      } finally {
        if (!isBackgroundFetch) {
          setLoading(false);
        }
      }
    },
    [],
  );

  // Fetch players data (fallback - players should come from dashboard)
  const fetchPlayers = useCallback(async (sessionCode: string) => {
    try {
      const response = await gameService.getDashboardPlayers(sessionCode);

      if (response.success) {
        // Response structure: {success: true, data: {...}} where data can be wrapped
        let playersArray = response.data as
          | Record<string, unknown>
          | Record<string, unknown>[];

        // Handle different response structures
        if (
          playersArray &&
          typeof playersArray === "object" &&
          "data" in playersArray
        ) {
          playersArray = (playersArray as Record<string, unknown>)
            .data as Record<string, unknown>[];
        }

        if (Array.isArray(playersArray)) {
          // Map API response to component-friendly format
          const mappedPlayers: DashboardPlayer[] = (
            playersArray as Record<string, unknown>[]
          ).map((p: Record<string, unknown>) => ({
            id: String(p.playerId || p.id || `player-${Math.random()}`),
            playerId: String(p.playerId || p.id || ""),
            name: String(p.playerName || p.name || ""),
            playerName: String(p.playerName || p.name || ""),
            email: String(p.email || ""),
            activeRiddle:
              Number(p.riddleAccess || p.activeBox || 0) || undefined,
            riddleAccess:
              Number(p.riddleAccess || p.activeBox || 0) || undefined,
            attempt: Number(p.attempts || p.attempt || 0) || undefined,
            attempts: Number(p.attempts || p.attempt || 0) || undefined,
            solved: String(p.solved || "-"),
          }));
          // Only update if we have players (fallback)
          if (mappedPlayers.length > 0) {
            setPlayers(mappedPlayers);
          }
        }
      }
    } catch {
      // Silent fail - fallback function
    }
  }, []);

  // Combined fetch function - dashboard includes all data
  const fetchDashboardData = useCallback(
    async (sessionCode: string) => {
      // Only fetch dashboard - it includes players data
      await fetchDashboard(sessionCode);
    },
    [fetchDashboard],
  );

  // Start polling for real-time updates
  const startPolling = useCallback(
    (sessionCode: string, interval: number = 5000) => {
      if (isPolling) return;

      setIsPolling(true);
      const pollInterval = setInterval(() => {
        fetchDashboardData(sessionCode);
      }, interval);

      return () => {
        clearInterval(pollInterval);
        setIsPolling(false);
      };
    },
    [isPolling, fetchDashboardData],
  );

  return {
    dashboardData,
    players,
    loading,
    error,
    isPolling,
    fetchDashboard,
    fetchPlayers,
    fetchDashboardData,
    startPolling,
  };
};
