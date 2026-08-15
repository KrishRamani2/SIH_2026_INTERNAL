"use client";

import { useEffect, useState, useCallback } from "react";
import { Activity, Shield, Zap, Clock, Users, Wifi, AlertTriangle, CheckCircle } from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, BarChart, Bar,
  Legend,
} from "recharts";
import Sparkline from "@/components/ui/SparklineChart";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import GaugeMeter from "@/components/ui/GaugeMeter";
import {
  generateTrafficData,
  generateConfidenceData,
  attackNarrative,
  topTalkers,
  protocolData,
  geoAttacks,
  generateSparkline,
} from "@/lib/mockData";

// ── Custom Tooltip ─────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0a1628", border: "1px solid #1a2d4a", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color, fontSize: 12, fontWeight: 600 }}>
          {p.name}: <span style={{ color: "#e2e8f0" }}>{Number(p.value).toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

const COLORS = { total: "#3b82f6", blocked: "#ef4444", legitimate: "#10b981", predicted: "#f59e0b" };

// ── KPI Card ──────────────────────────────────────────────────
function KPICard({
  label, value, suffix = "", prefix = "", color = "#06b6d4", icon: Icon, sparkData, decimals = 0,
}: {
  label: string; value: number; suffix?: string; prefix?: string;
  color?: string; icon: React.ElementType; sparkData: { value: number }[]; decimals?: number;
}) {
  return (
    <div className="card" style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>{label}</span>
        <Icon size={14} color={color} />
      </div>
      <div style={{ fontSize: "1.5rem", fontWeight: 800, color, lineHeight: 1 }} className="text-glow-cyan">
        <AnimatedCounter value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
      </div>
      <Sparkline data={sparkData} color={color} height={28} />
    </div>
  );
}

// ── World Map (SVG simplified) ────────────────────────────────
function WorldMap() {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "2/1", background: "radial-gradient(ellipse at center, #060f1e 0%, #020917 100%)", borderRadius: 8, overflow: "hidden" }}>
      <svg viewBox="0 0 800 400" style={{ width: "100%", height: "100%", opacity: 0.9 }}>
        <defs>
          <radialGradient id="dotGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Simplified world map outline */}
        <ellipse cx="400" cy="200" rx="380" ry="180" fill="none" stroke="#1a2d4a" strokeWidth="0.5" />
        {/* Grid lines */}
        {[-60,-30,0,30,60].map(lat => {
          const y = 200 - (lat/90)*180;
          return <line key={lat} x1="20" x2="780" y1={y} y2={y} stroke="#1a2d4a" strokeWidth="0.5" strokeDasharray="4,4" />;
        })}
        {[-120,-60,0,60,120].map(lng => {
          const x = 400 + (lng/180)*380;
          return <line key={lng} x1={x} x2={x} y1="20" y2="380" stroke="#1a2d4a" strokeWidth="0.5" strokeDasharray="4,4" />;
        })}
        {/* Attack points */}
        {geoAttacks.map((g) => {
          const x = 400 + (g.lng / 180) * 380;
          const y = 200 - (g.lat / 90) * 180;
          const size = Math.sqrt(g.attacks / 18420) * 14;
          return (
            <g key={g.code}>
              <circle cx={x} cy={y} r={size} fill="#ef4444" opacity="0.12" />
              <circle cx={x} cy={y} r={size * 0.5} fill="#ef4444" opacity="0.3" className="attack-dot" />
              <circle cx={x} cy={y} r={3} fill="#ef4444" opacity="0.9" />
              <text x={x} y={y - size - 4} textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="Inter">{g.code}</text>
            </g>
          );
        })}
        {/* Target server (India) */}
        <circle cx={480} cy={178} r={5} fill="#10b981" />
        <circle cx={480} cy={178} r={12} fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.5" className="pulse-ring" />
        <text x={480} y={205} textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="Inter" fontWeight="bold">SERVER</text>
      </svg>

      {/* Legend */}
      <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", gap: 12, fontSize: "0.6rem", color: "#475569" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
          Attack Source
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          Protected Server
        </span>
      </div>
    </div>
  );
}

