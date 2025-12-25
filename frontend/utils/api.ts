/**
 * API utilities for the Voice AI SaaS frontend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  // Config
  config: {
    onboarding: `${API_BASE_URL}/api/v1/config/onboarding`,
  },
  // Business
  business: {
    base: `${API_BASE_URL}/api/v1/business`,
    list: `${API_BASE_URL}/api/v1/business`,
    byId: (id: string) => `${API_BASE_URL}/api/v1/business/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/v1/business/${id}`,
  },
  // Knowledge Base
  knowledgeBase: {
    upload: (businessId: string) => `${API_BASE_URL}/api/v1/knowledge-base/upload/${businessId}`,
    list: (businessId: string) => `${API_BASE_URL}/api/v1/knowledge-base/${businessId}`,
    delete: (businessId: string, fileId: string) => `${API_BASE_URL}/api/v1/knowledge-base/${businessId}/${fileId}`,
  },
  // Phone Numbers
  phoneNumbers: {
    available: `${API_BASE_URL}/api/v1/phone-numbers/available`,
    purchase: (businessId: string) => `${API_BASE_URL}/api/v1/phone-numbers/purchase/${businessId}`,
    list: (businessId: string) => `${API_BASE_URL}/api/v1/phone-numbers/${businessId}`,
    delete: (businessId: string, phoneId: string) => `${API_BASE_URL}/api/v1/phone-numbers/${businessId}/${phoneId}`,
  },
  // Voice Assistant
  voiceAssistant: {
    create: (businessId: string) => `${API_BASE_URL}/api/v1/voice-assistant/${businessId}`,
    list: (businessId: string) => `${API_BASE_URL}/api/v1/voice-assistant/${businessId}`,
    byId: (businessId: string, assistantId: string) => `${API_BASE_URL}/api/v1/voice-assistant/${businessId}/${assistantId}`,
    options: `${API_BASE_URL}/api/v1/voice-assistant/options`,
  },
  // Onboarding
  onboarding: {
    complete: `${API_BASE_URL}/api/v1/onboarding/complete`,
  },
};

/**
 * Generic fetch wrapper with error handling
 */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete (defaultHeaders as Record<string, string>)["Content-Type"];
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(number: string): string {
  if (number.startsWith("+1") && number.length === 12) {
    const cleaned = number.slice(2);
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return number;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return "." + (filename.split(".").pop()?.toLowerCase() || "");
}

