// Custom hook for authentication
"use client";

import { useAuthStore } from "@/app/lib/store/authStore";
import { authService } from "@/app/lib/api/services/auth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useAuth = () => {
  const router = useRouter();
  const { user, role, isAuthenticated, loginPlayer, loginFacilitator, logout } =
    useAuthStore();

  const handlePlayerLogin = useCallback(
    async (
      name: string,
      email: string,
      language: string,
      gameSessionId?: number | null,
    ) => {
      try {
        const response = await authService.loginPlayer(
          name,
          email,
          language,
          gameSessionId,
        );
        if (response.success && response.data) {
          loginPlayer(response.data);
          router.push("/Game-page");
        }
        return response;
      } catch {
        return { success: false, error: "Login failed" };
      }
    },
    [loginPlayer, router],
  );

  const handleFacilitatorLogin = useCallback(
    async (code: string) => {
      try {
        const response = await authService.loginFacilitator(code);
        if (response.success && response.data) {
          loginFacilitator(response.data);
          router.push("/facilitator-dashboard");
        }
        return response;
      } catch {
        return { success: false, error: "Login failed" };
      }
    },
    [loginFacilitator, router],
  );

  const handleVerifySession = useCallback(
    async (sessionCode: string) => {
      try {
        console.log("Verifying session in hook:", sessionCode);
        const response = await authService.verifySessionCode(sessionCode);
        console.log("Response from verify session:", response);
        if (response.success && response.data) {
          // Navigate to facilitator dashboard with session code in URL path (no encoding needed)
          const dashboardPath = `/facilitator-dashboard/${sessionCode}`;
          console.log("Navigating to:", dashboardPath);
          router.push(dashboardPath);
        } else {
          console.log("Verification failed, not navigating");
        }
        return response;
      } catch (error) {
        console.error("Verify session error:", error);
        return {
          success: false,
          error: "Session verification failed",
          data: null,
        };
      }
    },
    [router],
  );

  const handleJoinGame = useCallback(
    async (
      playerId: number,
      name: string,
      email: string,
      language: string,
      gameSessionId: number,
    ) => {
      try {
        const response = await authService.joinGame(
          playerId,
          name,
          email,
          language,
          gameSessionId,
        );
        if (response.success && response.data) {
          // Handle both direct response and wrapped response
          const playerResponse = response.data as Record<string, unknown>;
          const playerData = response.data as Record<string, unknown>;
          const gameSessionData = playerData.gameSession as
            | Record<string, unknown>
            | undefined;

          loginPlayer({
            id: String(playerData.playerId || ""),
            name: String(playerData.name || ""),
            email: String(playerData.email || ""),
            language: String(playerData.language || "en"),
            joinedAt: String(playerData.createdAt || new Date().toISOString()),
            gameSessionId: playerData.gameSessionId as number | undefined,
            sessionCode: gameSessionData?.sessionCode as string | undefined,
          });
          router.push("/game");
        }
        return response;
      } catch {
        return { success: false, error: "Failed to join game" };
      }
    },
    [loginPlayer, router],
  );

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      logout();
      router.push("/");
    } catch {}
  }, [logout, router]);

  return {
    user,
    role,
    isAuthenticated,
    loginPlayer: handlePlayerLogin,
    joinGame: handleJoinGame,
    loginFacilitator: handleFacilitatorLogin,
    verifySession: handleVerifySession,
    logout: handleLogout,
    isPlayer: role === "player",
    isFacilitator: role === "facilitator",
  };
};
