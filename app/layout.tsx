import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument" });

const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "polaslot.fun";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "PolaSlot";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${domain}`),
  title: { default: `${appName} — AI Hawkeye Predictions & Matchup Slot`, template: `%s · ${appName}` },
  description:
    "The predictive odds & tactical line analytics engine built for Hawkeye Nation. Spin live game scenarios, run AI match simulations, and generate gameday collectibles.",
  openGraph: { siteName: appName, type: "website", url: `https://${domain}` },
  twitter: { card: "summary_large_image", site: "@HawkeyeReport" },
  other: { "ory-verify": "orynth-b7979e33a2ce4b3dbc05486ec13735d7" },
};

export const viewport: Viewport = { themeColor: "#FAFAFA" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body className="min-h-dvh font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
