import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import RootLayoutClient from "./layout-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flow Game - Interactive Learning Platform",
  description: "Join immersive game-based learning sessions with Flow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={
        {
          "--font-geist-sans": geistSans.variable,
          "--font-geist-mono": geistMono.variable,
        } as Record<string, string>
      }
    >
      <head>
        <Script
          src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className="bg-background text-textPrimary font-orbitron"
        suppressHydrationWarning
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
