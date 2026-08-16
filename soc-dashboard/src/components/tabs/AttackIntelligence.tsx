"use client";

import { useMemo } from "react";
import {
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis,
} from "recharts";
import {
  Clock, Sliders, AlertTriangle, ArrowRight, Layers, ShieldAlert, Gauge, Activity,
  Cloud, Server, TrendingUp, Shield
} from "lucide-react";

// ─── Data Definitions ─────────────────────────────────────────

const osCompositionData = [
  { name: "Linux-Mirai", pct: "42.1%", count: "54,128", value: 42.1, color: "#F25C1F" },
  { name: "Windows",     pct: "28.3%", count: "36,361", value: 28.3, color: "#161616" },
  { name: "Unknown",     pct: "14.7%", count: "18,932", value: 14.7, color: "#8E8B82" },
  { name: "IoT",         pct: "9.2%",  count: "11,815", value: 9.2,  color: "#F25C1F" },
  { name: "Mobile",      pct: "3.6%",  count: "4,617",  value: 3.6,  color: "#6366F1" },
  { name: "macOS",       pct: "2.1%",  count: "2,689",  value: 2.1,  color: "#C4C1B8" },
];

const radarData = [
  { feature: "TTL Score",     mirai: 95, windows: 45, unknown: 60 },
  { feature: "Window Size",   mirai: 30, windows: 90, unknown: 50 },
  { feature: "JA3 Match",     mirai: 88, windows: 40, unknown: 65 },
  { feature: "Header Order",  mirai: 92, windows: 35, unknown: 55 },
  { feature: "TCP Options",   mirai: 80, windows: 70, unknown: 40 },
  { feature: "Req Rate",      mirai: 98, windows: 50, unknown: 70 },
];

const scatterData = [
  // IoT (Amber) - low rate, mid/low entropy
  { x: 15, y: 5.5, z: 80, os: "IoT", color: "#F25C1F" },
  { x: 22, y: 4.8, z: 90, os: "IoT", color: "#F25C1F" },
  { x: 18, y: 7.2, z: 70, os: "IoT", color: "#F25C1F" },
  { x: 35, y: 6.0, z: 100, os: "IoT", color: "#F25C1F" },
  { x: 45, y: 1.2, z: 110, os: "IoT", color: "#F25C1F" },
  { x: 28, y: 0.8, z: 65, os: "IoT", color: "#F25C1F" },

  // Linux-Mirai (Crimson Red) - high rate, threat cluster
  { x: 450, y: 5.2, z: 220, os: "Linux-Mirai", color: "#F25C1F" },
  { x: 600, y: 4.8, z: 250, os: "Linux-Mirai", color: "#F25C1F" },
  { x: 800, y: 5.0, z: 300, os: "Linux-Mirai", color: "#F25C1F" },
  { x: 1200, y: 2.5, z: 280, os: "Linux-Mirai", color: "#F25C1F" },
  { x: 1500, y: 2.2, z: 310, os: "Linux-Mirai", color: "#F25C1F" },
  { x: 2200, y: 1.8, z: 260, os: "Linux-Mirai", color: "#F25C1F" },

  // Mobile (Indigo) - low/mid rate, mid entropy
  { x: 120, y: 6.8, z: 120, os: "Mobile", color: "#6366F1" },
  { x: 180, y: 7.1, z: 140, os: "Mobile", color: "#6366F1" },
  { x: 220, y: 6.5, z: 130, os: "Mobile", color: "#6366F1" },
  { x: 150, y: 3.2, z: 110, os: "Mobile", color: "#6366F1" },

  // Unknown (Slate) - low/mid rate, varied entropy
  { x: 160, y: 2.4, z: 95, os: "Unknown", color: "#8E8B82" },
  { x: 200, y: 4.2, z: 105, os: "Unknown", color: "#8E8B82" },
  { x: 240, y: 3.0, z: 115, os: "Unknown", color: "#8E8B82" },

  // Windows (Blue) - high rate, high/mid entropy
  { x: 3500, y: 6.8, z: 280, os: "Windows", color: "#161616" },
  { x: 4200, y: 7.2, z: 320, os: "Windows", color: "#161616" },
  { x: 5800, y: 5.8, z: 290, os: "Windows", color: "#161616" },
  { x: 8200, y: 7.0, z: 340, os: "Windows", color: "#161616" },
  { x: 12000, y: 3.5, z: 260, os: "Windows", color: "#161616" },
  { x: 18000, y: 2.8, z: 300, os: "Windows", color: "#161616" },
  { x: 25000, y: 3.8, z: 310, os: "Windows", color: "#161616" },

  // macOS (Cool Slate) - high rate, low entropy
  { x: 15000, y: 1.2, z: 120, os: "macOS", color: "#C4C1B8" },
  { x: 22000, y: 1.5, z: 140, os: "macOS", color: "#C4C1B8" },
];

