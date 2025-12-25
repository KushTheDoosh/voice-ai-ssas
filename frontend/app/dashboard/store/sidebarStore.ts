import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Sidebar state interface for managing collapse/expand behavior
 */
interface SidebarState {
  // State
  isCollapsed: boolean;
  isMobileOpen: boolean;
  
  // Actions
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobile: () => void;
  setMobileOpen: (open: boolean) => void;
  closeMobile: () => void;
}

/**
 * Sidebar store for managing sidebar UI state.
 * Persists collapsed preference to localStorage.
 */
export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,
      
      toggleCollapsed: () => set((state) => ({ 
        isCollapsed: !state.isCollapsed 
      })),
      
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      
      toggleMobile: () => set((state) => ({ 
        isMobileOpen: !state.isMobileOpen 
      })),
      
      setMobileOpen: (open) => set({ isMobileOpen: open }),
      
      closeMobile: () => set({ isMobileOpen: false }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
      }),
    }
  )
);

