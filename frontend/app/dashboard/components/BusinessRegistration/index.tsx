"use client";

import { useState } from "react";
import { useOnboardingStore, BusinessData } from "../../store/onboardingStore";
import { BusinessRegistrationConfig } from "./BusinessRegistrationConfig";
import { cn } from "@/utils";

export default function BusinessRegistration() {
  const { businessData, setBusinessData, setBusinessId, nextStep, isLoading, setLoading, setError } = useOnboardingStore();
  
  const [formData, setFormData] = useState<BusinessData>({
    name: businessData?.name || "",
    description: businessData?.description || "",
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof BusinessData, boolean>>>({});

  const validateField = (name: keyof BusinessData, value: string): string | null => {
    if (name === "name") {
      const field = BusinessRegistrationConfig.fields.name;
      if (field.required && !value.trim()) {
        return `${field.label} is required`;
      }
      if (value.length > field.maxLength) {
        return `${field.label} must be less than ${field.maxLength} characters`;
      }
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BusinessData, string>> = {};
    let isValid = true;
    
    const nameError = validateField("name", formData.name || "");
    if (nameError) {
      newErrors.name = nameError;
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name: keyof BusinessData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error || undefined }));
    }
  };

  const handleBlur = (name: keyof BusinessData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name] || "");
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(BusinessRegistrationConfig.api.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to create business");
      }
      
      const data = await response.json();
      setBusinessData(formData);
      setBusinessId(data.id);
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const { fields } = BusinessRegistrationConfig;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">
          {BusinessRegistrationConfig.title}
        </h2>
        <p className="text-stone-600 mt-1">
          {BusinessRegistrationConfig.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            {fields.name.label}
            {fields.name.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder={fields.name.placeholder}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
              errors.name 
                ? "border-red-300 bg-red-50/50" 
                : "border-stone-200 hover:border-stone-300"
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1.5">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            {fields.description.label}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            placeholder={fields.description.placeholder}
            rows={4}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white transition-all duration-200 resize-none",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
              "border-stone-200 hover:border-stone-300"
            )}
          />
          <p className="text-stone-400 text-xs mt-1">
            {formData.description?.length || 0} / {fields.description.maxLength} characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200",
              "bg-stone-900 hover:bg-stone-800 shadow-lg shadow-stone-900/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : (
              <>
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
