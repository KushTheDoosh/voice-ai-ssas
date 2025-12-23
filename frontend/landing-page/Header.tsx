"use client";

import { useState } from "react";
import Link from "next/link";
import { cn, ContainerConfig } from "@/utils";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Blog", href: "#blog" },
  { label: "Security", href: "#security" },
];

export class HeaderConfig {
  readonly logoText: string = "VoiceAI";
  readonly tagline: string = "backed by innovation";
  readonly navItems: NavItem[] = navItems;
}

interface HeaderProps {
  config?: HeaderConfig;
}

export default function Header({ config = new HeaderConfig() }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-50/80 backdrop-blur-md">
      <div className={cn(ContainerConfig.getContainerClasses(), "py-3 sm:py-4")}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1 group shrink-0">
            <span className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {config.logoText}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 hidden sm:inline">
              {config.tagline}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-0.5 bg-stone-100 rounded-full px-1.5 py-1 border border-stone-200">
              {config.navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="px-3 xl:px-4 py-1.5 sm:py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors rounded-full hover:bg-white whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900 -mr-2"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-80 mt-4 pt-4 border-t border-stone-200" : "max-h-0"
          )}
        >
          <ul className="flex flex-col gap-1">
            {config.navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
