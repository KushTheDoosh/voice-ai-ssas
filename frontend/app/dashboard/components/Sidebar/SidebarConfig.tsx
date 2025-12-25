import { ComponentType } from "react";

/**
 * Navigation item configuration interface
 */
export interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

/**
 * Icon components for sidebar navigation
 * Using inline SVG components for modularity
 */
export const SidebarIcons = {
  Home: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  
  CallHistory: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  
  PhoneNumbers: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
  ),
  
  KnowledgeBase: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  
  Plus: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 4v16m8-8H4" />
    </svg>
  ),
  
  ChevronLeft: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15 19l-7-7 7-7" />
    </svg>
  ),
  
  ChevronRight: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 5l7 7-7 7" />
    </svg>
  ),
  
  Menu: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  
  Close: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

/**
 * Default navigation items for the sidebar
 */
const defaultNavItems: NavItemConfig[] = [
  {
    id: "home",
    label: "Home",
    href: "/dashboard",
    icon: SidebarIcons.Home,
  },
  {
    id: "call-history",
    label: "Call History",
    href: "/dashboard/call-history",
    icon: SidebarIcons.CallHistory,
  },
  {
    id: "phone-numbers",
    label: "My Numbers",
    href: "/dashboard/phone-numbers",
    icon: SidebarIcons.PhoneNumbers,
  },
  {
    id: "knowledge-base",
    label: "Knowledge Base",
    href: "/dashboard/knowledge-base",
    icon: SidebarIcons.KnowledgeBase,
  },
];

/**
 * Sidebar configuration class following OOP patterns.
 * Provides configurable settings for sidebar branding and navigation.
 */
export class SidebarConfig {
  readonly logoText: string;
  readonly logoTagline: string;
  readonly navItems: NavItemConfig[];
  readonly createBusinessLabel: string;
  readonly collapsedWidth: number;
  readonly expandedWidth: number;
  
  constructor(options?: Partial<SidebarConfig>) {
    this.logoText = options?.logoText ?? "VoiceAI";
    this.logoTagline = options?.logoTagline ?? "backed by innovation";
    this.navItems = options?.navItems ?? defaultNavItems;
    this.createBusinessLabel = options?.createBusinessLabel ?? "Create Business";
    this.collapsedWidth = options?.collapsedWidth ?? 64;
    this.expandedWidth = options?.expandedWidth ?? 256;
  }
  
  /**
   * Get CSS width value based on collapsed state
   */
  getWidth(isCollapsed: boolean): string {
    return isCollapsed ? `${this.collapsedWidth}px` : `${this.expandedWidth}px`;
  }
  
  /**
   * Get Tailwind width class based on collapsed state
   */
  getWidthClass(isCollapsed: boolean): string {
    return isCollapsed ? "w-16" : "w-64";
  }
}

// Default singleton instance
export const defaultSidebarConfig = new SidebarConfig();

