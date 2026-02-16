// Session Store using Zustand
import { create } from "zustand";
import type { Session, SessionDetails } from "@/app/types/session";
import type { Player } from "@/app/types/auth";

interface SessionState {
  session: Session | null;
  sessionDetails: SessionDetails | null;
  loading: boolean;
  error: string | null;

  // Actions
  setSession: (session: Session) => void;
  setSessionDetails: (details: SessionDetails) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updateSessionStatus: (status: Session["status"]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  sessionDetails: null,
  loading: false,
  error: null,

  setSession: (session) => set({ session }),

  setSessionDetails: (details) => set({ sessionDetails: details }),

  addPlayer: (player) =>
    set((state) => {
      if (!state.session) return state;
      return {
        session: {
          ...state.session,
          players: [...state.session.players, player],
        },
      };
    }),

  removePlayer: (playerId) =>
    set((state) => {
      if (!state.session) return state;
      return {
        session: {
          ...state.session,
          players: state.session.players.filter((p) => p.id !== playerId),
        },
      };
    }),

  updateSessionStatus: (status) =>
    set((state) => {
      if (!state.session) return state;
      return {
        session: { ...state.session, status },
      };
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      session: null,
      sessionDetails: null,
      loading: false,
      error: null,
    }),
}));
