"use client";

import { useState } from "react";
import { useOnboardingStore, BusinessData } from "../../store/onboardingStore";
import { useBusinessStore, mapBusinessResponse } from "../../store/businessStore";
import { BusinessConfig } from "../../store/configStore";
import { cn, API_ENDPOINTS, apiFetch } from "@/utils";

interface Props {
  config: BusinessConfig;
}

export default function BusinessRegistration({ config }: Props) {
  const { businessData, setBusinessData, setBusinessId, nextStep, isLoading, setLoading, setError } = useOnboardingStore();
  const { addBusiness } = useBusinessStore();
  
  const [formData, setFormData] = useState<BusinessData>({
    name: businessData?.name || "",
    description: businessData?.description || "",
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof BusinessData, boolean>>>({});

  // Get field config from API config
  const nameField = config.fields.find((f) => f.name === "name");
  const descriptionField = config.fields.find((f) => f.name === "description");

  const validateField = (name: keyof BusinessData, value: string): string | null => {
    const field = config.fields.find((f) => f.name === name);
    if (!field) return null;
    
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }
    if (field.maxLength && value.length > field.maxLength) {
      return `${field.label} must be less than ${field.maxLength} characters`;
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BusinessData, string>> = {};
    let isValid = true;
    
    config.fields.forEach((field) => {
      const fieldName = field.name as keyof BusinessData;
      const error = validateField(fieldName, formData[fieldName] || "");
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });
    
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
      const response = await apiFetch<any>(API_ENDPOINTS.business.base, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
        }),
      });
      
      // Add to business store for dashboard display
      const business = mapBusinessResponse(response);
      addBusiness(business);
      // Update onboarding store
      setBusinessData(formData);
      setBusinessId(response.id);
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">
          {config.title}
        </h2>
        <p className="text-stone-600 mt-1">
          {config.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Name */}
        {nameField && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              {nameField.label}
              {nameField.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder={nameField.placeholder}
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
        )}

        {/* Description */}
        {descriptionField && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              {descriptionField.label}
              {descriptionField.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              placeholder={descriptionField.placeholder}
              rows={4}
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-white transition-all duration-200 resize-none",
                "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
                errors.description
                  ? "border-red-300 bg-red-50/50"
                  : "border-stone-200 hover:border-stone-300"
              )}
            />
            {descriptionField.maxLength && (
              <p className="text-stone-400 text-xs mt-1">
                {formData.description?.length || 0} / {descriptionField.maxLength} characters
              </p>
            )}
          </div>
        )}

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
