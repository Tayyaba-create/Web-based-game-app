"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { X, Eye, EyeOff } from "lucide-react";
import { authService } from "@/app/lib/api/services/auth";
import { useGameTranslation } from "@/app/lib/i18n/useGameTranslation";

interface VideoDialogProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
  password: string;
  language?: string;
}

type DialogStage = "password" | "video";

export default function VideoDialog({
  open,
  onClose,
  videoUrl,
  language = "en",
}: VideoDialogProps) {
  const { t } = useGameTranslation(language);
  const [stage, setStage] = useState<DialogStage>("password");
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmitPassword = async () => {
    setError("");

    if (!inputPassword) {
      setError(t("videoDialog.passwordRequired"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.verifyPassword(inputPassword);

      if (response.success) {
        setStage("video");
      } else {
        setError(response.error || t("videoDialog.incorrectPassword"));
        setInputPassword("");
      }
    } catch {
      setError(t("videoDialog.passwordVerifyError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmitPassword();
    }
  };

  const handleClose = () => {
    setStage("password");
    setInputPassword("");
    setError("");
    onClose();
  };

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .video-dialog-content {
            width: 84vw !important;
            max-width: 78vw !important;
            padding: 37px !important;
          }
        }
      `}</style>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent className="video-dialog-content relative rounded-[10px] p-[28px] sm:p-10 bg-[#12142A] border border-[#1E2144] text-white shadow-2xl text-center w-full sm:max-w-2xl">
          {/* Close Button */}
          <X
            onClick={handleClose}
            className="absolute top-[15px] right-[15px] w-6 h-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
          />

          {stage === "password" ? (
            <>
              {/* Password Stage */}
              <DialogHeader>
                <DialogTitle>
                  <span className="text-2xl font-bold text-center text-white block">
                    {t("videoDialog.enterPassword")}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col items-center text-center space-y-4 ">
                <p className="text-base text-gray-300 px-6 leading-relaxed mb-[25px] font-medium">
                  {t("videoDialog.videoPasswordProtected")}
                </p>

                {/* Password Input Field */}
                <div className="w-full max-w-md relative">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t("videoDialog.passwordPlaceholder")}
                      autoFocus
                      className="w-full !px-[0px] !py-3 pr-[45px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-[5px] top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors focus:outline-none bg-transparent border-0 p-0 cursor-pointer"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          className="w-5 h-5 stroke-2 text-white"
                          style={{ color: "white" }}
                        />
                      ) : (
                        <Eye
                          className="w-5 h-5 stroke-2 text-white"
                          style={{ color: "white" }}
                        />
                      )}
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <p className="text-red-400 text-sm mt-3 font-medium">
                      {error}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  variant="primary"
                  onClick={handleSubmitPassword}
                  disabled={isLoading}
                  className="w-full max-w-md !px-8 !py-3 mt-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? t("videoDialog.verifyingPassword")
                    : t("videoDialog.submitPassword")}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Video Stage */}
              <div className="flex flex-col items-center text-center space-y-6 mt-6 w-full">
                {/* Video Player */}
                <div className="w-full flex justify-center">
                  <div
                    className="relative w-full bg-black rounded-lg overflow-hidden border-2 border-[#2F3260]"
                    style={{
                      maxWidth: "600px",
                      aspectRatio: "3/2",
                      width: "100%",
                      height: "auto",
                    }}
                  >
                    <video
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      style={{
                        maxHeight: "60vw",
                        minHeight: "180px",
                        background: "black",
                      }}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
