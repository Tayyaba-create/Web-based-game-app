"use client";

import confetti from "canvas-confetti";

export function triggerConfetti(): void {
  if (typeof window !== "undefined") {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}

export function triggerDialogConfetti(
  containerElement: HTMLElement | null
): void {
  if (!containerElement || typeof window === "undefined") return;

  const rect = containerElement.getBoundingClientRect();
  const centerX = (rect.left + rect.right) / 2 / window.innerWidth;
  const centerY = (rect.top + rect.bottom) / 2 / window.innerHeight;

  confetti({
    particleCount: 100,
    spread: 90,
    origin: { x: centerX, y: centerY },
  });
}
