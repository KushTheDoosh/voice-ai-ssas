"use client";

import { cn } from "@/utils";
import { PhoneNumberConfig } from "./PhoneNumberConfig";

interface PhoneNumber {
  phone_number: string;
  friendly_name: string;
  locality?: string;
  region?: string;
  price_monthly: number;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
}

interface PhoneNumberCardProps {
  number: PhoneNumber;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PhoneNumberCard({ 
  number, 
  isSelected, 
  onSelect 
}: PhoneNumberCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
        isSelected 
          ? "border-teal-500 bg-teal-50/50 shadow-lg shadow-teal-500/10" 
          : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Phone number */}
          <p className="text-lg font-semibold text-stone-900 font-mono">
            {PhoneNumberConfig.formatPhoneNumber(number.phone_number)}
          </p>
          
          {/* Location */}
          {(number.locality || number.region) && (
            <p className="text-sm text-stone-500 mt-1">
              {[number.locality, number.region].filter(Boolean).join(", ")}
            </p>
          )}
          
          {/* Capabilities */}
          <div className="flex gap-2 mt-2">
            {number.capabilities.voice && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 rounded-full text-xs text-stone-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Voice
              </span>
            )}
            {number.capabilities.sms && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 rounded-full text-xs text-stone-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                SMS
              </span>
            )}
          </div>
        </div>
        
        {/* Price and selection indicator */}
        <div className="text-right">
          <p className="text-lg font-bold text-stone-900">
            ${number.price_monthly.toFixed(2)}
            <span className="text-sm font-normal text-stone-500">/mo</span>
          </p>
          
          <div className={cn(
            "mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ml-auto",
            isSelected 
              ? "border-teal-500 bg-teal-500" 
              : "border-stone-300"
          )}>
            {isSelected && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

