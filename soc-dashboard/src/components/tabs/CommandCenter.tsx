"use client";

import { useEffect, useState } from "react";
import { generateTrafficData } from "@/lib/mockData";
import KPIStrip               from "@/components/command/KPIStrip";
import TrafficChart            from "@/components/command/TrafficChart";
import SecurityHealth          from "@/components/command/SecurityHealth";
import GeoPanel                from "@/components/command/GeoPanel";
import TopOrigins            from "@/components/command/TopOrigins";
import TopTalkers              from "@/components/command/TopTalkers";
import ProtocolBreakdown       from "@/components/command/ProtocolBreakdown";
import ThreatMatrix            from "@/components/command/ThreatMatrix";
import ConfidenceTimeline      from "@/components/command/ConfidenceTimeline";
import MitigationAvailability  from "@/components/command/MitigationAvailability";
import LiveNarrative           from "@/components/command/LiveNarrative";

export default function CommandCenter() {
  const [traffic, setTraffic] = useState(() => generateTrafficData(30));

  // Live 2-second update
  useEffect(() => {
    const t = setInterval(() => {
      setTraffic(prev => {
        const next = [...prev.slice(1)];
        const base   = 3800 + Math.random() * 1800;
        const blocked= base * (0.44 + Math.random() * 0.12);
        const now    = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
        next.push({ time: now, total: Math.round(base), blocked: Math.round(blocked), legitimate: Math.round(base - blocked), predicted: Math.round(base * 1.08) });
        return next;
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Row 1 — KPI Strip */}
      <KPIStrip />

      {/* Row 2 — Traffic Timeline + Geographic Attack Sources + Top Origins */}
      <div className="grid-main">
        <TrafficChart data={traffic} />
        <GeoPanel />
        <TopOrigins />
      </div>

      {/* Row 3 — Security Health + Top Talkers + Protocol + Threat Matrix */}
      <div className="grid-4col">
        <SecurityHealth />
        <TopTalkers />
        <ProtocolBreakdown />
        <ThreatMatrix />
      </div>

      {/* Row 4 — Confidence + Mitigation + Availability */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ConfidenceTimeline />
        <MitigationAvailability />
      </div>

      {/* Row 5 — Live Narrative */}
      <LiveNarrative />

    </div>
  );
}
