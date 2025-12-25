"use client";

import { useState, useEffect, useCallback } from "react";
import { useOnboardingStore, PhoneNumberData } from "../../store/onboardingStore";
import { PhoneNumberConfig } from "../../store/configStore";
import { cn, API_ENDPOINTS, apiFetch, formatPhoneNumber } from "@/utils";

interface AvailableNumber {
  phone_number: string;
  friendly_name: string;
  locality?: string;
  region?: string;
  country_code: string;
  price_monthly: number;
  number_type: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
}

interface Props {
  config: PhoneNumberConfig;
}

const PRICE_PER_NUMBER = 5.00;

export default function PhoneNumberSelection({ config }: Props) {
  const { 
    businessId, 
    setPhoneNumberData, 
    nextStep, 
    prevStep,
    isLoading, 
    setLoading, 
    setError 
  } = useOnboardingStore();
  
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<AvailableNumber | null>(null);
  const [searchLoading, setSearchLoading] = useState(true);
  const [pattern, setPattern] = useState("");

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
      
      const response = await apiFetch<{ numbers: AvailableNumber[] }>(
        `${API_ENDPOINTS.phoneNumbers.available}?${params}`
      );
      
      setAvailableNumbers(response.numbers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load numbers");
    } finally {
      setSearchLoading(false);
    }
  }, [setError]);

  // Fetch numbers on mount
  useEffect(() => {
    fetchNumbers();
  }, [fetchNumbers]);

  const handleSearch = () => {
    setSelectedNumber(null);
    fetchNumbers(pattern);
  };

  const handlePurchase = async () => {
    if (!selectedNumber || !businessId) {
      setError("Please select a phone number");
      return;
    }
    
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
      
      const phoneData: PhoneNumberData = {
        phoneNumber: selectedNumber.phone_number,
        friendlyName: selectedNumber.friendly_name,
        locality: selectedNumber.locality,
        region: selectedNumber.region,
        priceMonthly: PRICE_PER_NUMBER,
      };
      
      setPhoneNumberData(phoneData);
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">
          {config.title}
        </h2>
        <p className="text-stone-600 mt-1">
          {config.subtitle}
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-teal-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-teal-800">
            <p className="font-medium mb-1">How it works</p>
            <p className="text-teal-700">
              Search for available phone numbers by area code. For example, enter <span className="font-mono bg-teal-100 px-1 rounded">615</span> to find 
              Nashville numbers, or <span className="font-mono bg-teal-100 px-1 rounded">212</span> for New York.
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-stone-50 rounded-xl p-5 space-y-4">
        {/* Country Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-lg">
            <span className="text-xl">🇺🇸</span>
            <span className="font-medium text-stone-900">United States</span>
          </div>
          <span className="text-stone-400">•</span>
          <span className="text-stone-600 font-medium">${PRICE_PER_NUMBER.toFixed(2)}/month per number</span>
        </div>
        
        {/* Pattern Search */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Search by Area Code <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="e.g. 415, 212, 615"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono text-lg"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className={cn(
                "px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
                "bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50"
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
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Phone Number Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-stone-900">Available Numbers</h3>
          {!searchLoading && availableNumbers.length > 0 && (
            <span className="text-sm text-stone-500">{availableNumbers.length} found</span>
          )}
        </div>
        
        <div className="border border-stone-200 rounded-xl overflow-hidden">
          {searchLoading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-stone-50">
              <svg className="animate-spin w-10 h-10 text-teal-500 mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-stone-600 font-medium">Searching available numbers...</p>
              <p className="text-stone-400 text-sm mt-1">This may take a moment</p>
            </div>
          ) : availableNumbers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-stone-50">
              <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-stone-700 font-semibold mb-1">No numbers found</p>
              <p className="text-stone-500 text-sm text-center max-w-xs">
                Try a different area code or clear the search to see all available numbers
              </p>
            </div>
          ) : (
            <div className="max-h-[320px] overflow-y-auto divide-y divide-stone-100">
              {availableNumbers.map((num) => {
                const isSelected = selectedNumber?.phone_number === num.phone_number;
                return (
                  <button
                    key={num.phone_number}
                    onClick={() => setSelectedNumber(num)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 transition-all text-left",
                      isSelected
                        ? "bg-teal-50"
                        : "bg-white hover:bg-stone-50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                        isSelected ? "border-teal-500 bg-teal-500" : "border-stone-300"
                      )}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className={cn("font-mono text-lg font-semibold", isSelected ? "text-teal-900" : "text-stone-900")}>
                          {formatPhoneNumber(num.phone_number)}
                        </p>
                        {(num.locality || num.region) && (
                          <p className="text-sm text-stone-500">
                            {num.locality ? `${num.locality}, ` : ""}{num.region || ""}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Capabilities */}
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex gap-1.5">
                        {num.capabilities.voice && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 rounded-full text-xs text-stone-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Voice
                          </span>
                        )}
                        {num.capabilities.sms && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 rounded-full text-xs text-stone-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            SMS
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Number Summary */}
      {selectedNumber && (
        <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-700 font-medium">Selected Number</p>
              <p className="text-xl font-bold text-teal-900 font-mono">
                {formatPhoneNumber(selectedNumber.phone_number)}
              </p>
              {(selectedNumber.locality || selectedNumber.region) && (
                <p className="text-sm text-teal-600">
                  {selectedNumber.locality ? `${selectedNumber.locality}, ` : ""}{selectedNumber.region || ""}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-teal-900">
                ${PRICE_PER_NUMBER.toFixed(2)}
                <span className="text-sm font-normal text-teal-600">/mo</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
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
          onClick={handlePurchase}
          disabled={isLoading || !selectedNumber}
          className={cn(
            "flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200",
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
              Purchasing...
            </>
          ) : (
            <>
              Purchase & Continue
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
