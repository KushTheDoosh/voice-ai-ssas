"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import OnboardingStepper from "./components/OnboardingStepper";
import Home from "./components/Home";
import { useOnboardingStore } from "./store/onboardingStore";

/**
 * Dashboard page content component.
 * Conditionally renders Home view or Onboarding flow based on URL params and state.
 */
function DashboardContent() {
  const searchParams = useSearchParams();
  const { businessId, currentStep } = useOnboardingStore();
  
  // Show onboarding if:
  // 1. URL has ?onboarding=true query param
  // 2. There's an active onboarding session (currentStep > 1 but not completed)
  const isOnboarding = searchParams.get("onboarding") === "true";
  const hasActiveOnboarding = currentStep > 1 && !businessId;
  
  const showOnboarding = isOnboarding || hasActiveOnboarding;

  if (showOnboarding) {
    return <OnboardingStepper />;
  }

  return <Home />;
}

/**
 * Dashboard page with Suspense boundary for useSearchParams.
 */
export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-stone-200 rounded-xl" />
            <div className="w-32 h-4 bg-stone-200 rounded" />
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
