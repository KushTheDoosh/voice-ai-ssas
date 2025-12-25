"use client";

import { useEffect } from "react";
import { cn } from "@/utils";
import { SidebarConfig, defaultSidebarConfig, SidebarIcons } from "./SidebarConfig";
import { useSidebarStore } from "../../store/sidebarStore";
import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import SidebarUser from "./SidebarUser";

interface SidebarProps {
  config?: SidebarConfig;
  userName?: string;
  userEmail?: string;
}

/**
 * Main Sidebar component with collapse logic and responsive behavior.
 * Uses Zustand store for state persistence.
 */
export default function Sidebar({ 
  config = defaultSidebarConfig,
  userName = "User",
  userEmail,
}: SidebarProps) {
  const { 
    isCollapsed, 
    isMobileOpen, 
    toggleCollapsed, 
    closeMobile,
    toggleMobile 
  } = useSidebarStore();

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        closeMobile();
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen, closeMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className={cn(
          "lg:hidden fixed top-4 left-4 z-50",
          "p-2 bg-white rounded-lg shadow-md border border-stone-200",
          "text-stone-600 hover:text-stone-900 hover:bg-stone-50",
          "transition-colors duration-200"
        )}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <SidebarIcons.Close className="w-6 h-6" />
        ) : (
          <SidebarIcons.Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: isCollapsed ? '64px' : '256px',
        }}
        className={cn(
          // Base styles
          "fixed top-0 left-0 h-screen z-40",
          "bg-white border-r border-stone-200",
          "flex flex-col overflow-hidden",
          // Smooth width transition
          "transition-[width] duration-300 ease-out",
          // Desktop
          "lg:relative lg:translate-x-0 lg:flex-shrink-0",
          // Mobile - always full width
          "max-lg:!w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo with Toggle */}
        <SidebarLogo
          logoText={config.logoText}
          logoTagline={config.logoTagline}
          isCollapsed={isCollapsed}
          onToggle={toggleCollapsed}
        />
        
        {/* Navigation */}
        <SidebarNav
          navItems={config.navItems}
          createBusinessLabel={config.createBusinessLabel}
          isCollapsed={isCollapsed}
          onItemClick={closeMobile}
        />
        
        {/* User Section at Bottom */}
        <SidebarUser
          userName={userName}
          userEmail={userEmail}
          isCollapsed={isCollapsed}
        />
      </aside>
    </>
  );
}

// Re-export config for convenience
export { SidebarConfig, defaultSidebarConfig } from "./SidebarConfig";
