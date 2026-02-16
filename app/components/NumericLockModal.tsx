"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import { X } from "lucide-react";
import { triggerDialogConfetti } from "../lib/utils/confetti";
import { useGameTranslation } from "@/app/lib/i18n/useGameTranslation";

const lockImg = "/assets/locks/NumericLock-locked.png";
const unlockImg = "/assets/locks/NumericLock-unlocked.png";
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Column configuration: 4 columns with original dial colors and darker borders
const COLUMN_DATA = [
  { type: "numbers", data: NUMBERS, color: "#b84342", borderColor: "#963432" }, // Col 1: Red
  { type: "numbers", data: NUMBERS, color: "#65dd7a", borderColor: "#4fb860" }, // Col 2: Green
  { type: "numbers", data: NUMBERS, color: "#fced56", borderColor: "#e8db4a" }, // Col 3: Yellow
  { type: "numbers", data: NUMBERS, color: "#7eb0fc", borderColor: "#6a9be8" }, // Col 4: Blue
];

interface CodeEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => Promise<void>;
  lockImage?: string;
  physicalCode?: string | null;
  language?: string;
}

export default function CodeEntryModal({
  open,
  onClose,
  onSubmit,
  lockImage,
  physicalCode,
  language = "en",
}: CodeEntryModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { t } = useGameTranslation(language);
  const [scrollOffsets, setScrollOffsets] = useState<number[]>([0, 0, 0, 0]);
  const [selectedValues, setSelectedValues] = useState<string[]>([
    "0",
    "0",
    "0",
    "0",
  ]);
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (open) {
      setIsUnlocked(false);
      setScrollOffsets([0, 0, 0, 0]);
      setSelectedValues(["0", "0", "0", "0"]);
      setError("");
    }
  }, [open]);

  const handleScroll = (columnIdx: number, e: React.WheelEvent) => {
    e.preventDefault();

    setScrollOffsets((prev) => {
      const newOffsets = [...prev];
      const direction = e.deltaY > 0 ? 1 : -1;
      const columnData = COLUMN_DATA[columnIdx];
      let newOffset = newOffsets[columnIdx] + direction;

      // Wrap around
      if (newOffset < 0) {
        newOffset = columnData.data.length - 1;
      } else if (newOffset >= columnData.data.length) {
        newOffset = 0;
      }

      newOffsets[columnIdx] = newOffset;
      setSelectedValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[columnIdx] = columnData.data[newOffset];
        return newValues;
      });
      setError("");

      return newOffsets;
    });
  };

  const handleButtonClick = (columnIdx: number, rowIdx: number) => {
    setScrollOffsets((prev) => {
      const newOffsets = [...prev];
      const columnData = COLUMN_DATA[columnIdx];
      const baseIndex = newOffsets[columnIdx];
      const valueIndex =
        (baseIndex + rowIdx - 1 + columnData.data.length) %
        columnData.data.length;

      newOffsets[columnIdx] = valueIndex;
      setSelectedValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[columnIdx] = columnData.data[valueIndex];
        return newValues;
      });
      setError("");

      return newOffsets;
    });
  };

  const getVisibleValues = (columnIdx: number): string[] => {
    const offset = scrollOffsets[columnIdx];
    const columnData = COLUMN_DATA[columnIdx];
    const visible: string[] = [];

    for (let i = -1; i <= 1; i++) {
      const idx =
        (offset + i + columnData.data.length) % columnData.data.length;
      visible.push(columnData.data[idx]);
    }

    return visible;
  };

  const handleSubmit = async () => {
    const code = selectedValues.join("");
    setIsSubmitting(true);

    try {
      // Call the parent's onSubmit and wait for backend response
      await onSubmit(code);

      // If we get here, the backend accepted the code
      triggerDialogConfetti(dialogRef.current);
      setIsUnlocked(true);
      setError("");
    } catch (err) {
      // Backend rejected the code
      setError(t("modal.incorrectCode"));
      setSelectedValues(["0", "0", "0", "0"]);
      setScrollOffsets([0, 0, 0, 0]);
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
                src={isUnlocked ? unlockImg : lockImage || lockImg}
                alt="Numeric Lock"
                fill
                style={{ objectFit: "contain" }}
                priority
                onLoadingComplete={() => setImageLoaded(true)}
              />

              {/* Overlay Scrollable Picker - 4 columns - Hidden until image loads */}
              {imageLoaded && (
                <div className="absolute left-[125px] top-[225px] flex gap-[1px]">
                  {[0, 1, 2, 3].map((colIdx) => {
                    const visibleValues = getVisibleValues(colIdx);
                    const columnData = COLUMN_DATA[colIdx];
                    return (
                      <div
                        key={colIdx}
                        className="flex flex-col gap-1 items-center"
                        onWheel={(e) => handleScroll(colIdx, e)}
                      >
                        {/* Top spacer (before first visible value) */}
                        <button
                          onClick={() => handleButtonClick(colIdx, 0)}
                          className="w-[28px] h-[40px] flex items-center justify-center text-[25px] font-extrabold rounded-lg transition-all p-[10px]"
                          style={{
                            backgroundColor: columnData.color,
                            border: `4px solid ${columnData.borderColor}`,
                            borderTop: "4px solid " + columnData.color,
                            borderLeft:
                              colIdx === 0
                                ? "none"
                                : `4px solid ${columnData.borderColor}`,
                            borderRight:
                              colIdx === 3
                                ? "none"
                                : `4px solid ${columnData.borderColor}`,
                            borderTopLeftRadius:
                              colIdx === 0 ? "8px" : undefined,
                            borderTopRightRadius:
                              colIdx === 3 ? "8px" : undefined,
                            fontWeight: 900,
                          }}
                        >
                          {visibleValues[0]}
                        </button>

                        {/* Middle row - focused/selected */}
                        <button
                          onClick={() => handleButtonClick(colIdx, 1)}
                          className="w-[28px] h-[40px] flex items-center justify-center text-[29px] font-extrabold rounded-lg opacity-100 transition-all transform scale-105 p-[10px]"
                          style={{
                            backgroundColor: columnData.color,
                            border: `4px solid ${columnData.borderColor}`,
                            borderLeft:
                              colIdx === 0
                                ? "none"
                                : `4px solid ${columnData.borderColor}`,
                            borderRight:
                              colIdx === 3
                                ? "none"
                                : `4px solid ${columnData.borderColor}`,
                            fontWeight: 900,
                          }}
                        >
                          {visibleValues[1]}
                        </button>

                        {/* Bottom spacer (after second visible value) */}
                        <button
                          onClick={() => handleButtonClick(colIdx, 2)}
                          className="w-[28px] h-[40px] flex items-center justify-center text-[25px] font-extrabold rounded-lg transition-all p-[10px]"
                          style={{
                            backgroundColor: columnData.color,
                            border: `4px solid ${columnData.borderColor}`,
                            borderBottom: "4px solid " + columnData.color,
                            borderLeft:
                              colIdx === 0
                                ? "none"
                                : `4px solid ${columnData.borderColor}`,
                            borderRight:
                              colIdx === 3
                                ? "none"
                                : `4px solid ${columnData.borderColor}`,
                            borderBottomLeftRadius:
                              colIdx === 0 ? "8px" : undefined,
                            borderBottomRightRadius:
                              colIdx === 3 ? "8px" : undefined,
                            fontWeight: 900,
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

          {/* Selected Code Display */}

          {/* Error Message with Reserved Space */}
          <div className="h-[24px] flex items-center justify-center mb-[15px]">
            {error && !isUnlocked && (
              <div className="text-red-500 text-sm font-semibold text-center">
                {error}
              </div>
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
            </div>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
}
