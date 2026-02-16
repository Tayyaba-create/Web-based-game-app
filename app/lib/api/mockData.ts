// Hardcoded mock data for all API responses

import type { Player, Facilitator } from "@/app/types/auth";
import type {
  Chest,
  PlayerProgress,
  GameProgressResponse,
  PlayerActivityData,
} from "@/app/types/game";
import type { Session, SessionDetails } from "@/app/types/session";

// Auth Data
export const mockPlayer: Player = {
  id: "player-1",
  name: "John Doe",
  email: "john@example.com",
  language: "en",
  joinedAt: new Date().toISOString(),
  gameSessionId: 1,
  sessionCode: "SESSION123",
};

export const mockFacilitator: Facilitator = {
  id: "facilitator-1",
  name: "Jane Smith",
  code: "ADMIN123",
  sessionId: "session-1",
};

// Game Data
export const mockGameSession = {
  gameSessionId: 1,
  sessionCode: "SESSION123",
  status: 0,
  playersJoined: 3,
  sessionUnlocked: true,
  sessionStarted: new Date().toISOString(),
  sessionCreated: new Date().toISOString(),
  sessionUnlockedAt: new Date().toISOString(), // Unlocked immediately when entered, timer starts
  sessionDuration: 60, // 60 seconds countdown
  language: "EN",
};

export const mockGameBoxes = [
  {
    boxID: 1,
    status: 0,
    padLockPassword: "hashed_password_1",
    padLockType: 1, // numeric
  },
  {
    boxID: 2,
    status: 0,
    padLockPassword: "hashed_password_2",
    padLockType: 2, // directional
  },
  {
    boxID: 3,
    status: 0,
    padLockPassword: "hashed_password_3",
    padLockType: 3, // numericV1
  },
  {
    boxID: 4,
    status: 0,
    padLockPassword: "hashed_password_4",
    padLockType: 4, // word
  },
  {
    boxID: 5,
    status: 0,
    padLockPassword: "hashed_password_5",
    padLockType: 5, // numericV2
  },
  {
    boxID: 6,
    status: 0,
    padLockPassword: "hashed_password_6",
    padLockType: 6, // wordML
  },
  {
    boxID: 7,
    status: 0,
    padLockPassword: "hashed_password_7",
    padLockType: 1, // numeric
  },
  {
    boxID: 8,
    status: 0,
    padLockPassword: "hashed_password_8",
    padLockType: 2, // directional
  },
  {
    boxID: 9,
    status: 0,
    padLockPassword: "hashed_password_9",
    padLockType: 3, // numericV1
  },
  {
    boxID: 10,
    status: 0,
    padLockPassword: "hashed_password_10",
    padLockType: 4, // word
  },
  {
    boxID: 11,
    status: 0,
    padLockPassword: "hashed_password_11",
    padLockType: 5, // numericV2
  },
  {
    boxID: 12,
    status: 0,
    padLockPassword: "hashed_password_12",
    padLockType: 6, // wordML
  },
  {
    boxID: 13,
    status: 0,
    padLockPassword: "hashed_password_13",
    padLockType: 1, // numeric
  },
  {
    boxID: 14,
    status: 0,
    padLockPassword: "hashed_password_14",
    padLockType: 2, // directional
  },
  {
    boxID: 15,
    status: 0,
    padLockPassword: "hashed_password_15",
    padLockType: 3, // numericV1
  },
  {
    boxID: 16,
    status: 0,
    padLockPassword: "hashed_password_16",
    padLockType: 4, // word
  },
];

export const mockGameProgressResponse: GameProgressResponse = {
  gameSession: mockGameSession,
  gameProgress: mockGameBoxes,
};

