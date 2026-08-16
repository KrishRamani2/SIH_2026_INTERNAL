"use client";
import { geoAttacks } from "@/lib/mockData";
import { ArrowRight, Globe } from "lucide-react";

const countryFlags: Record<string, string> = {
  CN: "🇨🇳", RU: "🇷🇺", US: "🇺🇸", BR: "🇧🇷",
  IN: "🇮🇳", DE: "🇩🇪", NL: "🇳🇱", UA: "🇺🇦", IR: "🇮🇷", NG: "🇳🇬",
};

// Pixel-accurate coordinates mapped to world-map.png (800 x 480 viewBox)
const countryCoords: Record<string, { x: number; y: number }> = {
  IN: { x: 550, y: 230 }, // Indian Subcontinent
  CN: { x: 635, y: 175 }, // East-Central China
  RU: { x: 560, y: 105 }, // Russia (Central Eurasia)
  US: { x: 195, y: 165 }, // Continental United States
  BR: { x: 280, y: 315 }, // Brazil / South America
  DE: { x: 432, y: 128 }, // Germany (Central Europe)
  NL: { x: 416, y: 118 }, // Netherlands (North Sea)
  UA: { x: 472, y: 132 }, // Ukraine (Eastern Europe)
  IR: { x: 508, y: 185 }, // Iran (Middle East)
  NG: { x: 415, y: 255 }, // Nigeria (West Africa)
};

export default function GeoPanel() {
  const attacks = geoAttacks;
  const maxA = Math.max(...attacks.map(g => g.attacks));
  const server = countryCoords.IN;
  const top4 = geoAttacks.slice(0, 4);

  const attackTrajectories = attacks.filter(g => g.code !== "IN").map(g => {
    const coord = countryCoords[g.code] || { x: 400, y: 200 };
    const sx = coord.x;
    const sy = coord.y;
    const tx = server.x;
    const ty = server.y;
    const mx = (sx + tx) / 2;
    const my = Math.min(sy, ty) - (Math.abs(sx - tx) > 300 ? 55 : 35);
    return {
      d: `M ${sx} ${sy} Q ${mx} ${my} ${tx} ${ty}`,
      animate: g.attacks > (maxA * 0.5),
      dur: `${2 + Math.random()}s`
    };
  });

  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      {/* Card Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Globe size={14} color="#F25C1F" />
          <div style={{ fontSize: 13, fontWeight: 600, color: "#161616" }}>Geographic Attack Sources</div>
        </div>
        <div style={{ fontSize: 11, color: "#8E8B82" }}>
          Target: <span style={{ fontWeight: 600, color: "#161616" }}>TRISHUL-IN</span> (India Defense Hub)
        </div>
      </div>

      <div style={{ display: "flex", width: "100%", height: 245, background: "#FCFBF9", borderRadius: 8, border: "1px solid #C4C1B8", overflow: "hidden" }}>
        
        <div style={{ flex: 1, position: "relative" }}>
          <svg viewBox="0 0 800 480" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
            <image href="/world-map.png" width="800" height="480" opacity="0.6" preserveAspectRatio="none" />
            
            {/* Subtle grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={`h${i}`} x1={0} x2={800} y1={70 + i * 85} y2={70 + i * 85} stroke="#C4C1B8" strokeWidth={0.5} strokeOpacity={0.25} />
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <line key={`v${i}`} x1={i * 100 + 50} x2={i * 100 + 50} y1={20} y2={460} stroke="#C4C1B8" strokeWidth={0.5} strokeOpacity={0.25} />
            ))}

            {attackTrajectories.map((t, i) => (
              <g key={i}>
                <path d={t.d} fill="none" stroke="#F25C1F" strokeWidth="1.5" strokeOpacity="0.4" />
                {t.animate && (
                  <circle r="3" fill="#F25C1F">
                    <animateMotion dur={t.dur} repeatCount="indefinite" path={t.d} />
                  </circle>
                )}
              </g>
            ))}

            {attacks.map(g => {
              const coord = countryCoords[g.code] || { x: 400, y: 200 };
              const x = coord.x;
              const y = coord.y;
              if (g.code === "IN") return null;
              const r = 3 + (g.attacks / maxA) * 11;
              return (
                <g key={g.code}>
                  <circle cx={x} cy={y} r={r} fill="#F25C1F" fillOpacity={0.15} stroke="#F25C1F" strokeWidth={1} strokeOpacity={0.6} />
                  <circle cx={x} cy={y} r={3} fill="#F25C1F" fillOpacity={0.9} />
                  <text x={x} y={y - r - 3} textAnchor="middle" fill="#161616" fontSize={8.5} fontWeight="700">
                    {g.code}
                  </text>
                </g>
              );
            })}

            {/* Central Target Node */}
            <circle cx={server.x} cy={server.y} r={6} fill="#161616" />
            <circle cx={server.x} cy={server.y} r={13} fill="none" stroke="#161616" strokeWidth={1.5} strokeOpacity={0.4} />
            <circle cx={server.x} cy={server.y} r={20} fill="none" stroke="#F25C1F" strokeWidth={1} strokeOpacity={0.35} />
            <text x={server.x} y={server.y + 22} textAnchor="middle" fill="#161616" fontSize={8.5} fontWeight="800">
              TRISHUL-IN
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
