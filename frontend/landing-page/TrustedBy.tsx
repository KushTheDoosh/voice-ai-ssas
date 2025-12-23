"use client";

import { cn, ContainerConfig } from "@/utils";

interface Partner {
  name: string;
  logoText: string;
}

const defaultPartners: Partner[] = [
  { name: "TechCorp", logoText: "TechCorp" },
  { name: "GlobalFinance", logoText: "GlobalFinance" },
  { name: "HealthFirst", logoText: "HealthFirst" },
  { name: "RetailMax", logoText: "RetailMax" },
  { name: "InsurePro", logoText: "InsurePro" },
  { name: "AutoServe", logoText: "AutoServe" },
];

export class TrustedByConfig {
  readonly headline: string = "Trusted by leading companies across industries";
  readonly partners: Partner[] = defaultPartners;
}

interface TrustedByProps {
  config?: TrustedByConfig;
}

export default function TrustedBy({ config = new TrustedByConfig() }: TrustedByProps) {
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-stone-50 border-y border-stone-100">
      <div className={ContainerConfig.getContainerClasses()}>
        {/* Headline */}
        <p className="text-center text-stone-500 text-xs sm:text-sm mb-6 sm:mb-8 md:mb-10 uppercase tracking-wider px-4 sm:px-0">
          {config.headline}
        </p>

        {/* Logo Strip */}
        <div className="relative overflow-hidden">
          {/* Gradient Fade - Left */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
          
          {/* Gradient Fade - Right */}
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />

          {/* Logos Container */}
          <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 overflow-x-auto sm:overflow-visible px-4 sm:px-0 scrollbar-hide">
            {config.partners.map((partner, index) => (
              <div
                key={index}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-300 hover:text-stone-400 transition-colors cursor-default select-none whitespace-nowrap shrink-0 sm:shrink"
              >
                {partner.logoText}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
