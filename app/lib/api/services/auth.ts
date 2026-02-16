// Authentication API service with hardcoded mock data
import type { Player, Facilitator } from "@/app/types/auth";
import { mockFacilitator, mockPlayer } from "../mockData";

export const authService = {
  // Facilitator login
  loginFacilitator: async (code: string) => {
    // Hardcoded logic: verify against "ADMIN123"
    if (code === "ADMIN123") {
      return {
        success: true,
        data: mockFacilitator,
      };
    }
    return {
      success: false,
      error: "Invalid facilitator code",
    };
  },

  // Player login/registration
  loginPlayer: async (
    name: string,
    email: string,
    language: string,
    gameSessionId?: number | null,
  ) => {
    // Hardcoded response with passed data
    const player: Player = {
      id: `player-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      language,
      joinedAt: new Date().toISOString(),
      gameSessionId: gameSessionId || 1,
      sessionCode: "SESSION123",
    };
    return {
      success: true,
      data: player,
    };
  },

  // Session verification with hardcoded data
  verifySessionCode: async (sessionCode: string) => {
    console.log("Verifying session code:", sessionCode);
    // Accept any code entered by the user
    if (sessionCode && sessionCode.trim().length > 0) {
      const response = {
        success: true,
        data: {
          code: sessionCode,
          sessionCode: sessionCode,
          status: "active",
          playersJoined: 3,
        },
        error: null,
      };
      console.log("Session verified successfully:", response);
      return response;
    }
    const errorResponse = {
      success: false,
      error: "Please enter a valid session code",
      data: null,
    };
    console.log("Session verification failed:", errorResponse);
    return errorResponse;
  },

  // Verify password with hardcoded data
  verifyPassword: async (password: string) => {
    // Hardcoded logic: accept any non-empty password for demo purposes
    if (password && password.length > 0) {
      return {
        success: true,
        data: {
          verified: true,
          message: "Password verified",
        },
        error: null,
      };
    }
    return {
      success: false,
      error: "Password verification failed",
      data: null,
    };
  },

  // Join game with hardcoded response
  joinGame: async (
    playerId: number,
    name: string,
    email: string,
    language: string,
    gameSessionId: number,
  ) => {
    return {
      success: true,
      data: {
        id: playerId.toString(),
        name,
        email,
        language,
        joinedAt: new Date().toISOString(),
        gameSessionId,
        sessionCode: "SESSION123",
      },
    };
  },

  // Logout
  logout: async () => {
    return {
      success: true,
      data: { message: "Logged out successfully" },
    };
  },
};
