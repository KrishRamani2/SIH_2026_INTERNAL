"use client";
import { geoAttacks } from "@/lib/mockData";
import { Globe } from "lucide-react";

const countryFlags: Record<string, string> = {
  CN: "🇨🇳", RU: "🇷🇺", US: "🇺🇸", BR: "🇧🇷",
  IN: "🇮🇳", DE: "🇩🇪", NL: "🇳🇱", UA: "🇺🇦", IR: "🇮🇷", NG: "🇳🇬",
};

export default function TopOrigins() {
  const top5 = geoAttacks.slice(0, 5);

  return (
    <div className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", height: "100%", justifyContent: "flex-start", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Globe size={14} color="#F25C1F" />
        <div style={{ fontSize: 13, fontWeight: 600, color: "#161616" }}>Top Origins</div>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>
        {top5.map(g => (
          <div key={g.code} style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13 }}>{countryFlags[g.code]}</span>
              <span style={{ fontWeight: 600, color: "#161616", fontSize: 11 }}>{g.country}</span>
            </div>
            <span className="mono" style={{ fontWeight: 700, color: "#F25C1F", fontSize: 11, marginLeft: 22 }}>
              {g.attacks >= 1000 ? (g.attacks / 1000).toFixed(1) + 'k' : g.attacks}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
