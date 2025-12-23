/**
 * Breakpoint Configuration
 * Centralized breakpoint definitions for consistent responsive design
 */

export class BreakpointConfig {
  // Breakpoint values in pixels
  static readonly XS = 320;
  static readonly SM = 640;
  static readonly MD = 768;
  static readonly LG = 1024;
  static readonly XL = 1280;
  static readonly XXL = 1536;

  // Media query strings for use in CSS-in-JS or styled-components
  static readonly mediaQueries = {
    xs: `(min-width: ${BreakpointConfig.XS}px)`,
    sm: `(min-width: ${BreakpointConfig.SM}px)`,
    md: `(min-width: ${BreakpointConfig.MD}px)`,
    lg: `(min-width: ${BreakpointConfig.LG}px)`,
    xl: `(min-width: ${BreakpointConfig.XL}px)`,
    xxl: `(min-width: ${BreakpointConfig.XXL}px)`,
    // Max-width queries for mobile-first overrides
    maxXs: `(max-width: ${BreakpointConfig.SM - 1}px)`,
    maxSm: `(max-width: ${BreakpointConfig.MD - 1}px)`,
    maxMd: `(max-width: ${BreakpointConfig.LG - 1}px)`,
    maxLg: `(max-width: ${BreakpointConfig.XL - 1}px)`,
    // Device-specific
    mobile: `(max-width: ${BreakpointConfig.MD - 1}px)`,
    tablet: `(min-width: ${BreakpointConfig.MD}px) and (max-width: ${BreakpointConfig.LG - 1}px)`,
    desktop: `(min-width: ${BreakpointConfig.LG}px)`,
    // Orientation
    portrait: "(orientation: portrait)",
    landscape: "(orientation: landscape)",
    // Touch capability
    touch: "(hover: none) and (pointer: coarse)",
    mouse: "(hover: hover) and (pointer: fine)",
  } as const;

  /**
   * Check if a given width falls within a breakpoint range
   */
  static isBreakpoint(
    width: number,
    breakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
  ): boolean {
    const breakpoints = {
      xs: width >= BreakpointConfig.XS && width < BreakpointConfig.SM,
      sm: width >= BreakpointConfig.SM && width < BreakpointConfig.MD,
      md: width >= BreakpointConfig.MD && width < BreakpointConfig.LG,
      lg: width >= BreakpointConfig.LG && width < BreakpointConfig.XL,
      xl: width >= BreakpointConfig.XL && width < BreakpointConfig.XXL,
      xxl: width >= BreakpointConfig.XXL,
    };
    return breakpoints[breakpoint];
  }

  /**
   * Get current breakpoint name based on width
   */
  static getCurrentBreakpoint(
    width: number
  ): "xs" | "sm" | "md" | "lg" | "xl" | "xxl" {
    if (width >= BreakpointConfig.XXL) return "xxl";
    if (width >= BreakpointConfig.XL) return "xl";
    if (width >= BreakpointConfig.LG) return "lg";
    if (width >= BreakpointConfig.MD) return "md";
    if (width >= BreakpointConfig.SM) return "sm";
    return "xs";
  }
}

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type DeviceType = "mobile" | "tablet" | "desktop";

