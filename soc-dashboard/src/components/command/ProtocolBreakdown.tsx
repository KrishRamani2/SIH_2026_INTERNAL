"use client";
import { ArrowRight } from "lucide-react";

// Sunburst-style SVG protocol ring
const protocols = [
  { name: "HTTP/1.1", pct: 38, color: "#161616" },
  { name: "HTTP/2",   pct: 25, color: "#161616" },
  { name: "UDP Flood",pct: 18, color: "#F25C1F" },
  { name: "SYN Flood",pct: 12, color: "#F25C1F" },
  { name: "HTTPS",    pct:  7, color: "#8E8B82" },
];

function ProtocolRing() {
  const cx = 70, cy = 70, outerR = 60, innerR = 35, gap = 1.5;
  let angle = -90;

  const segments = protocols.map(p => {
    const sweep = (p.pct / 100) * 360 - gap;
    const startAngle = angle + gap / 2;
    const endAngle = startAngle + sweep;
    angle += (p.pct / 100) * 360;

    const toRad = (d: number) => (d * Math.PI) / 180;
    const s = { x: cx + outerR * Math.cos(toRad(startAngle)), y: cy + outerR * Math.sin(toRad(startAngle)) };
    const e = { x: cx + outerR * Math.cos(toRad(endAngle)), y: cy + outerR * Math.sin(toRad(endAngle)) };
    const si = { x: cx + innerR * Math.cos(toRad(endAngle)), y: cy + innerR * Math.sin(toRad(endAngle)) };
    const ei = { x: cx + innerR * Math.cos(toRad(startAngle)), y: cy + innerR * Math.sin(toRad(startAngle)) };
    const large = sweep > 180 ? 1 : 0;

    return {
      ...p,
      d: `M ${s.x} ${s.y} A ${outerR} ${outerR} 0 ${large} 1 ${e.x} ${e.y} L ${si.x} ${si.y} A ${innerR} ${innerR} 0 ${large} 0 ${ei.x} ${ei.y} Z`,
    };
  });

  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      {segments.map(seg => (
        <path key={seg.name} d={seg.d} fill={seg.color} fillOpacity={0.85} />
      ))}
      <text x={cx} y={cy - 5} textAnchor="middle" fill="#8E8B82" fontSize={8} fontWeight="600" textDecoration="none">Attack</text>
      <text x={cx} y={cy + 7} textAnchor="middle" fill="#8E8B82" fontSize={8} fontWeight="600">Traffic</text>
    </svg>
  );
}

export default function ProtocolBreakdown() {
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#161616", marginBottom: 14 }}>Protocol Breakdown</div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <ProtocolRing />
        <div style={{ flex: 1 }}>
          {protocols.map(p => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#8E8B82" }}>{p.name}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: p.color }}>{p.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <button style={{ marginTop: 8, fontSize: 11, color: "#161616", background: "none", border: "none", cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
        View All Protocols <ArrowRight size={11} />
      </button>
    </div>
  );
}
