"use client";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceArea, ReferenceLine,
} from "recharts";
import { generateTrafficData } from "@/lib/mockData";
import { useState } from "react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p style={{ fontWeight: 600, marginBottom: 6, color: "#0F172A" }}>{label}</p>
      {payload.map((p: any) => p.value != null && (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 12 }}>
          <span style={{ color: "#475569" }}>{p.name}</span>
          <span style={{ fontWeight: 600, color: p.color }}>{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const ranges = ["1H", "6H", "24H", "Custom"];

export default function TrafficChart({ data }: { data: ReturnType<typeof generateTrafficData> }) {
  const [range, setRange] = useState("1H");

  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Traffic Intelligence Timeline</div>
          <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
            {[
              { label: "Legitimate Traffic", color: "#059669" },
              { label: "Blocked Traffic",   color: "#DC2626" },
              { label: "Suspicious Traffic",color: "#D97706" },
              { label: "Predicted Traffic", color: "#2563EB", dashed: true },
              { label: "Prediction Confidence", color: "#93C5FD", area: true },
            ].map(l => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#475569" }}>
                <span style={{
                  width: 20, height: 2,
                  background: l.area ? `linear-gradient(90deg,${l.color}88,${l.color}22)` : l.color,
                  display: "inline-block", borderRadius: 1,
                  borderTop: l.dashed ? `2px dashed ${l.color}` : undefined,
                  background: l.dashed ? "transparent" : l.area ? `linear-gradient(90deg,${l.color}88,${l.color}22)` : l.color,
                }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {ranges.map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              padding: "3px 10px", fontSize: 11, fontWeight: range === r ? 600 : 400,
              borderRadius: 6, border: "1px solid",
              borderColor: range === r ? "#2563EB" : "#E2E8F0",
              background: range === r ? "#EFF6FF" : "white",
              color: range === r ? "#2563EB" : "#475569",
              cursor: "pointer",
            }}>{r}</button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="legitArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="blockedArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DC2626" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#DC2626" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="predArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" stroke="#F1F5F9" />
          {/* Attack wave highlight */}
          <ReferenceArea x1={data[8]?.time} x2={data[14]?.time} fill="#FEF2F2" fillOpacity={0.6} />
          <ReferenceArea x1={data[18]?.time} x2={data[24]?.time} fill="#FEF2F2" fillOpacity={0.4} />
          <XAxis dataKey="time" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
          <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} width={36} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="legitimate" stroke="#059669" fill="url(#legitArea)" strokeWidth={2} dot={false} name="Legitimate" />
          <Area type="monotone" dataKey="blocked" stroke="#DC2626" fill="url(#blockedArea)" strokeWidth={2} dot={false} name="Blocked" />
          <Area type="monotone" dataKey="predicted" stroke="#2563EB" fill="url(#predArea)" strokeWidth={1.5} strokeDasharray="5 3" dot={false} name="Predicted" connectNulls />
          <ReferenceLine y={6500} stroke="#DC2626" strokeDasharray="4 4" strokeOpacity={0.5} />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Attack annotations */}
      <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 10, color: "#94A3B8" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: "#FEE2E2", border: "1px solid #FCA5A5", display: "inline-block" }} />
          Attack Wave 1 · 16:42–16:48
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: "#FEE2E2", border: "1px solid #FCA5A5", display: "inline-block" }} />
          Attack Wave 2 · 16:54–17:00
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: "#DBEAFE", border: "1px solid #93C5FD", display: "inline-block" }} />
          Mitigation Deployed · 17:02
        </span>
      </div>
    </div>
  );
}
