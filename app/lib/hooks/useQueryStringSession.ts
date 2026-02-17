// Custom hook for verifying session from query string
"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/app/lib/api/services/auth";
import { useSessionStore } from "@/app/lib/store/sessionStore";

interface QueryStringSessionVerificationState {
  isVerifying: boolean;
  isVerified: boolean;
  error: string | null;
  sessionCode: string | null;
}

export const useQueryStringSession = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSession } = useSessionStore();

  const [state, setState] = useState<QueryStringSessionVerificationState>({
    isVerifying: true,
    isVerified: false,
    error: null,
    sessionCode: null,
  });

  const verifyFromQueryString = useCallback(async () => {
    try {
      // Get session code from URL query parameters
      // Support multiple possible parameter names
      const sessionCode =
        searchParams.get("sessionCode") ||
        searchParams.get("code") ||
        searchParams.get("session");

      if (!sessionCode) {
        setState({
          isVerifying: false,
          isVerified: false,
          error: "No session code provided in URL",
          sessionCode: null,
        });
        return false;
      }

      setState((prev) => ({
        ...prev,
        isVerifying: true,
        sessionCode,
      }));

      // Call the verification API
      const response = await authService.verifySessionCode(sessionCode);

      if (response.success && response.data) {
        // Store session data - ensure code is set
        const sessionData = response.data;
        if (!sessionData.code) {
          sessionData.code = sessionCode;
        }
        setSession(sessionData);

        setState({
          isVerifying: false,
          isVerified: true,
          error: null,
          sessionCode,
        });

        return true;
      } else {
        setState({
          isVerifying: false,
          isVerified: false,
          error: (response as any)?.error || "Failed to verify session",
          sessionCode,
        });

        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      setState({
        isVerifying: false,
        isVerified: false,
        error: errorMessage,
        sessionCode: null,
      });

      return false;
    }
  }, [searchParams, setSession]);

  const redirectToLogin = useCallback(() => {
    router.push("/facilitator-login");
  }, [router]);

  const redirectToError = useCallback(
    (errorCode?: string) => {
      const errorParam = errorCode
        ? `?error=${encodeURIComponent(errorCode)}`
        : "";
      router.push(`/session-error${errorParam}`);
    },
    [router],
  );

  return {
    ...state,
    verifyFromQueryString,
    redirectToLogin,
    redirectToError,
  };
};
