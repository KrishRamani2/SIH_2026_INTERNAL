"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, AreaChart, Area, LineChart, Line,
} from "recharts";
import { recoveryTimeline, rtoHistory, generateResourceData } from "@/lib/mockData";
import { CheckCircle, Clock, Shield, FileText, Server, Lock } from "lucide-react";
import { useState } from "react";

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

const resourceData = generateResourceData();

const agentStatus = [
  { name: "Linux Agent", os: "Ubuntu 22.04", status: "active", cpu: 38, mem: 45, pid: 1247 },
  { name: "Windows Agent", os: "Windows Server 2022", status: "active", cpu: 22, mem: 60, pid: 4892 },
  { name: "Container Agent", os: "Alpine 3.18 / Docker", status: "active", cpu: 15, mem: 32, pid: 1 },
  { name: "WAF Agent", os: "NGINX+ModSecurity", status: "warning", cpu: 71, mem: 78, pid: 2048 },
];

const certChecklist = [
  { item: "Incident detected and logged", done: true },
  { item: "Initial notification to CERT-In", done: true },
  { item: "Incident classification (Severity: HIGH)", done: true },
  { item: "Detailed technical report generated", done: true },
  { item: "Forensic evidence archived", done: true },
  { item: "Post-incident analysis submitted", done: false },
  { item: "Final closure report to CERT-In", done: false },
];

// SVG Recovery Timeline
function RecoveryTimeline() {
  const total = 75; // total minutes
  const W = 700;
  const barH = 36;
  const labelH = 24;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width="100%" viewBox={`0 0 ${W + 20} ${(barH + 10) * recoveryTimeline.length + labelH + 30}`} style={{ fontFamily: "Inter, sans-serif" }}>
        {/* Time axis */}
        {Array.from({ length: 8 }, (_, i) => {
          const x = 10 + (i / 7) * W;
          const val = Math.round((i / 7) * total);
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={labelH} y2={(barH + 10) * recoveryTimeline.length + labelH + 10} stroke="#1a2d4a" strokeWidth={0.5} />
              <text x={x} y={labelH - 5} textAnchor="middle" fill="#475569" fontSize={9}>{val}m</text>
            </g>
          );
        })}

        {/* Bars */}
        {recoveryTimeline.map((ev, i) => {
          const x = 10 + (ev.start / total) * W;
          const w = (ev.duration / total) * W;
          const y = labelH + i * (barH + 10);
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={barH} rx={6} fill={ev.color} fillOpacity={0.25} stroke={ev.color} strokeWidth={1.5} />
              {w > 40 && (
                <text x={x + 6} y={y + 14} fill={ev.color} fontSize={10} fontWeight={700}>{ev.label}</text>
              )}
              {w > 80 && (
                <text x={x + 6} y={y + 26} fill="#94a3b8" fontSize={8}>{ev.description}</text>
              )}
              <text x={x - 4} y={y + barH / 2 + 4} fill="#475569" fontSize={8} textAnchor="end">{ev.label}</text>
            </g>
          );
        })}

        {/* Current time marker */}
        <line x1={10 + (47 / total) * W} x2={10 + (47 / total) * W} y1={labelH} y2={(barH + 10) * recoveryTimeline.length + labelH + 10} stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="4 2" />
        <text x={10 + (47 / total) * W} y={(barH + 10) * recoveryTimeline.length + labelH + 22} textAnchor="middle" fill="#06b6d4" fontSize={9}>NOW</text>
      </svg>
    </div>
  );
}

