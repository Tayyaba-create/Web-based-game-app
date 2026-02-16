"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/app/components/layout";
import { Button } from "@/app/components/ui";
import { useAuth } from "@/app/lib/hooks";
import { useHydration } from "@/app/lib/hooks/useHydration";
import { useGameTranslation } from "@/app/lib/i18n/useGameTranslation";
import { gameService } from "@/app/lib/api/services/game";
import { calculateRemainingTime } from "@/app/lib/utils/calculateRemainingTime";
import Image from "next/image";
import { Video, Check, HelpCircle } from "lucide-react";
import NumericLockModal from "@/app/components/NumericLockModal";
import DirectionalLockModal from "@/app/components/DirectionalLockModal";
import WordLockModal from "@/app/components/WordLockModal";
import NumericV1Modal from "@/app/components/NumericV1Modal";
import NumericV2Modal from "@/app/components/NumericV2Modal";
import WordMLModal from "@/app/components/WordMLModal";
import VideoDialog from "@/app/components/VideoDialog";
import SessionExpiredDialog from "@/app/components/SessionExpiredDialog";
import ProgressBar from "@/app/components/ProgressBar";
import type { GameBox } from "@/app/types/game";
import {
  getLockImageForBox,
  getLockTypeForBox,
  getLockUnlockImageForBox,
} from "@/app/lib/config/lockConfig";