// Anomaly heatmap grid data generator
function generateHeatmapMatrix() {
  const hours = ["10am", "11am", "12pm", "1pm", "2pm", "3pm"];
  const slots = ["0m", "5m", "10m", "15m", "20m", "25m", "30m", "35m", "40m", "45m", "50m", "55m"];

  return hours.map((hour, hIdx) => {
    return {
      hour,
      slots: slots.map((slot, sIdx) => {
        let val = 15 + Math.sin(sIdx + hIdx) * 12;
        // Inject peak anomaly for 11am and 12pm between 25m and 40m
        if ((hIdx === 1 || hIdx === 2) && sIdx >= 5 && sIdx <= 8) {
          val = 82 + (sIdx % 3) * 6;
        } else if ((hIdx === 1 || hIdx === 2) && (sIdx === 4 || sIdx === 9)) {
          val = 62 + (sIdx % 2) * 8;
        } else if (hIdx === 3 && sIdx >= 4 && sIdx <= 7) {
          val = 55 + (sIdx % 4) * 5;
        }
        return { slot, val };
      })
    };
  });
}

const colorScale = (val: number) => {
  if (val > 80) return "#F25C1F"; // Dark Red
  if (val > 65) return "#F25C1F"; // Red
  if (val > 50) return "#F25C1F"; // Orange
  if (val > 35) return "#FBBF24"; // Yellow
  if (val > 20) return "#86EFAC"; // Light Green
  return "#DCFCE7";               // Soft Green
};

