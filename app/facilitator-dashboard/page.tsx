"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/app/components/layout";
import { SessionDetails } from "@/app/components/SessionDetails";
import { PlayerProgress } from "@/app/components/PlayerProgress";
import { Button } from "@/app/components/ui";
import { useSession } from "@/app/lib/hooks";
import { useDashboard } from "@/app/lib/hooks/useDashboard";
import QRCodeDialog from "@/app/components/QRCodeDialog"; // import your existing dialog
import UnlockSessionDialog from "@/app/components/UnlockSessionDialog";
import { QrCode } from "lucide-react";
import { useQueryStringSession } from "@/app/lib/hooks";
import { gameService } from "@/app/lib/api/services/game";

function FacilitatorDashboardContent() {
  const [showQR, setShowQR] = useState(false);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);
  const { endSession, session, fetchSessionDetails } = useSession();
  const { dashboardData, fetchDashboard } = useDashboard();
  const {
    isVerifying,
    isVerified,
    error: verificationError,
    sessionCode,
    verifyFromQueryString,
    redirectToError,
  } = useQueryStringSession();
  const router = useRouter();

  const [sessionVerificationChecked, setSessionVerificationChecked] =
    useState(false);
  const [isSessionUnlocked, setIsSessionUnlocked] = useState(false);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const unlockedRef = useRef(false);
  const gameSessionIdRef = useRef<number | null>(null);

  // Redirect to facilitator login if no session code provided
  useEffect(() => {
    if (sessionVerificationChecked && !sessionCode) {
      router.push("/facilitator-login");
    }
  }, [sessionVerificationChecked, sessionCode, router]);

  // Verify session from query string on component mount
  useEffect(() => {
    if (!sessionVerificationChecked) {
      const checkSession = async () => {
        const isValid = await verifyFromQueryString();

        setSessionVerificationChecked(true);

        // If session code was in URL but verification failed, redirect to error page
        if (sessionCode && !isValid) {
          redirectToError(verificationError || "Invalid session code");
        }
      };

      checkSession();
    }
  }, [
    sessionVerificationChecked,
    verifyFromQueryString,
    sessionCode,
    redirectToError,
    verificationError,
  ]);

  // Set up polling for session details
  useEffect(() => {
    if (session?.id && sessionVerificationChecked && isVerified) {
      // Fetch immediately
      fetchSessionDetails(session.id);

      // Set up polling every 5 seconds
      const interval = setInterval(() => {
        fetchSessionDetails(session.id);
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [
    session?.id,
    sessionVerificationChecked,
    isVerified,
    fetchSessionDetails,
  ]);

  // Reset QR dialog when session changes
  useEffect(() => {
    if (!session) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowQR(false);
    }
  }, [session]);

  // Fetch and poll dashboard data
  useEffect(() => {
    if (!sessionCode) return;

    // Fetch immediately
    fetchDashboard(sessionCode);

    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchDashboard(sessionCode);
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
    }

    // Extract gameSessionId from dashboard data
    if (
      dashboardData?.gameSessionId &&
      gameSessionIdRef.current !== dashboardData.gameSessionId
    ) {
      gameSessionIdRef.current = dashboardData.gameSessionId;
      setGameSessionId(dashboardData.gameSessionId);
    }
  }, [dashboardData, sessionCode]);

  const handleFinish = async () => {
    if (session) {
      await endSession(session.id);
    }
    window.location.href = "/facilitator-login";
  };

  // Show loading state while verifying session
  if (isVerifying) {
    return (
      <AppLayout
        headerMode="dashboard"
        showTimer={true}
        transparentBackground={true}
      >
        <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B61FF] mx-auto mb-4"></div>
            <p className="text-lg">Verifying session...</p>
          </div>
        </main>
      </AppLayout>
    );
  }

  // Handle case where session code was provided but verification failed
  if (sessionCode && !isVerified && verificationError) {
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
              <p className="text-sm text-gray-300">{verificationError}</p>
            </div>
            <Button
              variant="primary"
              onClick={() =>
                redirectToError(verificationError || "Invalid session")
              }
              className="!px-6 !py-2"
            >
              Go to Error Page
            </Button>
          </div>
        </main>
      </AppLayout>
    );
  }

  const handleUnlock = async () => {
    if (!isSessionUnlocked) {
      // Show confirmation dialog
      setShowUnlockConfirm(true);
      return;
    }

    // If already unlocked, treat click as Finish (end session)
    await handleFinish();
  };

  const handleConfirmUnlock = async () => {
    try {
      if (!sessionCode) {
        alert("Session code not available");
        return;
      }

      // Call the unlock session API
      const response = await gameService.unlockSession(sessionCode);

      if (response.success) {
        // Session unlocked successfully
        setIsSessionUnlocked(true);
        setShowUnlockConfirm(false);
        setShowQR(true);
      } else {
        alert(`Failed to unlock session: ${response.error}`);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to unlock session";
      alert(`Error: ${errorMsg}`);
    }
  };

  // no header action for unlocking/finishing — control lives in the page buttons below

  return (
    <>
      {/* Full-viewport fixed background so it sits under header/footer */}
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
      >
        <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 space-y-8 font-sans mx-[30px] min-h-screen">
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-6 mb-[6px] mt-[15px]">
            <div className="flex gap-[4px] order-2 sm:order-1 mb-[4px] sm:mb-0">
              <Button
                variant="white"
                onClick={() => setShowQR(true)}
                className="!h-11 flex items-center justify-center mr-[5px] ml-[5px] !text-sm font-medium bg-white shadow-sm hover:bg-gray-50 !px-6 whitespace-nowrap"
              >
                <QrCode className="w-5 h-5 mr-[5px]" />
                <span>QR Code</span>
              </Button>
            </div>
            <Button
              variant={isSessionUnlocked ? "danger" : "primary"}
              onClick={handleUnlock}
              className="!h-14 flex items-center justify-center gap-2 !text-base font-medium !px-8 whitespace-nowrap order-1 mb-[5px] sm:order-2"
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
              <SessionDetails sessionCode={sessionCode || undefined} />
            </div>

            <PlayerProgress sessionCode={sessionCode || undefined} />
          </div>
        </main>

        {/* QR Code Dialog */}
        <QRCodeDialog
          open={showQR}
          onClose={() => {
            setShowQR(false);
          }}
          gameSessionId={gameSessionId || 0}
          sessionCode={sessionCode || undefined}
        />

        {/* Unlock Session Confirmation Dialog */}
        <UnlockSessionDialog
          open={showUnlockConfirm}
          onClose={() => {
            setShowUnlockConfirm(false);
          }}
          onConfirm={handleConfirmUnlock}
        />
      </AppLayout>
    </>
  );
}

export default function FacilitatorDashboard() {
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
      <FacilitatorDashboardContent />
    </Suspense>
  );
}
