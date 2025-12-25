"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import { NavItemConfig } from "./SidebarConfig";

interface SidebarNavItemProps {
  item: NavItemConfig;
  isCollapsed: boolean;
  onClick?: () => void;
}

/**
 * Individual navigation item component with icon, label, and active state.
 * Shows tooltip on hover when sidebar is collapsed.
 */
export default function SidebarNavItem({
  item,
  isCollapsed,
  onClick,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <li className="relative group">
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          "flex items-center h-10 rounded-lg",
          "transition-colors duration-200",
          "hover:bg-stone-100",
          isActive
            ? "bg-teal-50 text-teal-700 font-medium"
            : "text-stone-600 hover:text-stone-900",
          isCollapsed ? "justify-center px-0" : "justify-start px-3 gap-3"
        )}
      >
        {/* Icon */}
        <Icon
          className={cn(
            "w-5 h-5 flex-shrink-0",
            isActive ? "text-teal-600" : "text-stone-500 group-hover:text-stone-700"
          )}
        />
        
        {/* Label - Only shown when expanded */}
        {!isCollapsed && (
          <span className="whitespace-nowrap">
            {item.label}
          </span>
        )}
        
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />
        )}
      </Link>
      
      {/* Tooltip - Shown when collapsed */}
      {isCollapsed && (
        <div
          className={cn(
            "absolute left-full top-1/2 -translate-y-1/2 ml-2",
            "px-2 py-1 bg-stone-900 text-white text-sm rounded-md",
            "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
            "transition-opacity duration-150 whitespace-nowrap z-50",
            "pointer-events-none"
          )}
        >
          {item.label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
        </div>
      )}
    </li>
  );
}
