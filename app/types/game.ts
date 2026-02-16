// Game types

// API Response Types from GetGameProgress
export interface GameBox {
  boxID: number;
  status: number; // 0 = locked, 1 = unlocked
  padLockPassword: string; // hashed password
  padLockType: number; // 1-6: numeric, directional, numericV1, word, numericV2, wordML
}

export interface GameSessionData {
  gameSessionId: number;
  sessionCode: string;
  status: number;
  playersJoined: number;
  sessionUnlocked: boolean;
  sessionStarted?: string;
  sessionCreated?: string;
  sessionUnlockedAt?: string;
  sessionDuration: number;
  language?: string; // Language code: EN, PT, ES
}

export interface GameProgressResponse {
  gameSession: GameSessionData;
  gameProgress: GameBox[];
}

// Local UI State Types
export interface Chest {
  id: number;
  status: "locked" | "unlocked" | "opened";
  code?: string;
  videoUrl?: string;
  unlockedBy?: string;
  unlockedAt?: string;
}

export interface PlayerProgress {
  playerId: string;
  playerName: string;
  riddleAccess: number;
  attempts: number;
  solved: boolean;
}

export interface GameState {
  chests: Chest[];
  currentChest: number | null;
  playerProgress: PlayerProgress[];
  videoUrl?: string;
  gameSession?: GameSessionData;
}

// Player Activity API types
export interface PlayerStats {
  playerName: string;
  solved: number;
  unSolved: number;
  total: number;
}

export interface PlayerActivityItem {
  activeBox: number;
  attempt: number;
  solved: string;
}

export interface PlayerActivityData {
  playerStats: PlayerStats;
  playersProgress: PlayerActivityItem[];
}
