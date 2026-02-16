/**
 * Calculate remaining time for a session (counts down in real-time)
 * @param sessionUnlockedAt - UTC timestamp when session was unlocked
 * @param sessionDuration - Total session duration in minutes (default: 60)
 * @returns Remaining minutes in MM:SS format
 */
export const calculateRemainingTime = (
  sessionCreated: string | null | undefined,
  sessionUnlockedAt: string | null | undefined,
  sessionDuration: number = 60
): string => {
  // If session not unlocked yet, return full duration
  if (!sessionUnlockedAt) {
    return `${sessionDuration.toString().padStart(2, "0")}:00`;
  }

  try {
    // Helper function to parse timestamp robustly
    const parseTimestamp = (timestamp: string): Date => {
      // Handle formats like "2025-12-21T17:37:47.66" and "2025-12-21T17:37:47.660Z"
      let normalizedTimestamp = timestamp.trim();

      // If it doesn't have Z or timezone offset, add Z
      if (
        !normalizedTimestamp.includes("Z") &&
        !normalizedTimestamp.includes("+")
      ) {
        // Fix incomplete milliseconds (e.g., ".66" -> ".660")
        const parts = normalizedTimestamp.split(".");
        if (parts.length === 2) {
          const [datePart, fracPart] = parts;
          // Pad milliseconds to 3 digits
          const paddedFrac = (fracPart + "000").substring(0, 3);
          normalizedTimestamp = `${datePart}.${paddedFrac}Z`;
        } else {
          normalizedTimestamp += "Z";
        }
      }

      return new Date(normalizedTimestamp);
    };

    // Calculate remaining time from NOW (real-time countdown)
    const unlockedTime = parseTimestamp(sessionUnlockedAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedMs = currentTime - unlockedTime;
    const elapsedMinutes = elapsedMs / 1000 / 60;

    const remainingMinutes = Math.max(0, sessionDuration - elapsedMinutes);
    const minutes = Math.floor(remainingMinutes);
    const seconds = Math.round((remainingMinutes - minutes) * 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } catch (error) {
    return `${sessionDuration.toString().padStart(2, "0")}:00`;
  }
};
