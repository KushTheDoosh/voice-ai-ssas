// Barrel export for utils
export { BreakpointConfig, type Breakpoint, type DeviceType } from "./breakpoints";
export {
  useMediaQuery,
  useBreakpoint,
  useDeviceType,
  useIsTouchDevice,
  useWindowSize,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
} from "./useMediaQuery";
export {
  SpacingConfig,
  TypographyConfig,
  ContainerConfig,
  GridConfig,
  cn,
  getResponsiveValue,
  type ResponsiveValue,
} from "./responsive";
export {
  API_ENDPOINTS,
  apiFetch,
  formatPhoneNumber,
  formatFileSize,
  getFileExtension,
} from "./api";

