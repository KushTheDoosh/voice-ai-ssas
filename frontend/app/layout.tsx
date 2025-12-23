import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoiceAI - Intelligent Voice AI for Modern Business",
  description:
    "AI-powered voice agents to automate customer interactions, sales calls, and support — 24/7, without sacrificing the human touch.",
  keywords: [
    "voice AI",
    "AI voice agent",
    "conversational AI",
    "customer service automation",
    "sales automation",
  ],
  openGraph: {
    title: "VoiceAI - Intelligent Voice AI for Modern Business",
    description:
      "AI-powered voice agents to automate customer interactions, sales calls, and support — 24/7.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
