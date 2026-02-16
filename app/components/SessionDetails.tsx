"use client";

import { useSession } from "@/app/lib/hooks";
import type { DashboardPlayer } from "@/app/lib/hooks/useDashboard";

interface SessionDetailsProps {
  sessionCode?: string;
  players?: DashboardPlayer[];
}

export const SessionDetails = ({
  sessionCode: propSessionCode,
  players: propsPlayers = [],
}: SessionDetailsProps = {}) => {
  const { session } = useSession();

  // Use prop sessionCode as fallback
  const effectiveSessionCode = propSessionCode || session?.code;

  const statusColor = (status?: string) => {
    if (!status) return "text-gray-300";
    switch (status) {
      case "active":
      case "Active":
        return "text-[#7CE3FF] font-semibold"; // neon blue/cyan for Active
      case "completed":
      case "Completed":
        return "text-yellow-400 font-semibold";
      case "pending":
      case "Pending":
        return "text-[#FFD60A] font-semibold"; // neon yellow-ish
      default:
        return "text-gray-300 font-semibold";
    }
  };

  const sessionCode = session?.code || session?.id;
  const playersJoined = propsPlayers?.length || 0;
  const status = session?.status;

  // Map status number to string if needed
  const statusValue = String(status || "");
  const statusDisplay =
    statusValue === "1" || statusValue === "active"
      ? "Active"
      : statusValue === "2"
      ? "Completed"
      : statusValue === "0"
      ? "Pending"
      : "Active";

  return (
    <div className="bg-[#0D0F1A] text-white rounded-[0.8rem] border border-[#23263A] shadow-lg mx-auto max-w-7xl overflow-hidden p-[10px]">
      <h2 className="text-xs sm:text-sm md:text-base font-semibold text-[#7CE3FF] mb-[6px] border-l-4 border-[#7B61FF] pl-[8px]">
        Session Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[6px]">
        <div className="bg-[#0e1020] rounded-[1px] p-[8px]">
          <p className="text-gray-400 text-xs mb-[4px]">Session Code</p>
          <p className="text-white font-semibold truncate text-xs">
            {sessionCode ?? "—"}
          </p>
        </div>
        <div className="bg-[#0e1020] rounded-[1px] p-[8px]">
          <p className="text-gray-400 text-xs mb-[4px]">Status</p>
          <p className={`${statusColor(statusDisplay)} text-xs`}>
            {statusDisplay}
          </p>
        </div>
        <div className="bg-[#0e1020] rounded-[1px] p-[8px]">
          <p className="text-gray-400 text-xs mb-[4px]">Players Joined</p>
          <p className="font-semibold text-xs">{playersJoined}</p>
        </div>
      </div>
    </div>
  );
};
