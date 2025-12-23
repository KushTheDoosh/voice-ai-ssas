"use client";

import { useState, useEffect, useCallback } from "react";
import { BreakpointConfig, Breakpoint, DeviceType } from "./breakpoints";

/**
 * Custom hook for responsive media queries
 * Provides reactive breakpoint detection for React components
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}

/**
 * Hook to get current breakpoint
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("md");

  const updateBreakpoint = useCallback(() => {
    if (typeof window === "undefined") return;
    setBreakpoint(BreakpointConfig.getCurrentBreakpoint(window.innerWidth));
  }, []);

  useEffect(() => {
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, [updateBreakpoint]);

  return breakpoint;
}

/**
 * Hook to get device type (mobile/tablet/desktop)
 */
export function useDeviceType(): DeviceType {
  const isMobile = useMediaQuery(BreakpointConfig.mediaQueries.mobile);
  const isTablet = useMediaQuery(BreakpointConfig.mediaQueries.tablet);

  if (isMobile) return "mobile";
  if (isTablet) return "tablet";
  return "desktop";
}

/**
 * Hook to check if device has touch capability
 */
export function useIsTouchDevice(): boolean {
  return useMediaQuery(BreakpointConfig.mediaQueries.touch);
}

/**
 * Hook to get window dimensions
 */
export function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}

/**
 * Convenience hooks for common breakpoint checks
 */
export function useIsMobile(): boolean {
  return useMediaQuery(BreakpointConfig.mediaQueries.mobile);
}

export function useIsTablet(): boolean {
  return useMediaQuery(BreakpointConfig.mediaQueries.tablet);
}

export function useIsDesktop(): boolean {
  return useMediaQuery(BreakpointConfig.mediaQueries.desktop);
}

