import { PersistOptions } from "zustand/middleware";

export const persistConfig: PersistOptions<Record<string, unknown>> = {
  name: "flow-game-storage",
  partialize: () => ({
    // Only persist non-sensitive data
  }),
};
