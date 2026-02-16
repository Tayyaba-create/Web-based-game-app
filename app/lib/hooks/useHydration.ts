import { useEffect, useState } from "react";

/**
 * Hook to detect if the component has been hydrated (mounted on client)
 * Useful for avoiding hydration mismatches between server and client
 */
export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};
