"use client";

import { cn } from "@/utils";

interface SidebarUserProps {
  userName: string;
  userEmail?: string;
  isCollapsed: boolean;
}

/**
 * User profile section at the bottom of the sidebar.
 * Shows user avatar and name, with collapsed state support.
 */
export default function SidebarUser({
  userName,
  userEmail,
  isCollapsed,
}: SidebarUserProps) {
  // Get initials from name
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="border-t border-stone-200/60 p-2 flex-shrink-0">
      <div
        className={cn(
          "flex items-center h-10 rounded-lg",
          "hover:bg-stone-100 transition-colors duration-200 cursor-pointer",
          isCollapsed ? "justify-center px-0" : "justify-start px-2 gap-3"
        )}
      >
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-stone-600 to-stone-700 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-white">{initials}</span>
        </div>
        
        {/* User Info - Only shown when expanded */}
        {!isCollapsed && (
          <>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-stone-900 truncate">
                {userName}
              </span>
              {userEmail && (
                <span className="text-xs text-stone-500 truncate">
                  {userEmail}
                </span>
              )}
            </div>
            
            {/* Dropdown indicator */}
            <svg
              className="w-4 h-4 text-stone-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </>
        )}
      </div>
    </div>
  );
}
