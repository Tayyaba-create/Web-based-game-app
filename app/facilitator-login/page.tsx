"use client";

import Image from "next/image";
import { Card, Input, Button } from "@/app/components/ui";
import { useAuth } from "@/app/lib/hooks";
import { useState } from "react";
import { validators } from "@/app/lib/utils/validators";

export default function FacilitatorLogin() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { verifySession } = useAuth();

  const handleLogin = async () => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Validation
    if (!code.trim()) {
      setError("Please enter a session code");
      return;
    }

    setIsLoading(true);

    // Verify session code
    const result = await verifySession(code.trim());

    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "Invalid session code");
    } else {
      setSuccess("Session verified successfully!");
      // Clear the input after successful verification
      setCode("");
      // Navigation happens in the hook
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .facilitator-login-bg {
            background-image: url('/assets/small_screens _bg_facilitator_dashboard.jpg') !important;
          }
        }
      `}</style>
      <div
        className="facilitator-login-bg min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/background login.png')" }}
      >
        {/* Full screen layout for login pages */}
        <main className="flex flex-col flex-1 items-center justify-center px-4 py-8">
          {/* Title Section */}
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
            <p className="text-gray-300 mb-9 text-xl">Facilitator Login</p>
          </div>

          {/* Card Section */}
          <Card>
            <div className="space-y-10 w-full">
              {/* Subtitle */}
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Enter authorization code
                </h2>
              </div>

              {/* Input */}
              <div className="space-y-6">
                <Input
                  placeholder="Enter your code here"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  style={{ color: "#FFFFFF", borderColor: "#2A2D3D" }}
                />
              </div>

              {/* Button */}
              <div className="space-y-6 pt-4">
                <Button
                  onClick={handleLogin}
                  width="w-full"
                  className="mt-[10px] text-white "
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Session"}
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-center mt-6 bg-[#ffffff] rounded-[5px] px-4 py-2">
                  <p className="text-xs font-medium text-[#d60000]">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="text-center mt-6 bg-[#ffffff] rounded-[5px] px-4 py-2">
                  <p className="text-xs font-medium text-[#008000]">
                    {success}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </main>
      </div>
    </>
  );
}
