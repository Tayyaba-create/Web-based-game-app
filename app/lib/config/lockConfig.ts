/**
 * Lock configuration mapping each chest box to its lock type and image
 */

export type LockType =
  | "numeric"
  | "directional"
  | "numericV1"
  | "word"
  | "numericV2"
  | "wordML";

interface LockConfig {
  box: number;
  type: LockType;
  image: string;
  unlockImage?: string; // Optional unlock image path
  directionalVariant?: "red" | "blue"; // For directional locks
}

export const LOCK_CONFIGURATIONS: LockConfig[] = [
  // Numeric locks (Box 1-3)
  { box: 1, type: "numeric", image: "/assets/locks/NumericLock-locked.png" },
  { box: 2, type: "numeric", image: "/assets/locks/NumericLock-locked.png" },
  { box: 3, type: "numeric", image: "/assets/locks/NumericLock-locked.png" },

  // Directional locks (Box 4-6)
  {
    box: 4,
    type: "directional",
    image: "/assets/locks/Directional-locked.png",
    unlockImage: "/assets/locks/Directional-unlocked.png",
    directionalVariant: "red",
  },
  {
    box: 5,
    type: "directional",
    image: "/assets/locks/Directional-blue-locked.png",
    unlockImage: "/assets/locks/Directional-blue-unlocked.png",
    directionalVariant: "blue",
  },
  {
    box: 6,
    type: "directional",
    image: "/assets/locks/Directional-black-locked.png",
    unlockImage: "/assets/locks/Directional-black-unlocked.png",
    directionalVariant: "red",
  },

  // NumericV1 locks (Box 7, 8, 13, 15)
  {
    box: 7,
    type: "numericV1",
    image: "/assets/locks/NumericV1-Locked.png",
  },
  { box: 8, type: "numericV1", image: "/assets/locks/NumericV1-Locked.png" },
  { box: 13, type: "numericV1", image: "/assets/locks/NumericV1-Locked.png" },
  { box: 15, type: "numericV1", image: "/assets/locks/NumericV1-Locked.png" },

  // Word lock (Box 9)
  { box: 9, type: "word", image: "/assets/locks/WordLock-locked.png" },

  // NumericV2 locks (Box 10, 11, 12, 14)
  { box: 10, type: "numericV2", image: "/assets/locks/NumericV2-Locked.png" },
  { box: 11, type: "numericV2", image: "/assets/locks/NumericV2-Locked.png" },
  { box: 12, type: "numericV2", image: "/assets/locks/NumericV2-Locked.png" },
  { box: 14, type: "numericV2", image: "/assets/locks/NumericV2-Locked.png" },

  // WordML lock (Box 16)
  { box: 16, type: "wordML", image: "/assets/locks/WordMLLock-locked.png" },
];

/**
 * Get lock configuration for a specific box (0-indexed)
 */
export function getLockConfigForBox(boxIndex: number): LockConfig | undefined {
  return LOCK_CONFIGURATIONS.find((config) => config.box === boxIndex + 1);
}

/**
 * Get lock image path for a specific box (0-indexed)
 */
export function getLockImageForBox(boxIndex: number): string {
  const config = getLockConfigForBox(boxIndex);
  return config?.image || "/assets/locks/NumericLock.png"; // Default fallback
}

/**
 * Get lock type for a specific box (0-indexed)
 */
export function getLockTypeForBox(boxIndex: number): LockType {
  const config = getLockConfigForBox(boxIndex);
  return config?.type || "numeric"; // Default fallback
}

/**
 * Get unlock image path for a specific box (0-indexed)
 */
export function getLockUnlockImageForBox(boxIndex: number): string | undefined {
  const config = getLockConfigForBox(boxIndex);
  return config?.unlockImage;
}
