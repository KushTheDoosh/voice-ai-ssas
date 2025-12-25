import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_ENDPOINTS, apiFetch } from "@/utils";

/**
 * Business entity interface matching the backend BusinessResponse model
 */
export interface Business {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Backend response format
 */
interface BusinessApiResponse {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Business store state interface
 */
interface BusinessState {
  // Data
  businesses: Business[];
  activeBusiness: Business | null;
  
  // Loading states
  isLoading: boolean;
  isFetched: boolean;
  error: string | null;
  
  // Actions
  addBusiness: (business: Business) => void;
  removeBusiness: (id: string) => void;
  updateBusiness: (id: string, updates: Partial<Business>) => void;
  setActiveBusiness: (business: Business | null) => void;
  setBusinesses: (businesses: Business[]) => void;
  
  // Async actions
  fetchBusinesses: () => Promise<void>;
  deleteBusiness: (id: string) => Promise<boolean>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utilities
  getBusinessById: (id: string) => Business | undefined;
  reset: () => void;
}

const initialState = {
  businesses: [],
  activeBusiness: null,
  isLoading: false,
  isFetched: false,
  error: null,
};

/**
 * Helper function to convert backend response to Business interface
 */
export function mapBusinessResponse(response: BusinessApiResponse): Business {
  return {
    id: response.id,
    name: response.name,
    description: response.description,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
}

/**
 * Business store for managing created businesses across the dashboard.
 * Uses Zustand with persistence to localStorage for session continuity.
 */
export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      addBusiness: (business) => set((state) => ({
        businesses: [...state.businesses, business],
      })),
      
      removeBusiness: (id) => set((state) => ({
        businesses: state.businesses.filter((b) => b.id !== id),
        // Clear active business if it was removed
        activeBusiness: state.activeBusiness?.id === id ? null : state.activeBusiness,
      })),
      
      updateBusiness: (id, updates) => set((state) => ({
        businesses: state.businesses.map((b) => 
          b.id === id ? { ...b, ...updates } : b
        ),
        // Update active business if it was the one updated
        activeBusiness: state.activeBusiness?.id === id 
          ? { ...state.activeBusiness, ...updates }
          : state.activeBusiness,
      })),
      
      setActiveBusiness: (business) => set({ activeBusiness: business }),
      
      setBusinesses: (businesses) => set({ businesses, isFetched: true }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      getBusinessById: (id) => {
        return get().businesses.find((b) => b.id === id);
      },
      
      fetchBusinesses: async () => {
        const state = get();
        // Avoid duplicate fetches
        if (state.isLoading) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiFetch<BusinessApiResponse[]>(API_ENDPOINTS.business.list);
          const businesses = response.map(mapBusinessResponse);
          set({ businesses, isLoading: false, isFetched: true, error: null });
        } catch (err) {
          set({ 
            isLoading: false, 
            error: err instanceof Error ? err.message : "Failed to fetch businesses" 
          });
        }
      },
      
      deleteBusiness: async (id) => {
        try {
          await apiFetch(API_ENDPOINTS.business.delete(id), { method: "DELETE" });
          // Remove from local state
          set((state) => ({
            businesses: state.businesses.filter((b) => b.id !== id),
            activeBusiness: state.activeBusiness?.id === id ? null : state.activeBusiness,
          }));
          return true;
        } catch (err) {
          set({ error: err instanceof Error ? err.message : "Failed to delete business" });
          return false;
        }
      },
      
      reset: () => set(initialState),
    }),
    {
      name: "business-storage",
      partialize: (state) => ({
        businesses: state.businesses,
        activeBusiness: state.activeBusiness,
        isFetched: state.isFetched,
      }),
    }
  )
);