export const mockChests: Chest[] = [
  {
    id: 1,
    status: "locked",
    code: "1234",
    videoUrl: "/assets/language_Videos/video1.mp4",
  },
  {
    id: 2,
    status: "locked",
    code: "5678",
    videoUrl: "/assets/language_Videos/video2.mp4",
  },
  {
    id: 3,
    status: "locked",
    code: "9012",
    videoUrl: "/assets/language_Videos/video3.mp4",
  },
  {
    id: 4,
    status: "locked",
    code: "3456",
    videoUrl: "/assets/language_Videos/video4.mp4",
  },
  {
    id: 5,
    status: "locked",
    code: "7890",
    videoUrl: "/assets/language_Videos/video5.mp4",
  },
  {
    id: 6,
    status: "locked",
    code: "2345",
    videoUrl: "/assets/language_Videos/video6.mp4",
  },
  {
    id: 7,
    status: "locked",
    code: "6789",
    videoUrl: "/assets/language_Videos/video7.mp4",
  },
  {
    id: 8,
    status: "locked",
    code: "0123",
    videoUrl: "/assets/language_Videos/video8.mp4",
  },
  {
    id: 9,
    status: "locked",
    code: "4567",
    videoUrl: "/assets/language_Videos/video9.mp4",
  },
  {
    id: 10,
    status: "locked",
    code: "8901",
    videoUrl: "/assets/language_Videos/video10.mp4",
  },
  {
    id: 11,
    status: "locked",
    code: "2468",
    videoUrl: "/assets/language_Videos/video11.mp4",
  },
  {
    id: 12,
    status: "locked",
    code: "1357",
    videoUrl: "/assets/language_Videos/video12.mp4",
  },
  {
    id: 13,
    status: "locked",
    code: "9876",
    videoUrl: "/assets/language_Videos/video13.mp4",
  },
  {
    id: 14,
    status: "locked",
    code: "5432",
    videoUrl: "/assets/language_Videos/video14.mp4",
  },
  {
    id: 15,
    status: "locked",
    code: "1111",
    videoUrl: "/assets/language_Videos/video15.mp4",
  },
  {
    id: 16,
    status: "locked",
    code: "2222",
    videoUrl: "/assets/language_Videos/video16.mp4",
  },
];

export const mockPlayerProgress: PlayerProgress[] = [
  {
    playerId: "player-1",
    playerName: "John Doe",
    riddleAccess: 1,
    attempts: 0,
    solved: false,
  },
  {
    playerId: "player-2",
    playerName: "Jane Smith",
    riddleAccess: 2,
    attempts: 1,
    solved: false,
  },
  {
    playerId: "player-3",
    playerName: "Bob Johnson",
    riddleAccess: 1,
    attempts: 2,
    solved: true,
  },
];

// Dashboard Data
export const mockDashboardData = {
  gameSessionId: 1,
  sessionCode: "SESSION123",
  status: "active",
  playersJoined: 3,
  sessionUnlocked: true,
  sessionCreated: new Date().toISOString(),
  sessionUnlockedAt: new Date().toISOString(), // Timer starts immediately
  sessionStarted: new Date().toISOString(),
  sessionDuration: 60,
  playersProgress: [
    {
      id: "player-1",
      playerId: "player-1",
      name: "John Doe",
      playerName: "John Doe",
      email: "john@example.com",
      activeRiddle: 1,
      riddleAccess: 1,
      attempt: 0,
      attempts: 0,
      solved: false,
    },
    {
      id: "player-2",
      playerId: "player-2",
      name: "Jane Smith",
      playerName: "Jane Smith",
      email: "jane@example.com",
      activeRiddle: 2,
      riddleAccess: 2,
      attempt: 1,
      attempts: 1,
      solved: false,
    },
    {
      id: "player-3",
      playerId: "player-3",
      name: "Bob Johnson",
      playerName: "Bob Johnson",
      email: "bob@example.com",
      activeRiddle: 1,
      riddleAccess: 1,
      attempt: 2,
      attempts: 2,
      solved: true,
    },
  ],
};

export const mockDashboardPlayers = mockDashboardData.playersProgress;

// Player Activity Data
export const mockPlayerActivityData: PlayerActivityData = {
  playerStats: {
    playerName: "John Doe",
    solved: 2,
    unSolved: 4,
    total: 6,
  },
  playersProgress: [
    {
      activeBox: 1,
      attempt: 0,
      solved: "false",
    },
    {
      activeBox: 2,
      attempt: 1,
      solved: "true",
    },
    {
      activeBox: 3,
      attempt: 2,
      solved: "false",
    },
  ],
};

// Session Data
export const mockSession: Session = {
  id: "session-1",
  code: "SESSION123",
  status: "active",
  startedAt: new Date().toISOString(),
  facilitatorId: "facilitator-1",
  players: [mockPlayer],
};

export const mockSessionDetails: SessionDetails = {
  sessionCode: "SESSION123",
  status: "active",
  playersJoined: 3,
};
