"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn, ContainerConfig } from "@/utils";

interface BusinessData {
  id: string;
  name: string;
  description?: string;
}

interface PhoneNumber {
  phone_number: string;
  friendly_name?: string;
  status: string;
}

interface VoiceAssistant {
  name: string;
  voice: string;
  model_provider: string;
  model_name: string;
}

export default function BusinessDashboard() {
  const params = useParams();
  const businessId = params.businessId as string;
  
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<PhoneNumber | null>(null);
  const [assistant, setAssistant] = useState<VoiceAssistant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [businessRes, phoneRes, assistantRes] = await Promise.all([
          fetch(`http://localhost:8000/api/v1/business/${businessId}`),
          fetch(`http://localhost:8000/api/v1/phone-numbers/${businessId}`),
          fetch(`http://localhost:8000/api/v1/voice-assistant/${businessId}`),
        ]);

        if (businessRes.ok) {
          setBusiness(await businessRes.json());
        }
        if (phoneRes.ok) {
          setPhoneNumber(await phoneRes.json());
        }
        if (assistantRes.ok) {
          setAssistant(await assistantRes.json());
        }
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId]);

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
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            Start New Setup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors group mb-6"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900">
              {business.name}
            </h1>
            {business.description && (
              <p className="text-stone-600 mt-1">{business.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Phone Number Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-stone-200/50 border border-stone-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-stone-500">Phone Number</p>
              <p className="text-2xl font-bold text-stone-900 mt-1 font-mono">
                {phoneNumber?.phone_number || "Not assigned"}
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Ready to receive calls
          </p>
        </div>

        {/* Voice Assistant Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-stone-200/50 border border-stone-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-stone-500">Voice Assistant</p>
              <p className="text-2xl font-bold text-stone-900 mt-1">
                {assistant?.name || "Not configured"}
              </p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="px-2 py-1 bg-stone-100 rounded text-xs text-stone-600">
              {assistant?.voice || "N/A"}
            </span>
            <span className="px-2 py-1 bg-stone-100 rounded text-xs text-stone-600">
              {assistant?.model_name || "N/A"}
            </span>
          </div>
        </div>

        {/* Calls Today Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-stone-200/50 border border-stone-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-stone-500">Calls Today</p>
              <p className="text-2xl font-bold text-stone-900 mt-1">0</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-stone-500 mt-4">
            No calls received yet
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg shadow-stone-200/50 border border-stone-100">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 rounded-xl border border-stone-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-left group">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-teal-200 transition-colors">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <p className="font-medium text-stone-900">Test Call</p>
            <p className="text-sm text-stone-500">Make a test call to your assistant</p>
          </button>
          
          <button className="p-4 rounded-xl border border-stone-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all text-left group">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-cyan-200 transition-colors">
              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-medium text-stone-900">Edit Assistant</p>
            <p className="text-sm text-stone-500">Modify voice and behavior settings</p>
          </button>
          
          <button className="p-4 rounded-xl border border-stone-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-left group">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="font-medium text-stone-900">View Analytics</p>
            <p className="text-sm text-stone-500">See call history and insights</p>
          </button>
        </div>
      </div>

      {/* Success Message */}
      <div className="mt-8 p-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Your Voice AI is Ready!</h3>
            <p className="text-white/80 mt-1">
              Your voice assistant is now live and ready to handle calls. Share your phone number with customers to start receiving AI-powered support calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

