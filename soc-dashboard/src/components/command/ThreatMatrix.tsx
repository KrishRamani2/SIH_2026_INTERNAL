"use client";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ZAxis, CartesianGrid, Cell } from "recharts";
import { ArrowRight } from "lucide-react";

const threats = [
  { name: "SYN Flood",        x: 65, y: 82, z: 8200, color: "#F25C1F" },
  { name: "UDP Flood",        x: 55, y: 70, z: 6100, color: "#F25C1F" },
  { name: "HTTP Flood",       x: 80, y: 60, z: 9800, color: "#F25C1F" },
  { name: "Botnet",           x: 45, y: 88, z: 5400, color: "#161616" },
  { name: "App Layer",        x: 30, y: 50, z: 2800, color: "#161616" },
  { name: "Unknown",          x: 20, y: 30, z: 1200, color: "#C4C1B8" },
];

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const r = Math.sqrt(payload.z / 9800) * 28;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={payload.color} fillOpacity={0.18} />
      <circle cx={cx} cy={cy} r={r * 0.55} fill={payload.color} fillOpacity={0.7} />
      <text x={cx} y={cy - r - 4} textAnchor="middle" fill="#8E8B82" fontSize={9} fontWeight="600">{payload.name}</text>
    </g>
  );
};

const TooltipContent = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <div style={{ fontWeight: 700, color: d.color, marginBottom: 4 }}>{d.name}</div>
      <div style={{ fontSize: 11, color: "#8E8B82" }}>Volume: <b style={{ color: "#161616" }}>{d.x}%</b></div>
      <div style={{ fontSize: 11, color: "#8E8B82" }}>Severity: <b style={{ color: "#161616" }}>{d.y}%</b></div>
      <div style={{ fontSize: 11, color: "#8E8B82" }}>Requests: <b style={{ color: "#161616" }}>{d.z.toLocaleString()}</b></div>
    </div>
  );
};

export default function ThreatMatrix() {
  return (
    <div className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#161616", marginBottom: 4 }}>Threat Severity Matrix</div>
        <div style={{ fontSize: 10, color: "#C4C1B8", marginBottom: 12 }}>X=Volume · Y=Severity · Size=Requests</div>
        <ResponsiveContainer width="100%" height={200}>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 20 }}>
            <CartesianGrid strokeDasharray="0" stroke="#EBEAE5" />
            <XAxis type="number" dataKey="x" domain={[0, 100]} tick={{ fill: "#C4C1B8", fontSize: 9 }} tickLine={false} axisLine={false} label={{ value: "Traffic Volume", fill: "#C4C1B8", fontSize: 9, position: "insideBottom", offset: -8 }} />
            <YAxis type="number" dataKey="y" domain={[0, 100]} tick={{ fill: "#C4C1B8", fontSize: 9 }} tickLine={false} axisLine={false} width={28} label={{ value: "Severity", fill: "#C4C1B8", fontSize: 9, angle: -90, position: "insideLeft" }} />
            <ZAxis type="number" dataKey="z" range={[100, 1000]} />
            <Tooltip content={<TooltipContent />} />
            <Scatter data={threats} shape={<CustomDot />}>
              {threats.map((t, i) => <Cell key={i} fill={t.color} />)}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {threats.map(t => (
            <span key={t.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#8E8B82" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.color, display: "inline-block" }} />
              {t.name}
            </span>
          ))}
        </div>
      </div>
      <button style={{ marginTop: 8, fontSize: 11, color: "#161616", background: "none", border: "none", cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
        View Full Matrix <ArrowRight size={11} />
      </button>
    </div>
  );
}
