# Flow App Game - Complete Code Overview

## 📋 Project Summary

**Flow App Game** is a Next.js-based interactive gaming and assessment platform that supports:

- **Facilitators** who manage game sessions and monitor player progress
- **Players** who join sessions, unlock puzzles/locks, and progress through games
- **Real-time Dashboard** for session monitoring and player activity tracking

---

## 🏗️ Architecture Overview

```
Frontend (React + Next.js) → API Routes (Backend) → Stores (Zustand)
         ↓
    Components & Pages
    ↓
    TypeScript Types & Utils
```

### Key Technologies

- **Next.js 16** - Full-stack React framework with App Router
- **React 19** - UI component library
- **TypeScript** - Type safety across the codebase
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations and transitions
- **QR Code** - Session joining via QR codes

---

## 📁 Folder Structure & Responsibilities

### 1. **`/app` - Application Root**

The main application entry point and layout wrapper.

| File/Folder         | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `layout.tsx`        | Root server layout wrapper                |
| `layout-client.tsx` | Client-side layout provider               |
| `page.tsx`          | Homepage (redirects to facilitator-login) |
| `globals.css`       | Global styles                             |

---

### 2. **`/app/api` - Backend API Routes**

RESTful API endpoints using Next.js API routes (App Router pattern).

#### **`/api/auth`** - Authentication

- `player/route.ts` - Create/retrieve player accounts
- `verify-password/route.ts` - Validate session passwords
- `verify-session/route.ts` - Verify active sessions

#### **`/api/dashboard`** - Facilitator Dashboard Management

- `get-dashboard/[sessionCode]/` - Retrieve session dashboard data
- `finish-session/[sessionCode]/` - End a session
- `unlock-session/[sessionCode]/` - Unlock all players in session

#### **`/api/game`** - Game State & Progress

- `game-progress/[sessionCode]/` - Get game progress for session
- `player-progress/route.ts` - Update individual player progress
- `player-activity/route.ts` - Log player activity events
- `players/route.ts` - Get all players in session
- `unlock/route.ts` - Unlock specific puzzles for players
- `lock-config/[sessionCode]/` - Manage lock configurations

#### **`/api/player`** - Player Actions

- `join-game/route.ts` - Player joins a game session

**API Pattern**: Query parameters + request body for data transfer.

---

### 3. **`/app/components` - Reusable UI Components**

#### **Modal Components** (Interactive Dialogs)

- `NumericLockModal.tsx` - Numeric puzzle unlock UI
- `NumericV1Modal.tsx` - Numeric variant 1
- `NumericV2Modal.tsx` - Numeric variant 2
- `WordLockModal.tsx` - Word-based puzzle
- `WordMLModal.tsx` - Word ML variant
- `DirectionalLockModal.tsx` - Directional/arrow puzzle
- `QRCodeDialog.tsx` - Display QR code for session joining
- `SessionExpiredDialog.tsx` - Notification when session expires

#### **Feature Components**

- `PlayerDetailsDialog.tsx` - View player information
- `PlayerProgress.tsx` - Display player progress status
- `ProgressBar.tsx` - Visual progress indicator
- `FinishSessionDialog.tsx` - End session confirmation
- `UnlockSessionDialog.tsx` - Session unlock UI
- `VideoDialog.tsx` - Play instructional/reward videos

#### **Layout Components** (`/components/layout`)

- `AppLayout.tsx` - Main app wrapper layout
- `AppHeader.tsx` - Navigation header
- `AppFooter.tsx` - Footer section
- `LayoutWrapper.tsx` - Layout context provider
- `index.ts` - Barrel export

#### **UI Base Components** (`/components/ui`)

- `Button.tsx` - Reusable button component
- `Card.tsx` - Card container
- `Input.tsx` - Form input field
- `dialog.tsx` - Dialog/modal base
- `index.ts` - Barrel export

---

### 4. **`/app/pages` - Next.js Pages & Routes**

| Page                                           | Route                           | Purpose                      |
| ---------------------------------------------- | ------------------------------- | ---------------------------- |
| `facilitator-login/page.tsx`                   | `/facilitator-login`            | Facilitator authentication   |
| `facilitator-dashboard/page.tsx`               | `/facilitator-dashboard`        | Dashboard home               |
| `facilitator-dashboard/[sessionCode]/page.tsx` | `/facilitator-dashboard/[code]` | Session management dashboard |
| `game/page.tsx`                                | `/game`                         | Player game/puzzle screen    |
| `playerlogin/page.tsx`                         | `/playerlogin`                  | Player session join          |
| `session-error/page.tsx`                       | `/session-error`                | Error state display          |

---

### 5. **`/app/lib` - Core Business Logic & Utilities**

#### **`/lib/api`** - API Client & Services

- `client.ts` - Axios/Fetch wrapper for API calls
- `services/auth.ts` - Authentication API calls
- `services/game.ts` - Game management API calls

#### **`/lib/config`** - Configuration

- `env.ts` - Environment variable handling
- `lockConfig.ts` - Lock type definitions and configurations

#### **`/lib/hooks`** - Custom React Hooks

- `useAuth.ts` - Authentication state & methods
- `useGame.ts` - Game state management
- `useSession.ts` - Session management
- `useDashboard.ts` - Dashboard data management
- `useCountdownTimer.ts` - Session countdown logic
- `useTimer.ts` - General timer utilities
- `useQueryStringSession.ts` - URL query parameter handling
- `useHydration.ts` - Client-side hydration management
- `index.ts` - Barrel export

#### **`/lib/store`** - State Management (Zustand)

