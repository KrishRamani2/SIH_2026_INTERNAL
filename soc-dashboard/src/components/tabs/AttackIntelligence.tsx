"use client";

import {
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  ZAxis, Treemap, AreaChart, Area, Legend,
} from "recharts";
import { osFingerprintData, fingerprintRadar, behaviorData, asnData, generateAnomalyHeatmap } from "@/lib/mockData";
import { useMemo } from "react";

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0a1628", border: "1px solid #1a2d4a", borderRadius: 8, padding: "8px 12px" }}>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || "#e2e8f0", fontSize: 12, fontWeight: 600 }}>
          {p.name || p.dataKey}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

const osColorMap: Record<string, string> = {
  "Linux-Mirai": "#ef4444",
  Windows: "#06b6d4",
  Unknown: "#6b7280",
  IoT: "#f59e0b",
  Mobile: "#8b5cf6",
  macOS: "#10b981",
};

// Custom treemap content
function TreemapContent({ x, y, width, height, name, fill, value }: any) {
  if (width < 30 || height < 20) return null;
  return (
    <g>
      <rect x={x + 1} y={y + 1} width={width - 2} height={height - 2} rx={4} fill={fill} fillOpacity={0.25} stroke={fill} strokeWidth={1} strokeOpacity={0.6} />
      {width > 60 && height > 30 && (
        <>
          <text x={x + 8} y={y + 16} fill="#e2e8f0" fontSize={9} fontFamily="Inter" fontWeight={700}>{name?.substring(0, 18)}</text>
          <text x={x + 8} y={y + 28} fill={fill} fontSize={8} fontFamily="JetBrains Mono, monospace">{value?.toLocaleString()}</text>
        </>
      )}
    </g>
  );
}

// Anomaly heatmap
function AnomalyHeatmap() {
  const data = useMemo(() => generateAnomalyHeatmap(), []);
  const hours = ["10am", "11am", "12pm", "1pm", "2pm", "3pm"];
  const slots = Array.from({ length: 12 }, (_, i) => `${i * 5}m`);

  const getColor = (score: number) => {
    if (score > 80) return "#ef4444";
    if (score > 60) return "#f59e0b";
    if (score > 40) return "#8b5cf6";
    if (score > 20) return "#06b6d4";
    return "#1a2d4a";
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
        <div style={{ width: 36 }} />
        {slots.map(s => <div key={s} style={{ flex: 1, fontSize: "0.5rem", color: "#475569", textAlign: "center" }}>{s}</div>)}
      </div>
      {hours.map((h, hi) => (
        <div key={h} style={{ display: "flex", gap: 2, marginBottom: 2, alignItems: "center" }}>
          <div style={{ width: 36, fontSize: "0.55rem", color: "#475569", flexShrink: 0 }}>{h}</div>
          {data.filter(d => d.hour === hi).map((d, si) => (
            <div
              key={si}
              className="heatmap-cell"
              title={`Score: ${d.score.toFixed(1)}`}
              style={{ flex: 1, height: 18, background: getColor(d.score), borderRadius: 3, opacity: 0.85 }}
            />
          ))}
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, justifyContent: "flex-end" }}>
        <span style={{ fontSize: "0.55rem", color: "#475569" }}>Low</span>
        {["#1a2d4a", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"].map(c => (
          <div key={c} style={{ width: 16, height: 8, background: c, borderRadius: 2 }} />
        ))}
        <span style={{ fontSize: "0.55rem", color: "#475569" }}>Critical</span>
      </div>
    </div>
  );
}

export default function AttackIntelligence() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Row 1: OS Fingerprint + Radar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* OS Fingerprint Pie */}
        <div className="panel" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>OS Fingerprint Composition</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={osFingerprintData}
                  dataKey="value"
                  cx="50%" cy="50%"
                  outerRadius={78}
                  innerRadius={42}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {osFingerprintData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: any) => [`${v}%`, "Share"]}
                  contentStyle={{ background: "#0a1628", border: "1px solid #1a2d4a", borderRadius: 8 }}
                  labelStyle={{ color: "#94a3b8" }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {osFingerprintData.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{d.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="progress-bar" style={{ width: 60 }}>
                      <div className="progress-fill" style={{ width: `${d.value}%`, background: d.color }} />
                    </div>
                    <span className="mono" style={{ fontSize: "0.65rem", color: d.color, width: 28, textAlign: "right" }}>{d.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="panel" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>Fingerprint Feature Breakdown</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={fingerprintRadar}>
              <PolarGrid stroke="#1a2d4a" />
              <PolarAngleAxis dataKey="feature" tick={{ fill: "#475569", fontSize: 10 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar name="Mirai" dataKey="mirai" stroke="#ef4444" fill="#ef4444" fillOpacity={0.18} dot={false} />
              <Radar name="Windows" dataKey="windows" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.12} dot={false} />
              <Radar name="Unknown" dataKey="unknown" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.10} dot={false} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #1a2d4a", borderRadius: 8, fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Treemap + Scatter */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
        {/* ASN Treemap */}
        <div className="panel" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>Source ASN / Organization Treemap</div>
          <ResponsiveContainer width="100%" height={220}>
            <Treemap data={asnData} dataKey="size" content={<TreemapContent />} isAnimationActive={false}>
              <Tooltip
                formatter={(v: any) => [v.toLocaleString(), "Requests"]}
                contentStyle={{ background: "#0a1628", border: "1px solid #1a2d4a", borderRadius: 8, fontSize: 11 }}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>

        {/* Behavioral Scatter */}
        <div className="panel" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 8 }}>Behavioral Cluster Analysis</div>
          <p style={{ fontSize: "0.65rem", color: "#475569", marginBottom: 12 }}>X=Request Rate · Y=Entropy · Size=Volume · Color=OS Family</p>
          <ResponsiveContainer width="100%" height={210}>
            <ScatterChart margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" />
              <XAxis dataKey="requestRate" name="RPS" tick={{ fill: "#475569", fontSize: 10 }} label={{ value: "Request Rate", fill: "#475569", fontSize: 9, position: "insideBottom", offset: -5 }} />
              <YAxis dataKey="entropy" name="Entropy" tick={{ fill: "#475569", fontSize: 10 }} />
              <ZAxis dataKey="volume" range={[20, 300]} />
              <Tooltip content={<ChartTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              {Object.entries(osColorMap).map(([os, color]) => (
                <Scatter
                  key={os}
                  name={os}
                  data={behaviorData.filter(d => d.os === os)}
                  fill={color}
                  fillOpacity={0.7}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Anomaly Heatmap */}
      <div className="panel" style={{ padding: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Anomaly Score Heatmap (Per 5-Minute Slot)</div>
        <AnomalyHeatmap />
      </div>
    </div>
  );
}
