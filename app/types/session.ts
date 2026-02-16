import { Player } from "./auth";
// Session types

export interface Session {
  id: string;
  code: string;
  status: "active" | "inactive" | "completed";
  startedAt: string;
  facilitatorId: string;
  players: Player[];
}

export interface SessionDetails {
  sessionCode: string;
  status: string;
  playersJoined: number;
}

export interface SessionState {
  session: Session | null;
  loading: boolean;
  error: string | null;
}
