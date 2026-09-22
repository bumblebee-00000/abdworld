import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { MessageCircle } from "lucide-react";
import CustomerChatbot from "@/components/chat/CustomerChatbot";
import "./globals.css";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";
const WHATSAPP_CHANNEL_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL ??
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I want to enquire about your rice products.")}`;

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ABD WORLD - Premium Rice Wholesaler & Supplier",
    template: "%s | ABD WORLD",
  },
  description:
    "Premium quality rice wholesaler and supplier. We offer Basmati, Non-Basmati, and specialty rice varieties at wholesale prices. Trusted quality for retailers, restaurants, and businesses.",
  keywords: [
    "rice wholesaler",
    "rice supplier",
    "premium rice",
    "basmati rice",
    "wholesale rice",
    "bulk rice",
    "rice distributor",
    "ABD WORLD",
  ],
  icons: {
    icon: "/company-logo.png",
    shortcut: "/company-logo.png",
    apple: "/company-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "ABD WORLD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="antialiased">
        {children}
        <a
          href={WHATSAPP_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open WhatsApp channel"
          className="fixed bottom-5 left-5 z-[79] inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-900/20 ring-4 ring-white/80 transition-transform duration-200 hover:scale-[1.02] hover:bg-[#1ebe5d] sm:bottom-7 sm:left-7"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
        <CustomerChatbot />
      </body>
    </html>
  );
}
