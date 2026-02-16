"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/components/ui/dialog";
import { gameService } from "@/app/lib/api/services/game";
import type { PlayerStats, PlayerActivityItem } from "@/app/types/game";

interface Riddle {
  id: number;
  name: string;
  visited: boolean;
  solved: boolean;
  attempts: number;
}

interface PlayerDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  playerName: string;
  playerEmail?: string;
  riddleData: Riddle[];
  sessionCode?: string;
  playerId?: number | string;
}

export const PlayerDetailsDialog = ({
  open,
  onClose,
  playerName,
  playerEmail,
  riddleData,
  sessionCode,
  playerId,
}: PlayerDetailsDialogProps) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [activityItems, setActivityItems] = useState<PlayerActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch real player activity data
  useEffect(() => {
    if (open && sessionCode && playerId) {
      const fetchPlayerActivity = async () => {
        try {
          setIsLoading(true);
          setError(null);

          const response = await gameService.getPlayerActivity(
            sessionCode,
            playerId,
          );

          if (response.success && response.data) {
            setPlayerStats(response.data.playerStats);
            setActivityItems(response.data.playersProgress);
          } else {
            setError(
              (response as any)?.error || "Failed to load player activity",
            );
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : "Unknown error";
          setError(errorMsg);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPlayerActivity();
    }
  }, [open, sessionCode, playerId]);

  // Use API data if available, otherwise fall back to props data
  const totalRiddles = playerStats?.total ?? riddleData.length;
  const solvedRiddles =
    playerStats?.solved ?? riddleData.filter((r) => r.solved).length;
  const visitedRiddles =
    playerStats?.unSolved ?? riddleData.filter((r) => r.visited).length;

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="relative rounded-[10px] p-[30px] sm:p-[24px] md:p-[28px] bg-[#0D0F1A] border border-[#23263A] text-white shadow-2xl w-[75vw] sm:w-[90vw] md:w-[80vw] lg:w-[400px] max-h-[85vh] overflow-y-auto\">
        {/* Close Button - Top Right */}
        <X
          onClick={onClose}
          className="absolute top-[15px] right-[15px] w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        />

        {/* Header */}
        <DialogHeader>
          <div className="mb-[4px]">
            <div className="text-xs sm:text-sm font-extrabold text-white mb-[1px] break-words truncate">
              {playerName}
            </div>
            {playerEmail && (
              <p className="text-gray-400 text-xs break-all truncate">
                {playerEmail}
              </p>
            )}
          </div>
        </DialogHeader>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-[8px] mb-[8px]">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B61FF]"></div>
              <p className="ml-3 text-gray-400">Loading player data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="mt-[8px] mb-[8px]">
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400 text-sm">Error loading data:</p>
              <p className="text-red-300 text-xs mt-2">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <div className="mt-[12px]">
            {/* Statistics */}
            <div className="mb-[16px]">
              <h3 className="text-xs sm:text-sm font-semibold text-[#7CE3FF] mb-[10px] border-l-4 border-[#7B61FF] pl-[8px]">
                Statistics
              </h3>
              <div className="grid grid-cols-3 gap-[8px] sm:gap-[10px]">
                <div className="bg-[#1A1C2A] border border-[#23263A] rounded-[8px] p-[10px] sm:p-[12px] text-center hover:border-[#7B61FF] transition-colors cursor-pointer">
                  <div className="text-base sm:text-lg font-bold text-[#7B61FF] mb-[4px]">
                    {solvedRiddles}
                  </div>
                  <p className="text-gray-400 text-xs leading-tight">
                    Boxes Solved
                  </p>
                </div>
                <div className="bg-[#1A1C2A] border border-[#23263A] rounded-[8px] p-[10px] sm:p-[12px] text-center hover:border-[#7B61FF] transition-colors cursor-pointer">
                  <div className="text-base sm:text-lg font-bold text-[#3A8DFF] mb-[4px]">
                    {visitedRiddles}
                  </div>
                  <p className="text-gray-400 text-xs leading-tight">
                    Boxes Visited
                  </p>
                </div>
                <div className="bg-[#1A1C2A] border border-[#23263A] rounded-[8px] p-[10px] sm:p-[12px] text-center hover:border-[#7B61FF] transition-colors cursor-pointer">
                  <div className="text-base sm:text-lg font-bold text-[#FFD60A] mb-[4px]">
                    {totalRiddles}
                  </div>
                  <p className="text-gray-400 text-xs leading-tight">
                    Total Boxes
                  </p>
                </div>
              </div>
            </div>

            {/* Box Activity - From API Data */}
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-[#7CE3FF] mb-[10px] border-l-4 border-[#7B61FF] pl-[8px]">
                Box Activity
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-[8px] sm:gap-[10px]">
                {activityItems && activityItems.length > 0 ? (
                  activityItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#1A1C2A] border border-[#23263A] rounded-[8px] p-[12px] sm:p-[14px] hover:border-[#7B61FF] transition-colors flex flex-col justify-between min-h-[85px] sm:min-h-[95px]"
                    >
                      <div className="mb-[6px]">
                        <p className="text-[#7CE3FF] font-bold text-sm sm:text-base">
                          Box {item.activeBox}
                        </p>
                      </div>
                      <div className="text-gray-400 text-xs space-y-[3px]">
                        <p>Attempt: {item.attempt}</p>
                        <p>
                          <span className="text-white font-semibold">
                            Status:{" "}
                          </span>
                          <span
                            className={`font-semibold ${
                              item.solved === "Yes"
                                ? "text-[#39FF14]"
                                : "text-[#FFD60A]"
                            }`}
                          >
                            {item.solved}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs text-center py-6 col-span-2 sm:col-span-3">
                    No activity data available
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
