"use client";

import { Clock } from "lucide-react";
import { useTimer } from "@/app/lib/hooks/useTimer";

interface HeaderProps {
  playerName: string;
}

export const Header = ({ playerName }: HeaderProps) => {
  const { formatted } = useTimer({ autoStart: true });

  return (
    <header className="w-full bg-[#0F1125] text-white border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center px-6 py-4 gap-4">
        {/* Left: Player Name */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400 tracking-wide text-left">
          {playerName}
        </h1>

        {/* Center: Timer */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg ">
            <Clock className="w-5 h-5 text-gray-300 mr-[10px]" />
            <span className="font-mono text-gray-100 font-semibold text-lg">
              {formatted}
            </span>
          </div>
        </div>

        {/* Right: Language Selector */}
        <div className="flex justify-end">
          <select
            className="p-[10px]
                       text-white rounded-md border border-gray-700
                       px-5 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500
                       hover:border-purple-400 transition-all duration-300"
          >
            <option value="en">EN — English</option>
            <option value="pt">PT — Português</option>
            <option value="fr">FR — Français</option>
          </select>
        </div>
      </div>
    </header>
  );
};
