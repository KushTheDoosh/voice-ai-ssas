"use client";

import BusinessList from "./BusinessList";

/**
 * Home page content component.
 * Displays the list of businesses and welcome message.
 */
export default function Home() {
  return (
    <div className="py-4">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          Welcome to VoiceAI
        </h1>
        <p className="text-stone-600">
          Manage your voice assistants and monitor call performance from your dashboard.
        </p>
      </div>
      
      {/* Business List */}
      <BusinessList />
    </div>
  );
}

// Re-export components
export { default as BusinessList } from "./BusinessList";
export { default as BusinessCard } from "./BusinessCard";