export default function AttackIntelligence() {
  const heatmapData = useMemo(() => generateHeatmapMatrix(), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ─── Row 1: OS Fingerprint Composition + Fingerprint Feature Breakdown ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Card 1: OS Fingerprint Composition */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#161616", marginBottom: 16 }}>
            OS Fingerprint Composition
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* Donut Chart */}
            <div style={{ position: "relative", width: 170, height: 170, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={osCompositionData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {osCompositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Donut Center Label */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                pointerEvents: "none"
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#161616", lineHeight: 1 }}>128,542</div>
                <div style={{ fontSize: 10, color: "#8E8B82", marginTop: 4, fontWeight: 500 }}>Total Requests</div>
              </div>
            </div>

            {/* Legend List */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {osCompositionData.map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, display: "inline-block" }} />
                    <span style={{ fontSize: 12, color: "#8E8B82", fontWeight: 500 }}>{item.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#161616", width: 45, textAlign: "right" }}>{item.pct}</span>
                    <span style={{ fontSize: 11, color: "#C4C1B8", width: 45, textAlign: "right", fontFamily: "monospace" }}>{item.count}</span>
                  </div>
                </div>
              ))}

              {/* Bottom Insight Badge */}
              <div style={{
                marginTop: 6, paddingTop: 10, borderTop: "1px solid #EBEAE5",
                display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#161616", fontWeight: 600
              }}>
                <TrendingUp size={12} />
                <span>18.6% vs last 24h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Fingerprint Feature Breakdown */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#161616", marginBottom: 16 }}>
            Fingerprint Feature Breakdown
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, alignItems: "center" }}>

            {/* Radar Chart */}
            <div>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <PolarGrid stroke="#C4C1B8" />
                  <PolarAngleAxis dataKey="feature" tick={{ fill: "#8E8B82", fontSize: 10, fontWeight: 500 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar name="Linux-Mirai" dataKey="mirai" stroke="#F25C1F" fill="#F25C1F" fillOpacity={0.15} strokeWidth={1.5} />
                  <Radar name="Windows" dataKey="windows" stroke="#161616" fill="#161616" fillOpacity={0.12} strokeWidth={1.5} />
                  <Radar name="Unknown" dataKey="unknown" stroke="#F25C1F" fill="#F25C1F" fillOpacity={0.12} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
              {/* Radar Legend */}
              <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 4 }}>
                {[
                  { name: "Linux-Mirai", color: "#F25C1F" },
                  { name: "Windows",     color: "#161616" },
                  { name: "Unknown",     color: "#F25C1F" },
                ].map(l => (
                  <span key={l.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#8E8B82" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: l.color, display: "inline-block" }} />
                    {l.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Callouts Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ padding: 6, borderRadius: 6, background: "#F25C1F33", color: "#F25C1F", marginTop: 2, flexShrink: 0 }}>
                  <Clock size={14} />
                </div>
                <div style={{ fontSize: 11, color: "#8E8B82", lineHeight: 1.35 }}>
                  <span style={{ fontWeight: 600, color: "#F25C1F" }}>Linux-Mirai</span> shows high TTL consistency and request rate
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ padding: 6, borderRadius: 6, background: "#EBEAE5", color: "#161616", marginTop: 2, flexShrink: 0 }}>
                  <Sliders size={14} />
                </div>
                <div style={{ fontSize: 11, color: "#8E8B82", lineHeight: 1.35 }}>
                  <span style={{ fontWeight: 600, color: "#161616" }}>Windows</span> fingerprints exhibit larger window sizes
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ padding: 6, borderRadius: 6, background: "#F25C1F33", color: "#F25C1F", marginTop: 2, flexShrink: 0 }}>
                  <AlertTriangle size={14} />
                </div>
                <div style={{ fontSize: 11, color: "#8E8B82", lineHeight: 1.35 }}>
                  <span style={{ fontWeight: 600, color: "#F25C1F" }}>Unknown</span> category has mixed behavioral patterns
                </div>
              </div>

              <button style={{
                marginTop: 6, padding: "7px 12px", borderRadius: 6, border: "none",
                background: "#EBEAE5", color: "#161616", fontSize: 11, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}>
                View Feature Details <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Row 2: Source ASN / Organization Treemap + Behavioral Cluster Analysis ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 }}>

        {/* Card 3: Source ASN / Organization Treemap */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#161616", marginBottom: 14 }}>
            Source ASN / Organization Treemap
          </div>

          {/* Treemap visual grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gridTemplateRows: "110px 95px", gap: 8 }}>

            {/* AS4134 China Telecom - High Threat Vector */}
            <div style={{
              gridRow: "1 / 3", gridColumn: "1",
              background: "linear-gradient(135deg, #F25C1F, #F25C1F)",
              borderRadius: 8, padding: 12, color: "white",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxShadow: "0 2px 6px rgba(220,38,38,0.2)"
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.85, letterSpacing: "0.04em" }}>AS4134 • HIGH THREAT</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>China Telecom</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "monospace" }}>62,581</div>
            </div>

            {/* AS8075 Microsoft */}
            <div style={{
              background: "#F4F3EF", border: "1px solid var(--border)",
              borderRadius: 8, padding: 10, color: "#161616",
              display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#8E8B82" }}>AS8075</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#161616" }}>Microsoft</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "monospace", color: "#161616" }}>12,340</div>
            </div>

            {/* AS13335 Cloudflare */}
            <div style={{
              background: "#F4F3EF", border: "1px solid var(--border)",
              borderRadius: 8, padding: 10, color: "#161616",
              display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#8E8B82" }}>AS13335</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#161616" }}>Cloudflare</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "monospace", color: "#8E8B82" }}>6,540</div>
            </div>

            {/* AS3320 Deutsche Telekom */}
            <div style={{
              background: "#F4F3EF", border: "1px solid var(--border)",
              borderRadius: 8, padding: 10, color: "#161616",
              display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#8E8B82" }}>AS3320</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#161616", lineHeight: 1.1 }}>Deutsche Tel.</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "#8E8B82" }}>4,100</div>
            </div>

            {/* AS16509 Amazon AWS */}
            <div style={{
              background: "#F4F3EF", border: "1px solid var(--border)",
              borderRadius: 8, padding: 10, color: "#161616",
              display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#8E8B82" }}>AS16509</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#161616" }}>Amazon AWS</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "monospace", color: "#8E8B82" }}>8,901</div>
            </div>

            {/* AS4837 China Unicom */}
            <div style={{
              background: "#F25C1F33", border: "1px solid #FECACA",
              borderRadius: 8, padding: 10, color: "#161616",
              display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#F25C1F" }}>AS4837</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#F25C1F" }}>China Unicom</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "#F25C1F" }}>5,210</div>
            </div>

            {/* AS6939 Hurricane Electric */}
            <div style={{
              gridColumn: "4",
              background: "#F4F3EF", border: "1px solid var(--border)",
              borderRadius: 8, padding: 10, color: "#161616",
              display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#8E8B82" }}>AS6939</div>
                <div style={{ fontSize: 9, fontWeight: 600, color: "#161616", lineHeight: 1.1 }}>Hurricane Elec.</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "#8E8B82" }}>3,200</div>
            </div>

          </div>
        </div>

        {/* Card 4: Behavioral Cluster Analysis */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#161616" }}>Behavioral Cluster Analysis</div>
          </div>
          <div style={{ fontSize: 10, color: "#C4C1B8", marginBottom: 12 }}>
            X: Request Rate · Y: Entropy · Size: Volume · Color: OS Family
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 16, alignItems: "center" }}>
            {/* Scatter Plot */}
            <div>
              <ResponsiveContainer width="100%" height={185}>
                <ScatterChart margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBEAE5" />
                  <XAxis dataKey="x" type="number" scale="log" domain={[10, 100000]} name="Request Rate" tick={{ fill: "#C4C1B8", fontSize: 9 }} tickFormatter={v => v >= 1000 ? `${v/1000}K` : v} />
                  <YAxis dataKey="y" type="number" domain={[0, 8]} name="Entropy" tick={{ fill: "#C4C1B8", fontSize: 9 }} width={20} />
                  <ZAxis dataKey="z" range={[40, 200]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="chart-tooltip">
                        <div style={{ fontWeight: 700, color: d.color }}>{d.os}</div>
                        <div style={{ fontSize: 11, color: "#8E8B82" }}>Request Rate: <b>{d.x.toLocaleString()} req/s</b></div>
                        <div style={{ fontSize: 11, color: "#8E8B82" }}>Entropy: <b>{d.y}</b></div>
                      </div>
                    );
                  }} />
                  {["IoT", "Linux-Mirai", "Mobile", "Unknown", "Windows", "macOS"].map(os => (
                    <Scatter key={os} name={os} data={scatterData.filter(d => d.os === os)} fill={scatterData.find(d => d.os === os)?.color} />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 4 }}>
                {[
                  { name: "IoT",          color: "#F25C1F" },
                  { name: "Linux-Mirai",  color: "#F25C1F" },
                  { name: "Mobile",       color: "#161616" },
                  { name: "Unknown",      color: "#C4C1B8" },
                  { name: "Windows",      color: "#161616" },
                  { name: "macOS",        color: "#8E8B82" },
                ].map(l => (
                  <span key={l.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#8E8B82" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: l.color, display: "inline-block" }} />
                    {l.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "#F4F3EF", borderRadius: 6 }}>
                <Layers size={14} color="#161616" />
                <div>
                  <div style={{ fontSize: 9, color: "#C4C1B8", fontWeight: 600 }}>Total Clusters</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#161616" }}>7</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "#F25C1F33", borderRadius: 6 }}>
                <ShieldAlert size={14} color="#F25C1F" />
                <div>
                  <div style={{ fontSize: 9, color: "#F25C1F", fontWeight: 600 }}>High Risk Clusters</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#F25C1F" }}>2</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "#F4F3EF", borderRadius: 6 }}>
                <Gauge size={14} color="#161616" />
                <div>
                  <div style={{ fontSize: 9, color: "#C4C1B8", fontWeight: 600 }}>Avg. Request Rate</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#161616" }}>12.7K req/s</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "#F4F3EF", borderRadius: 6 }}>
                <Activity size={14} color="#161616" />
                <div>
                  <div style={{ fontSize: 9, color: "#C4C1B8", fontWeight: 600 }}>Max Entropy</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#161616" }}>7.32</div>
                </div>
              </div>

              <button style={{
                marginTop: 2, padding: "6px 10px", borderRadius: 6, border: "none",
                background: "#EBEAE5", color: "#161616", fontSize: 10, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4
              }}>
                View Cluster Details <ArrowRight size={10} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Row 3: Anomaly Score Heatmap (Per 5-Minute Slot) ─── */}
      <div className="card" style={{ padding: "18px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#161616", marginBottom: 14 }}>
          Anomaly Score Heatmap (Per 5-Minute Slot)
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 20, alignItems: "center" }}>

          {/* Left Heatmap Matrix */}
          <div>
            {/* Header X-axis Slots */}
            <div style={{ display: "grid", gridTemplateColumns: "40px repeat(12, 1fr)", gap: 4, marginBottom: 6 }}>
              <div />
              {["0m", "5m", "10m", "15m", "20m", "25m", "30m", "35m", "40m", "45m", "50m", "55m"].map(s => (
                <div key={s} style={{ fontSize: 10, color: "#C4C1B8", textAlign: "center", fontWeight: 500 }}>{s}</div>
              ))}
            </div>

            {/* Rows */}
            {heatmapData.map(row => (
              <div key={row.hour} style={{ display: "grid", gridTemplateColumns: "40px repeat(12, 1fr)", gap: 4, marginBottom: 4, alignItems: "center" }}>
                <div style={{ fontSize: 10, color: "#8E8B82", fontWeight: 600 }}>{row.hour}</div>
                {row.slots.map((cell, idx) => (
                  <div
                    key={idx}
                    title={`${row.hour} @ ${cell.slot}: Score ${cell.val}`}
                    style={{
                      height: 22,
                      borderRadius: 4,
                      background: colorScale(cell.val),
                      transition: "transform 0.15s",
                      cursor: "pointer"
                    }}
                  />
                ))}
              </div>
            ))}

            {/* Bottom Scale Legend */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, fontSize: 10, color: "#8E8B82" }}>
              <span>Low</span>
              {["#FCFBF9", "#EBEAE5", "#C4C1B8", "#8E8B82", "rgba(242, 92, 31, 0.4)", "#F25C1F"].map((c, i) => (
                <span key={i} style={{ width: 22, height: 10, borderRadius: 2, background: c, display: "inline-block" }} />
              ))}
              <span>High</span>
            </div>
          </div>

          {/* Right Summary Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8E8B82", marginBottom: 2 }}>
              Anomaly Summary (Last 1 Hour)
            </div>

            <div style={{ padding: "10px 12px", borderRadius: 8, background: "#F25C1F33", border: "1px solid #F25C1F33", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ padding: 6, borderRadius: 6, background: "#F25C1F33", color: "#F25C1F" }}>
                <TrendingUp size={16} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#F25C1F", fontWeight: 600 }}>High Anomaly Periods</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#F25C1F" }}>25m – 40m</div>
              </div>
            </div>

            <div style={{ padding: "10px 12px", borderRadius: 8, background: "#EBEAE5", border: "1px solid #C4C1B8", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ padding: 6, borderRadius: 6, background: "#C4C1B8", color: "#161616" }}>
                <Shield size={16} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#1E40AF", fontWeight: 600 }}>Max Anomaly Score</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#161616" }}>92 / 100</div>
              </div>
            </div>

            <div style={{ padding: "10px 12px", borderRadius: 8, background: "#EBEAE5", border: "1px solid #C4C1B8", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ padding: 6, borderRadius: 6, background: "#C4C1B8", color: "#8E8B82" }}>
                <Activity size={16} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#065F46", fontWeight: 600 }}>Avg Anomaly Score</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#8E8B82" }}>63 / 100</div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
