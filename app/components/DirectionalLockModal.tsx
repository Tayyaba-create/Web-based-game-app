"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import {
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Delete,
} from "lucide-react";
import { triggerDialogConfetti } from "../lib/utils/confetti";
import { useGameTranslation } from "@/app/lib/i18n/useGameTranslation";

const lockImg = "/assets/locks/Directional-locked.png";
const unlockImg = "/assets/locks/Directional-unlocked.png";

interface DirectionalLockModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => Promise<void>;
  lockImage?: string;
  unlockImage?: string;
  physicalCode?: string | null;
  language?: string;
}

const DIRECTION_MAP = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

export default function DirectionalLockModal({
  open,
  onClose,
  onSubmit,
  lockImage,
  unlockImage,
  physicalCode,
  language = "en",
}: DirectionalLockModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { t } = useGameTranslation(language);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDirectionClick = (direction: keyof typeof DIRECTION_MAP) => {
    const directionSymbol = DIRECTION_MAP[direction];
    const newInput = input + directionSymbol;
    setInput(newInput);
    setError("");
  };

  const convertDirectionsToLetters = (directionInput: string): string => {
    // Map arrow symbols to letters
    const letterMap: { [key: string]: string } = {
      "↑": "u",
      "↓": "d",
      "←": "l",
      "→": "r",
    };

    return directionInput
      .split("")
      .map((char) => letterMap[char] || char)
      .join("")
      .toUpperCase(); // Convert to uppercase to match database format
  };

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError(t("modal.pleaseEnterDirectionSequence"));
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert arrow symbols to letters (u, r, d, l)
      const letterCode = convertDirectionsToLetters(input);

      // Submit the letter code to backend for verification
      await onSubmit(letterCode);
      triggerDialogConfetti(dialogRef.current);
      setIsUnlocked(true);
      setError("");
    } catch (err) {
      setError(t("modal.incorrectCode"));
      setInput("");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (open) {
      setInput("");
      setError("");
      setIsUnlocked(false);
      setImageLoaded(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <div ref={dialogRef}>
        <DialogContent className="relative rounded-[10px] bg-black p-[6px] border border-[#1E2144] text-white shadow-2xl text-center w-[350px]">
          <div className="flex justify-end mb-4 px-2 relative">
            <div
              className={`absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-[#7B61FF] to-[#6A50DD] rounded-full ${
                isUnlocked ? "animate-pulse" : ""
              }`}
            />
            <X
              onClick={onClose}
              className="relative z-10 w-6 h-6 text-gray-400 hover:text-[#7B61FF] transition-colors cursor-pointer"
            />
          </div>

          {/* Physical Code Display - Red bold text below X icon */}
          {isUnlocked && physicalCode && (
            <div className="mb-6 animate-fade-in-slide-down">
              <p className="text-lg font-bold text-[#FF0000] tracking-wider animate-pulse-slow">
                {t("modal.congratulation")}
              </p>
              <p
                className="text-lg font-bold text-[#FF0000] tracking-wider animate-pulse-slow"
                style={{ animationDelay: "0.1s" }}
              >
                {t("modal.yourPhysicalCodeIs")}
              </p>
              <p
                className="text-3xl font-bold text-[#FF0000] mt-2 tracking-wider animate-bounce-slow"
                style={{ animationDelay: "0.2s" }}
              >
                {physicalCode}
              </p>
            </div>
          )}

          {/* Lock Image with Directional Buttons Overlay */}
          <div className="flex justify-center mb-8">
            <div className="relative mb-[15px] w-[300px] h-[300px] mx-auto">
              {/* Skeleton Loading State */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1C2A] via-[#262833] to-[#1A1C2A] rounded-lg animate-pulse" />
              )}

              <Image
                src={
                  isUnlocked ? unlockImage || unlockImg : lockImage || lockImg
                }
                alt="Directional Lock"
                fill
                style={{ objectFit: "contain" }}
                priority
                onLoadingComplete={() => setImageLoaded(true)}
              />

              {/* Up Button - Hidden until image loads */}
              {!isUnlocked && imageLoaded && (
                <button
                  onClick={() => handleDirectionClick("up")}
                  className="absolute top-[140px] left-[145px] transform -translate-x-1/2 bg-[#fff] hover:bg-[#6A50DD] text-transparent p-2 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 opacity-0"
                  aria-label="Direction Up"
                >
                  <ArrowUp size={18} />
                </button>
              )}

              {/* Down Button */}
              {!isUnlocked && (
                <button
                  onClick={() => handleDirectionClick("down")}
                  className="absolute bottom-[20px] left-[145px] transform -translate-x-1/2 bg-[#7B61FF] hover:bg-[#6A50DD] text-transparent p-2 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 opacity-0"
                  aria-label="Direction Down"
                >
                  <ArrowDown size={18} />
                </button>
              )}

              {/* Left Button */}
              {!isUnlocked && (
                <button
                  onClick={() => handleDirectionClick("left")}
                  className="absolute left-[70px] top-[205] transform -translate-y-1/2 bg-[#7B61FF] hover:bg-[#6A50DD] text-transparent p-2 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 opacity-0"
                  aria-label="Direction Left"
                >
                  <ArrowLeft size={18} />
                </button>
              )}

              {/* Right Button */}
              {!isUnlocked && (
                <button
                  onClick={() => handleDirectionClick("right")}
                  className="absolute right-[85px] top-[205px] transform -translate-y-1/2 bg-[#7B61FF] hover:bg-[#6A50DD] text-transparent p-2 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 opacity-0"
                  aria-label="Direction Right"
                >
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Selected Code Display / Error Message */}
          <div className="text-center h-[24px] flex items-center justify-center mb-[15px]">
            {error && !isUnlocked ? (
              <div className="text-red-500 text-sm font-semibold text-center">
                {error}
              </div>
            ) : (
              <p className="text-base font-bold text-[#FFFFFF]">{input}</p>
            )}
          </div>

          {/* Action Buttons - Hidden until image loads */}
          {imageLoaded && (
            <div className="flex justify-center gap-[5px] mb-[30px]">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isUnlocked}
              >
                {isSubmitting
                  ? t("modal.verifying")
                  : isUnlocked
                    ? t("modal.unlocked")
                    : t("modal.submitCode")}
              </Button>
              <Button
                onClick={() => setInput((prev) => prev.slice(0, -1))}
                disabled={input.length === 0 || isUnlocked}
                variant="danger"
                className="w-10 h-10 p-0 text-[#ffffff] "
              >
                <Delete size={24} />
              </Button>
            </div>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
}
