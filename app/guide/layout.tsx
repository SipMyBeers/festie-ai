import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "../globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Festie.ai — Coachella Guide",
  description: "Your offline festival companion for Coachella 2026",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Festie Guide",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#7c3aed",
  viewportFit: "cover",
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${body.variable} ${display.variable} min-h-screen bg-festie-dark text-white font-body`}>
      {children}
    </div>
  );
}
