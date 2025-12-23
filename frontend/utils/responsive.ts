/**
 * Responsive Utilities
 * Helper functions and classes for responsive design
 */

import { Breakpoint } from "./breakpoints";

/**
 * Responsive value type - allows different values for different breakpoints
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Spacing scale configuration
 */
export class SpacingConfig {
  static readonly scale = {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    32: "8rem", // 128px
  } as const;

  /**
   * Get responsive padding classes
   */
  static getPaddingClasses(
    size: "sm" | "md" | "lg" | "xl",
    axis?: "x" | "y"
  ): string {
    const paddingMap = {
      sm: { base: "p-4", md: "md:p-6" },
      md: { base: "p-6", md: "md:p-8", lg: "lg:p-10" },
      lg: { base: "p-6", md: "md:p-10", lg: "lg:p-16" },
      xl: { base: "p-8", md: "md:p-12", lg: "lg:p-20", xl: "xl:p-24" },
    };

    if (axis) {
      const axisPrefix = axis === "x" ? "px" : "py";
      return paddingMap[size].base
        .replace("p-", `${axisPrefix}-`)
        .concat(
          " ",
          Object.entries(paddingMap[size])
            .slice(1)
            .map(([bp, val]) => val.replace("p-", `${axisPrefix}-`))
            .join(" ")
        );
    }

    return Object.values(paddingMap[size]).join(" ");
  }
}

/**
 * Typography responsive utilities
 */
export class TypographyConfig {
  /**
   * Responsive heading sizes
   */
  static readonly headingSizes = {
    h1: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
    h2: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
    h3: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
    h4: "text-lg sm:text-xl md:text-2xl",
    h5: "text-base sm:text-lg md:text-xl",
    h6: "text-sm sm:text-base md:text-lg",
  } as const;

  /**
   * Responsive body text sizes
   */
  static readonly bodySizes = {
    xs: "text-xs",
    sm: "text-xs sm:text-sm",
    base: "text-sm sm:text-base",
    lg: "text-base sm:text-lg md:text-xl",
    xl: "text-lg sm:text-xl md:text-2xl",
  } as const;

  /**
   * Get responsive line height
   */
  static getLineHeight(tight?: boolean): string {
    return tight ? "leading-tight md:leading-snug" : "leading-relaxed";
  }
}

/**
 * Container utilities for consistent max-widths
 */
export class ContainerConfig {
  static readonly maxWidths = {
    sm: "max-w-screen-sm", // 640px
    md: "max-w-screen-md", // 768px
    lg: "max-w-screen-lg", // 1024px
    xl: "max-w-screen-xl", // 1280px
    "2xl": "max-w-screen-2xl", // 1536px
    full: "max-w-full",
    prose: "max-w-prose", // 65ch
    "7xl": "max-w-7xl", // 80rem
  } as const;

  /**
   * Get container classes with responsive padding
   */
  static getContainerClasses(
    maxWidth: keyof typeof ContainerConfig.maxWidths = "7xl"
  ): string {
    return `${ContainerConfig.maxWidths[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8`;
  }
}

/**
 * Grid utilities for responsive layouts
 */
export class GridConfig {
  /**
   * Get responsive grid columns
   */
  static getGridCols(
    mobile: number,
    tablet?: number,
    desktop?: number
  ): string {
    let classes = `grid-cols-${mobile}`;
    if (tablet) classes += ` md:grid-cols-${tablet}`;
    if (desktop) classes += ` lg:grid-cols-${desktop}`;
    return classes;
  }

  /**
   * Get responsive gap
   */
  static getGap(size: "sm" | "md" | "lg" | "xl"): string {
    const gapMap = {
      sm: "gap-4 md:gap-6",
      md: "gap-6 md:gap-8",
      lg: "gap-8 md:gap-10 lg:gap-12",
      xl: "gap-10 md:gap-12 lg:gap-16",
    };
    return gapMap[size];
  }
}

/**
 * Utility function to conditionally join class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Get value based on current breakpoint
 */
export function getResponsiveValue<T>(
  value: ResponsiveValue<T>,
  breakpoint: Breakpoint,
  defaultValue: T
): T {
  if (typeof value !== "object" || value === null) {
    return value as T;
  }

  const breakpointOrder: Breakpoint[] = ["xs", "sm", "md", "lg", "xl", "xxl"];
  const currentIndex = breakpointOrder.indexOf(breakpoint);

  // Find the closest defined value at or below current breakpoint
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (bp in value) {
      return (value as Record<Breakpoint, T>)[bp];
    }
  }

  return defaultValue;
}

