"use client";

import Link from "next/link";
import { cn, ContainerConfig } from "@/utils";

interface FooterLink {
  label: string;
  href: string;
}

const defaultLegalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "DPA", href: "/dpa" },
];

const defaultSocialLinks: FooterLink[] = [
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

export class FooterConfig {
  readonly companyName: string = "VoiceAI Labs Inc.";
  readonly currentYear: number = new Date().getFullYear();
  readonly legalLinks: FooterLink[] = defaultLegalLinks;
  readonly socialLinks: FooterLink[] = defaultSocialLinks;
}

interface FooterProps {
  config?: FooterConfig;
}

export default function Footer({ config = new FooterConfig() }: FooterProps) {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className={cn(ContainerConfig.getContainerClasses(), "py-8 sm:py-10 md:py-12")}>
        <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between">
          {/* Copyright - Center on mobile, left on desktop */}
          <div className="text-xs sm:text-sm text-center md:text-left order-3 md:order-1">
            &copy;{config.currentYear} {config.companyName}
          </div>

          {/* Legal Links - Always centered */}
          <nav className="order-1 md:order-2">
            <ul className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
              {config.legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links - Center on mobile, right on desktop */}
          <div className="flex items-center justify-center md:justify-end gap-4 sm:gap-6 order-2 md:order-3">
            {config.socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
