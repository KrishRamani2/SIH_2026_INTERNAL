"use client";
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const S = (base: number, v: number, n = 12) =>
  Array.from({ length: n }, (_, i) => ({ v: Math.max(0, base + Math.sin(i * 0.8) * v + (Math.random() - 0.5) * v) }));

// Availability 24h strip
function AvailStrip() {
  const cells = Array.from({ length: 48 }, (_, i) => {
    const t = i < 18 ? "healthy" : i < 22 ? "attack" : i < 28 ? "degraded" : "healthy";
    return { t };
  });
  const colorMap: Record<string, string> = { healthy: "#059669", attack: "#DC2626", degraded: "#D97706" };
  return (
    <div style={{ display: "flex", gap: 1.5, height: 8, marginTop: 6 }}>
      {cells.map((c, i) => (
        <div key={i} style={{ flex: 1, borderRadius: 2, background: colorMap[c.t] + "99" }} />
      ))}
    </div>
  );
}

// Radial countdown (RTO)
function RTOArc({ value = 75 }: { value?: number }) {
  const pct = Math.max(0, Math.min(100, (120 - value) / 120));
  const r = 18, cx = 22, cy = 22, stroke = 4;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg width={44} height={44} viewBox="0 0 44 44">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2563EB" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#0F172A" fontSize={9} fontWeight="700">{value}s</text>
    </svg>
  );
}

const kpis = [
  {
    id: "rps", label: "Current RPS", value: "5,012", delta: "+12.4%", up: true, sub: "vs 30m avg",
    viz: () => (
      <ResponsiveContainer width="100%" height={32}>
        <LineChart data={S(4800, 600)} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <Line type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    ),
  },
  {
    id: "blocked", label: "Blocked Traffic", value: "49.7%", delta: "+8.6%", up: false, sub: "vs 30m avg",
    viz: () => (
      <div style={{ marginTop: 6 }}>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: "49.7%", background: "#DC2626" }} />
        </div>
      </div>
    ),
  },
  {
    id: "mitigations", label: "Active Mitigations", value: "14", delta: "3 new in last 10m", up: false, sub: "",
    viz: () => (
      <ResponsiveContainer width="100%" height={32}>
        <BarChart data={Array.from({ length: 8 }, (_, i) => ({ v: 8 + i * 0.8 + Math.random() * 3 }))} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <Bar dataKey="v" fill="#7C3AED" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    ),
  },
  {
    id: "rto", label: "Est. RTO", value: "75s", delta: "−10s prev 30m", up: true, sub: "",
    viz: () => <div style={{ display: "flex", justifyContent: "center", marginTop: 2 }}><RTOArc value={75} /></div>,
  },
  {
    id: "legit", label: "Legitimate Users", value: "2,522", delta: "+15.3%", up: true, sub: "vs 30m avg",
    viz: () => (
      <ResponsiveContainer width="100%" height={32}>
        <AreaChart data={S(2400, 200)} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="legitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke="#059669" fill="url(#legitGrad)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    ),
  },
  {
    id: "latency", label: "Detection Latency", value: "142ms", delta: "−18ms vs 30m avg", up: true, sub: "",
    viz: () => (
      <ResponsiveContainer width="100%" height={32}>
        <BarChart data={Array.from({ length: 12 }, (_, i) => ({ v: 100 + Math.random() * 80 }))} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <Bar dataKey="v" fill="#D97706" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    ),
  },
  {
    id: "avail", label: "Availability", value: "99.2%", delta: "+0.3% vs 24h avg", up: true, sub: "",
    viz: () => <AvailStrip />,
  },
  {
    id: "ips", label: "Attack IPs", value: "18,420", delta: "+22.7%", up: false, sub: "vs 30m avg",
    viz: () => (
      <ResponsiveContainer width="100%" height={32}>
        <LineChart data={S(16000, 2000)} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <Line type="monotone" dataKey="v" stroke="#DC2626" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    ),
  },
];

export default function KPIStrip() {
  return (
    <div className="grid-kpi">
      {kpis.map(k => (
        <div key={k.id} className="card" style={{ padding: "14px 16px" }}>
          <div className="label-xs" style={{ marginBottom: 6 }}>{k.label}</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "#0F172A", lineHeight: 1 }}>
            {k.value}
          </div>
          <div style={{ marginTop: 4, marginBottom: 4 }}>
            {k.viz()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 4 }}>
            {k.up
              ? <TrendingUp size={10} color="#059669" />
              : <TrendingDown size={10} color="#DC2626" />}
            <span style={{ fontSize: 11, color: k.up ? "#059669" : "#DC2626", fontWeight: 600 }}>
              {k.delta}
            </span>
            {k.sub && <span style={{ fontSize: 10, color: "#94A3B8" }}>{k.sub}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