- `authStore.ts` - User authentication state
- `gameStore.ts` - Game & puzzle state
- `sessionStore.ts` - Session data store
- `config.ts` - Global configuration state
- `index.ts` - Barrel export

**Store Pattern**: Zustand for global state (no Redux complexity)

#### **`/lib/utils`** - Utility Functions

- `calculateRemainingTime.ts` - Time calculation logic
- `confetti.ts` - Celebration animation
- `constants.ts` - App-wide constants
- `formatters.ts` - Data formatting (dates, numbers, etc.)
- `validators.ts` - Input validation functions
- `index.ts` - Barrel export

#### **`/lib/i18n`** - Internationalization

- `useGameTranslation.ts` - Translation hook
- `translations/` - Language files

---

### 6. **`/app/types` - TypeScript Definitions**

Centralized type definitions for consistency.

| File         | Contains                           |
| ------------ | ---------------------------------- |
| `auth.ts`    | User, auth session, login types    |
| `game.ts`    | Game, puzzle, lock, progress types |
| `session.ts` | Session, room, facilitator types   |
| `api.ts`     | API request/response types         |
| `index.ts`   | Barrel export                      |

---

### 7. **`/public` - Static Assets**

- `assets/locks/` - Lock UI images and icons
- `assets/language_Videos/` - Instructional/educational videos

---

## 🔄 Data Flow

### Player Flow

```
1. Player visits app
↓
2. Scans QR Code OR manually enters session code
   → `/api/player/join-game`
↓
3. Player sees puzzle/lock
↓
4. Player solves puzzle → sends attempt
   → `/api/game/unlock` or `/api/game/player-progress`
↓
5. Progress updated in `gameStore`
↓
6. Dashboard reflects changes in real-time
```

### Facilitator Flow

```
1. Facilitator logs in
   → `/facilitator-login`
   → `/api/auth/verify-session`
↓
2. Views session dashboard
   → `/api/dashboard/get-dashboard/[sessionCode]`
↓
3. Can action: unlock puzzles, finish session, unlock all
   → `/api/game/unlock` or `/api/dashboard/unlock-session`
↓
4. Monitors player activity
   → `/api/game/player-activity`
```

---

## 🔐 State Management Pattern

### Zustand Stores (Client-Side Only)

```typescript
// Global state
-authStore - // User info, auth tokens
  gameStore - // Current puzzle state, player locks
  sessionStore - // Session code, session metadata
  config; // App configuration
```

### Server State

- Managed via API routes in `/app/api`
- Database calls (assumed external database)
- Session validation and security

---

## 🎯 Component Hierarchy

```
<AppLayout>              (Root layout)
├── <AppHeader>         (Navigation)
├── <main content>
│   ├── <Modal Components>  (NumericLockModal, WordLockModal, etc.)
│   ├── <Card>          (Content containers)
│   ├── <Button>        (Interactive elements)
│   └── <Dialog>        (Dialogs/confirmations)
└── <AppFooter>         (Footer)
```

---

## 🔗 Key Integration Points

### 1. **Session Management**

- Session codes validated on every request
- Check `/api/auth/verify-session` for validity
- Store in `sessionStore` for persistence

### 2. **Lock System**

- Multiple lock types: Numeric, Word, Directional
- Configuration in `/lib/config/lockConfig.ts`
- UI components map to lock types

### 3. **Real-time Updates**

- Polling or WebSocket (implementation in services)
- Dashboard refreshes automatically
- Progress bars update in real-time

### 4. **QR Code Generation**

- Session QR code in `QRCodeDialog.tsx`
- Links to `/playerlogin` with session code
- Using `qrcode.react` library

---

## 📊 API Endpoints Reference

### Authentication

- `POST /api/auth/player` - Create/get player
- `POST /api/auth/verify-session` - Validate session
- `POST /api/auth/verify-password` - Validate password

### Game Management

- `GET /api/game/game-progress/[sessionCode]` - Get all progress
- `POST /api/game/player-progress` - Update player progress
- `POST /api/game/unlock` - Unlock puzzle
- `POST /api/game/player-activity` - Log activity
- `GET /api/game/players` - Get all players

### Dashboard

- `GET /api/dashboard/get-dashboard/[sessionCode]` - Get dashboard
- `POST /api/dashboard/finish-session/[sessionCode]` - End session
- `POST /api/dashboard/unlock-session/[sessionCode]` - Unlock all

### Player

- `POST /api/player/join-game` - Join session

---

## 🛠️ Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
```

---

## 📦 Dependencies Summary

| Package       | Version   | Usage            |
| ------------- | --------- | ---------------- |
| Next.js       | 16.0.7    | Framework        |
| React         | 19.2.0    | UI library       |
| TypeScript    | ^5        | Type safety      |
| Zustand       | ^5.0.8    | State management |
| Tailwind CSS  | ^4        | Styling          |
| Framer Motion | ^12.23.24 | Animations       |
| QRCode        | ^4.2.0    | QR generation    |
| Confetti      | ^1.9.4    | Celebrations     |
| Lucide React  | ^0.548.0  | Icons            |

---

## 🔒 Security Considerations

1. **Session Validation** - Every request validates session code
2. **Password Verification** - Passwords verified server-side
3. **Authentication** - Facilitator auth tokens (assumed in authStore)
4. **Data Access** - Ensure user can only access their sessions

---

## 🚀 Deployment Notes

- Deployed on Vercel (Next.js native platform)
- Environment variables in `.env.local`

---

_Last Updated: February 2026 - Flow App Game Project_
