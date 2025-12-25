"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn, API_ENDPOINTS, apiFetch, formatPhoneNumber, formatFileSize } from "@/utils";

// Types
interface BusinessData {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface PhoneNumber {
  id: string;
  phone_number: string;
  friendly_name?: string;
  status: string;
  purchased_at: string;
}

interface VoiceAssistant {
  id: string;
  name: string;
  voice: string;
  model_provider: string;
  model_name: string;
  first_message: string;
  system_prompt: string;
  end_call_message: string;
  max_call_duration_seconds: number;
  phone_number_id?: string;
  created_at: string;
  updated_at: string;
}

interface KnowledgeBaseFile {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

// Modal Component
function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = "md"
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    md: "max-w-2xl",
    lg: "max-w-3xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={cn(
        "relative bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden mx-4",
        sizeClasses[size]
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-xl font-bold text-stone-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

// Add Phone Number Form
function AddPhoneNumberForm({ 
  businessId, 
  onSuccess, 
  onCancel,
}: { 
  businessId: string; 
  onSuccess: () => void; 
  onCancel: () => void;
  config: any;
}) {
  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(true);
  const [pattern, setPattern] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchNumbers = useCallback(async (searchPattern?: string) => {
    setSearchLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        country_code: "US",
        number_type: "local",
        limit: "10",
      });
      if (searchPattern) {
        params.append("area_code", searchPattern);
      }
      
      const data = await apiFetch<{ numbers: any[] }>(`${API_ENDPOINTS.phoneNumbers.available}?${params}`);
      setAvailableNumbers(data.numbers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load numbers");
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Fetch numbers on mount
  useEffect(() => {
    fetchNumbers();
  }, [fetchNumbers]);

  const handleSearch = () => {
    setSelectedNumber(null);
    fetchNumbers(pattern);
  };

  const handlePurchase = async () => {
    if (!selectedNumber) return;
    setLoading(true);
    setError(null);
    try {
      await apiFetch(API_ENDPOINTS.phoneNumbers.purchase(businessId), {
        method: "POST",
        body: JSON.stringify({
          phone_number: selectedNumber.phone_number,
          friendly_name: selectedNumber.friendly_name,
        }),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="text-stone-600">
        <p className="mb-3">Select your country and optionally add a pattern.</p>
        <p className="text-sm bg-stone-50 p-3 rounded-lg border border-stone-100">
          For example, to search for phone numbers in the US starting with a 615 prefix, specify 615. 
          Search results will be in the form &quot;1615XXXXXX&quot;
        </p>
      </div>

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Country - Fixed to USA */}
        <div className="sm:w-48">
          <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl">
            <span className="text-xl">🇺🇸</span>
            <span className="font-medium text-stone-900">United States</span>
          </div>
        </div>
        
        {/* Pattern Search */}
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="Pattern: 615"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className={cn(
              "px-4 py-3 rounded-xl transition-all flex items-center justify-center",
              "bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-50"
            )}
          >
            {searchLoading ? (
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Phone Number Selection */}
      <div>
        <div className="relative">
          <select
            value={selectedNumber?.phone_number || ""}
            onChange={(e) => {
              const num = availableNumbers.find(n => n.phone_number === e.target.value);
              setSelectedNumber(num || null);
            }}
            disabled={searchLoading || availableNumbers.length === 0}
            className={cn(
              "w-full px-4 py-4 rounded-xl border bg-white appearance-none cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
              "disabled:bg-stone-50 disabled:cursor-not-allowed",
              selectedNumber ? "border-teal-500 text-stone-900" : "border-stone-200 text-stone-500"
            )}
          >
            {searchLoading ? (
              <option value="">Loading available numbers...</option>
            ) : availableNumbers.length === 0 ? (
              <option value="">No numbers available</option>
            ) : (
              <>
                <option value="">Select phone number</option>
                {availableNumbers.map((num) => (
                  <option key={num.phone_number} value={num.phone_number}>
                    {formatPhoneNumber(num.phone_number)}
                    {num.locality ? ` - ${num.locality}` : ""}
                    {num.region ? `, ${num.region}` : ""}
                  </option>
                ))}
              </>
            )}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
        
        {/* Selected number info */}
        {selectedNumber && (
          <div className="mt-3 p-4 bg-teal-50 rounded-xl border border-teal-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-teal-600 font-medium uppercase tracking-wide mb-1">Selected</p>
                <p className="text-lg font-mono font-bold text-teal-900">
                  {formatPhoneNumber(selectedNumber.phone_number)}
                </p>
                {(selectedNumber.locality || selectedNumber.region) && (
                  <p className="text-sm text-teal-700">
                    {selectedNumber.locality ? `${selectedNumber.locality}, ` : ""}{selectedNumber.region || ""}
                  </p>
                )}
              </div>
              {selectedNumber.price_monthly && (
                <div className="text-right">
                  <p className="text-xl font-bold text-teal-900">
                    ${selectedNumber.price_monthly.toFixed(2)}
                    <span className="text-sm font-normal text-teal-600">/mo</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button 
          onClick={onCancel} 
          className="px-5 py-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handlePurchase}
          disabled={loading || !selectedNumber}
          className={cn(
            "px-8 py-3 rounded-xl font-semibold text-white transition-all",
            "bg-indigo-400 hover:bg-indigo-500",
            "disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          )}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Purchasing...
            </>
          ) : (
            "Purchase number"
          )}
        </button>
      </div>
    </div>
  );
}

// Voice Assistant Form (Create/Edit)
function VoiceAssistantForm({ 
  businessId, 
  businessName,
  assistant,
  phoneNumbers,
  onSuccess, 
  onCancel,
  onBuyNumber,
  config
}: { 
  businessId: string; 
  businessName: string;
  assistant?: VoiceAssistant;
  phoneNumbers: PhoneNumber[];
  onSuccess: () => void; 
  onCancel: () => void;
  onBuyNumber: () => void;
  config: any;
}) {
  const isEdit = !!assistant;
  const voiceConfig = config?.voiceAssistant;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: assistant?.name || "",
    firstMessage: assistant?.first_message || voiceConfig?.defaults?.firstMessage || "",
    systemPrompt: assistant?.system_prompt || (voiceConfig?.defaults?.systemPrompt || "").replace("{business_name}", businessName),
    modelProvider: assistant?.model_provider || "openai",
    modelName: assistant?.model_name || "gpt-4o",
    voice: assistant?.voice || "rachel",
    endCallMessage: assistant?.end_call_message || voiceConfig?.defaults?.endCallMessage || "",
    maxCallDurationSeconds: assistant?.max_call_duration_seconds || voiceConfig?.defaults?.maxCallDurationSeconds || 300,
    phoneNumberId: assistant?.phone_number_id || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentProvider = (voiceConfig?.providers || []).find((p: any) => p.id === formData.modelProvider);

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "modelProvider") {
        const provider = (voiceConfig?.providers || []).find((p: any) => p.id === value);
        if (provider?.models?.length > 0) {
          newData.modelName = provider.models[0].id;
        }
      }
      return newData;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Assistant name is required";
    if (!formData.firstMessage.trim()) newErrors.firstMessage = "First message is required";
    if (!formData.systemPrompt.trim()) newErrors.systemPrompt = "System prompt is required";
    if (!formData.endCallMessage.trim()) newErrors.endCallMessage = "End call message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        first_message: formData.firstMessage,
        system_prompt: formData.systemPrompt,
        model_provider: formData.modelProvider,
        model_name: formData.modelName,
        voice: formData.voice,
        end_call_message: formData.endCallMessage,
        max_call_duration_seconds: formData.maxCallDurationSeconds,
        phone_number_id: formData.phoneNumberId || null,
      };

      if (isEdit && assistant) {
        await apiFetch(API_ENDPOINTS.voiceAssistant.byId(businessId, assistant.id), {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch(API_ENDPOINTS.voiceAssistant.create(businessId), {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEdit ? "update" : "create"} assistant`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Name */}
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
            "w-full px-4 py-3 rounded-xl border bg-white transition-all",
            "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
            errors.name ? "border-red-300" : "border-stone-200"
          )}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Inbound Phone Number */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Inbound Phone Number
        </label>
        <div className="flex gap-2">
          <select
            value={formData.phoneNumberId}
            onChange={(e) => handleChange("phoneNumberId", e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">No inbound number</option>
            {phoneNumbers.map((phone) => (
              <option key={phone.id} value={phone.id}>
                {formatPhoneNumber(phone.phone_number)} {phone.friendly_name ? `(${phone.friendly_name})` : ""}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onBuyNumber}
            className="px-4 py-3 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buy New
          </button>
        </div>
        <p className="text-xs text-stone-500 mt-1.5">
          Assign a phone number for this assistant to receive inbound calls
        </p>
      </div>

      {/* Model Provider & Model */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Model Provider</label>
          <select
            value={formData.modelProvider}
            onChange={(e) => handleChange("modelProvider", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {(voiceConfig?.providers || []).map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Model</label>
          <select
            value={formData.modelName}
            onChange={(e) => handleChange("modelName", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {currentProvider?.models?.map((m: any) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Voice */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Voice</label>
        <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
          {(voiceConfig?.voices || []).slice(0, 8).map((v: any) => (
            <button
              key={v.id}
              type="button"
              onClick={() => handleChange("voice", v.id)}
              className={cn(
                "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                formData.voice === v.id
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
              )}
            >
              {v.name}
            </button>
          ))}
        </div>
        {(voiceConfig?.voices || []).length > 8 && (
          <details className="mt-2">
            <summary className="text-sm text-teal-600 cursor-pointer">Show more voices</summary>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {(voiceConfig?.voices || []).slice(8).map((v: any) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleChange("voice", v.id)}
                  className={cn(
                    "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                    formData.voice === v.id
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                  )}
                >
                  {v.name}
                </button>
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
          rows={2}
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-white transition-all resize-none",
            "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
            errors.firstMessage ? "border-red-300" : "border-stone-200"
          )}
        />
        {errors.firstMessage && <p className="text-red-500 text-sm mt-1">{errors.firstMessage}</p>}
      </div>

      {/* System Prompt */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          System Prompt <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.systemPrompt}
          onChange={(e) => handleChange("systemPrompt", e.target.value)}
          rows={4}
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-white transition-all resize-none font-mono text-sm",
            "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
            errors.systemPrompt ? "border-red-300" : "border-stone-200"
          )}
        />
        {errors.systemPrompt && <p className="text-red-500 text-sm mt-1">{errors.systemPrompt}</p>}
      </div>

      {/* End Call Message */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          End Call Message <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.endCallMessage}
          onChange={(e) => handleChange("endCallMessage", e.target.value)}
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-white transition-all",
            "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500",
            errors.endCallMessage ? "border-red-300" : "border-stone-200"
          )}
        />
        {errors.endCallMessage && <p className="text-red-500 text-sm mt-1">{errors.endCallMessage}</p>}
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Max Call Duration</label>
        <div className="flex flex-wrap gap-2">
          {(voiceConfig?.durationPresets || []).map((p: any) => (
            <button
              key={p.value}
              type="button"
              onClick={() => handleChange("maxCallDurationSeconds", p.value)}
              className={cn(
                "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                formData.maxCallDurationSeconds === p.value
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-stone-100">
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={cn(
            "flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all",
            "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600",
            "disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          )}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isEdit ? "Saving..." : "Creating..."}
            </>
          ) : (
            <>{isEdit ? "Save Changes" : "Create Assistant"}</>
          )}
        </button>
      </div>
    </div>
  );
}

// File Type Icons
const FILE_ICONS: Record<string, string> = {
  ".pdf": "📄",
  ".csv": "📊",
  ".txt": "📝",
  ".docx": "📃",
  ".doc": "📃",
};

function BusinessDashboardContent() {
  const params = useParams();
  const businessId = params.businessId as string;
  
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [assistants, setAssistants] = useState<VoiceAssistant[]>([]);
  const [files, setFiles] = useState<KnowledgeBaseFile[]>([]);
  const [config, setConfig] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState<VoiceAssistant | null>(null);
  
  // File upload
  const [uploading, setUploading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [businessRes, phonesRes, assistantsRes, filesRes, configRes] = await Promise.all([
        apiFetch<BusinessData>(API_ENDPOINTS.business.byId(businessId)),
        apiFetch<PhoneNumber[]>(API_ENDPOINTS.phoneNumbers.list(businessId)).catch(() => []),
        apiFetch<VoiceAssistant[]>(API_ENDPOINTS.voiceAssistant.list(businessId)).catch(() => []),
        apiFetch<KnowledgeBaseFile[]>(API_ENDPOINTS.knowledgeBase.list(businessId)).catch(() => []),
        apiFetch<any>(API_ENDPOINTS.config.onboarding),
      ]);
      
      setBusiness(businessRes);
      setPhoneNumbers(phonesRes);
      setAssistants(assistantsRes);
      setFiles(filesRes);
      setConfig(configRes);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
  }, [businessId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(uploadedFiles).forEach((file) => {
        formData.append("files", file);
      });
      
      await apiFetch(API_ENDPOINTS.knowledgeBase.upload(businessId), {
        method: "POST",
        body: formData,
      });
      
      const newFiles = await apiFetch<KnowledgeBaseFile[]>(API_ENDPOINTS.knowledgeBase.list(businessId));
      setFiles(newFiles);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await apiFetch(API_ENDPOINTS.knowledgeBase.delete(businessId, fileId), { method: "DELETE" });
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEditAssistant = (assistant: VoiceAssistant) => {
    setEditingAssistant(assistant);
    setShowAssistantModal(true);
  };

  const handleCloseAssistantModal = () => {
    setShowAssistantModal(false);
    setEditingAssistant(null);
  };

  const getAssignedPhoneNumber = (assistant: VoiceAssistant): PhoneNumber | undefined => {
    if (!assistant.phone_number_id) return undefined;
    return phoneNumbers.find((p) => p.id === assistant.phone_number_id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-12 h-12 text-teal-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-stone-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Dashboard Not Found</h2>
          <p className="text-stone-600 mb-6">{error || "The requested dashboard could not be found."}</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors group mb-6"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900">
              {business.name}
            </h1>
            {business.description && (
              <p className="text-stone-600 mt-1 max-w-2xl">{business.description}</p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPhoneModal(true)}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all",
                "bg-white border-2 border-teal-500 text-teal-700 hover:bg-teal-50"
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Buy Phone Number
            </button>
            <button
              onClick={() => {
                setEditingAssistant(null);
                setShowAssistantModal(true);
              }}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all",
                "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600",
                "shadow-lg shadow-teal-500/25"
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Phone Numbers Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-900">Phone Numbers</h2>
          <span className="text-sm text-stone-500">{phoneNumbers.length} number{phoneNumbers.length !== 1 ? "s" : ""}</span>
            </div>
        
        {phoneNumbers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 text-center">
            <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">No phone numbers yet</h3>
            <p className="text-stone-500 mb-4">Purchase a phone number to start receiving calls</p>
            <button
              onClick={() => setShowPhoneModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
            >
              Buy Phone Number
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phoneNumbers.map((phone) => (
              <div key={phone.id} className="bg-white rounded-2xl p-5 shadow-lg shadow-stone-200/50 border border-stone-100">
          <div className="flex items-start justify-between">
            <div>
                    <p className="text-xl font-bold text-stone-900 font-mono">
                      {formatPhoneNumber(phone.phone_number)}
              </p>
                    {phone.friendly_name && <p className="text-sm text-stone-500 mt-1">{phone.friendly_name}</p>}
            </div>
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {phone.status}
            </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Knowledge Base Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-900">Knowledge Base</h2>
          <span className="text-sm text-stone-500">{files.length} file{files.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-stone-200/50 border border-stone-100 overflow-hidden">
          <div className="p-5 border-b border-stone-100">
            <label className={cn(
              "flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all",
              uploading ? "border-teal-300 bg-teal-50" : "border-stone-200 hover:border-teal-400 hover:bg-teal-50/50"
            )}>
              <input
                type="file"
                multiple
                accept=".pdf,.csv,.txt,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? (
                <>
                  <svg className="animate-spin w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-teal-700 font-medium">Uploading...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-stone-600">
                    <span className="font-medium text-teal-600">Click to upload</span> or drag and drop
                  </span>
                </>
              )}
            </label>
            </div>
          
          {files.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-stone-500">No files uploaded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-stone-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-lg">
                    {FILE_ICONS[file.file_type] || "📄"}
          </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 truncate">{file.filename}</p>
                    <p className="text-sm text-stone-500">
                      {formatFileSize(file.file_size)} • {new Date(file.uploaded_at).toLocaleDateString()}
          </p>
        </div>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
      </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Voice Assistants Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-900">Voice Assistants</h2>
          <span className="text-sm text-stone-500">{assistants.length} assistant{assistants.length !== 1 ? "s" : ""}</span>
            </div>
        
        {assistants.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 text-center">
            <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">No voice assistants yet</h3>
            <p className="text-stone-500 mb-4">Create an AI assistant to handle your calls</p>
            <button
              onClick={() => {
                setEditingAssistant(null);
                setShowAssistantModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
            >
              Create Assistant
          </button>
        </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assistants.map((assistant) => {
              const assignedPhone = getAssignedPhoneNumber(assistant);
              return (
                <div key={assistant.id} className="bg-white rounded-2xl p-5 shadow-lg shadow-stone-200/50 border border-stone-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-stone-900">{assistant.name}</h3>
                      <p className="text-sm text-stone-500 mt-1 line-clamp-1">{assistant.first_message}</p>
      </div>
                    <button
                      onClick={() => handleEditAssistant(assistant)}
                      className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-all"
                      title="Edit assistant"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
                    </button>
          </div>
                  
                  {/* Inbound Number */}
                  {assignedPhone && (
                    <div className="mb-3 p-3 bg-teal-50 rounded-xl border border-teal-100">
                      <p className="text-xs text-teal-600 font-medium mb-1">Inbound Number</p>
                      <p className="text-sm font-mono font-semibold text-teal-900">
                        {formatPhoneNumber(assignedPhone.phone_number)}
            </p>
          </div>
                  )}
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-medium">
                      {assistant.voice}
                    </span>
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-medium">
                      {assistant.model_provider}
                    </span>
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-medium">
                      {assistant.model_name}
                    </span>
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-medium">
                      {Math.floor(assistant.max_call_duration_seconds / 60)}m max
                    </span>
        </div>
      </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Phone Modal */}
      <Modal isOpen={showPhoneModal} onClose={() => setShowPhoneModal(false)} title="Buy Phone Number">
        <AddPhoneNumberForm
          businessId={businessId}
          config={config}
          onSuccess={() => {
            setShowPhoneModal(false);
            fetchData();
          }}
          onCancel={() => setShowPhoneModal(false)}
        />
      </Modal>

      {/* Assistant Modal (Create/Edit) */}
      <Modal
        isOpen={showAssistantModal}
        onClose={handleCloseAssistantModal}
        title={editingAssistant ? "Edit Voice Assistant" : "Create Voice Assistant"}
        size="lg"
      >
        <VoiceAssistantForm
          businessId={businessId}
          businessName={business.name}
          assistant={editingAssistant || undefined}
          phoneNumbers={phoneNumbers}
          config={config}
          onSuccess={() => {
            handleCloseAssistantModal();
            fetchData();
          }}
          onCancel={handleCloseAssistantModal}
          onBuyNumber={() => {
            handleCloseAssistantModal();
            setShowPhoneModal(true);
          }}
        />
      </Modal>
    </div>
  );
}

/**
 * Business Dashboard page with Suspense boundary for useParams.
 */
export default function BusinessDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-stone-200 rounded-xl" />
            <div className="w-48 h-4 bg-stone-200 rounded" />
            <div className="w-32 h-3 bg-stone-200 rounded" />
          </div>
        </div>
      }
    >
      <BusinessDashboardContent />
    </Suspense>
  );
}
