"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, Input, Button } from "@/app/components/ui";
import { useAuth } from "@/app/lib/hooks";
import { validators } from "@/app/lib/utils/validators";
import { gameService } from "@/app/lib/api/services/game";

function PlayerLoginContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("");
  const [error, setError] = useState("");
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const { joinGame } = useAuth();
  const searchParams = useSearchParams();

  // Read sessionId and sessionCode from query parameters
  useEffect(() => {
    const sessionId = searchParams?.get("sessionId");
    const sCode = searchParams?.get("sessionCode");
    const pId = searchParams?.get("playerId");

    if (sessionId) {
      const parsedId = parseInt(sessionId, 10);
      if (!isNaN(parsedId)) {
        setGameSessionId(parsedId);
      }
    }
    if (sCode) {
      setSessionCode(sCode);
    }
    if (pId) {
      const parsedPlayerId = parseInt(pId, 10);
      if (!isNaN(parsedPlayerId)) {
        setPlayerId(parsedPlayerId);
      }
    }
  }, [searchParams]);

  const handleLogin = async () => {
    // Validation
    if (!name.trim() || !email.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!validators.isValidName(name.trim())) {
      setError("Name must be 2-50 characters");
      return;
    }

    if (!validators.isValidEmail(email.trim())) {
      setError("Please enter a valid email");
      return;
    }

    if (!language) {
      setError("Please select a language");
      return;
    }

    if (!gameSessionId && !sessionCode) {
      setError("Game session is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Validate session exists if sessionCode is provided
      if (sessionCode) {
        const dashboardResponse = await gameService.getDashboard(sessionCode);
        if (!dashboardResponse.success) {
          setError("Invalid or expired session code. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      // Generate a temporary player ID if not provided
      const tempPlayerId = playerId || Math.floor(Math.random() * 1000000) + 1;

      // Call joinGame API directly - it handles player registration and joining
      const joinResult = await joinGame(
        tempPlayerId,
        name.trim(),
        email.trim(),
        language,
        gameSessionId || 0 // Use 0 as fallback, backend will handle it
      );

      if (!joinResult.success) {
        setError(joinResult.error || "Failed to join game");
        setIsLoading(false);
        return;
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .player-login-bg {
            background-image: url('/assets/small_screens _bg_facilitator_dashboard.jpg') !important;
          }
        }
      `}</style>
      <div
        className="player-login-bg min-h-screen flex flex-col bg-cover bg-center bg-no-repeat text-white"
        style={{ backgroundImage: "url('/assets/background login.png')" }}
      >
        {/* Full screen layout for login pages */}
        <main className="flex flex-col flex-1 items-center justify-center px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center bg-[#1A1C2A] rounded-full w-[145px] h-[145px] mb-4">
              <Image
                src="/assets/Logo_flow.png"
                alt="Flow Logo"
                width={115}
                height={115}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-gray-300 mb-9 text-2xl">Player Login</p>
          </div>

          {/* Login Card */}
          <Card>
            <div className="space-y-10 w-full px-4 sm:px-6 md:px-8 lg:px-10 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3">
                  Enter your details
                </h2>
              </div>

              {/* Input Fields */}
              <div className="space-y-6">
                <div className="flex flex-col">
                  <label className="text-base sm:text-lg md:text-xl font-semibold text-gray-200 mb-[6px] mt-[12px]">
                    Name
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-base sm:text-lg md:text-xl placeholder-gray-400 bg-[#0F111A] rounded-[0.3rem] focus:border-[#7B61FF] focus:ring-2 focus:ring-[#7B61FF] focus:ring-opacity-20 transition-all duration-300 pl-[5px]"
                    style={{ color: "#FFFFFF", borderColor: "#2A2D3D" }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-base sm:text-lg md:text-xl font-semibold text-gray-200 mb-[6px] mt-[12px] ">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-base sm:text-lg md:text-xl placeholder-gray-400 bg-[#0F111A] rounded-[0.3rem] focus:border-[#7B61FF] focus:ring-2 focus:ring-[#7B61FF] focus:ring-opacity-20 transition-all duration-300 pl-[7px]"
                    style={{ color: "#FFFFFF", borderColor: "#2A2D3D" }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-base sm:text-lg md:text-xl font-semibold text-gray-200 mb-[6px] mt-[12px]">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-4 sm:px-5 md:px-6 py-3 sm:py-3 bg-[#0F111A] border-2 border-[#2A2D3D] rounded-[0.3rem] placeholder-gray-400 focus:outline-none focus:border-[#7B61FF] focus:ring-2 focus:ring-[#7B61FF] focus:ring-opacity-20 transition-all duration-300 text-lg sm:text-xl md:text-2xl appearance-none pt-[11px] pb-[11px] pl-[5px] text-white"
                    style={{
                      color: language ? "#FFFFFF" : "#9CA3AF",
                      borderColor: "#2A2D3D",
                    }}
                  >
                    <option value="" className="text-gray-400 bg-[#0F111A] ">
                      Select language
                    </option>
                    <option value="en" className="text-gray-300 bg-[#0F111A]">
                      EN — English
                    </option>
                    <option value="pt" className="text-gray-300 bg-[#0F111A]">
                      PT — Português
                    </option>
                    <option value="es" className="text-gray-300 bg-[#0F111A]">
                      ES — Español
                    </option>
                  </select>
                </div>
              </div>

              {/* Button Section */}
              <div className="pt-4">
                <Button
                  disabled={isLoading}
                  onClick={handleLogin}
                  className="!text-base sm:!text-lg md:!text-xl py-3 sm:py-3 md:py-4 mt-[20px]"
                  width="w-full"
                >
                  {isLoading ? "Joining Game..." : "Join Game"}
                </Button>

                {error && (
                  <div className="text-center mt-[10px] bg-[#ffffff] rounded-[5px] px-[4px] py-[2px]">
                    <span className="text-[#d60000]">{error}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </main>
      </div>
    </>
  );
}

export default function PlayerLogin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayerLoginContent />
    </Suspense>
  );
}
