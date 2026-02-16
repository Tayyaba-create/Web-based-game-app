"use client";

import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

interface AppLayoutProps {
  children: ReactNode;
  headerMode?: "default" | "game" | "dashboard";
  playerName?: string;
  showTimer?: boolean;
  showLanguage?: boolean;
  transparentBackground?: boolean;
  customActions?: React.ReactNode;
  sessionCreated?: string;
  sessionUnlockedAt?: string;
  sessionDuration?: number;
  sessionCode?: string;
}

export const AppLayout = ({
  children,
  headerMode = "default",
  playerName,
  showTimer = false,
  showLanguage = false,
  transparentBackground = false,
  customActions,
  sessionCreated,
  sessionUnlockedAt,
  sessionDuration = 60,
  sessionCode,
}: AppLayoutProps) => {
  return (
    <div
      className={`min-h-screen flex flex-col ${
        transparentBackground ? "bg-transparent" : "bg-[#0F1125]"
      }`}
    >
      <AppHeader
        mode={headerMode}
        playerName={playerName}
        showTimer={showTimer}
        showLanguage={showLanguage}
        customActions={customActions}
        sessionCreated={sessionCreated}
        sessionUnlockedAt={sessionUnlockedAt}
        sessionCode={sessionCode}
        sessionDuration={sessionDuration}
      />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
};
