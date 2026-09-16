import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import CustomerChatbot from "@/components/chat/CustomerChatbot";
import "./globals.css";

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
    default: "ABD World Rice - Premium Rice Wholesaler & Supplier",
    template: "%s | ABD World Rice",
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
    "ABD World Rice",
  ],
  icons: {
    icon: "/company-logo.png",
    shortcut: "/company-logo.png",
    apple: "/company-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "ABD World Rice",
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
        <CustomerChatbot />
      </body>
    </html>
  );
}
