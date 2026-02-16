"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui";
import { useAuth } from "@/app/lib/hooks";
import { LogOut, User, Clock, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { calculateRemainingTime } from "@/app/lib/utils/calculateRemainingTime";

interface AppHeaderProps {
  mode?: "default" | "game" | "dashboard";
  playerName?: string;
  showTimer?: boolean;
  showLanguage?: boolean;
  customActions?: React.ReactNode;
  sessionCreated?: string;
  sessionUnlockedAt?: string;
  sessionDuration?: number;
  sessionCode?: string;
}

export const AppHeader = ({
  mode = "default",
  playerName,
  showTimer = false,
  showLanguage = false,
  customActions,
  sessionCreated,
  sessionUnlockedAt,
  sessionDuration = 60,
  sessionCode,
}: AppHeaderProps) => {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [dynamicTime, setDynamicTime] = useState<string>(
    calculateRemainingTime(sessionCreated, sessionUnlockedAt, sessionDuration)
  );
  const language =
    (user as unknown as Record<string, unknown>)?.language || "en";

  // Update timer every second when session is unlocked
  useEffect(() => {
    if (!sessionUnlockedAt) return;

    const interval = setInterval(() => {
      setDynamicTime(
        calculateRemainingTime(
          sessionCreated,
          sessionUnlockedAt,
          sessionDuration
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionCreated, sessionUnlockedAt, sessionDuration]);

  // Use dynamic time if available, otherwise show 60:00 (not from context)
  const displayTime = sessionUnlockedAt ? dynamicTime : "60:00";

  // Don't show header on login pages
  if (
    pathname?.includes("/facilitator-login") ||
    pathname?.includes("/playerlogin")
  ) {
    return null;
  }

  // Game Mode Header
  if (mode === "game") {
    return (
      <>
        <header className="sticky  z-50 w-full bg-[#0F1125] border-b border-white/40 shadow-[0_1px_0_rgba(255,255,255,0.1)]">
          <style>{`
            @media (max-width: 768px) {
              .game-header-container {
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .game-timer-mobile {
                display: none;
              }
              .game-player-name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 0 1 auto;
                margin-right: 50px;
               
              }
            }
            @media (min-width: 769px) {
              .game-timer-below {
                display: none;
              }
            }
          `}</style>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center px-[30px] game-header-container">
              {/* Left: Player Name */}
              <h1 className="text-2xl font-bold text-white flex-1 game-player-name">
                {playerName || "Player"}
              </h1>

              {/* Center: Timer with Clock Icon - Hidden on mobile */}
              {showTimer && (
                <div className="flex items-center gap-2 font-mono text-white justify-center flex-1 game-timer-mobile">
                  <Clock className="w-5 h-5 text-white mr-[5px]" />
                  {displayTime}
                </div>
              )}

              {/* Right: Language */}
              {showLanguage && (
                <div className="flex items-center gap-2 justify-end flex-1">
                  <Image
                    src="/assets/icons8-globe-50.png"
                    alt="Language"
                    width={24}
                    height={24}
                    className="mr-[5px] brightness-0 invert"
                  />
                  <span className="text-white font-medium text-lg mr-[10px]">
                    {(language as string).toUpperCase()}
                  </span>
                </div>
              )}
              {!showLanguage && showTimer && <div className="flex-1"></div>}
            </div>
          </div>
        </header>

        {/* Timer Below Header - Mobile Only */}
        {showTimer && (
          <div className="game-timer-below w-full bg-[#7ce3ff] text-[#000000] border-b border-white/40 flex justify-center items-center h-[28px]">
            <div className="flex items-center gap-2 font-mono text-white">
              <Clock className="w-4 h-4 text-white mr-[5px]" />
              <span className="text-sm font-[700]">{displayTime}</span>
            </div>
          </div>
        )}
      </>
    );
  }

  // Dashboard Mode Header
  if (mode === "dashboard") {
    return (
      <header className="sticky top-0 z-50  w-full bg-[#0F1125] border-b border-white/40 shadow-[0_1px_0_rgba(255,255,255,0.1)] ">
        <style>{`
          @media (max-width: 768px) {
            .dashboard-header-container {
              display: flex;
              flex-direction: column;
              gap: 0.1rem;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .dashboard-logo {
              width: 100%;
              display: flex;
              justify-content: center;
              padding: 8px;
              background: radial-gradient(circle, rgba(77, 49, 221, 0.26) 0%, rgba(58, 141, 255, 0.05) 100%);
              border-radius: 50%;
              width: 80px;
              height: 80px;
              margin: 0;
            }
            .dashboard-title {
              width: 100%;
              display: flex;
              justify-content: center;
              margin: 0;

            }
            .dashboard-actions {
              width: 100%;
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              gap: 0rem;
              background-color: #7ce3ff !important;
              color: black !important;
              font-weight: 800 !important;
              border: 0px !important;
              
              
            }
            .dashboard-timer {
              background-color: transparent !important;
              color: inherit !important;
              font-weight: inherit !important;
            }
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 ">
          <div className="flex items-center justify-between px-[30px] py-[2px] dashboard-header-container">
            {/* Left: Logo */}
            <div className="dashboard-logo">
              <Image
                src="/assets/Logo_flow.png"
                alt="Flow Logo"
                width={80}
                height={80}
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain pl-[5px] flex-shrink-0"
              />
            </div>

            {/* Center: Dashboard Title */}
            <div className="dashboard-title">
              <h2 className=" m-[10px] text-center">Dashboard</h2>
            </div>

            {/* Right: Timer and Custom Actions */}
            <div className="flex items-center gap-2 flex-shrink-0 dashboard-actions">
              {/* Timer */}
              {showTimer && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap h-[30px] w-[100px] dashboard-timer">
                  <Clock className="text-purple-400  sm:w-5 sm:h-5 mr-[5px]" />
                  <span className="font-mono text-xs sm:text-sm md:text-base text-gray-100">
                    {displayTime}
                  </span>
                </div>
              )}
              {/* Admin Settings (white icon) - hide on the facilitator dashboard page to avoid duplication */}
              {!pathname?.includes("/facilitator-dashboard") && (
                <Link href="/admin-dashboard" className="ml-2">
                  <div
                    role="button"
                    aria-label="Admin dashboard"
                    className="w-10 h-10 rounded-md flex items-center justify-center bg-white/5 hover:bg-white/10"
                  >
                    <Settings className="w-6 h-6 mr-[10px]" color="#ffffff" />
                  </div>
                </Link>
              )}
              {customActions}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Default Mode Header (general layout)
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0F1125] border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center min-h-[48px] sm:min-h-[56px] md:min-h-[64px]">
          {/* Logo/Home */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] bg-clip-text text-transparent">
                FLOW
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`transition-colors hover:text-[#7B61FF] ${
                pathname === "/" ? "text-[#7B61FF]" : "text-gray-300"
              }`}
            >
              Home
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="text-[#4CC9F0]">{user?.name || "User"}</span>
                </div>

                {/* Timer */}
                {showTimer && (
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg whitespace-nowrap ml-[10px]">
                    <Clock className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5 mr-[5px]" />
                    <span className="font-mono text-xs sm:text-sm md:text-base text-gray-100">
                      {displayTime}
                    </span>
                  </div>
                )}
                <Button
                  variant="danger"
                  onClick={logout}
                  className="!px-2 !py-1 sm:!px-3 sm:!py-1.5 !text-xs sm:!text-sm mx-[10px]"
                >
                  <LogOut className="w-3 h-3 sm:w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link href="/facilitator-login">
                  <Button
                    variant="primary"
                    className="!px-2 !py-1 sm:!px-3 sm:!py-1.5 md:!px-4 md:!py-2 !text-xs sm:!text-sm"
                  >
                    <span className="hidden xs:inline">Facilitator</span>
                    <span className="xs:hidden">Facil</span>
                  </Button>
                </Link>
                <Link href="/playerlogin">
                  <Button
                    variant="primary"
                    className="!px-2 !py-1 sm:!px-3 sm:!py-1.5 md:!px-4 md:!py-2 !text-xs sm:!text-sm"
                  >
                    Player
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
