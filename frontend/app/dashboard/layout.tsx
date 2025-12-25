"use client";

import { cn } from "@/utils";
import Sidebar from "./components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-stone-50 via-stone-100 to-teal-50/30">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-100/40 to-cyan-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-stone-200/50 to-stone-100/30 rounded-full blur-3xl" />
      </div>
      
      {/* Layout Container - Full height flex */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar - Full height */}
        <Sidebar userName="Demo User" userEmail="demo@voiceai.com" />
        
        {/* Main content - Scrollable */}
        <main
          className={cn(
            "flex-1 overflow-y-auto",
            "transition-all duration-300",
            // Responsive padding for mobile menu
            "pt-16 lg:pt-0"
          )}
        >
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
