import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "ShieldSense SOC | Intelligent DDoS Detection Platform — SIH 2026",
  description: "Real-time DDoS detection & response platform with ML-powered OS fingerprinting, traffic forecasting, and automated mitigation. SIH 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