export default function ComplianceTab() {
  const [reportExpanded, setReportExpanded] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Recovery Timeline */}
      <div className="panel" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div className="section-title">Attack Recovery Timeline</div>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="badge badge-green"><Clock size={10} /> 47m elapsed</span>
            <span className="badge badge-amber">28m to recovery</span>
          </div>
        </div>
        <RecoveryTimeline />
      </div>

      {/* RTO + Resource Usage */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
        {/* RTO History */}
        <div className="panel" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>RTO History (Last 6 Incidents)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={rtoHistory} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" />
              <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}s`} domain={[0, 120]} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #1a2d4a", borderRadius: 8, fontSize: 11 }} />
              <ReferenceLine y={72} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: "Avg 72s", fill: "#f59e0b", fontSize: 9 }} />
              <Bar dataKey="rto" name="RTO (seconds)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 12 }}>
            {[["Best", "55s", "#10b981"], ["Avg", "72s", "#f59e0b"], ["Worst", "91s", "#ef4444"]].map(([l, v, c]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div className="mono" style={{ fontSize: "1rem", fontWeight: 800, color: c }}>{v}</div>
                <div style={{ fontSize: "0.6rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Utilization */}
        <div className="panel" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>Resource Utilisation During Attack</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={resourceData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2d4a" />
              <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 9 }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="cpu" stroke="#ef4444" strokeWidth={2} dot={false} name="CPU %" />
              <Line type="monotone" dataKey="network" stroke="#06b6d4" strokeWidth={2} dot={false} name="Network %" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {[["CPU", "#ef4444"], ["Network", "#06b6d4"]].map(([l, c]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.6rem", color: "#94a3b8" }}>
                <span style={{ width: 14, height: 2, background: c, display: "inline-block", borderRadius: 2 }} />{l}
              </span>
            ))}
          </div>
          {/* WAF rule count */}
          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "rgba(6,182,212,0.06)", borderRadius: 8, border: "1px solid rgba(6,182,212,0.15)" }}>
            <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
              <Shield size={12} color="#06b6d4" /> Active WAF Rules
            </span>
            <span className="mono" style={{ fontSize: "0.8rem", fontWeight: 800, color: "#06b6d4" }}>
              {resourceData[resourceData.length - 1].wafRules}
            </span>
          </div>
        </div>
      </div>

      {/* Privacy + CERT-In */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Privacy Metrics */}
        <div className="panel" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>Privacy & Compliance Metrics</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Differential Privacy ε", value: "0.83", unit: "(ε ≤ 1.0 required)", color: "#10b981", icon: Lock },
              { label: "Data Minimisation Score", value: "94%", unit: "of data fields anonymised", color: "#10b981", icon: Shield },
              { label: "PII Exposed in Logs", value: "0", unit: "fields (DPDP compliant)", color: "#10b981", icon: CheckCircle },
              { label: "Log Retention Policy", value: "90 days", unit: "encrypted at rest", color: "#06b6d4", icon: FileText },
              { label: "CERT-In Notification", value: "<6h", unit: "from detection (compliant)", color: "#10b981", icon: Clock },
            ].map(m => (
              <div key={m.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <m.icon size={14} color={m.color} />
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{m.label}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontSize: "0.85rem", fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: "0.55rem", color: "#475569" }}>{m.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CERT-In Checklist */}
        <div className="panel" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div className="section-title">CERT-In Report Status</div>
            <span className="badge badge-cyan">INC-2026-0815-001</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {certChecklist.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #1a2d4a" }}>
                {c.done ? (
                  <CheckCircle size={14} color="#10b981" />
                ) : (
                  <div style={{ width: 14, height: 14, borderRadius: "50%", border: "1.5px solid #475569", flexShrink: 0 }} />
                )}
                <span style={{ fontSize: "0.7rem", color: c.done ? "#94a3b8" : "#475569" }}>{c.item}</span>
                {!c.done && <span className="badge badge-amber" style={{ marginLeft: "auto" }}>Pending</span>}
              </div>
            ))}
          </div>
          <button
            onClick={() => setReportExpanded(!reportExpanded)}
            style={{ width: "100%", padding: "8px", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 8, color: "#06b6d4", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em" }}
          >
            {reportExpanded ? "▲ HIDE REPORT PREVIEW" : "▼ PREVIEW REPORT"}
          </button>
          {reportExpanded && (
            <div style={{ marginTop: 10, padding: "10px 12px", background: "#060f1e", borderRadius: 8, border: "1px solid #1a2d4a" }}>
              <pre className="mono" style={{ fontSize: "0.6rem", color: "#94a3b8", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
{`CERT-In INCIDENT REPORT
========================
Incident ID: INC-2026-0815-001
Date: 2026-08-15 16:47 IST
Severity: HIGH
Type: DDoS — HTTP Flood + SYN Flood
Target: api.shield.in (Port 443)
Attack Volume: ~4,847 RPS peak
Botnet: Linux-Mirai (42% fingerprint)
Source Countries: CN, RU, US, BR
Mitigations: WAF rules, Geo-block,
  BGP rate-limit, CDN scrubbing
Status: ONGOING — under mitigation
RTO Estimate: 28 minutes
`}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Multi-OS Agent Health */}
      <div className="panel" style={{ padding: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Multi-OS Agent Health Monitor</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {agentStatus.map((agent) => (
            <div key={agent.name} className="card" style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Server size={16} color={agent.status === "active" ? "#10b981" : "#f59e0b"} />
                <span className={`badge badge-${agent.status === "active" ? "green" : "amber"}`}>{agent.status}</span>
              </div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>{agent.name}</div>
              <div style={{ fontSize: "0.6rem", color: "#475569", marginBottom: 10 }}>{agent.os}</div>
              {[["CPU", agent.cpu, "#ef4444"], ["MEM", agent.mem, "#8b5cf6"]].map(([l, v, c]) => (
                <div key={l as string} style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: "0.6rem", color: "#475569" }}>{l}</span>
                    <span className="mono" style={{ fontSize: "0.65rem", color: c as string }}>{v}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${v}%`, background: c as string }} />
                  </div>
                </div>
              ))}
              <div style={{ fontSize: "0.55rem", color: "#475569", marginTop: 6 }} className="mono">PID: {agent.pid}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
