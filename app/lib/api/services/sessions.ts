// Session API service with hardcoded mock data
import type { Session, SessionDetails } from "@/app/types/session";
import type { Player } from "@/app/types/auth";
import { mockSession, mockSessionDetails, mockPlayer } from "../mockData";

export const sessionService = {
  // Create a new session
  createSession: async (facilitatorId: string) => {
    const newSession: Session = {
      id: `session-${Math.random().toString(36).substr(2, 9)}`,
      code: `SESSION${Math.floor(Math.random() * 9000) + 1000}`,
      status: "active",
      startedAt: new Date().toISOString(),
      facilitatorId,
      players: [],
    };
    return {
      success: true,
      data: newSession,
    };
  },

  // Get session by ID
  getSession: async (sessionId: string) => {
    return {
      success: true,
      data: mockSession,
    };
  },

  // Get session by code
  getSessionByCode: async (code: string) => {
    if (code === "SESSION123") {
      return {
        success: true,
        data: mockSession,
      };
    }
    return {
      success: false,
      error: "Session not found",
    };
  },

  // Get session details
  getSessionDetails: async (sessionId: string) => {
    return {
      success: true,
      data: mockSessionDetails,
    };
  },

  // Join session as player
  joinSession: async (sessionCode: string, playerId: string) => {
    const sessionWithPlayer: Session = {
      ...mockSession,
      players: [...mockSession.players, mockPlayer],
    };
    return {
      success: true,
      data: sessionWithPlayer,
    };
  },

  // Get players in session
  getPlayers: async (sessionId: string) => {
    return {
      success: true,
      data: [mockPlayer],
    };
  },

  // End session
  endSession: async (sessionId: string) => {
    return {
      success: true,
      data: {
        ...mockSession,
        status: "completed" as const,
      },
    };
  },
};
