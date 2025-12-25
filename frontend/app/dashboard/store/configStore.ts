import { create } from "zustand";
import { API_ENDPOINTS, apiFetch } from "@/utils";

// Types matching the backend config response
export interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: string;
  maxLength?: number;
}

export interface BusinessConfig {
  title: string;
  subtitle: string;
  fields: FieldConfig[];
  api: {
    endpoint: string;
  };
}

export interface FileTypeConfig {
  extension: string;
  label: string;
  icon: string;
  mimeTypes: string[];
}

export interface KnowledgeBaseConfig {
  title: string;
  subtitle: string;
  maxFileSize: number;
  maxFiles: number;
  acceptedFileTypes: FileTypeConfig[];
  api: {
    uploadEndpoint: string;
    listEndpoint: string;
    deleteEndpoint: string;
  };
}

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
}

export interface NumberTypeConfig {
  id: string;
  name: string;
  description: string;
}

export interface PhoneNumberConfig {
  title: string;
  subtitle: string;
  countries: CountryConfig[];
  numberTypes: NumberTypeConfig[];
  api: {
    searchEndpoint: string;
    purchaseEndpoint: string;
    listEndpoint: string;
  };
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  models: ModelConfig[];
}

export interface VoiceConfig {
  id: string;
  name: string;
  gender: string;
  accent: string;
}

export interface DurationPreset {
  value: number;
  label: string;
}

export interface VoiceAssistantConfig {
  title: string;
  subtitle: string;
  providers: ProviderConfig[];
  voices: VoiceConfig[];
  durationPresets: DurationPreset[];
  defaults: {
    systemPrompt: string;
    firstMessage: string;
    endCallMessage: string;
    maxCallDurationSeconds: number;
  };
  api: {
    endpoint: string;
    completeEndpoint: string;
  };
}

export interface OnboardingConfig {
  steps: StepConfig[];
  business: BusinessConfig;
  knowledgeBase: KnowledgeBaseConfig;
  phoneNumber: PhoneNumberConfig;
  voiceAssistant: VoiceAssistantConfig;
}

interface ConfigState {
  config: OnboardingConfig | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchConfig: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  config: null,
  isLoading: false,
  error: null,
};

export const useConfigStore = create<ConfigState>((set, get) => ({
  ...initialState,
  
  fetchConfig: async () => {
    // Don't refetch if already loaded
    if (get().config) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const config = await apiFetch<OnboardingConfig>(API_ENDPOINTS.config.onboarding);
      set({ config, isLoading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : "Failed to load configuration",
        isLoading: false 
      });
    }
  },
  
  reset: () => set(initialState),
}));

