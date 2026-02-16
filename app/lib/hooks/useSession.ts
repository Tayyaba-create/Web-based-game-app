// Custom hook for session management
"use client";

import { useSessionStore } from "@/app/lib/store/sessionStore";
import { sessionService } from "@/app/lib/api/services/sessions";
import { useCallback } from "react";
import type { Player } from "@/app/types/auth";

export const useSession = () => {
  const {
    session,
    sessionDetails,
    loading,
    error,
    setSession,
    setSessionDetails,
    addPlayer: addPlayerToStore,
    removePlayer: removePlayerFromStore,
    updateSessionStatus,
    setLoading,
    setError,
    reset,
  } = useSessionStore();

  const fetchSession = useCallback(
    async (sessionId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await sessionService.getSession(sessionId);
        if (response.success && response.data) {
          setSession(response.data);
        } else {
          setError((response as any)?.error || "Failed to fetch session");
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setSession, setLoading, setError]
  );

  const fetchSessionDetails = useCallback(
    async (sessionId: string) => {
      setLoading(true);
      try {
        const response = await sessionService.getSessionDetails(sessionId);
        if (response.success && response.data) {
          setSessionDetails(response.data);
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setSessionDetails, setLoading, setError]
  );

  const joinSession = useCallback(
    async (sessionCode: string, playerId: string) => {
      setLoading(true);
      try {
        const response = await sessionService.joinSession(
          sessionCode,
          playerId
        );
        if (response.success && response.data) {
          setSession(response.data);
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setSession, setLoading, setError]
  );

  const endSession = useCallback(
    async (sessionId: string) => {
      setLoading(true);
      try {
        const response = await sessionService.endSession(sessionId);
        if (response.success) {
          updateSessionStatus("completed");
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [updateSessionStatus, setLoading, setError]
  );

  const addPlayer = useCallback(
    (player: Record<string, unknown>) => {
      const playerData: Player = {
        id: String(player.id || ""),
        name: String(player.name || ""),
        email: String(player.email || ""),
        language: String(player.language || "en"),
        joinedAt: String(player.joinedAt || new Date().toISOString()),
        gameSessionId: player.gameSessionId as number | undefined,
        sessionCode: player.sessionCode as string | undefined,
      };
      addPlayerToStore(playerData);
    },
    [addPlayerToStore]
  );

  const removePlayer = useCallback(
    (playerId: string) => {
      removePlayerFromStore(playerId);
    },
    [removePlayerFromStore]
  );

  return {
    session,
    sessionDetails,
    loading,
    error,
    fetchSession,
    fetchSessionDetails,
    joinSession,
    endSession,
    addPlayer,
    removePlayer,
    updateSessionStatus,
    reset,
  };
};
