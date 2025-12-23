"use client";

import { useState, useEffect } from "react";
import { useOnboardingStore, PhoneNumberData } from "../../store/onboardingStore";
import { PhoneNumberConfig } from "./PhoneNumberConfig";
import PhoneNumberCard from "./PhoneNumberCard";
import { cn } from "@/utils";

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

export default function PhoneNumberSelection() {
  const { 
    businessId, 
    phoneNumberData, 
    setPhoneNumberData, 
    nextStep, 
    prevStep,
    isLoading, 
    setLoading, 
    setError 
  } = useOnboardingStore();
  
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<AvailableNumber | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Filters
  const [countryCode, setCountryCode] = useState("US");
  const [areaCode, setAreaCode] = useState("");
  const [numberType, setNumberType] = useState("local");

  const fetchNumbers = async () => {
    setSearchLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        country_code: countryCode,
        number_type: numberType,
        limit: "20",
      });
      
      if (areaCode) {
        params.append("area_code", areaCode);
      }
      
      const response = await fetch(
        `${PhoneNumberConfig.api.searchEndpoint}?${params}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch phone numbers");
      }
      
      const data = await response.json();
      setAvailableNumbers(data.numbers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load numbers");
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, [countryCode, numberType]);

  const handleSearch = () => {
    fetchNumbers();
  };

  const handleSelectNumber = (number: AvailableNumber) => {
    setSelectedNumber(number);
  };

  const handlePurchase = async () => {
    if (!selectedNumber || !businessId) {
      setError("Please select a phone number");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${PhoneNumberConfig.api.purchaseEndpoint}/${businessId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: selectedNumber.phone_number,
            friendly_name: selectedNumber.friendly_name,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to purchase phone number");
      }
      
      const phoneData: PhoneNumberData = {
        phoneNumber: selectedNumber.phone_number,
        friendlyName: selectedNumber.friendly_name,
        locality: selectedNumber.locality,
        region: selectedNumber.region,
        priceMonthly: selectedNumber.price_monthly,
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
      <div>
        <h2 className="text-2xl font-bold text-stone-900">
          {PhoneNumberConfig.title}
        </h2>
        <p className="text-stone-600 mt-1">
          {PhoneNumberConfig.subtitle}
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-stone-50 rounded-xl">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Country
          </label>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            {PhoneNumberConfig.countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Area Code */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Area Code (optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="e.g. 415"
              className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="px-4 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Number Type */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Number Type
          </label>
          <div className="flex gap-2">
            {PhoneNumberConfig.numberTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setNumberType(type.id)}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all",
                  numberType === type.id
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                )}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phone number grid */}
      <div className="min-h-[300px]">
        {searchLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-stone-500">Searching available numbers...</p>
            </div>
          </div>
        ) : availableNumbers.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-stone-50 rounded-xl">
            <div className="text-center">
              <svg className="w-12 h-12 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <p className="text-stone-500">No numbers available</p>
              <p className="text-sm text-stone-400 mt-1">Try a different area code or country</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableNumbers.map((number) => (
              <PhoneNumberCard
                key={number.phone_number}
                number={number}
                isSelected={selectedNumber?.phone_number === number.phone_number}
                onSelect={() => handleSelectNumber(number)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selected number summary */}
      {selectedNumber && (
        <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-700 font-medium">Selected Number</p>
              <p className="text-lg font-bold text-teal-900 font-mono">
                {PhoneNumberConfig.formatPhoneNumber(selectedNumber.phone_number)}
              </p>
            </div>
            <p className="text-lg font-bold text-teal-900">
              ${selectedNumber.price_monthly.toFixed(2)}/mo
            </p>
          </div>
        </div>
      )}

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

