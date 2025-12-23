"use client";

import React from "react";
import { cn, TypographyConfig, ContainerConfig, GridConfig } from "@/utils";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const defaultFeatures: Feature[] = [
  {
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "24/7 Availability",
    description: "Never miss a call. Our AI voice agents work around the clock, handling customer inquiries even when your team is offline.",
  },
  {
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Natural Conversations",
    description: "Advanced AI that understands context, handles interruptions, and responds with human-like empathy and clarity.",
  },
  {
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Deployment",
    description: "Go live in minutes, not months. Simple integration with your existing phone systems and CRM platforms.",
  },
  {
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Real-time Analytics",
    description: "Deep insights into every conversation. Track sentiment, identify trends, and optimize performance.",
  },
  {
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Enterprise Security",
    description: "Bank-level encryption and SOC 2 compliance. Your customer data is protected with the highest security standards.",
  },
  {
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Seamless Handoffs",
    description: "When human expertise is needed, AI seamlessly transfers calls with full context for smooth experiences.",
  },
];

export class FeaturesConfig {
  readonly sectionTitle: string = "Why Choose VoiceAI";
  readonly sectionSubtitle: string =
    "Powerful features that transform how businesses communicate";
  readonly features: Feature[] = defaultFeatures;
}

interface FeaturesProps {
  config?: FeaturesConfig;
}

export default function Features({ config = new FeaturesConfig() }: FeaturesProps) {
  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white">
      <div className={ContainerConfig.getContainerClasses()}>
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className={cn(
            TypographyConfig.headingSizes.h2,
            "font-bold text-stone-900 mb-3 sm:mb-4"
          )}>
            {config.sectionTitle}
          </h2>
          <p className={cn(
            TypographyConfig.bodySizes.lg,
            "text-stone-600 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-4 sm:px-0"
          )}>
            {config.sectionSubtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className={cn(
          "grid gap-4 sm:gap-6 md:gap-8",
          GridConfig.getGridCols(1, 2, 3)
        )}>
          {config.features.map((feature, index) => (
            <div
              key={index}
              className="group p-5 sm:p-6 md:p-8 bg-stone-50 rounded-xl sm:rounded-2xl border border-stone-100 hover:border-stone-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-semibold text-stone-900 mb-2 sm:mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
