"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, Cpu, Shield, Zap, CheckCircle, Activity } from "lucide-react";

const EVENTS = [
  { time: "16:48:22", icon: AlertTriangle, color: "#F25C1F", bg: "#F25C1F33", title: "Attack Detected", sub: "Traffic spike 340% above baseline", conf: "91%" },
  { time: "16:48:28", icon: Cpu,           color: "#F25C1F", bg: "#F25C1F33", title: "ML Classification", sub: "SYN flood pattern matched", conf: "94%" },
  { time: "16:48:51", icon: Shield,        color: "#F25C1F", bg: "#F25C1F33", title: "WAF Rule Triggered", sub: "Rule #4421 activated", conf: "Block initiated" },
  { time: "16:49:02", icon: Zap,           color: "#F25C1F", bg: "#F25C1F33", title: "Traffic Blocked", sub: "Malicious traffic blocked", conf: "49.7% of total" },
  { time: "16:49:18", icon: Activity,      color: "#8E8B82", bg: "#EBEAE5", title: "Mitigation Deployed", sub: "Adaptive mitigation deployed across edge nodes", conf: "—" },
  { time: "16:50:10", icon: CheckCircle,   color: "#161616", bg: "#EBEAE5", title: "System Stabilized", sub: "Traffic normalizing. Monitoring continues", conf: "—" },
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
        <div style={{ fontSize: 13, fontWeight: 600, color: "#161616" }}>Live Attack Narrative</div>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#8E8B82", fontWeight: 600 }}>
          <span className="dot-pulse" style={{ background: "#8E8B82", width: 6, height: 6 }} />
          Live
        </span>
      </div>

      {/* Horizontal incident timeline */}
      <div style={{ display: "flex", alignItems: "flex-start", width: "100%", paddingBottom: 8, position: "relative" }}>
        {EVENTS.map((ev, i) => {
          const Icon = ev.icon;
          const isActive = i === highlight;
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
              {/* Node */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 0, padding: "0 4px" }}>
                {/* Icon circle */}
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: ev.bg,
                  border: `2px solid ${isActive ? ev.color : "#A8A49B"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: isActive ? `0 0 0 4px ${ev.color}25` : "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "all 0.3s",
                  zIndex: 2,
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={ev.color} />
                </div>
                {/* Time */}
                <div style={{ fontSize: 10, color: "#C4C1B8", marginTop: 8, fontFamily: "monospace", fontWeight: 600 }}>{ev.time}</div>
                {/* Title */}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#161616", marginTop: 3, textAlign: "center", lineHeight: 1.3 }}>{ev.title}</div>
                {/* Sub */}
                <div style={{ fontSize: 10, color: "#8E8B82", marginTop: 3, textAlign: "center", lineHeight: 1.3, maxWidth: 160 }}>{ev.sub}</div>
                {/* Confidence / Status pill */}
                {ev.conf !== "—" && (
                  <div style={{
                    marginTop: 6, fontSize: 9, fontWeight: 700,
                    color: ev.color, background: ev.bg,
                    border: `1px solid ${ev.color}30`,
                    padding: "2px 8px", borderRadius: 99,
                    whiteSpace: "nowrap"
                  }}>
                    {ev.conf.includes("%") ? `Confidence: ${ev.conf}` : ev.conf}
                  </div>
                )}
              </div>

              {/* Connector between nodes */}
              {i < EVENTS.length - 1 && (
                <div style={{
                  height: 2,
                  flex: 1,
                  marginTop: 19,
                  background: i < highlight
                    ? `linear-gradient(90deg, ${EVENTS[i].color}, ${EVENTS[i+1].color})`
                    : "#C4C1B8",
                  transition: "background 0.5s",
                  alignSelf: "flex-start"
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

