"use client";

import { cn } from "@/utils";

interface Voice {
  id: string;
  name: string;
  gender: "male" | "female";
  accent: string;
}

interface VoicePreviewProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: () => void;
}

export default function VoicePreview({ voice, isSelected, onSelect }: VoicePreviewProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "p-4 rounded-xl border-2 text-left transition-all duration-200 group",
        isSelected
          ? "border-teal-500 bg-teal-50/50 shadow-md"
          : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors",
          isSelected ? "bg-teal-100" : "bg-stone-100 group-hover:bg-stone-200"
        )}>
          {voice.gender === "female" ? "👩" : "👨"}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-stone-900">{voice.name}</p>
          <p className="text-xs text-stone-500">{voice.accent}</p>
        </div>
        
        {/* Selection indicator */}
        <div className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
          isSelected
            ? "border-teal-500 bg-teal-500"
            : "border-stone-300"
        )}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

