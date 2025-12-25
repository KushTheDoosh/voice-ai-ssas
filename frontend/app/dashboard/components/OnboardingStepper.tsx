"use client";

import { useEffect } from "react";
import { useOnboardingStore } from "../store/onboardingStore";
import { useConfigStore } from "../store/configStore";
import StepIndicator from "./StepIndicator";
import BusinessRegistration from "./BusinessRegistration";
import KnowledgeBaseUpload from "./KnowledgeBaseUpload";
import PhoneNumberSelection from "./PhoneNumberSelection";
import VoiceAssistantConfig from "./VoiceAssistantConfig";

export default function OnboardingStepper() {
  const { currentStep, setCurrentStep } = useOnboardingStore();
  const { config, isLoading, error, fetchConfig } = useConfigStore();

  // Fetch config on mount
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleStepClick = (step: number) => {
    // Only allow going back to completed steps
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const renderCurrentStep = () => {
    if (!config) return null;
    
    switch (currentStep) {
      case 1:
        return <BusinessRegistration config={config.business} />;
      case 2:
        return <KnowledgeBaseUpload config={config.knowledgeBase} />;
      case 3:
        return <PhoneNumberSelection config={config.phoneNumber} />;
      case 4:
        return <VoiceAssistantConfig config={config.voiceAssistant} />;
      default:
        return <BusinessRegistration config={config.business} />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10 text-teal-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-stone-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !config) {
    return (
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Failed to Load</h2>
          <p className="text-stone-600 mb-4">{error || "Could not load configuration"}</p>
          <button
            onClick={() => fetchConfig()}
            className="px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Map config steps to StepIndicator format
  const steps = config.steps.map((step) => ({
    id: step.id,
    title: step.title,
    description: step.description,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
          Set Up Your Voice AI
        </h1>
        <p className="text-stone-600 mt-2 text-lg">
          Complete these steps to launch your AI-powered voice assistant
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {/* Current step content */}
      <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 p-6 md:p-10">
        {renderCurrentStep()}
      </div>
    </div>
  );
}
