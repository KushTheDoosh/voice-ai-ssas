"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils";
import { Business } from "../../store/businessStore";

interface BusinessCardProps {
  business: Business;
  onSelect?: (business: Business) => void;
  onDelete?: (business: Business) => void;
}

/**
 * Individual business card component with actions.
 * Displays business info and provides navigation to business details.
 */
export default function BusinessCard({ business, onSelect, onDelete }: BusinessCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formattedDate = new Date(business.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    
    if (onDelete) {
      setIsDeleting(true);
      await onDelete(business);
      setIsDeleting(false);
    }
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative">
      <Link
        href={`/dashboard/${business.id}`}
        onClick={() => onSelect?.(business)}
        className={cn(
          "group block p-5 rounded-xl",
          "bg-white border border-stone-200",
          "hover:border-teal-200 hover:shadow-lg hover:shadow-teal-50",
          "transition-all duration-200",
          "cursor-pointer",
          isDeleting && "opacity-50 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          {/* Business Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg flex items-center justify-center border border-teal-100">
            <svg
              className="w-5 h-5 text-teal-600"
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
          
          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">
              Active
            </span>
            
            {/* More Actions Button */}
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Business Name */}
        <h3 className="font-semibold text-stone-900 group-hover:text-teal-700 transition-colors mb-1">
          {business.name}
        </h3>
        
        {/* Description */}
        {business.description && (
          <p className="text-sm text-stone-500 line-clamp-2 mb-3">
            {business.description}
          </p>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <span className="text-xs text-stone-400">
            Created {formattedDate}
          </span>
          
          {/* Arrow indicator */}
          <svg
            className="w-4 h-4 text-stone-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-12 z-20 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1 overflow-hidden">
            <Link
              href={`/dashboard/${business.id}`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Dashboard
            </Link>
            
            <div className="border-t border-stone-100 my-1" />
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left disabled:opacity-50"
            >
              {isDeleting ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
              {isDeleting ? "Deleting..." : "Delete Business"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
