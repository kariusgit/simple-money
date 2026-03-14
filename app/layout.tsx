import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Simple Money - Earn Daily Commissions with Simple Tasks",
  description:
    "Join 10,000+ members earning daily commissions on Simple Money. Complete tasks, unlock VIP levels, and grow your income with our transparent rewards platform.",
  keywords: [
    "earn money online",
    "daily commissions",
    "task platform",
    "passive income",
    "crypto earnings",
  ],
  openGraph: {
    title: "Simple Money - Earn Daily Commissions with Simple Tasks",
    description:
      "Join 10,000+ members earning daily commissions. Complete tasks, unlock VIP levels, and grow your income.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf9f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
