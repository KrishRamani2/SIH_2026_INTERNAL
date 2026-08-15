"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, Cpu, Shield, Zap, CheckCircle, Activity } from "lucide-react";

const EVENTS = [
  { time: "16:48:22", icon: AlertTriangle, color: "#DC2626", bg: "#FEF2F2", title: "Attack Detected", sub: "Traffic spike 340% above baseline", conf: "91%" },
  { time: "16:48:28", icon: Cpu,           color: "#7C3AED", bg: "#F5F3FF", title: "ML Classification", sub: "SYN flood pattern matched", conf: "94%" },
  { time: "16:48:51", icon: Shield,        color: "#D97706", bg: "#FFFBEB", title: "WAF Rule Triggered", sub: "Rule #4421 activated. Block initiated", conf: "—" },
  { time: "16:49:02", icon: Zap,           color: "#2563EB", bg: "#EFF6FF", title: "Traffic Blocked", sub: "Adaptive traffic blocked 49.7% of total", conf: "—" },
  { time: "16:49:18", icon: Activity,      color: "#0EA5E9", bg: "#F0F9FF", title: "Mitigation Deployed", sub: "Adaptive mitigation deployed across edge nodes", conf: "—" },
  { time: "16:50:10", icon: CheckCircle,   color: "#059669", bg: "#ECFDF5", title: "System Stabilized", sub: "Traffic normal-izing. Monitoring continues", conf: "—" },
];

export default function LiveNarrative() {
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHighlight(h => (h + 1) % EVENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Live Attack Narrative</div>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#059669", fontWeight: 600 }}>
          <span className="dot-pulse" style={{ background: "#059669", width: 6, height: 6 }} />
          Live
        </span>
      </div>

      {/* Horizontal incident timeline */}
      <div style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", paddingBottom: 8 }}>
        {EVENTS.map((ev, i) => {
          const Icon = ev.icon;
          const isActive = i === highlight;
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", flexShrink: 0 }}>
              {/* Node */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 140 }}>
                {/* Icon circle */}
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: ev.bg,
                  border: `2px solid ${isActive ? ev.color : "#E2E8F0"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: isActive ? `0 0 0 4px ${ev.color}20` : undefined,
                  transition: "all 0.3s",
                }}>
                  <Icon size={18} color={ev.color} />
                </div>
                {/* Time */}
                <div style={{ fontSize: 9, color: "#94A3B8", marginTop: 6, fontFamily: "monospace" }}>{ev.time}</div>
                {/* Title */}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#0F172A", marginTop: 4, textAlign: "center", lineHeight: 1.3 }}>{ev.title}</div>
                {/* Sub */}
                <div style={{ fontSize: 9, color: "#475569", marginTop: 3, textAlign: "center", lineHeight: 1.4, padding: "0 4px" }}>{ev.sub}</div>
                {/* Confidence */}
                {ev.conf !== "—" && (
                  <div style={{ marginTop: 5, fontSize: 9, fontWeight: 700, color: ev.color, background: ev.bg, padding: "1px 7px", borderRadius: 99 }}>
                    Confidence: {ev.conf}
                  </div>
                )}
              </div>

              {/* Connector */}
              {i < EVENTS.length - 1 && (
                <div style={{
                  height: 2, width: 32, marginTop: 19, flexShrink: 0,
                  background: i < highlight
                    ? `linear-gradient(90deg, ${EVENTS[i].color}, ${EVENTS[i+1].color})`
                    : "#E2E8F0",
                  transition: "background 0.5s",
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
