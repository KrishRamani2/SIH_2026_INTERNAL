"use client";

import { useState } from "react";
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea, Legend,
  BarChart, Bar,
} from "recharts";
import GaugeMeter from "@/components/ui/GaugeMeter";
import { generateForecastData } from "@/lib/mockData";

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0a1628", border: "1px solid #1a2d4a", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any, i: number) => p.value != null && (
        <p key={i} style={{ color: p.color, fontSize: 12, fontWeight: 600 }}>
          {p.name}: <span style={{ color: "#e2e8f0" }}>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  );
};

const forecastData = generateForecastData();

const forecastAccuracy = [
  { date: "Aug 9", error: 4.2 },
  { date: "Aug 10", error: 3.8 },
  { date: "Aug 11", error: 5.1 },
  { date: "Aug 12", error: 2.9 },
  { date: "Aug 13", error: 3.3 },
  { date: "Aug 14", error: 4.0 },
  { date: "Aug 15", error: 3.1 },
];

// Auto-actions based on intensity
function getAutoActions(intensity: number) {
  const actions = [];
  if (intensity > 20) actions.push({ label: "Rate limiting activated", color: "#f59e0b" });
  if (intensity > 40) actions.push({ label: "Geo-blocking: CN, RU, IR", color: "#f59e0b" });
  if (intensity > 60) actions.push({ label: "WAF rules pushed (level 3)", color: "#ef4444" });
  if (intensity > 75) actions.push({ label: "BGP null-route triggered", color: "#ef4444" });
  if (intensity > 90) actions.push({ label: "CDN scrubbing center activated", color: "#8b5cf6" });
  if (intensity <= 20) actions.push({ label: "Monitoring baseline only", color: "#10b981" });
  return actions;
}

export default function PredictiveTab() {
  const [intensity, setIntensity] = useState(65);
  const actions = getAutoActions(intensity);

  const predictedPeak = Math.round(4000 + intensity * 65);
  const impactPct = Math.max(0, (intensity - 30) * 0.8).toFixed(1);
  const rto = Math.round(30 + intensity * 1.2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Main Forecast Chart */}
      <div className="panel" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div className="section-title">Traffic Trajectory Forecast</div>
            <p style={{ fontSize: "0.68rem", color: "#475569", marginTop: 4 }}>
              Actual (solid) · Predicted (dashed) · Threshold (red) · Pre-mitigation window (shaded)
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <GaugeMeter value={96.9} color="#10b981" label="Accuracy" size={90} />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" />
            <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
            <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
            {/* Pre-mitigation shaded area */}
            <ReferenceArea x1={forecastData[16]?.time} x2={forecastData[20]?.time} fill="#f59e0b" fillOpacity={0.07} label={{ value: "Pre-mitigation", fill: "#f59e0b", fontSize: 9 }} />
            <ReferenceLine y={6500} stroke="#ef4444" strokeDasharray="5 3" label={{ value: "DANGER THRESHOLD", fill: "#ef4444", fontSize: 9 }} />
            <Area type="monotone" dataKey="predicted" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.06} strokeDasharray="6 3" strokeWidth={2} name="Predicted" connectNulls />
            <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2.5} dot={false} name="Actual" connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Row 2: Accuracy chart + What-if simulator */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>

        {/* Forecast Accuracy */}
        <div className="panel" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>Prediction Error History (MAPE %)</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={forecastAccuracy} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" />
              <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[0, 8]} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #1a2d4a", borderRadius: 8, fontSize: 11 }} />
              <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Max tolerable", fill: "#ef4444", fontSize: 9 }} />
              <Bar dataKey="error" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="MAPE %" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(139,92,246,0.08)", borderRadius: 8, border: "1px solid rgba(139,92,246,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem" }}>
              <span style={{ color: "#94a3b8" }}>7-day avg MAPE:</span>
              <span style={{ color: "#8b5cf6", fontWeight: 700 }} className="mono">3.77%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", marginTop: 4 }}>
              <span style={{ color: "#94a3b8" }}>Model:</span>
              <span style={{ color: "#10b981", fontWeight: 600 }}>LSTM-Transformer Hybrid</span>
            </div>
          </div>
        </div>

        {/* What-If Simulator */}
        <div className="panel" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>What-If Attack Simulator</div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Attack Intensity</label>
              <span className="mono" style={{ fontSize: "0.8rem", fontWeight: 700, color: intensity > 70 ? "#ef4444" : intensity > 40 ? "#f59e0b" : "#10b981" }}>
                {intensity}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={intensity}
              onChange={e => setIntensity(Number(e.target.value))}
              style={{ width: "100%", accentColor: intensity > 70 ? "#ef4444" : intensity > 40 ? "#f59e0b" : "#10b981", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem", color: "#475569", marginTop: 4 }}>
              <span>Normal</span><span>Moderate</span><span>Severe</span><span>Critical</span>
            </div>
          </div>

          {/* Predicted impact cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Peak RPS", value: predictedPeak.toLocaleString(), color: "#ef4444" },
              { label: "User Impact", value: `${impactPct}%`, color: "#f59e0b" },
              { label: "Est. RTO", value: `${rto}s`, color: "#8b5cf6" },
            ].map(m => (
              <div key={m.label} className="card" style={{ padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: m.color }} className="mono">{m.value}</div>
                <div style={{ fontSize: "0.6rem", color: "#475569", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Auto-actions */}
          <div>
            <div style={{ fontSize: "0.65rem", color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Auto-actions Triggered</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {actions.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 6, border: `1px solid ${a.color}30` }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
