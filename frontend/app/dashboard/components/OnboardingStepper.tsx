"use client";

import { useOnboardingStore } from "../store/onboardingStore";
import StepIndicator, { Step } from "./StepIndicator";
import BusinessRegistration from "./BusinessRegistration";
import KnowledgeBaseUpload from "./KnowledgeBaseUpload";
import PhoneNumberSelection from "./PhoneNumberSelection";
import VoiceAssistantConfig from "./VoiceAssistantConfig";

const STEPS: Step[] = [
  {
    id: 1,
    title: "Business Info",
    description: "Company details",
  },
  {
    id: 2,
    title: "Knowledge Base",
    description: "Upload documents",
  },
  {
    id: 3,
    title: "Phone Number",
    description: "Select a number",
  },
  {
    id: 4,
    title: "Voice Assistant",
    description: "Configure AI",
  },
];

export default function OnboardingStepper() {
  const { currentStep, setCurrentStep, businessId } = useOnboardingStore();

  const handleStepClick = (step: number) => {
    // Only allow going back to completed steps
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessRegistration />;
      case 2:
        return <KnowledgeBaseUpload />;
      case 3:
        return <PhoneNumberSelection />;
      case 4:
        return <VoiceAssistantConfig />;
      default:
        return <BusinessRegistration />;
    }
  };

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
        steps={STEPS}
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

