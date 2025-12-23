"use client";

import Link from "next/link";
import OnboardingStepper from "./components/OnboardingStepper";

export default function DashboardPage() {
  return (
    <div className="min-h-screen py-8">
      {/* Navigation back */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Onboarding stepper */}
      <OnboardingStepper />
    </div>
  );
}

