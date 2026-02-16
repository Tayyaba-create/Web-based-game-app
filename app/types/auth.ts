// Authentication types

export interface Player {
  id: string;
  name: string;
  email: string;
  language: string;
  joinedAt: string;
  gameSessionId?: number;
  sessionCode?: string;
}

export interface Facilitator {
  id: string;
  name?: string;
  code: string;
  sessionId: string;
}

export type UserRole = "facilitator" | "player";

export interface AuthState {
  user: Player | Facilitator | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}
