// Application-wide constants

export const GAME_CONSTANTS = {
  CHEST_COUNT: 16,
  MAX_ATTEMPTS_PER_CHEST: 5,
  RIDDLE_ACCESS_INCREMENT: 1,
} as const;

export const SESSION_CONSTANTS = {
  CODE_LENGTH: 6,
  MAX_PLAYERS: 50,
  SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
} as const;

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  CODE_LENGTH: 5,
} as const;

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "fr", name: "French", native: "Français" },
] as const;

export const API_ENDPOINTS = {
  AUTH: {
    FACILITATOR: "/api/auth/facilitator",
    PLAYER: "/api/auth/player",
    LOGOUT: "/api/auth/logout",
  },
  SESSIONS: {
    BASE: "/api/sessions",
    BY_CODE: (code: string) => `/api/sessions/code/${code}`,
    BY_ID: (id: string) => `/api/sessions/${id}`,
    DETAILS: (id: string) => `/api/sessions/${id}/details`,
    JOIN: (code: string) => `/api/sessions/${code}/join`,
    PLAYERS: (id: string) => `/api/sessions/${id}/players`,
    QR: (id: string) => `/api/sessions/${id}/qr`,
    END: (id: string) => `/api/sessions/${id}/end`,
  },
  GAME: {
    CHESTS: "/api/game/chests",
    CHEST_BY_ID: (id: number) => `/api/game/chests/${id}`,
    UNLOCK: (id: number) => `/api/game/chests/${id}/unlock`,
    PROGRESS: "/api/game/progress",
    ATTEMPTS: "/api/game/attempts",
  },
} as const;
