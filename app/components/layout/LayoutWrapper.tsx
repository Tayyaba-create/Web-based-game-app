"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppLayout } from "./AppLayout";

interface LayoutWrapperProps {
  children: ReactNode;
}

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const pathname = usePathname();

  // Pages that should NOT have the app layout (full screen custom layouts)
  const noLayoutPages = [
    "/facilitator-login",
    "/playerlogin",
    "/game",
    "/facilitator-dashboard",
  ];

  const shouldShowLayout = !noLayoutPages.some((page) =>
    pathname?.startsWith(page)
  );

  if (shouldShowLayout) {
    return <AppLayout>{children}</AppLayout>;
  }

  return <>{children}</>;
};
