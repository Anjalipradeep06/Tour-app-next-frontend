"use client";

import { useEffect, useRef } from "react";

/**
 * Repeatedly calls `callback` every `delay` ms.
 * - Pauses automatically when the tab is not visible (saves requests/battery).
 * - Immediately refetches the moment the tab becomes visible again.
 * - Pass `enabled = false` (or `delay = null`) to stop polling entirely.
 */
export const usePolling = (
  callback: () => void,
  delay: number | null,
  enabled: boolean = true
) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || delay === null) return;

    const tick = () => {
      if (document.visibilityState === "visible") {
        savedCallback.current();
      }
    };

    const id = setInterval(tick, delay);

    document.addEventListener("visibilitychange", tick);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [delay, enabled]);
};