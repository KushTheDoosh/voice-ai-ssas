"use client";

import { cn } from "@/utils";
import { NavItemConfig } from "./SidebarConfig";
import SidebarNavItem from "./SidebarNavItem";
import CreateBusinessButton from "./CreateBusinessButton";

interface SidebarNavProps {
  navItems: NavItemConfig[];
  createBusinessLabel: string;
  isCollapsed: boolean;
  onItemClick?: () => void;
}

/**
 * Navigation list container component.
 * Renders nav items and the create business button.
 */
export default function SidebarNav({
  navItems,
  createBusinessLabel,
  isCollapsed,
  onItemClick,
}: SidebarNavProps) {
  return (
    <nav className="flex-1 overflow-hidden py-4 px-2">
      {/* Create Business Button */}
      <div className="mb-4">
        <CreateBusinessButton
          label={createBusinessLabel}
          isCollapsed={isCollapsed}
          onClick={onItemClick}
        />
      </div>
      
      {/* Section Label - Only shown when expanded */}
      {!isCollapsed && (
        <div className="px-3 mb-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
          Platform
        </div>
      )}
      
      {/* Navigation Items */}
      <ul className="space-y-1">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            onClick={onItemClick}
          />
        ))}
      </ul>
    </nav>
  );
}
