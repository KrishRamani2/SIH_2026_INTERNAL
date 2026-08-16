"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, AreaChart, Area, Line, ComposedChart
} from "recharts";
import { Info, ArrowRight, ShieldCheck, Lock, ChevronDown } from "lucide-react";

// ─── Data Definitions ─────────────────────────────────────────

const ttlData = [
  { range: "0-32",    val: 2.0,  color: "#6366F1" },
  { range: "33-64",   val: 0.2,  color: "#6366F1" },
  { range: "65-96",   val: 2.0,  color: "#6366F1" },
  { range: "97-128",  val: 20.8, color: "#DC2626", label: "97 - 128 (Windows)\n20.8% of total requests" },
  { range: "129-160", val: 0.3,  color: "#94A3B8" },
  { range: "161-192", val: 13.5, color: "#0284C7" },
  { range: "193-224", val: 0.1,  color: "#94A3B8" },
  { range: "225-255", val: 3.0,  color: "#94A3B8" },
];

const deviceBreakdown = [
  { name: "Desktop / Browser", pct: "52%", count: "66,891", val: 52, color: "#2563EB" },
  { name: "Windows Systems",   pct: "28%", count: "35,988", val: 28, color: "#DC2626" },
  { name: "Linux / Unix",      pct: "11%", count: "14,152", val: 11, color: "#6366F1" },
  { name: "Mobile Devices",    pct: "6%",  count: "7,753",  val: 6,  color: "#64748B" },
  { name: "Unknown / Other",   pct: "3%",  count: "3,758",  val: 3,  color: "#D97706" },
];

const ja3Table = [
  { hash: "a48d...1f3e1", req: "6,501", pct: "9.21%", risk: "High",   bg: "#FEF2F2", text: "#DC2626" },
  { hash: "c1b2...d8f4",  req: "5,142", pct: "7.28%", risk: "Medium", bg: "#FFFBEB", text: "#D97706" },
  { hash: "f3a9...e2b3",  req: "3,054", pct: "4.33%", risk: "Medium", bg: "#FFFBEB", text: "#D97706" },
  { hash: "98b1...7ce1",  req: "2,349", pct: "3.33%", risk: "Medium", bg: "#FFFBEB", text: "#D97706" },
  { hash: "b23c...7a6b",  req: "2,164", pct: "3.07%", risk: "Low",    bg: "#ECFDF5", text: "#059669" },
  { hash: "d1e9...ef27",  req: "1,821", pct: "2.58%", risk: "Low",    bg: "#ECFDF5", text: "#059669" },
];

const tcpStackedData = [
  { opt: "MSS",       linux: 35, windows: 40, iot: 25 },
  { opt: "WSCALE",    linux: 33, windows: 38, iot: 29 },
  { opt: "TIMESTAMP", linux: 30, windows: 31, iot: 39 },
  { opt: "SACK",      linux: 33, windows: 38, iot: 29 },
  { opt: "NOP",       linux: 34, windows: 37, iot: 29 },
];

const attackerTrendData = [
  { date: "Aug 1",  returning: 6.1, newAtk: 2.6 },
  { date: "Aug 3",  returning: 6.8, newAtk: 2.9 },
  { date: "Aug 5",  returning: 8.7, newAtk: 3.4 },
  { date: "Aug 7",  returning: 5.6, newAtk: 2.5 },
  { date: "Aug 9",  returning: 6.2, newAtk: 2.8 },
  { date: "Aug 11", returning: 5.4, newAtk: 2.3 },
  { date: "Aug 13", returning: 7.0, newAtk: 3.1 },
  { date: "Aug 14", returning: 7.8, newAtk: 3.6 },
];

