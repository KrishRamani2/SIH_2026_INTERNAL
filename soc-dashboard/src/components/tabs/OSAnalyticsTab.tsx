"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, AreaChart, Area,
} from "recharts";
import { osFingerprintData, topTalkers, ttlHistogram } from "@/lib/mockData";

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0a1628", border: "1px solid #1a2d4a", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || "#e2e8f0", fontSize: 12, fontWeight: 600 }}>
          {p.name}: {Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const deviceTypes = [
  { name: "Bot/Scripted", value: 52, color: "#ef4444" },
  { name: "Desktop Browser", value: 23, color: "#06b6d4" },
  { name: "IoT Device", value: 14, color: "#f59e0b" },
  { name: "Mobile", value: 7, color: "#8b5cf6" },
  { name: "Unknown", value: 4, color: "#6b7280" },
];

const ja3Hashes = [
  { hash: "a8d3...b2f1", count: 4820, label: "Mirai variant" },
  { hash: "c7e9...a4d2", count: 3140, label: "Generic bot" },
  { hash: "f2a1...9b3e", count: 2890, label: "Curl/libcurl" },
  { hash: "9d4c...1e8f", count: 1940, label: "Python requests" },
  { hash: "b3f8...7c2a", count: 1560, label: "Go http" },
  { hash: "2e6d...4a9c", count: 1120, label: "PHP fsockopen" },
  { hash: "e1a4...d5f3", count: 890, label: "Custom scanner" },
];

const tcpOptions = [
  { option: "MSS", linux: 4200, windows: 2800, iot: 1100 },
  { option: "WSCALE", linux: 3800, windows: 2400, iot: 400 },
  { option: "TIMESTAMP", linux: 4100, windows: 1200, iot: 200 },
  { option: "SACK", linux: 3600, windows: 2600, iot: 800 },
  { option: "NOP", linux: 4000, windows: 2200, iot: 950 },
];

const returningVsNew = Array.from({ length: 14 }, (_, i) => ({
  day: `Aug ${i + 1}`,
  returning: Math.round(2000 + Math.random() * 1500),
  new: Math.round(5000 + Math.random() * 4000),
}));

export default function OSAnalyticsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Row 1: TTL Histogram + Device Types */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
        {/* TTL Histogram */}
        <div className="panel" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>TTL Distribution Histogram</div>
          <p style={{ fontSize: "0.65rem", color: "#475569", marginBottom: 12 }}>
            TTL=64 peak → Linux/Android devices. TTL=128 → Windows. TTL=255 → Cisco/networking equipment.
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ttlHistogram} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" />
              <XAxis dataKey="ttl" tick={{ fill: "#475569", fontSize: 11 }} tickLine={false} axisLine={false} label={{ value: "TTL Value", fill: "#475569", fontSize: 10, position: "insideBottom", offset: -4 }} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              {ttlHistogram.map((d, i) => (
                <Bar
                  key={i}
                  dataKey="count"
                  data={[d]}
                  fill={d.ttl === "64" ? "#ef4444" : d.ttl === "128" ? "#06b6d4" : "#8b5cf6"}
                  radius={[4, 4, 0, 0]}
                  name="Packet Count"
                />
              ))}
              <Bar dataKey="count" name="Packet Count" radius={[4, 4, 0, 0]}>
                {ttlHistogram.map((d, i) => (
                  <Cell key={i} fill={d.ttl === "64" ? "#ef4444" : d.ttl === "128" ? "#06b6d4" : d.ttl === "128" ? "#06b6d4" : "#8b5cf6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Type + JA3 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="panel" style={{ padding: 16, flex: 1 }}>
            <div className="section-title" style={{ marginBottom: 10 }}>Device Type Breakdown</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ResponsiveContainer width={90} height={90}>
                <PieChart>
                  <Pie data={deviceTypes} dataKey="value" cx="50%" cy="50%" outerRadius={40} innerRadius={20} strokeWidth={0}>
                    {deviceTypes.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {deviceTypes.map(d => (
                  <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, display: "inline-block" }} />
                      <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{d.name}</span>
                    </div>
                    <span className="mono" style={{ fontSize: "0.65rem", color: d.color }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: JA3 table + TCP Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
        {/* JA3 Hash Cloud */}
        <div className="panel" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>JA3/JA4 Hash Frequency</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {ja3Hashes.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="mono" style={{ fontSize: "0.65rem", color: "#06b6d4", width: 90, flexShrink: 0 }}>{h.hash}</span>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{ width: `${(h.count / 4820) * 100}%`, background: `linear-gradient(90deg, #8b5cf6, #06b6d4)` }} />
                </div>
                <span className="mono" style={{ fontSize: "0.65rem", color: "#94a3b8", width: 40, textAlign: "right" }}>{h.count.toLocaleString()}</span>
                <span style={{ fontSize: "0.6rem", color: "#475569", width: 80, flexShrink: 0 }}>{h.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TCP Options Stacked Bar */}
        <div className="panel" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>TCP Options Frequency by OS</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={tcpOptions} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" />
              <XAxis dataKey="option" tick={{ fill: "#475569", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="linux" stackId="a" fill="#ef4444" name="Linux" />
              <Bar dataKey="windows" stackId="a" fill="#06b6d4" name="Windows" />
              <Bar dataKey="iot" stackId="a" fill="#f59e0b" name="IoT" radius={[4, 4, 0, 0]} name="IoT" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
            {[["Linux", "#ef4444"], ["Windows", "#06b6d4"], ["IoT", "#f59e0b"]].map(([l, c]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.6rem", color: "#94a3b8" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "inline-block" }} />{l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Returning vs New attackers */}
      <div className="panel" style={{ padding: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Returning vs New Attackers (14-Day Trend)</div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={returningVsNew} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" />
            <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
            <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="new" stroke="#ef4444" fill="url(#newGrad)" strokeWidth={2} name="New Attackers" dot={false} />
            <Area type="monotone" dataKey="returning" stroke="#f59e0b" fill="url(#retGrad)" strokeWidth={2} name="Returning Attackers" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* OS Comparison Table */}
      <div className="panel" style={{ padding: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>OS Family Comparison Table</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a2d4a" }}>
                {["OS Family", "Requests", "% Share", "Avg TTL", "JA3 Similarity", "Block Rate", "Risk Level"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.6rem" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { os: "Linux-Mirai", req: "18,420", pct: "42%", ttl: "64", ja3: "94%", block: "96.4%", risk: "critical", color: "#ef4444" },
                { os: "Windows", req: "12,340", pct: "28%", ttl: "128", ja3: "71%", block: "89.2%", risk: "high", color: "#f59e0b" },
                { os: "Unknown", req: "6,580", pct: "15%", ttl: "Varies", ja3: "32%", block: "72.1%", risk: "medium", color: "#8b5cf6" },
                { os: "IoT", req: "3,950", pct: "9%", ttl: "64", ja3: "88%", block: "95.8%", risk: "high", color: "#f59e0b" },
                { os: "Mobile", req: "1,760", pct: "4%", ttl: "64", ja3: "41%", block: "55.0%", risk: "low", color: "#10b981" },
                { os: "macOS", req: "880", pct: "2%", ttl: "64", ja3: "28%", block: "40.2%", risk: "low", color: "#10b981" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1a2d4a", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#0a1628")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, display: "inline-block" }} />
                    <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{row.os}</span>
                  </td>
                  <td style={{ padding: "8px 12px" }} className="mono"><span style={{ color: "#94a3b8" }}>{row.req}</span></td>
                  <td style={{ padding: "8px 12px" }}><span style={{ color: row.color, fontWeight: 700 }}>{row.pct}</span></td>
                  <td style={{ padding: "8px 12px" }} className="mono"><span style={{ color: "#94a3b8" }}>{row.ttl}</span></td>
                  <td style={{ padding: "8px 12px" }} className="mono"><span style={{ color: "#06b6d4" }}>{row.ja3}</span></td>
                  <td style={{ padding: "8px 12px" }} className="mono"><span style={{ color: "#10b981" }}>{row.block}</span></td>
                  <td style={{ padding: "8px 12px" }}>
                    <span className={`badge badge-${row.risk === "critical" ? "red" : row.risk === "high" ? "amber" : row.risk === "medium" ? "purple" : "green"}`}>{row.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
