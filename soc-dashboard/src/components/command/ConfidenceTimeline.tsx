"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { generateConfidenceData } from "@/lib/mockData";

const data = generateConfidenceData(30);

// Event markers
const events = [
  { time: "16:40", label: "A", title: "Traffic Spike",       color: "#F25C1F" },
  { time: "16:46", label: "A", title: "Attack Event",        color: "#F25C1F" },
  { time: "16:51", label: "M", title: "Mitigation Deployed", color: "#8E8B82" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div style={{ fontWeight: 600, color: "#161616", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 11, color: "#8E8B82" }}>Confidence: <b style={{ color: "#161616" }}>{payload[0]?.value?.toFixed(1)}%</b></div>
    </div>
  );
};

export default function ConfidenceTimeline() {
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#161616" }}>Attack Confidence Timeline</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { color: "#161616", label: "Attack Confidence" },
            { color: "#C4C1B8", dashed: true, label: "ML Prediction" },
            { color: "#F25C1F", label: "Attack Event", dot: true },
            { color: "#8E8B82", label: "Mitigation Event", dot: true },
          ].map(l => (
            <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#8E8B82" }}>
              {l.dot
                ? <span style={{ width: 8, height: 8, borderRadius: "50%", border: `2px solid ${l.color}`, display: "inline-block" }} />
                : <span style={{ width: 16, height: 2, background: l.dashed ? "none" : l.color, borderTop: l.dashed ? `2px dashed ${l.color}` : undefined, display: "inline-block" }} />}
              {l.label}
            </span>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#161616" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#161616" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" stroke="#EBEAE5" />
          <XAxis dataKey="time" tick={{ fill: "#C4C1B8", fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
          <YAxis domain={[50, 105]} tick={{ fill: "#C4C1B8", fontSize: 9 }} axisLine={false} tickLine={false} width={28} tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={80} stroke="#F25C1F" strokeDasharray="4 3" label={{ value: "Threshold: 80%", fill: "#F25C1F", fontSize: 9, position: "insideTopRight" }} />
          <Area type="monotone" dataKey="confidence" stroke="#161616" fill="url(#confGrad)" strokeWidth={2} dot={false} name="Confidence %" />
        </AreaChart>
      </ResponsiveContainer>
      {/* Event markers below */}
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        {events.map(e => (
          <span key={e.title} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#8E8B82" }}>
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: e.color + "20", border: `1.5px solid ${e.color}`, display: "flex", alignItems: "center", justifyContent: "center", color: e.color, fontSize: 8, fontWeight: 700 }}>
              {e.label}
            </span>
            {e.title}
          </span>
        ))}
      </div>
    </div>
  );
}
