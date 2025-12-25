"use client";

import Link from "next/link";
import { cn } from "@/utils";

interface SidebarLogoProps {
  logoText: string;
  logoTagline: string;
  isCollapsed: boolean;
  onToggle?: () => void;
}

/**
 * Sidebar logo component with collapsed/expanded variants.
 * Displays company branding at the top of the sidebar with toggle button below.
 */
export default function SidebarLogo({
  logoText,
  logoTagline,
  isCollapsed,
  onToggle,
}: SidebarLogoProps) {
  return (
    <div className="border-b border-stone-200/60 flex-shrink-0">
      {/* Logo Section */}
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center h-[60px] px-3",
          "hover:bg-stone-50 transition-colors duration-200 group",
          isCollapsed ? "justify-center" : "justify-start gap-3"
        )}
      >
        {/* Logo Icon */}
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </div>
        
        {/* Logo Text - Hidden when collapsed */}
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-lg font-bold text-stone-900 tracking-tight whitespace-nowrap">
              {logoText}
            </span>
            <span className="text-[10px] text-stone-500 whitespace-nowrap">
              {logoTagline}
            </span>
          </div>
        )}
      </Link>
      
      {/* Toggle Button - Below logo, hidden on mobile */}
      {onToggle && (
        <button
          onClick={onToggle}
          className={cn(
            "hidden lg:flex items-center h-10 w-full",
            "text-stone-500 hover:text-stone-700 hover:bg-stone-100",
            "transition-colors duration-200 border-t border-stone-100",
            isCollapsed ? "justify-center px-0" : "justify-start px-3 gap-2"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {/* Toggle Icon */}
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isCollapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h8m-8 6h16M13 9l3 3-3 3"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16M11 9l-3 3 3 3"
              />
            )}
          </svg>
          
          {/* Label - Only shown when expanded */}
          {!isCollapsed && (
            <span className="text-sm whitespace-nowrap">
              Close sidebar
            </span>
          )}
        </button>
      )}
    </div>
  );
}
