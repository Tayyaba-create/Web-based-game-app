import React from "react";

interface ProgressBarProps {
  unlockedChests: number[];
  totalChests?: number;
}

export default function ProgressBar({
  unlockedChests,
  totalChests = 16,
}: ProgressBarProps) {
  const progressPercentage = (unlockedChests.length / totalChests) * 100;

  return (
    <div className="w-full px-0 py-4 mt-[40px]">
      <div
        className="relative w-full h-[20px] bg-[#0F1125] my-[5px] box-border"
        style={{ boxShadow: "inset 0 0 0 3px #3A8DFF" }}
      >
        {/* Progress Bar Fill */}
        <div
          className="h-full bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] transition-all duration-500 ease-in-out relative"
          style={{
            width: `${progressPercentage}%`,
          }}
        />

        {/* Progress Circle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-[#0F1125] mt-[15px] mb-[60px] rounded-full border-[2px] border-[#3A8DFF] flex items-center justify-center transition-all duration-500 ease-in-out overflow-visible"
          style={{
            left: `calc(${progressPercentage}% - 10px)`,
            boxShadow: "0 0 30px #3A8DFF",
          }}
        >
          <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF]" />
          <div className="absolute text-white font-bold text-2xl px-6">
            {Math.round(progressPercentage)}%
          </div>
        </div>
      </div>
    </div>
  );
}
