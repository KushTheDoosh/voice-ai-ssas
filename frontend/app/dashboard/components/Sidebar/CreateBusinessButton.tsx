"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/utils";
import { SidebarIcons } from "./SidebarConfig";
import { useOnboardingStore } from "../../store/onboardingStore";

interface CreateBusinessButtonProps {
  label: string;
  isCollapsed: boolean;
  onClick?: () => void;
}

/**
 * Styled button that triggers the onboarding flow.
 * Resets onboarding state and navigates to the onboarding page.
 */
export default function CreateBusinessButton({
  label,
  isCollapsed,
  onClick,
}: CreateBusinessButtonProps) {
  const router = useRouter();
  const { reset } = useOnboardingStore();
  
  const handleClick = () => {
    // Reset onboarding state for new business
    reset();
    // Navigate to onboarding (same as dashboard but with fresh state)
    router.push("/dashboard?onboarding=true");
    // Call optional callback (e.g., close mobile menu)
    onClick?.();
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center h-10 rounded-lg",
          "bg-gradient-to-r from-teal-500 to-cyan-500",
          "hover:from-teal-600 hover:to-cyan-600",
          "text-white font-medium",
          "transition-colors duration-200",
          "shadow-sm hover:shadow-md",
          isCollapsed ? "justify-center px-0" : "justify-start px-3 gap-3"
        )}
      >
        <SidebarIcons.Plus className="w-5 h-5 flex-shrink-0" />
        
        {/* Label - Only shown when expanded */}
        {!isCollapsed && (
          <span className="whitespace-nowrap">
            {label}
          </span>
        )}
      </button>
      
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
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
        </div>
      )}
    </div>
  );
}
