"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

// Bullet chart
function BulletChart() {
  const comparatives = [
    { label: "Current", value: 50,  color: "#161616" },
    { label: "Target",  value: 80,  color: "#8E8B82" },
    { label: "Ind. Avg", value: 65, color: "#C4C1B8" },
  ];
  return (
    <div>
      {comparatives.map(c => (
        <div key={c.label} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: "#8E8B82" }}>{c.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.value}%</span>
          </div>
          <div style={{ height: 12, borderRadius: 4, background: "#EBEAE5", overflow: "hidden", position: "relative" }}>
            <div style={{ width: `${c.value}%`, height: "100%", borderRadius: 4, background: c.color, opacity: 0.85 }} />
          </div>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#C4C1B8", marginTop: 4 }}>
        <span>0%</span><span>50%</span><span>100%</span>
      </div>
    </div>
  );
}

// 24h availability timeline
function AvailabilityTimeline() {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const isAttack = i >= 10 && i <= 14;
    const isDeg    = i === 15;
    return { h: i, s: isAttack ? "attack" : isDeg ? "degraded" : "healthy" };
  });
  const colors: Record<string, string> = { healthy: "#8E8B82", attack: "#F25C1F", degraded: "#F25C1F" };
  return (
    <div>
      <div style={{ display: "flex", gap: 2, height: 28, borderRadius: 6, overflow: "hidden" }}>
        {hours.map(h => (
          <div key={h.h} title={`${h.h}:00 — ${h.s}`}
            style={{ flex: 1, background: colors[h.s], opacity: 0.75, cursor: "pointer", transition: "opacity 0.1s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#C4C1B8", marginTop: 4 }}>
        <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        {[["#8E8B82", "Healthy"], ["#F25C1F", "Degraded"], ["#F25C1F", "Outage"]].map(([c, l]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#8E8B82" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "inline-block" }} />{l}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MitigationAvailability() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Mitigation Efficiency Bullet */}
      <div className="card" style={{ padding: "18px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#161616", marginBottom: 14 }}>
          Mitigation Efficiency (Bullet Chart)
        </div>
        <BulletChart />
      </div>

      {/* System Availability */}
      <div className="card" style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#161616" }}>System Availability (24h)</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#8E8B82", letterSpacing: "-0.02em" }}>99.2%</div>
        </div>
        <AvailabilityTimeline />
      </div>
    </div>
  );
}
