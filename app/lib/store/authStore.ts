// Authentication Store using Zustand
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Player, Facilitator, UserRole } from "@/app/types/auth";

interface AuthState {
  user: Player | Facilitator | null;
  role: UserRole | null;
  isAuthenticated: boolean;

  // Actions
  loginPlayer: (player: Player) => void;
  loginFacilitator: (facilitator: Facilitator) => void;
  logout: () => void;
  setUser: (user: Player | Facilitator | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,

      loginPlayer: (player) => {
        set({
          user: player,
          role: "player",
          isAuthenticated: true,
        });
      },

      loginFacilitator: (facilitator) => {
        set({
          user: facilitator,
          role: "facilitator",
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          role: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => {
        if (!user) {
          set({
            user: null,
            role: null,
            isAuthenticated: false,
          });
          return;
        }

        const role: UserRole = "sessionId" in user ? "facilitator" : "player";
        set({ user, role, isAuthenticated: true });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
