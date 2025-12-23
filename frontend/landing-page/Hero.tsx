"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn, TypographyConfig, ContainerConfig } from "@/utils";

export class HeroConfig {
  readonly headline: string = "Intelligent Voice AI";
  readonly headlineAccent: string = "for Modern Business";
  readonly subheadline: string =
    "AI-powered voice agents to automate customer interactions, sales calls, and support — 24/7, without sacrificing the human touch";
  readonly ctaText: string = "Get Started";
  readonly ctaHref: string = "/dashboard";
  readonly secondaryText: string = "Go live in minutes. Transform your customer experience.";
}

function CtaButton({ ctaText, ctaHref }: { ctaText: string; ctaHref: string }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(ctaHref);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-stone-900 text-white text-sm sm:text-base font-semibold rounded-full hover:bg-stone-800 transition-all hover:scale-105 shadow-lg hover:shadow-xl active:scale-100 cursor-pointer"
    >
      {ctaText}
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </button>
  );
}

interface HeroProps {
  config?: HeroConfig;
}

export default function Hero({ config = new HeroConfig() }: HeroProps) {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = orb.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / 50;
      const deltaY = (e.clientY - centerY) / 50;

      orb.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100 pt-16 sm:pt-20">
      {/* Background Orbs - Hidden on very small screens for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute -top-32 -left-32 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-stone-200/50 to-stone-300/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-32 -right-32 w-56 sm:w-72 lg:w-80 h-56 sm:h-72 lg:h-80 bg-gradient-to-tl from-stone-200/50 to-stone-300/30 rounded-full blur-3xl animate-float-slower" />
        <div className="absolute top-1/4 right-1/4 w-48 sm:w-56 lg:w-64 h-48 sm:h-56 lg:h-64 bg-gradient-to-bl from-cyan-100/30 to-teal-100/20 rounded-full blur-2xl animate-float" />
      </div>

      <div className={cn(ContainerConfig.getContainerClasses(), "relative z-10 text-center py-8 sm:py-12 lg:py-16")}>
        {/* Main Headline */}
        <h1 className={cn(
          TypographyConfig.headingSizes.h1,
          "font-bold text-stone-900 tracking-tight leading-[0.9] mb-4 sm:mb-6"
        )}>
          {config.headline}
          <br />
          <span className="text-stone-600">{config.headlineAccent}</span>
        </h1>

        {/* Subheadline */}
        <p className={cn(
          TypographyConfig.bodySizes.lg,
          "text-stone-600 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4 sm:px-0"
        )}>
          {config.subheadline}
        </p>

        {/* Interactive Orb */}
        <div className="relative flex justify-center mb-8 sm:mb-10">
          <div
            ref={orbRef}
            className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 cursor-pointer group transition-transform duration-300"
          >
            {/* Orb Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />

            {/* Main Orb */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-teal-500 to-stone-800 rounded-full shadow-2xl overflow-hidden">
              {/* Orb Highlight */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-1/3 h-1/3 bg-white/30 rounded-full blur-md" />
              <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 w-1/4 h-1/4 bg-teal-300/20 rounded-full blur-sm" />
            </div>

            {/* Tap to Talk Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center text-white">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 mb-1 opacity-80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0 3 3 0 00-6 0z"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium opacity-90">Tap to talk</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 px-4 sm:px-0">
          <CtaButton ctaText={config.ctaText} ctaHref={config.ctaHref} />
          <p className="text-xs sm:text-sm text-stone-500">{config.secondaryText}</p>
        </div>
      </div>
    </section>
  );
}