export default function PlayerGamePage() {
  const [selectedChest, setSelectedChest] = useState<number | null>(null);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [gameBoxes, setGameBoxes] = useState<GameBox[]>([]);
  const [unlockedChests, setUnlockedChests] = useState<number[]>([]);
  const [submittedCodes, setSubmittedCodes] = useState<{
    [key: number]: string;
  }>({});
  const [physicalCode, setPhysicalCode] = useState<string | null>(null);
  const [physicalCodesByBox, setPhysicalCodesByBox] = useState<{
    [key: number]: string | null;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrating, setIsHydrating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionCreated, setSessionCreated] = useState<string>();
  const [sessionUnlockedAt, setSessionUnlockedAt] = useState<string>();
  const [sessionDuration, setSessionDuration] = useState<number>(60);
  const [sessionStatus, setSessionStatus] = useState<number | null>(null);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [sessionLanguage, setSessionLanguage] = useState<string>("en");
  const { user, isPlayer } = useAuth();
  const isHydrated = useHydration();
  const router = useRouter();
  const initialFetchDone = useRef(false);
  // Use user's chosen language for UI translations, but keep sessionLanguage for lock configuration
  const userLanguage =
    user && "language" in user ? (user.language as string).toLowerCase() : "en";
  const { t } = useGameTranslation(userLanguage);

  // Load unlocked chests from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUnlocked = localStorage.getItem("unlockedChests");
      if (savedUnlocked) {
        try {
          setUnlockedChests(JSON.parse(savedUnlocked));
        } catch (e) {
          // If parsing fails, just start with empty array
          setUnlockedChests([]);
        }
      }
    }
  }, []);

  // Save unlocked chests to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && unlockedChests.length > 0) {
      localStorage.setItem("unlockedChests", JSON.stringify(unlockedChests));
    }
  }, [unlockedChests]);

  // Wait for hydration to complete before showing any content
  useEffect(() => {
    if (isHydrated) {
      setIsHydrating(false);
    }
  }, [isHydrated]);

  // Validate player is authenticated - wait for hydration first
  useEffect(() => {
    if (!isHydrated) return;

    if (!isPlayer || !user) {
      router.push("/playerlogin");
    } else {
      // Set initial language from user's login selection (will be overridden by session language from API)
      if ("language" in user && user.language) {
        setSessionLanguage(user.language.toLowerCase());
      }
    }
  }, [isHydrated, isPlayer, user, router]);

  // Fetch game progress from API
  useEffect(() => {
    if (!isHydrated || !user || !isPlayer) return;

    const fetchGameProgress = async () => {
      // Only show loading on initial fetch, not on polling
      if (!initialFetchDone.current) {
        setIsLoading(true);
      }
      setError(null);

      try {
        // Get session code and player ID from user (stored after login)
        if (!user) {
          throw new Error("User not found");
        }

        let sessionCode = "SHI-HDS-XkkKi"; // Default fallback for testing
        let playerId: number | string | undefined;

        if ("sessionCode" in user && user.sessionCode) {
          sessionCode = user.sessionCode;
        }

        if ("id" in user && user.id) {
          playerId = user.id;
        }

        const response = await gameService.getGameProgress(
          sessionCode,
          playerId,
        );

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch game progress");
        }

        if (!response.data) {
          throw new Error("No data returned from API");
        }

        // Handle both direct response and wrapped response structures
        let gameData: any = response.data;

        // If response has nested data wrapper, unwrap it
        if (gameData && typeof gameData === "object" && "data" in gameData) {
          gameData = gameData.data;
        }

        // Extract session data for timer
        const gameSession = gameData?.gameSession;
        if (gameSession) {
          if (gameSession.sessionCreated) {
            setSessionCreated(gameSession.sessionCreated);
          }
          if (gameSession.sessionUnlockedAt) {
            setSessionUnlockedAt(gameSession.sessionUnlockedAt);
          }
          if (gameSession.sessionDuration) {
            setSessionDuration(gameSession.sessionDuration);
          }
          // Set language from session API response, with fallback to user's login selection
          if (gameSession.language) {
            setSessionLanguage(gameSession.language.toLowerCase());
          } else if (user && "language" in user && user.language) {
            setSessionLanguage(user.language.toLowerCase());
          }
          // Check if session has expired (status = 2 means finished)
          if (gameSession.status === 2 && !showSessionExpired) {
            setSessionStatus(gameSession.status);
            setShowSessionExpired(true);
          }
        }

        // Extract gameProgress from response data
        const gameProgressData = gameData?.gameProgress;

        if (!Array.isArray(gameProgressData)) {
          throw new Error(
            `Invalid game progress data format: expected array but got ${typeof gameProgressData}. Full data: ${JSON.stringify(
              gameData,
            )}`,
          );
        }

        if (gameProgressData.length === 0) {
          throw new Error("No game boxes found");
        }

        // Set game boxes from API
        setGameBoxes(gameProgressData);

        // Don't overwrite unlocked chests from API - use local localStorage state instead
        // The unlocked chests are managed locally and persisted to localStorage
        // This prevents the API response from resetting locally stored unlock progress

        // Store physical codes by box ID
        const physicalCodesMap: { [key: number]: string | null } = {};
        gameProgressData.forEach((box: any) => {
          physicalCodesMap[box.boxID - 1] = box.physicalCode; // Convert to 0-indexed
        });
        setPhysicalCodesByBox(physicalCodesMap);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
      } finally {
        // Only hide loading on initial fetch
        if (!initialFetchDone.current) {
          setIsLoading(false);
          initialFetchDone.current = true;
        }
      }
    };

    fetchGameProgress();

    // Poll every 5 seconds for game progress (includes session data for timer)
    const pollInterval = setInterval(() => {
      fetchGameProgress();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [isHydrated, user, isPlayer]);

  const playerName =
    isPlayer && user && "name" in user ? (user.name as string) : "Player";

  // Track if finishSession has been called to prevent duplicates
  const finishSessionCalledRef = useRef(false);

  // Handle timer completion - show session expired dialog when timer reaches 00:00
  useEffect(() => {
    if (!sessionUnlockedAt || !sessionCreated || sessionStatus === 2) {
      return; // Don't trigger if session data not ready or already finished
    }

    const checkTimerCompletion = () => {
      const remainingTime = calculateRemainingTime(
        sessionCreated,
        sessionUnlockedAt,
        sessionDuration,
      );

      if (remainingTime === "00:00" && !finishSessionCalledRef.current) {
        // Prevent duplicate calls
        finishSessionCalledRef.current = true;

        // Show session expired dialog without calling API
        setSessionStatus(2);
        setShowSessionExpired(true);
      }
    };

    // Check immediately
    checkTimerCompletion();

    // Then check every 500ms to ensure we catch the 00:00 state
    const timerCheckInterval = setInterval(checkTimerCompletion, 500);

    return () => clearInterval(timerCheckInterval);
  }, [sessionCreated, sessionUnlockedAt, sessionDuration, sessionStatus, user]);

  const handleSubmitCode = async (code: string) => {
    if (selectedChest === null || !user) {
      throw new Error("No chest selected");
    }

    try {
      // Get session code from user
      let sessionCode = "SHI-HDS-XkkKi"; // Default fallback
      if ("sessionCode" in user && user.sessionCode) {
        sessionCode = user.sessionCode;
      }

      const boxID = selectedChest + 1; // Convert to 1-indexed for API
      const playerId = "id" in user ? parseInt(user.id) : 0;

      // Call backend to verify password - single API call handles unlock + verification
      const response = await gameService.unlockChest(
        sessionCode,
        boxID,
        code,
        playerId,
      );

      if (!response.success) {
        throw new Error(response.error || "Incorrect code");
      }

      // Generate a random physical code to display
      const randomCode = Math.floor(Math.random() * 9000) + 1000; // Random 4-digit code
      setPhysicalCode(String(randomCode));

      // Code was correct - update UI state
      setUnlockedChests((prev) => {
        if (!prev.includes(selectedChest)) {
          return [...prev, selectedChest];
        }
        return prev;
      });

      // Store the submitted code
      setSubmittedCodes((prev) => ({
        ...prev,
        [selectedChest]: code,
      }));

      // DO NOT close modal here - let the modal handle closing after countdown completes
      // The modal will call onClose after the 5-second countdown
    } catch (err) {
      throw err; // Re-throw so modal can catch it and show error
    }
  };

  // Get language-specific video URL
  const getVideoUrl = (): string => {
    // Map language codes to video file paths
    const videoMap: Record<string, string> = {
      en: "/assets/language_Videos/English.mp4",
      es: "/assets/language_Videos/Flow - Video de God Of War ES.mp4",
      pt: "/assets/language_Videos/Flow - Video de God Of War PT.mp4",
      fr: "/assets/language_Videos/English.mp4", // Fallback to English for French
    };

    const videoUrl = videoMap[userLanguage] || videoMap["en"];
    return videoUrl;
  };

  // Show loading state while hydrating from localStorage
  if (isHydrating) {
    return (
      <AppLayout
        headerMode="game"
        playerName="Player"
        showTimer={true}
        showLanguage={false}
        transparentBackground={true}
        sessionCreated={sessionCreated}
        sessionUnlockedAt={sessionUnlockedAt}
        sessionDuration={sessionDuration}
      >
        <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-8">
              <p className="text-blue-400 text-xl font-semibold mb-4">
                Loading...
              </p>
              <p className="text-gray-300">Restoring your session...</p>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  // Show access denied only after hydration is complete
  if (!isPlayer || !user) {
    return (
      <AppLayout
        headerMode="game"
        playerName="Player"
        showTimer={true}
        showLanguage={false}
        transparentBackground={true}
        sessionCreated={sessionCreated}
        sessionUnlockedAt={sessionUnlockedAt}
        sessionDuration={sessionDuration}
      >
        <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-8 mb-6">
              <p className="text-red-400 text-xl font-semibold mb-4">
                {t("game.accessDenied")}
              </p>
              <p className="text-gray-300 mb-6">{t("game.mustLogin")}</p>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout
        headerMode="game"
        playerName={playerName}
        showTimer={true}
        showLanguage={true}
        transparentBackground={true}
        sessionCreated={sessionCreated}
        sessionUnlockedAt={sessionUnlockedAt}
        sessionDuration={sessionDuration}
      >
        <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p className="text-gray-300">{t("game.loading")}</p>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout
        headerMode="game"
        playerName={playerName}
        showTimer={true}
        showLanguage={true}
        transparentBackground={true}
        sessionCreated={sessionCreated}
        sessionUnlockedAt={sessionUnlockedAt}
        sessionDuration={sessionDuration}
      >
        <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-8 mb-6">
              <p className="text-red-400 text-xl font-semibold mb-4">
                {t("game.error")}
              </p>
              <p className="text-gray-300 mb-6">{error}</p>
              <Button
                variant="primary"
                onClick={() => router.push("/playerlogin")}
              >
                {t("game.backToLogin")}
              </Button>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <>
      {/* Full-viewport background (covers header too) */}
      <div
        className="fixed w-screen h-screen bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/assets/Background%20img_gme-dashboard.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      />
      <AppLayout
        headerMode="game"
        playerName={playerName}
        showTimer={true}
        showLanguage={true}
        transparentBackground={true}
        sessionCreated={sessionCreated}
        sessionUnlockedAt={sessionUnlockedAt}
        sessionDuration={sessionDuration}
      >
        <div className="w-full min-h-screen">
          <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">
            {/* Progress Bar */}
            <ProgressBar unlockedChests={unlockedChests} />

            {/* Buttons Container */}
            <div className="flex flex-wrap gap-[20px] w-full px-4 justify-center items-center mt-[60px] mb-[10px]">
              {/* Unlocked Boxes Display */}
              <div className="border-0 px-[35px] py-[16px] rounded-[0.35rem] text-[#5d3eff] font-['Orbitron'] tracking-wider rounded-xl bg-[#FFFFFF]">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  {t("game.unlockedBoxes")} {unlockedChests.length}/
                  {gameBoxes.length} {t("game.boxes")}
                </span>
              </div>

              {/* Video Button */}
              <Button
                variant="primary"
                onClick={() => setShowVideoDialog(true)}
                disabled={showSessionExpired}
                className="!px-4 sm:!px-6 md:!px-8 !py-2 sm:!py-3 md:!py-4 !text-sm sm:!text-base md:!text-lg font-['Orbitron'] tracking-wider !border-[#FFFFFF] hover:shadow-[0_0_20px_rgba(123,97,255,0.6)] hover:!scale-[1.05] disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
              >
                <div className="flex items-center justify-center gap-2 ">
                  <Video size={25} />
                  <span className="ml-[5px]">{t("game.watchVideo")}</span>
                </div>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
              {gameBoxes.map((gameBox) => {
                const boxIndex = gameBox.boxID - 1; // Convert to 0-indexed for display
                const isUnlocked = unlockedChests.includes(boxIndex);

                return (
                  <div
                    key={gameBox.boxID}
                    onClick={() => {
                      // Only open modal if chest is not already unlocked and session is not expired
                      if (!isUnlocked && !showSessionExpired) {
                        setSelectedChest(boxIndex);
                        setPhysicalCode(null); // Clear physical code when opening a new chest
                      }
                    }}
                    className={`
                relative
                ${
                  isUnlocked
                    ? "bg-gradient-to-r from-[#FF3A3A]/20 to-[#FF6B6B]/0"
                    : "bg-gradient-to-r from-[#7B61FF]/20 to-[#3A8DFF]/0"
                }
                rounded-xl
                flex
                items-center
                justify-center
                shadow-lg
                hover:scale-105 
                transition-transform
                duration-300
                ${
                  !isUnlocked && !showSessionExpired
                    ? "cursor-pointer"
                    : "cursor-default"
                }
                w-full
                max-w-[350px]
                h-[180px]
                sm:h-[200px]
                md:h-[220px]
                lg:h-[240px]
                m-[10px]
                rounded-[1rem]
                border-1 border-white
                overflow-visible
                ${
                  isUnlocked
                    ? "shadow-[0_0_15px_rgba(0,255,140,0.4)]"
                    : "shadow-[0_0_15px_rgba(255,0,0,0.4)]"
                }
                ${
                  showSessionExpired && !isUnlocked ? "pointer-events-none" : ""
                }
              `}
                  >
                    <Image
                      src={
                        isUnlocked
                          ? "/assets/chest-open.png"
                          : "/assets/chest-closed.png"
                      }
                      alt={`Chest ${gameBox.boxID}`}
                      width={180}
                      height={180}
                      className="object-contain"
                      loading="eager"
                    />
                    <div className="absolute top-[15px] left-[15px] z-50 text-white font-black text-lg bg-black bg-opacity-50 px-2 py-1 rounded">
                      {t("game.box")} {gameBox.boxID}
                    </div>
                    {physicalCodesByBox[boxIndex] && (
                      <div className="absolute inset-0 flex items-start justify-center mt-[100px] bg-black bg-opacity-60 rounded-xl z-30">
                        <div className="text-center">
                          <p
                            className="text-[#fff] font-mono text-[22px] tracking-wider"
                            style={{ fontWeight: 700 }}
                          >
                            {physicalCodesByBox[boxIndex]}
                          </p>
                        </div>
                      </div>
                    )}
                    {!isUnlocked && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          width: "56px",
                          height: "56px",
                          backgroundColor: "#ef4444",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                          border: "3px solid #dc2626",
                        }}
                      >
                        <HelpCircle
                          size={36}
                          className="text-white"
                          strokeWidth={2}
                        />
                      </div>
                    )}
                    {isUnlocked && (
                      <>
                        <div
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            width: "56px",
                            height: "56px",
                            backgroundColor: "#22c55e",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                            border: "3px solid #16a34a",
                          }}
                        >
                          <Check
                            size={40}
                            className="text-white"
                            strokeWidth={4}
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Lock Modals - Render based on lock type */}
            {selectedChest !== null &&
              (() => {
                const lockType = getLockTypeForBox(selectedChest);
                const lockImage = getLockImageForBox(selectedChest);

                switch (lockType) {
                  case "numeric":
                    return (
                      <NumericLockModal
                        open={selectedChest !== null}
                        onClose={() => setSelectedChest(null)}
                        onSubmit={handleSubmitCode}
                        lockImage={lockImage}
                        physicalCode={physicalCode}
                        language={userLanguage}
                      />
                    );
                  case "directional":
                    return (
                      <DirectionalLockModal
                        open={selectedChest !== null}
                        onClose={() => setSelectedChest(null)}
                        onSubmit={handleSubmitCode}
                        lockImage={lockImage}
                        unlockImage={getLockUnlockImageForBox(
                          selectedChest || 0,
                        )}
                        physicalCode={physicalCode}
                        language={userLanguage}
                      />
                    );
                  case "numericV1":
                    return (
                      <NumericV1Modal
                        open={selectedChest !== null}
                        onClose={() => setSelectedChest(null)}
                        onSubmit={handleSubmitCode}
                        lockImage={lockImage}
                        physicalCode={physicalCode}
                        language={userLanguage}
                      />
                    );
                  case "word":
                    return (
                      <WordLockModal
                        open={selectedChest !== null}
                        onClose={() => setSelectedChest(null)}
                        onSubmit={handleSubmitCode}
                        lockImage={lockImage}
                        physicalCode={physicalCode}
                        language={userLanguage}
                      />
                    );
                  case "numericV2":
                    return (
                      <NumericV2Modal
                        open={selectedChest !== null}
                        onClose={() => setSelectedChest(null)}
                        onSubmit={handleSubmitCode}
                        lockImage={lockImage}
                        physicalCode={physicalCode}
                        language={userLanguage}
                      />
                    );
                  case "wordML":
                    return (
                      <WordMLModal
                        open={selectedChest !== null}
                        onClose={() => setSelectedChest(null)}
                        onSubmit={handleSubmitCode}
                        lockImage={lockImage}
                        physicalCode={physicalCode}
                        language={userLanguage}
                        sessionLanguage={sessionLanguage}
                      />
                    );
                  default:
                    return null;
                }
              })()}

            {/* Video Dialog */}
            <VideoDialog
              open={showVideoDialog}
              onClose={() => setShowVideoDialog(false)}
              videoUrl={getVideoUrl()}
              password=""
              language={userLanguage}
            />

            {/* Session Expired Dialog */}
            <SessionExpiredDialog
              open={showSessionExpired}
              language={userLanguage}
              onClose={() => {
                setShowSessionExpired(false);
              }}
              onConfirm={() => {
                window.location.href = "/playerlogin";
              }}
            />
          </div>
        </div>
      </AppLayout>
    </>
  );
}