export default function OSAnalyticsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ─── Row 1: TTL Distribution Histogram + Device Type Breakdown ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>

        {/* Card 1: TTL Distribution Histogram */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                TTL Distribution Histogram <Info size={13} color="#94A3B8" />
              </div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                TTL values distribution across different device types
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 10, color: "#475569", marginBottom: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366F1", display: "inline-block" }} />
              TTL ≤ 64 (Likely Linux/Unix)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#DC2626", display: "inline-block" }} />
              64 &lt; TTL ≤ 128 (Windows Threat)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0284C7", display: "inline-block" }} />
              128 &lt; TTL ≤ 255 (Network/Infra)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#94A3B8", display: "inline-block" }} />
              Others / Unclassified
            </span>
          </div>

          {/* Bar Chart */}
          <div style={{ position: "relative" }}>
            {/* Windows Annotation Badge */}
            <div style={{
              position: "absolute", top: "10%", left: "41%",
              background: "white", border: "1px solid #E2E8F0", borderRadius: 6,
              padding: "4px 8px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              fontSize: 10, zIndex: 10, textAlign: "center"
            }}>
              <div style={{ fontWeight: 700, color: "#0F172A" }}>97 - 128 (Windows)</div>
              <div style={{ color: "#475569", fontWeight: 600 }}>20.8% of total requests</div>
            </div>

            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={ttlData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="0" stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: "TTL Value (Range)", fill: "#94A3B8", fontSize: 10, position: "insideBottom", offset: -5 }} />
                <YAxis domain={[0, 25]} tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="chart-tooltip">
                      <div style={{ fontWeight: 600, color: "#0F172A" }}>Range: {payload[0].payload.range}</div>
                      <div style={{ fontSize: 11, color: payload[0].payload.color }}>Share: <b>{payload[0].value}%</b></div>
                    </div>
                  );
                }} />
                <Bar dataKey="val" radius={[4, 4, 0, 0]} barSize={28}>
                  {ttlData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Info Banner */}
          <div style={{
            marginTop: 10, padding: "8px 12px", borderRadius: 8,
            background: "#F0F9FF", border: "1px solid #BAE6FD",
            display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#0369A1", fontWeight: 500
          }}>
            <Info size={15} color="#0284C7" />
            <span>Most requests (20.8%) have TTL in the 97-128 range, typically associated with Windows systems.</span>
          </div>
        </div>

        {/* Card 2: Device Type Breakdown */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 16 }}>
            Device Type Breakdown <Info size={13} color="#94A3B8" />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Donut Chart */}
            <div style={{ position: "relative", width: 150, height: 150, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceBreakdown}
                    dataKey="val"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {deviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Donut Center */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                pointerEvents: "none"
              }}>
                <div style={{ fontSize: 9, color: "#64748B", fontWeight: 600 }}>Total Requests</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>128,542</div>
              </div>
            </div>

            {/* Legend List */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#94A3B8", fontWeight: 700, borderBottom: "1px solid #F1F5F9", paddingBottom: 4 }}>
                <span>Device Type</span>
                <span style={{ display: "flex", gap: 20 }}>
                  <span>% of Total</span>
                  <span style={{ width: 45, textAlign: "right" }}>Requests</span>
                </span>
              </div>

              {deviceBreakdown.map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.color, display: "inline-block" }} />
                    <span style={{ fontSize: 11, color: "#334155", fontWeight: 500 }}>{item.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0F172A" }}>{item.pct}</span>
                    <span style={{ fontSize: 10, color: "#94A3B8", width: 45, textAlign: "right", fontFamily: "monospace" }}>{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Green Info Banner */}
          <div style={{
            marginTop: 18, padding: "8px 12px", borderRadius: 8,
            background: "#ECFDF5", border: "1px solid #A7F3D0",
            display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#047857", fontWeight: 500
          }}>
            <ShieldCheck size={15} color="#059669" />
            <span>Desktop/Browser traffic dominates the network with 52% of total requests.</span>
          </div>
        </div>

      </div>

      {/* ─── Row 2: JA3/JA4 Hash Frequency + TCP Options Frequency ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 }}>

        {/* Card 3: JA3/JA4 Hash Frequency */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 14 }}>
            JA3/JA4 Hash Frequency <Info size={13} color="#94A3B8" />
          </div>

          {/* Ranked Table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                <th style={{ textAlign: "left", fontSize: 9, color: "#94A3B8", fontWeight: 700, paddingBottom: 6 }}>JA3/JA4 HASH</th>
                <th style={{ textAlign: "right", fontSize: 9, color: "#94A3B8", fontWeight: 700, paddingBottom: 6 }}>REQUESTS</th>
                <th style={{ textAlign: "right", fontSize: 9, color: "#94A3B8", fontWeight: 700, paddingBottom: 6 }}>% OF TOTAL</th>
                <th style={{ textAlign: "right", fontSize: 9, color: "#94A3B8", fontWeight: 700, paddingBottom: 6 }}>RISK LEVEL</th>
              </tr>
            </thead>
            <tbody>
              {ja3Table.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #F8FAFC" }}>
                  <td style={{ padding: "7px 0", fontSize: 11, fontWeight: 600, color: "#2563EB", fontFamily: "monospace" }}>{row.hash}</td>
                  <td style={{ padding: "7px 0", fontSize: 11, color: "#475569", textAlign: "right", fontFamily: "monospace" }}>{row.req}</td>
                  <td style={{ padding: "7px 0", fontSize: 11, color: "#334155", textAlign: "right", fontWeight: 500 }}>{row.pct}</td>
                  <td style={{ padding: "7px 0", textAlign: "right" }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: row.text, background: row.bg,
                      padding: "2px 8px", borderRadius: 4, display: "inline-block"
                    }}>
                      {row.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button style={{
            marginTop: 12, width: "100%", padding: "7px 0", borderRadius: 6, border: "none",
            background: "#EFF6FF", color: "#2563EB", fontSize: 11, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
          }}>
            View All Hashes <ArrowRight size={12} />
          </button>
        </div>

        {/* Card 4: TCP Options Frequency by OS */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 14 }}>
            TCP Options Frequency by OS <Info size={13} color="#94A3B8" />
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={tcpStackedData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#F1F5F9" />
              <XAxis dataKey="opt" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="chart-tooltip">
                    <div style={{ fontWeight: 600, color: "#0F172A" }}>{payload[0].payload.opt}</div>
                    {payload.map((p: any) => (
                      <div key={p.name} style={{ fontSize: 11, color: p.color }}>{p.name}: <b>{p.value}%</b></div>
                    ))}
                  </div>
                );
              }} />
              <Bar dataKey="linux" stackId="a" fill="#EF4444" name="Linux / Unix" barSize={34} />
              <Bar dataKey="windows" stackId="a" fill="#06B6D4" name="Windows" />
              <Bar dataKey="iot" stackId="a" fill="#F59E0B" name="IoT / Network" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 10, color: "#475569", marginTop: 4 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", display: "inline-block" }} />
              Linux / Unix
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#06B6D4", display: "inline-block" }} />
              Windows
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />
              IoT / Network
            </span>
          </div>

          {/* Bottom Info Banner */}
          <div style={{
            marginTop: 10, padding: "8px 12px", borderRadius: 8,
            background: "#F0F9FF", border: "1px solid #BAE6FD",
            display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#0369A1", fontWeight: 500
          }}>
            <Lock size={15} color="#0284C7" />
            <span>MSS and NOP options are most frequently used across all operating systems.</span>
          </div>
        </div>

      </div>

      {/* ─── Card 5: Returning vs New Attackers (14-Day Trend) ─── */}
      <div className="card" style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
              Returning vs New Attackers (14-Day Trend) <Info size={13} color="#94A3B8" />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Legend */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 10, color: "#475569" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", display: "inline-block" }} />
                Returning Attackers
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />
                New Attackers
              </span>
            </div>

            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 10px", borderRadius: 6,
              border: "1px solid #E2E8F0", background: "white",
              fontSize: 11, fontWeight: 500, color: "#475569", cursor: "pointer",
            }}>
              Last 14 Days <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* Trend Area Chart with Callout Badges */}
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={attackerTrendData} margin={{ top: 25, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="#F1F5F9" />
            <XAxis dataKey="date" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="chart-tooltip">
                  <div style={{ fontWeight: 600, color: "#0F172A" }}>{label}</div>
                  <div style={{ fontSize: 11, color: "#EF4444" }}>Returning: <b>{payload[0].value}%</b></div>
                  {payload[1] && <div style={{ fontSize: 11, color: "#F59E0B" }}>New: <b>{payload[1].value}%</b></div>}
                </div>
              );
            }} />

            {/* Returning Area (Red) */}
            <Area type="monotone" dataKey="returning" stroke="#EF4444" strokeWidth={2} fill="url(#retGrad)" name="Returning Attackers" dot={{ fill: "#EF4444", r: 4 }} />

            {/* New Line (Orange) */}
            <Line type="monotone" dataKey="newAtk" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B", r: 3 }} name="New Attackers" />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Bottom Info Banner */}
        <div style={{
          marginTop: 10, padding: "8px 12px", borderRadius: 8,
          background: "#F0F9FF", border: "1px solid #BAE6FD",
          display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#0369A1", fontWeight: 500
        }}>
          <Info size={15} color="#0284C7" />
          <span>Returning attackers have increased by 24.3% compared to the previous 14-day period.</span>
        </div>
      </div>

    </div>
  );
}
