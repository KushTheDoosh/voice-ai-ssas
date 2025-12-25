"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore, VoiceAssistantData } from "../../store/onboardingStore";
import { VoiceAssistantConfig as VoiceAssistantConfigType } from "../../store/configStore";
import VoicePreview from "./VoicePreview";
import { cn, API_ENDPOINTS, apiFetch } from "@/utils";

interface Props {
  config: VoiceAssistantConfigType;
}

export default function VoiceAssistantConfig({ config }: Props) {
  const router = useRouter();
  const { 
    businessId, 
    businessData,
    voiceAssistantData, 
    setVoiceAssistantData, 
    prevStep,
    isLoading, 
    setLoading, 
    setError,
    reset
  } = useOnboardingStore();
  
  const [formData, setFormData] = useState<VoiceAssistantData>({
    name: voiceAssistantData?.name || "",
    firstMessage: voiceAssistantData?.firstMessage || config.defaults.firstMessage,
    systemPrompt: voiceAssistantData?.systemPrompt || 
      config.defaults.systemPrompt.replace("{business_name}", businessData?.name || "your company"),
    modelProvider: voiceAssistantData?.modelProvider || config.providers[0]?.id || "openai",
    modelName: voiceAssistantData?.modelName || config.providers[0]?.models[0]?.id || "gpt-4o",
    voice: voiceAssistantData?.voice || config.voices[0]?.id || "rachel",
    endCallMessage: voiceAssistantData?.endCallMessage || config.defaults.endCallMessage,
    maxCallDurationSeconds: voiceAssistantData?.maxCallDurationSeconds || config.defaults.maxCallDurationSeconds,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof VoiceAssistantData, string>>>({});

  const currentProvider = useMemo(() => 
    config.providers.find(p => p.id === formData.modelProvider),
    [formData.modelProvider, config.providers]
  );

  const handleChange = (name: keyof VoiceAssistantData, value: string | number) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Reset model when provider changes
      if (name === "modelProvider") {
        const provider = config.providers.find(p => p.id === value);
        if (provider && provider.models.length > 0) {
          newData.modelName = provider.models[0].id;
        }
      }
      
      return newData;
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof VoiceAssistantData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Assistant name is required";
    }
    if (!formData.firstMessage.trim()) {
      newErrors.firstMessage = "First message is required";
    }
    if (!formData.systemPrompt.trim()) {
      newErrors.systemPrompt = "System prompt is required";
    }
    if (!formData.endCallMessage.trim()) {
      newErrors.endCallMessage = "End call message is required";
    }
    if (formData.maxCallDurationSeconds < 30 || formData.maxCallDurationSeconds > 3600) {
      newErrors.maxCallDurationSeconds = "Duration must be between 30 seconds and 60 minutes";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm() || !businessId) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create voice assistant
      await apiFetch(API_ENDPOINTS.voiceAssistant.create(businessId), {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          first_message: formData.firstMessage,
          system_prompt: formData.systemPrompt,
          model_provider: formData.modelProvider,
          model_name: formData.modelName,
          voice: formData.voice,
          end_call_message: formData.endCallMessage,
          max_call_duration_seconds: formData.maxCallDurationSeconds,
        }),
      });
      
      // Complete onboarding
      const completeData = await apiFetch<{ dashboard_url: string }>(
        API_ENDPOINTS.onboarding.complete,
        {
          method: "POST",
          body: JSON.stringify({ business_id: businessId }),
        }
      );
      
      // Save data and redirect
      setVoiceAssistantData(formData);
      reset(); // Clear onboarding state
      router.push(completeData.dashboard_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">
          {config.title}
        </h2>
        <p className="text-stone-600 mt-1">
          {config.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        {/* Assistant Name */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Assistant Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Customer Support Agent"
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
              errors.name ? "border-red-300 bg-red-50/50" : "border-stone-200 hover:border-stone-300"
            )}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1.5">{errors.name}</p>}
        </div>

        {/* Model Provider & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Model Provider
            </label>
            <select
              value={formData.modelProvider}
              onChange={(e) => handleChange("modelProvider", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              {config.providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Model
            </label>
            <select
              value={formData.modelName}
              onChange={(e) => handleChange("modelName", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              {currentProvider?.models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Voice Selection */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Voice (ElevenLabs)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {config.voices.slice(0, 8).map((voice) => (
              <VoicePreview
                key={voice.id}
                voice={voice}
                isSelected={formData.voice === voice.id}
                onSelect={() => handleChange("voice", voice.id)}
              />
            ))}
          </div>
          {config.voices.length > 8 && (
            <details className="mt-2">
              <summary className="text-sm text-teal-600 cursor-pointer hover:text-teal-700">
                Show more voices
              </summary>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {config.voices.slice(8).map((voice) => (
                  <VoicePreview
                    key={voice.id}
                    voice={voice}
                    isSelected={formData.voice === voice.id}
                    onSelect={() => handleChange("voice", voice.id)}
                  />
                ))}
              </div>
            </details>
          )}
        </div>

        {/* First Message */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            First Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.firstMessage}
            onChange={(e) => handleChange("firstMessage", e.target.value)}
            placeholder="What the assistant says when answering a call"
            rows={2}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white transition-all duration-200 resize-none",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
              errors.firstMessage ? "border-red-300 bg-red-50/50" : "border-stone-200 hover:border-stone-300"
            )}
          />
          {errors.firstMessage && <p className="text-red-500 text-sm mt-1.5">{errors.firstMessage}</p>}
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            System Prompt <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.systemPrompt}
            onChange={(e) => handleChange("systemPrompt", e.target.value)}
            placeholder="Instructions for how the AI should behave"
            rows={6}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white transition-all duration-200 resize-none font-mono text-sm",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
              errors.systemPrompt ? "border-red-300 bg-red-50/50" : "border-stone-200 hover:border-stone-300"
            )}
          />
          {errors.systemPrompt && <p className="text-red-500 text-sm mt-1.5">{errors.systemPrompt}</p>}
        </div>

        {/* End Call Message */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            End Call Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.endCallMessage}
            onChange={(e) => handleChange("endCallMessage", e.target.value)}
            placeholder="What the assistant says before ending a call"
            rows={2}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white transition-all duration-200 resize-none",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
              errors.endCallMessage ? "border-red-300 bg-red-50/50" : "border-stone-200 hover:border-stone-300"
            )}
          />
          {errors.endCallMessage && <p className="text-red-500 text-sm mt-1.5">{errors.endCallMessage}</p>}
        </div>

        {/* Max Call Duration */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Maximum Call Duration
          </label>
          <div className="flex flex-wrap gap-2">
            {config.durationPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleChange("maxCallDurationSeconds", preset.value)}
                className={cn(
                  "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                  formData.maxCallDurationSeconds === preset.value
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-2">
            Current: {Math.floor(formData.maxCallDurationSeconds / 60)} min {formData.maxCallDurationSeconds % 60} sec
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={prevStep}
          disabled={isLoading}
          className={cn(
            "px-6 py-4 rounded-xl font-semibold transition-all duration-200",
            "border border-stone-200 text-stone-700 hover:bg-stone-50",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Back
        </button>
        
        <button
          onClick={handleCreate}
          disabled={isLoading}
          className={cn(
            "flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200",
            "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600",
            "shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40",
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Create Voice Assistant
            </>
          )}
        </button>
      </div>
    </div>
  );
}
