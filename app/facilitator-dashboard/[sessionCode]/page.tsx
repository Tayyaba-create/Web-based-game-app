"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppLayout } from "@/app/components/layout";
import { SessionDetails } from "@/app/components/SessionDetails";
import { PlayerProgress } from "@/app/components/PlayerProgress";
import { Button } from "@/app/components/ui";
import { useSession, useTimer } from "@/app/lib/hooks";
import { useDashboard } from "@/app/lib/hooks/useDashboard";
import { authService } from "@/app/lib/api/services/auth";
import { gameService } from "@/app/lib/api/services/game";
import { useSessionStore } from "@/app/lib/store/sessionStore";
import { calculateRemainingTime } from "@/app/lib/utils/calculateRemainingTime";
import QRCodeDialog from "@/app/components/QRCodeDialog";
import UnlockSessionDialog from "@/app/components/UnlockSessionDialog";
import FinishSessionDialog from "@/app/components/FinishSessionDialog";
import SessionExpiredDialog from "@/app/components/SessionExpiredDialog";
import { QrCode } from "lucide-react";

function FacilitatorDashboardWithCodeContent() {
  const params = useParams();
  const router = useRouter();
  const sessionCode = params?.sessionCode as string;
  const { start } = useTimer({ autoStart: false });

  const [showQR, setShowQR] = useState(false);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const { endSession, session } = useSession();
  const { setSession } = useSessionStore();
  const { dashboardData, fetchDashboard, players, loading, error } =
    useDashboard();

  const [verificationState, setVerificationState] = useState({
    isVerifying: true,
    isVerified: false,
    error: null as string | null,
  });

  // Track unlock state from dashboard response (persistent across refreshes)
  const [isSessionUnlocked, setIsSessionUnlocked] = useState(false);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("00:00");
  const unlockedRef = useRef(false);
  const gameSessionIdRef = useRef<number | null>(null);
  const autoFinishCalledRef = useRef(false);

  // Verify session from URL parameter on component mount
  useEffect(() => {
    if (!sessionCode) {
      router.push("/facilitator-dashboard");
      return;
    }

    const verifySession = async () => {
      try {
        const response = await authService.verifySessionCode(sessionCode);

        if (response.success && response.data) {
          // Store session data with session code from URL
          const sessionData = response.data;
          // Ensure code is set from the URL parameter
          if (!sessionData.code) {
            sessionData.code = sessionCode;
          }
          setSession(sessionData);

          setVerificationState({
            isVerifying: false,
            isVerified: true,
            error: null,
          });
        } else {
          setVerificationState({
            isVerifying: false,
            isVerified: false,
            error: response.error || "Failed to verify session",
          });

          // Redirect to error page after a short delay
          setTimeout(() => {
            router.push(
              `/session-error?error=${encodeURIComponent(
                response.error || "Invalid session code",
              )}`,
            );
          }, 2000);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        setVerificationState({
          isVerifying: false,
          isVerified: false,
          error: errorMessage,
        });

        // Redirect to error page after a short delay
        setTimeout(() => {
          router.push(
            `/session-error?error=${encodeURIComponent(errorMessage)}`,
          );
        }, 2000);
      }
    };

    verifySession();
  }, [sessionCode, router, setSession]);

  // Set up polling for session details after verification
  useEffect(() => {
    if (verificationState.isVerified && session?.id) {
      // Set up polling every 5 seconds
      const interval = setInterval(() => {
        // Fetch fresh session details
        authService.verifySessionCode(sessionCode).then((response) => {
          if (response.success && response.data) {
            setSession(response.data);
          }
        });
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [verificationState.isVerified, session?.id, sessionCode, setSession]);

  // Fetch and poll dashboard data
  useEffect(() => {
    if (!sessionCode) return;

    // Fetch immediately
    fetchDashboard(sessionCode, false);

    // Poll every 5 seconds (background fetch - no loading indicator)
    const interval = setInterval(() => {
      fetchDashboard(sessionCode, true);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [sessionCode, fetchDashboard]);

  // Sync unlock state from dashboard data (persistent across page refreshes)
  useEffect(() => {
    if (dashboardData?.sessionUnlocked === true && !unlockedRef.current) {
      unlockedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSessionUnlocked(true);
      // Auto-start timer if session is already unlocked
      start();
    }

    // Check if session has expired (status = 2 means finished)
    if (String(dashboardData?.status) === "2" && !showSessionExpired) {
      setShowSessionExpired(true);
    }

    // Extract gameSessionId from dashboard data
    if (
      dashboardData?.gameSessionId &&
      gameSessionIdRef.current !== dashboardData.gameSessionId
    ) {
      gameSessionIdRef.current = dashboardData.gameSessionId;
      setGameSessionId(dashboardData.gameSessionId);
    }
  }, [
    dashboardData?.sessionUnlocked,
    dashboardData?.gameSessionId,
    dashboardData?.status,
    sessionCode,
  ]);
  // Monitor remaining time and auto-finish session when timer reaches 0:00
  useEffect(() => {
    if (
      !dashboardData?.sessionUnlockedAt ||
      !dashboardData?.sessionDuration ||
      autoFinishCalledRef.current
    ) {
      return;
    }

    const interval = setInterval(() => {
      const newRemainingTime = calculateRemainingTime(
        dashboardData?.sessionCreated,
        dashboardData?.sessionUnlockedAt,
        dashboardData?.sessionDuration,
      );
      setRemainingTime(newRemainingTime);

      // When timer reaches 0:00, automatically call finish session
      if (newRemainingTime === "00:00" && !autoFinishCalledRef.current) {
        autoFinishCalledRef.current = true;
        handleFinish();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    dashboardData?.sessionUnlockedAt,
    dashboardData?.sessionDuration,
    dashboardData?.sessionCreated,
  ]);
  const handleFinish = async () => {
    try {
      // Call the finish session API
      const response = await gameService.finishSession(sessionCode);

      if (response.success) {
        // Session finished successfully, redirect to login
        window.location.href = "/facilitator-login";
      } else {
        const errorMsg =
          response.error || response.message || "Failed to finish session";
        alert(`Failed to finish session: ${errorMsg}`);
        setShowFinishConfirm(false);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to finish session";
      alert(`Error: ${errorMsg}`);
      setShowFinishConfirm(false);
    }
  };

  const handleUnlock = async () => {
    if (!isSessionUnlocked) {
      // Show confirmation dialog
      setShowUnlockConfirm(true);
      return;
    }

    // Show finish confirmation dialog instead of directly finishing
    setShowFinishConfirm(true);
  };

  const handleConfirmFinish = async () => {
    setShowFinishConfirm(false);
    // If already unlocked, treat click as Finish (end session)
    await handleFinish();
  };

  const handleConfirmUnlock = async () => {
    try {
      // Call the unlock session API
      const response = await gameService.unlockSession(sessionCode);

      if (response.success) {
        // Session unlocked successfully
        setIsSessionUnlocked(true);
        setShowUnlockConfirm(false);
        start();
      } else {
        alert(`Failed to unlock session: ${response.error}`);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to unlock session";
      alert(`Error: ${errorMsg}`);
    }
  };

  // Show loading state while verifying session
  if (verificationState.isVerifying) {
    return (
      <AppLayout
        headerMode="dashboard"
        showTimer={true}
        transparentBackground={true}
      >
        <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B61FF] mx-auto mb-4"></div>
            <p className="text-lg">Verifying session code: {sessionCode}</p>
          </div>
        </main>
      </AppLayout>
    );
  }

  // Handle case where verification failed
  if (!verificationState.isVerified && verificationState.error) {
    return (
      <AppLayout
        headerMode="dashboard"
        showTimer={true}
        transparentBackground={true}
      >
        <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 mb-6">
              <p className="text-red-400 mb-2">Session Verification Failed</p>
              <p className="text-sm text-gray-300">{verificationState.error}</p>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Redirecting to error page...
            </p>
          </div>
        </main>
      </AppLayout>
    );
  }

  // Main dashboard content after verification
  return (
    <>
      {/* Full-viewport fixed background */}
      <div
        style={{
          position: "fixed",

          width: "100vw",
          height: "100vh",
          backgroundImage: "url('/assets/Background%20img_gme-dashboard.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      />
      <AppLayout
        headerMode="dashboard"
        showTimer={true}
        transparentBackground={true}
        sessionCreated={dashboardData?.sessionCreated}
        sessionUnlockedAt={dashboardData?.sessionUnlockedAt}
        sessionDuration={dashboardData?.sessionDuration}
      >
        <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 space-y-8 font-sans mx-[30px] min-h-screen">
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-6 mb-[6px] mt-[15px]">
            <div className="flex gap-[4px] order-2 sm:order-1 mb-[4px] sm:mb-0">
              <Button
                variant="white"
                onClick={() => setShowQR(true)}
                disabled={showSessionExpired}
                className="!h-11 flex items-center justify-center mr-[5px] ml-[5px] !text-sm font-medium bg-white shadow-sm hover:bg-gray-50 !px-6 whitespace-nowrap disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:bg-white"
              >
                <QrCode className="w-5 h-5 mr-[5px]" />
                <span>QR Code</span>
              </Button>
            </div>
            <Button
              variant={isSessionUnlocked ? "danger" : "primary"}
              onClick={handleUnlock}
              disabled={showSessionExpired}
              className="!h-14 flex items-center justify-center gap-2 !text-base font-medium !px-8 whitespace-nowrap order-1 mb-[5px] sm:order-2 disabled:cursor-not-allowed"
            >
              <span style={{ color: "white" }}>
                {isSessionUnlocked
                  ? "Finish Session"
                  : "Unlock Session for Players"}
              </span>
            </Button>
          </div>

          {/* Body */}
          <div className="space-y-8">
            <div className="mb-[20px] mt-[20px]">
              <SessionDetails sessionCode={sessionCode} players={players} />
            </div>

            <PlayerProgress
              sessionCode={sessionCode}
              players={players}
              loading={loading}
              error={error}
            />
          </div>
        </main>

        {/* QR Code Dialog */}
        <QRCodeDialog
          open={showQR}
          onClose={() => {
            setShowQR(false);
          }}
          gameSessionId={gameSessionId || 0}
          sessionCode={sessionCode}
        />

        {/* Unlock Session Confirmation Dialog */}
        <UnlockSessionDialog
          open={showUnlockConfirm}
          onClose={() => {
            setShowUnlockConfirm(false);
          }}
          onConfirm={handleConfirmUnlock}
        />

        {/* Finish Session Confirmation Dialog */}
        <FinishSessionDialog
          open={showFinishConfirm}
          onClose={() => {
            setShowFinishConfirm(false);
          }}
          onConfirm={handleConfirmFinish}
        />

        {/* Session Expired Dialog */}
        <SessionExpiredDialog
          open={showSessionExpired}
          language="en"
          onClose={() => {
            setShowSessionExpired(false);
          }}
          onConfirm={() => {
            window.location.href = "/facilitator-dashboard";
          }}
        />
      </AppLayout>
    </>
  );
}

export default function FacilitatorDashboardWithCode() {
  return (
    <Suspense
      fallback={
        <AppLayout
          headerMode="dashboard"
          showTimer={true}
          transparentBackground={true}
        >
          <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B61FF] mx-auto mb-4"></div>
              <p className="text-lg">Loading dashboard...</p>
            </div>
          </main>
        </AppLayout>
      }
    >
      <FacilitatorDashboardWithCodeContent />
    </Suspense>
  );
}
