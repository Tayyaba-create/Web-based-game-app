"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import { triggerDialogConfetti } from "../lib/utils/confetti";
import { X } from "lucide-react";
import { useGameTranslation } from "@/app/lib/i18n/useGameTranslation";

const unlockImg = "/assets/locks/NumericV1-Unlocked.png";

interface NumericV1ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => Promise<void>;
  lockImage: string;
  physicalCode?: string | null;
  language?: string;
}

const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Row configuration: 3 rows for NumericV1 horizontal layout
const ROW_DATA = [
  { type: "numbers", data: NUMBERS, color: "#b84342" }, // Row 1: Red
  { type: "numbers", data: NUMBERS, color: "#65dd7a" }, // Row 2: Green
  { type: "numbers", data: NUMBERS, color: "#7eb0fc" }, // Row 3: Blue
];

export default function NumericV1Modal({
  open,
  onClose,
  onSubmit,
  lockImage,
  physicalCode,
  language = "en",
}: NumericV1ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { t } = useGameTranslation(language);
  const [scrollOffsets, setScrollOffsets] = useState<number[]>([0, 0, 0]);
  const [selectedValues, setSelectedValues] = useState<string[]>([
    "0",
    "0",
    "0",
  ]);
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleScroll = (rowIdx: number, e: React.WheelEvent) => {
    e.preventDefault();

    setScrollOffsets((prev) => {
      const newOffsets = [...prev];
      const direction = e.deltaY > 0 ? 1 : -1;
      const rowData = ROW_DATA[rowIdx];
      let newOffset = newOffsets[rowIdx] + direction;

      // Wrap around
      if (newOffset < 0) {
        newOffset = rowData.data.length - 1;
      } else if (newOffset >= rowData.data.length) {
        newOffset = 0;
      }

      newOffsets[rowIdx] = newOffset;
      setSelectedValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[rowIdx] = rowData.data[newOffset];
        return newValues;
      });

      return newOffsets;
    });
  };

  const handleButtonClick = (rowIdx: number, colIdx: number) => {
    setScrollOffsets((prev) => {
      const newOffsets = [...prev];
      const rowData = ROW_DATA[rowIdx];
      const baseIndex = newOffsets[rowIdx];
      const valueIndex =
        (baseIndex + colIdx - 1 + rowData.data.length) % rowData.data.length;

      newOffsets[rowIdx] = valueIndex;
      setSelectedValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[rowIdx] = rowData.data[valueIndex];
        return newValues;
      });

      return newOffsets;
    });
  };

  const getVisibleValues = (rowIdx: number): string[] => {
    const offset = scrollOffsets[rowIdx];
    const rowData = ROW_DATA[rowIdx];
    const visible: string[] = [];

    for (let i = -1; i <= 1; i++) {
      const idx = (offset + i + rowData.data.length) % rowData.data.length;
      visible.push(rowData.data[idx]);
    }

    return visible;
  };

  const handleSubmit = async () => {
    const code = selectedValues.join("");
    setIsSubmitting(true);

    try {
      await onSubmit(code);
      triggerDialogConfetti(dialogRef.current);
      setIsUnlocked(true);
    } catch (err) {
      setError(t("modal.incorrectCode"));
      setSelectedValues(["0", "0", "0"]);
      setScrollOffsets([0, 0, 0]);
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {/* Lock Image with Overlay Picker */}
          <div className="flex justify-center mb-8">
            <div className="relative mb-[15px] w-[350px] h-[350px] mx-auto">
              {/* Skeleton Loading State */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1C2A] via-[#262833] to-[#1A1C2A] rounded-lg animate-pulse" />
              )}

              <Image
                src={isUnlocked ? unlockImg : lockImage}
                alt="NumericV1 Lock"
                fill
                style={{ objectFit: "contain" }}
                priority
                onLoadingComplete={() => setImageLoaded(true)}
              />

              {/* Overlay Scrollable Picker - 3 rows horizontal layout - Hidden until image loads */}
              {imageLoaded && (
                <div className="absolute top-[204px] left-[190px] flex flex-col gap-[1px]">
                  {[0, 1, 2].map((rowIdx) => {
                    const visibleValues = getVisibleValues(rowIdx);
                    return (
                      <div
                        key={rowIdx}
                        className="flex gap-[0px] items-center"
                        onWheel={(e) => handleScroll(rowIdx, e)}
                      >
                        {/* Left spacer (before first visible value) */}
                        <button
                          onClick={() => handleButtonClick(rowIdx, 0)}
                          className={`h-[24px] w-[27px] flex items-center justify-center text-xs transition-all border-t-[2px] border-b-[2px] border-l-[3px] border-r-[2px] border-t-[#faf8f9] border-b-[#faf8f9] border-l-[#666570] border-r-[#606060] text-[16px] mb-[7px] py-[2px] px-0 rounded-l-[5px] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.3)]`}
                          style={{
                            fontWeight: 700,
                            fontFamily: '"Orbitron", sans-serif',
                            backgroundImage:
                              "linear-gradient(135deg, #ffffff 0%, #494949ff 20%, #b8b8b8 50%, #909090 80%, #c0c0c0 100%)",
                          }}
                        >
                          {visibleValues[0]}
                        </button>

                        {/* Middle row - focused/selected */}
                        <button
                          onClick={() => handleButtonClick(rowIdx, 1)}
                          className="h-[24px] w-[27px] flex items-center justify-center text-xs opacity-100 transition-all transform scale-105 text-[20px] py-[2px] px-0 border-t-[2px] border-b-[2px] border-l-[3px] border-r-[2px] border-t-[#faf8f9] border-b-[#faf8f9] mb-[7px] border-l-[#f0f0f0] border-r-[#505050] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.9),inset_-1px_-1px_3px_rgba(0,0,0,0.5),0_3px_6px_rgba(0,0,0,0.4)]"
                          style={{
                            fontWeight: 700,
                            fontFamily: '"Orbitron", sans-serif',
                            backgroundImage:
                              "linear-gradient(135deg, #ffffff 0%, #f0f0f0ff 15%, #c8c8c8 45%, #a8a8a8 75%, #d0d0d0 100%)",
                          }}
                        >
                          {visibleValues[1]}
                        </button>

                        {/* Right spacer (after second visible value) */}
                        <button
                          onClick={() => handleButtonClick(rowIdx, 2)}
                          className={`h-[24px] w-[27px] flex items-center justify-center text-xs transition-all border-t-[2px] border-b-[2px] border-r-[3px] border-l-[2px] border-t-[#faf8f9] border-b-[#faf8f9] border-l-[#606060] border-r-[#666570] mb-[7px] text-[16px] py-[2px] px-0 rounded-r-[7px] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.3)]`}
                          style={{
                            fontWeight: 700,
                            fontFamily: '"Orbitron", sans-serif',
                            backgroundImage:
                              "linear-gradient(135deg, #ffffff 0%, #494949ff 20%, #b8b8b8 50%, #909090 80%, #c0c0c0 100%)",
                          }}
                        >
                          {visibleValues[2]}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Error Message with Reserved Space */}
          <div className="h-[24px] flex items-center justify-center mb-[15px]">
            {error && !isUnlocked && (
              <div className="text-red-500 text-sm font-semibold text-center">
                {error}
              </div>
            )}
          </div>

          {/* Submit Button - Hidden until image loads */}
          {imageLoaded && (
            <div className="flex justify-center mb-[30px]">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isUnlocked}
                className="bg-[#7B61FF] hover:bg-[#6A50DD] text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? t("modal.verifying")
                  : isUnlocked
                    ? t("modal.unlocked")
                    : t("modal.submitCode")}
              </Button>
            </div>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
}
