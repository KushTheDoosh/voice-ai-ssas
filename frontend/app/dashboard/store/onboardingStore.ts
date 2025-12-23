import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BusinessData {
  name: string;
  description?: string;
}

export interface KnowledgeBaseFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
}

export interface PhoneNumberData {
  phoneNumber: string;
  friendlyName: string;
  locality?: string;
  region?: string;
  priceMonthly: number;
}

export interface VoiceAssistantData {
  name: string;
  firstMessage: string;
  systemPrompt: string;
  modelProvider: string;
  modelName: string;
  voice: string;
  endCallMessage: string;
  maxCallDurationSeconds: number;
}

interface OnboardingState {
  // Current step (1-4)
  currentStep: number;
  
  // Step data
  businessData: BusinessData | null;
  knowledgeBaseFiles: KnowledgeBaseFile[];
  phoneNumberData: PhoneNumberData | null;
  voiceAssistantData: VoiceAssistantData | null;
  
  // Business ID from backend
  businessId: string | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  setBusinessData: (data: BusinessData) => void;
  setBusinessId: (id: string) => void;
  
  addKnowledgeBaseFile: (file: KnowledgeBaseFile) => void;
  removeKnowledgeBaseFile: (id: string) => void;
  setKnowledgeBaseFiles: (files: KnowledgeBaseFile[]) => void;
  
  setPhoneNumberData: (data: PhoneNumberData) => void;
  
  setVoiceAssistantData: (data: VoiceAssistantData) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  businessData: null,
  knowledgeBaseFiles: [],
  phoneNumberData: null,
  voiceAssistantData: null,
  businessId: null,
  isLoading: false,
  error: null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ 
        currentStep: Math.min(state.currentStep + 1, 4) 
      })),
      
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(state.currentStep - 1, 1) 
      })),
      
      setBusinessData: (data) => set({ businessData: data }),
      
      setBusinessId: (id) => set({ businessId: id }),
      
      addKnowledgeBaseFile: (file) => set((state) => ({
        knowledgeBaseFiles: [...state.knowledgeBaseFiles, file]
      })),
      
      removeKnowledgeBaseFile: (id) => set((state) => ({
        knowledgeBaseFiles: state.knowledgeBaseFiles.filter(f => f.id !== id)
      })),
      
      setKnowledgeBaseFiles: (files) => set({ knowledgeBaseFiles: files }),
      
      setPhoneNumberData: (data) => set({ phoneNumberData: data }),
      
      setVoiceAssistantData: (data) => set({ voiceAssistantData: data }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set(initialState),
    }),
    {
      name: "onboarding-storage",
      partialize: (state) => ({
        currentStep: state.currentStep,
        businessData: state.businessData,
        phoneNumberData: state.phoneNumberData,
        voiceAssistantData: state.voiceAssistantData,
        businessId: state.businessId,
      }),
    }
  )
);