// ── Attack Narrative ──────────────────────────────────────────
function NarrativePanel() {
  const [items, setItems] = useState(attackNarrative.slice(0, 6));
  const [idx, setIdx] = useState(6);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(prev => {
        const next = (prev + 1) % attackNarrative.length;
        setItems(cur => [attackNarrative[prev % attackNarrative.length], ...cur.slice(0, 7)]);
        return next;
      });
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const sevColor: Record<string, string> = {
    critical: "#ef4444", warning: "#f59e0b", info: "#06b6d4", success: "#10b981"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
      {items.map((item, i) => (
        <div key={i} className="narrative-item" style={{
          paddingLeft: 10,
          paddingTop: 6,
          paddingBottom: 6,
          borderLeftColor: sevColor[item.severity],
          opacity: 1 - i * 0.1,
          transition: "all 0.4s ease",
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span className="mono" style={{ fontSize: "0.6rem", color: "#475569", flexShrink: 0, marginTop: 2 }}>{item.time}</span>
            <span style={{ fontSize: "0.72rem", color: i === 0 ? "#e2e8f0" : "#94a3b8", lineHeight: 1.4 }}>{item.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function CommandCenter() {
  const [traffic, setTraffic] = useState(() => generateTrafficData());
  const [confidence, setConfidence] = useState(() => generateConfidenceData());
  const [tick, setTick] = useState(0);

  const kpiSpark = {
    rps: generateSparkline(4847, 600),
    blocked: generateSparkline(51, 8),
    mitigations: generateSparkline(12, 3),
    rto: generateSparkline(75, 10),
    impact: generateSparkline(0.8, 0.3),
    latency: generateSparkline(142, 40),
    availability: generateSparkline(99.2, 0.4),
    active: generateSparkline(18420, 2000),
  };

  // Live update every 2s
  useEffect(() => {
    const t = setInterval(() => {
      setTraffic(prev => {
        const next = [...prev.slice(1)];
        const base = 4200 + Math.random() * 1200;
        const blocked = base * (0.48 + Math.random() * 0.08);
        const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
        next.push({ time: now, total: Math.round(base), blocked: Math.round(blocked), legitimate: Math.round(base - blocked), predicted: Math.round(base * 1.1) });
        return next;
      });
      setTick(t => t + 1);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const latest = traffic[traffic.length - 1];
  const blockedPct = ((latest.blocked / latest.total) * 100).toFixed(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── KPI Strip ────────────────────────────────────────── */}
      <div className="grid-cols-kpi">
        <KPICard label="Current RPS" value={latest.total} color="#06b6d4" icon={Activity} sparkData={kpiSpark.rps} />
        <KPICard label="Blocked Traffic" value={parseFloat(blockedPct)} suffix="%" color="#ef4444" icon={Shield} sparkData={kpiSpark.blocked} decimals={1} />
        <KPICard label="Active Mitigations" value={14} color="#f59e0b" icon={Zap} sparkData={kpiSpark.mitigations} />
        <KPICard label="Est. RTO" value={75} suffix="s" color="#8b5cf6" icon={Clock} sparkData={kpiSpark.rto} />
        <KPICard label="Legitimate Users" value={latest.legitimate} color="#10b981" icon={Users} sparkData={kpiSpark.impact} />
        <KPICard label="Detection Latency" value={142} suffix="ms" color="#f59e0b" icon={AlertTriangle} sparkData={kpiSpark.latency} />
        <KPICard label="Availability" value={99.2} suffix="%" color="#10b981" icon={CheckCircle} sparkData={kpiSpark.availability} decimals={1} />
        <KPICard label="Attack IPs" value={18420} color="#ef4444" icon={Wifi} sparkData={kpiSpark.active} />
      </div>

      {/* ── Main traffic chart + Gauges ──────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16 }}>
        <div className="panel" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div className="section-title" style={{ width: "auto" }}>Real-time Traffic Monitor</div>
              <p style={{ fontSize: "0.7rem", color: "#475569", marginTop: 4 }}>Last 30 minutes — 2-second live feed</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {Object.entries(COLORS).map(([k, c]) => (
                <span key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.65rem", color: "#94a3b8" }}>
                  <span style={{ width: 16, height: 2, background: c, display: "inline-block", borderRadius: 2 }} />{k}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={traffic} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" />
              <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={6500} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: "DANGER", fill: "#ef4444", fontSize: 9 }} />
              <Line type="monotone" dataKey="total" stroke={COLORS.total} strokeWidth={2} dot={false} name="Total" />
              <Line type="monotone" dataKey="blocked" stroke={COLORS.blocked} strokeWidth={2} dot={false} name="Blocked" />
              <Line type="monotone" dataKey="legitimate" stroke={COLORS.legitimate} strokeWidth={2} dot={false} name="Legitimate" />
              <Line type="monotone" dataKey="predicted" stroke={COLORS.predicted} strokeWidth={1.5} strokeDasharray="5 3" dot={false} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gauges */}
        <div className="panel" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16, alignItems: "center", justifyContent: "center" }}>
          <div className="section-title" style={{ width: "100%", textAlign: "center", justifyContent: "center" }}>Attack Status</div>
          <GaugeMeter value={94} color="#ef4444" label="Confidence" size={130} />
          <div style={{ width: "100%", height: 1, background: "#1a2d4a" }} />
          <GaugeMeter value={parseFloat(blockedPct)} color="#06b6d4" label="Mitigation Eff." size={130} />
          <span className="badge badge-red">
            <span className="dot-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            UNDER ATTACK
          </span>
        </div>
      </div>

      {/* ── Secondary 3-column grid ───────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 16 }}>

        {/* World Map */}
        <div className="panel" style={{ padding: 16 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Geographic Attack Sources</div>
          <WorldMap />
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {geoAttacks.slice(0, 4).map(g => (
              <div key={g.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: "0.75rem" }}>{g.code}</span> {g.country}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, marginLeft: 12 }}>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${(g.attacks / 18420) * 100}%`, background: "linear-gradient(90deg, #ef4444, #f59e0b)" }} />
                  </div>
                  <span className="mono" style={{ fontSize: "0.65rem", color: "#ef4444", width: 50, textAlign: "right" }}>{g.attacks.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Talkers */}
        <div className="panel" style={{ padding: 16 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Top Talkers</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={topTalkers} layout="vertical" margin={{ left: 0, right: 4, top: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="ip" tick={{ fill: "#475569", fontSize: 9 }} width={110} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="requests" fill="#ef4444" radius={[0, 3, 3, 0]} name="Requests" />
              <Bar dataKey="blocked" fill="#06b6d4" radius={[0, 3, 3, 0]} name="Blocked" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.6rem", color: "#94a3b8" }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#ef4444", display: "inline-block" }} />Requests
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.6rem", color: "#94a3b8" }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#06b6d4", display: "inline-block" }} />Blocked
            </span>
          </div>
        </div>

        {/* Protocol + Confidence */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Protocol Donut */}
          <div className="panel" style={{ padding: 16, flex: 1 }}>
            <div className="section-title" style={{ marginBottom: 8 }}>Protocol Breakdown</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie data={protocolData} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={44} strokeWidth={0}>
                    {protocolData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                {protocolData.map(d => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>{d.name}</span>
                    </div>
                    <span className="mono" style={{ fontSize: "0.65rem", color: d.color }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Confidence Area */}
          <div className="panel" style={{ padding: 16, flex: 1 }}>
            <div className="section-title" style={{ marginBottom: 8 }}>Attack Confidence</div>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={confidence.slice(-15)} margin={{ top: 2, right: 2, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis domain={[60, 100]} hide />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="confidence" stroke="#ef4444" fill="url(#confGrad)" strokeWidth={2} name="Confidence %" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Attack Narrative ──────────────────────────────────── */}
      <div className="panel" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div className="section-title">Live Attack Narrative</div>
          <span className="badge badge-red">
            <span className="dot-blink" style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            LIVE
          </span>
        </div>
        <div className="scan-line" />
        <NarrativePanel />
      </div>
    </div>
  );
}
