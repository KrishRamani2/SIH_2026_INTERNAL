import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShieldSense SOC | Intelligent DDoS Detection Platform — SIH 2026",
  description: "Real-time DDoS detection and response platform featuring ML-powered OS fingerprinting, traffic forecasting, behavioral clustering, and automated mitigation. Built for SIH 2026.",
  keywords: ["DDoS", "SOC", "cybersecurity", "SIH2026", "ML", "intrusion detection", "ShieldSense"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
