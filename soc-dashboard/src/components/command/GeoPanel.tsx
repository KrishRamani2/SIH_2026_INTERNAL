"use client";
import { geoAttacks } from "@/lib/mockData";
import { ArrowRight } from "lucide-react";

const countryFlags: Record<string, string> = {
  CN: "🇨🇳", RU: "🇷🇺", US: "🇺🇸", BR: "🇧🇷",
  IN: "🇮🇳", DE: "🇩🇪", NL: "🇳🇱", UA: "🇺🇦", IR: "🇮🇷", NG: "🇳🇬",
};

function LightWorldMap() {
  const attacks = geoAttacks;
  const maxA = Math.max(...attacks.map(g => g.attacks));

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "2/1", background: "#F8FAFC", borderRadius: 8, border: "1px solid #F1F5F9", overflow: "hidden" }}>
      <svg viewBox="0 0 800 400" style={{ width: "100%", height: "100%" }}>
        {/* Simple world map background */}
        <rect width={800} height={400} fill="#F8FAFC" />
        {[0,1,2,3,4].map(i => (
          <line key={`h${i}`} x1={0} x2={800} y1={80+i*60} y2={80+i*60} stroke="#E2E8F0" strokeWidth={0.5} />
        ))}
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={`v${i}`} x1={i*100+50} x2={i*100+50} y1={20} y2={380} stroke="#E2E8F0" strokeWidth={0.5} />
        ))}

        {/* Attack arcs to India server */}
        {attacks.map(g => {
          const sx = 400 + (g.lng / 180) * 370;
          const sy = 200 - (g.lat / 90) * 170;
          const tx = 470, ty = 195; // India/server position
          const mx = (sx + tx) / 2, my = Math.min(sy, ty) - 40;
          const opacity = 0.3 + (g.attacks / maxA) * 0.5;
          const sw = 0.5 + (g.attacks / maxA) * 2.5;
          return (
            <path key={g.code}
              d={`M ${sx} ${sy} Q ${mx} ${my} ${tx} ${ty}`}
              fill="none" stroke="#DC2626" strokeWidth={sw} strokeOpacity={opacity}
            />
          );
        })}

        {/* Attack source dots */}
        {attacks.map(g => {
          const x = 400 + (g.lng / 180) * 370;
          const y = 200 - (g.lat / 90) * 170;
          const r = 4 + (g.attacks / maxA) * 14;
          return (
            <g key={g.code}>
              <circle cx={x} cy={y} r={r} fill="#DC2626" fillOpacity={0.12} stroke="#DC2626" strokeWidth={1} strokeOpacity={0.5} />
              <circle cx={x} cy={y} r={3} fill="#DC2626" fillOpacity={0.8} />
              <text x={x} y={y - r - 3} textAnchor="middle" fill="#DC2626" fontSize={8} fontWeight="600">{g.code}</text>
            </g>
          );
        })}

        {/* Protected server (India) */}
        <circle cx={470} cy={195} r={7} fill="#2563EB" />
        <circle cx={470} cy={195} r={14} fill="none" stroke="#2563EB" strokeWidth={1.5} strokeOpacity={0.3} />
        <circle cx={470} cy={195} r={22} fill="none" stroke="#2563EB" strokeWidth={1} strokeOpacity={0.15} />
        <text x={470} y={222} textAnchor="middle" fill="#2563EB" fontSize={8} fontWeight="700">SERVER</text>
      </svg>

      {/* Volume legend */}
      <div style={{ position: "absolute", bottom: 8, left: 8, fontSize: 10, color: "#475569" }}>
        <div style={{ fontWeight: 600, marginBottom: 4, color: "#0F172A" }}>Attack Volume</div>
        {[["#DC2626", "Very High"], ["#F87171", "High"], ["#FCA5A5", "Medium"], ["#FEE2E2", "Low"]].map(([c, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GeoPanel() {
  const top4 = geoAttacks.slice(0, 4);
  const max = top4[0].attacks;

  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Geographic Attack Sources</div>
      </div>
      <LightWorldMap />

      {/* Top countries */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Top Countries</div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "6px 12px", alignItems: "center" }}>
        {top4.map(g => (
          <div key={g.code} style={{ display: "contents" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#0F172A", display: "flex", alignItems: "center", gap: 5 }}>
              <span>{countryFlags[g.code]}</span>
              <span style={{ color: { CN: "#DC2626", RU: "#B45309", US: "#1D4ED8", BR: "#047857" }[g.code] || "#475569", fontWeight: 700, fontSize: 10 }}>{g.code}</span>
              <span style={{ color: "#475569" }}>{g.country}</span>
            </div>
            <div style={{ height: 5, borderRadius: 99, background: "#F1F5F9", overflow: "hidden" }}>
              <div style={{ width: `${(g.attacks / max) * 100}%`, height: "100%", background: "#DC2626", borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#0F172A", textAlign: "right", whiteSpace: "nowrap" }}>
              {g.attacks.toLocaleString()}
            </div>
          </div>
          ))}
        </div>
        <button style={{ marginTop: 10, fontSize: 11, color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
          View All Countries <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
}
