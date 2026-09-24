import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { CrtOverlay } from "@/components/crt-overlay";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Retro Ollie Games — Old Tech. New Life.",
    template: "%s | Retro Ollie Games",
  },
  description:
    "Retro Ollie Games is an online refurb store: buy restored consoles and games, sell or trade your gear, or send your console in for professional cleaning and refurbishment. Old tech. New life.",
  openGraph: {
    siteName: "Retro Ollie Games",
    type: "website",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${pressStart.variable} min-h-dvh bg-ink font-display text-bone`}
      >
        <Suspense>
          <Header />
        </Suspense>
        {children}
        <Footer />
        <CrtOverlay />
      </body>
    </html>
  );
}
