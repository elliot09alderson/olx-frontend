import { useRef, useCallback } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRan = useRef<number>(0);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRan = now - lastRan.current;

      if (timeSinceLastRan >= delay) {
        // Execute immediately if enough time has passed
        func(...args);
        lastRan.current = now;
      } else {
        // Clear existing timeout and set a new one
        if (timeout.current) {
          clearTimeout(timeout.current);
        }
        
        timeout.current = setTimeout(() => {
          func(...args);
          lastRan.current = Date.now();
          timeout.current = null;
        }, delay - timeSinceLastRan);
      }
    },
    [func, delay]
  );
}