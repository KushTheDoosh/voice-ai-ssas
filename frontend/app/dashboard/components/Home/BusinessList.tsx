"use client";

import { useEffect } from "react";
import { cn } from "@/utils";
import { useBusinessStore, Business } from "../../store/businessStore";
import BusinessCard from "./BusinessCard";

interface BusinessListProps {
  onBusinessSelect?: (business: Business) => void;
}

/**
 * Grid/list of created businesses.
 * Fetches from backend and shows empty state when no businesses exist.
 */
export default function BusinessList({ onBusinessSelect }: BusinessListProps) {
  const { 
    businesses, 
    isLoading, 
    isFetched,
    error,
    setActiveBusiness, 
    fetchBusinesses,
    deleteBusiness 
  } = useBusinessStore();

  // Fetch businesses on mount
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleSelect = (business: Business) => {
    setActiveBusiness(business);
    onBusinessSelect?.(business);
  };

  const handleDelete = async (business: Business) => {
    if (confirm(`Are you sure you want to delete "${business.name}"? This will also delete all associated phone numbers, voice assistants, and knowledge base files.`)) {
      await deleteBusiness(business.id);
    }
  };

  // Loading state
  if (isLoading && !isFetched) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <svg className="animate-spin w-10 h-10 text-teal-500 mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-stone-500">Loading businesses...</p>
      </div>
    );
  }

  // Error state
  if (error && !isFetched) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-stone-900 mb-2">Failed to load businesses</h3>
        <p className="text-stone-500 text-center mb-4">{error}</p>
        <button
          onClick={() => fetchBusinesses()}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        {/* Empty illustration */}
        <div className="w-20 h-20 mb-6 bg-gradient-to-br from-stone-100 to-stone-50 rounded-2xl flex items-center justify-center">
          <svg
            className="w-10 h-10 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-stone-900 mb-2">
          No businesses yet
        </h3>
        
        <p className="text-stone-500 text-center max-w-sm mb-6">
          Get started by creating your first business. Set up your voice assistant
          and start handling calls in minutes.
        </p>
        
        <p className="text-sm text-stone-400">
          Click &quot;Create Business&quot; in the sidebar to begin
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">
            Your Businesses
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Manage your voice AI assistants across all your businesses
          </p>
        </div>
        
        <span className="px-3 py-1 bg-stone-100 text-stone-600 text-sm font-medium rounded-full">
          {businesses.length} {businesses.length === 1 ? "business" : "businesses"}
        </span>
      </div>
      
      {/* Business Grid */}
      <div
        className={cn(
          "grid gap-4",
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {businesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
