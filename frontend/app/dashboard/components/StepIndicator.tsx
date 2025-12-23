"use client";

import { cn } from "@/utils";

export interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function StepIndicator({ 
  steps, 
  currentStep, 
  onStepClick 
}: StepIndicatorProps) {
  return (
    <div className="w-full mb-8 md:mb-12">
      {/* Desktop stepper */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = onStepClick && (isCompleted || step.id === currentStep);
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle and content */}
              <div 
                className={cn(
                  "flex flex-col items-center",
                  isClickable && "cursor-pointer"
                )}
                onClick={() => isClickable && onStepClick?.(step.id)}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300",
                    isCompleted && "bg-teal-500 text-white shadow-lg shadow-teal-500/30",
                    isCurrent && "bg-stone-900 text-white shadow-lg shadow-stone-900/30 ring-4 ring-stone-900/20",
                    !isCompleted && !isCurrent && "bg-stone-200 text-stone-500"
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p className={cn(
                    "text-sm font-medium transition-colors",
                    isCurrent ? "text-stone-900" : "text-stone-500"
                  )}>
                    {step.title}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5 max-w-[120px]">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 mt-[-40px]">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      isCompleted ? "bg-teal-500" : "bg-stone-200"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Mobile stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-stone-500">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm font-medium text-stone-900">
            {steps[currentStep - 1]?.title}
          </span>
        </div>
        <div className="flex gap-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex-1 h-2 rounded-full transition-all duration-300",
                currentStep > step.id && "bg-teal-500",
                currentStep === step.id && "bg-stone-900",
                currentStep < step.id && "bg-stone-200"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

