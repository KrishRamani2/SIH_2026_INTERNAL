"use client";

import { Info, Clock, RefreshCw, Search, Shield, Flame, Globe, CheckCircle, ShieldCheck, AlertCircle, Ban, Activity, Download, FileText } from "lucide-react";
import { generatePdfReport } from "@/lib/pdfReportGenerator";

export default function ComplianceTab() {
  const handleExportPdf = () => {
    generatePdfReport("compliance");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ─── Top Action Strip ─── */}
      <div className="card" style={{
        padding: "16px 20px",
        background: "linear-gradient(135deg, #0F172A, #1E293B)",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ padding: 8, borderRadius: 8, background: "#2563EB", color: "white" }}>
            <FileText size={18} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>CERT-In Statutory Audit &amp; Compliance Hub</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
              Official DDoS incident disclosure &amp; mitigation directives under Indian IT Rules 2026
            </div>
          </div>
        </div>

        <button
          onClick={handleExportPdf}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 7,
            background: "linear-gradient(135deg, #D97706, #F59E0B)",
            color: "white", fontSize: 11, fontWeight: 600,
            border: "none", cursor: "pointer",
            boxShadow: "0 2px 6px rgba(217,119,6,0.25)"
          }}
        >
          <Download size={14} /> Export CERT-In Audit Report
        </button>
      </div>

      {/* ─── Main Card: Attack Recovery Timeline ─── */}
      <div className="card" style={{ padding: "20px 24px" }}>

        {/* Card Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
              Attack Recovery Timeline <Info size={14} color="#94A3B8" />
            </div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>
              Real-time progression of mitigation and recovery steps
            </div>
          </div>

          {/* Top Right Timer Badges */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Elapsed Time */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "5px 12px", borderRadius: 7,
              background: "#EFF6FF", border: "1px solid #DBEAFE"
            }}>
              <div style={{ color: "#2563EB" }}>
                <Clock size={16} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#64748B" }}>Elapsed Time</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                  47m <span style={{ fontSize: 10, fontWeight: 500, color: "#64748B" }}>sec</span>
                </div>
              </div>
            </div>

            {/* Time to Recovery */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "5px 12px", borderRadius: 7,
              background: "#ECFDF5", border: "1px solid #A7F3D0"
            }}>
              <div style={{ color: "#059669" }}>
                <RefreshCw size={16} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#64748B" }}>Time to Recovery</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                  28m <span style={{ fontSize: 10, fontWeight: 500, color: "#64748B" }}>remaining</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Timeline Flow Section ─── */}
        <div style={{ position: "relative", marginBottom: 36, padding: "0 10px" }}>

          {/* Top Time Scale Markers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", textAlign: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>0m</div>
              <div style={{ fontSize: 9, color: "#94A3B8" }}>Start</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>11m</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>21m</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>32m</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>43m</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>54m</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>64m</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>75m</div>
              <div style={{ fontSize: 9, color: "#94A3B8" }}>Estimated Complete</div>
            </div>
          </div>

          {/* Horizontal Line with Colored Segments & Nodes */}
          <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>

            {/* Connecting Colored Line Segments */}
            <div style={{ position: "absolute", left: "6.25%", right: "6.25%", height: 3, display: "flex" }}>
              <div style={{ flex: 1, background: "#F59E0B" }} />
              <div style={{ flex: 1, background: "#2563EB" }} />
              <div style={{ flex: 2, background: "#EF4444" }} />
              <div style={{ flex: 2, background: "#94A3B8" }} />
              <div style={{ flex: 1, background: "#10B981" }} />
            </div>

            {/* Nodes */}
            <div style={{ position: "absolute", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 6.25%", boxSizing: "border-box" }}>

              {/* 0m Node */}
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "white", border: "3px solid #F59E0B", transform: "translateX(-50%)" }} />

              {/* 11m Node */}
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "white", border: "3px solid #2563EB", transform: "translateX(-50%)" }} />

              {/* 21m Node */}
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "white", border: "3px solid #EF4444", transform: "translateX(-50%)" }} />

              {/* 32m Node */}
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "white", border: "3px solid #EF4444", transform: "translateX(-50%)" }} />

              {/* 43m Node (NOW) */}
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "white", border: "3px solid #2563EB", transform: "translateX(-50%)", zIndex: 5 }} />

              {/* 54m Node */}
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "white", border: "3px solid #94A3B8", transform: "translateX(-50%)" }} />

              {/* 64m Node */}
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "white", border: "3px solid #10B981", transform: "translateX(-50%)" }} />

              {/* 75m Node */}
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "white", border: "3px solid #10B981", transform: "translateX(-50%)" }} />

            </div>

            {/* Vertical Dashed NOW Line */}
            <div style={{
              position: "absolute", left: "57.1%", top: 10, bottom: -180,
              width: 1.5, borderLeft: "2px dashed #2563EB", zIndex: 4,
              display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center"
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#2563EB", background: "white", padding: "1px 4px", borderRadius: 4, transform: "translateY(16px)" }}>
                NOW
              </span>
            </div>

          </div>

          {/* 5 Phase Step Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr 1.3fr 1fr", gap: 14, marginTop: 24 }}>

            {/* Step 1: Detection */}
            <div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFFBEB", border: "1px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B" }}>
                  <Search size={18} />
                </div>
              </div>
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, background: "#F59E0B", color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>1</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>Detection</span>
                </div>
                <div style={{ fontSize: 9, color: "#94A3B8", background: "#FEF3C7", display: "inline-block", padding: "1px 6px", borderRadius: 4, marginBottom: 10, fontWeight: 600 }}>
                  0m – 11m
                </div>
                <div style={{ fontSize: 10, color: "#475569", lineHeight: 1.4, minHeight: 32, marginBottom: 12 }}>
                  ML model triggered, anomaly confirmed
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color: "#D97706", borderTop: "1px solid #FEF3C7", paddingTop: 8 }}>
                  <Activity size={12} /> Severity: High
                </div>
              </div>
            </div>

            {/* Step 2: First Mitigation */}
            <div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EFF6FF", border: "1px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB" }}>
                  <Shield size={18} />
                </div>
              </div>
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, background: "#2563EB", color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>2</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>First Mitigation</span>
                </div>
                <div style={{ fontSize: 9, color: "#94A3B8", background: "#DBEAFE", display: "inline-block", padding: "1px 6px", borderRadius: 4, marginBottom: 10, fontWeight: 600 }}>
                  11m – 21m
                </div>
                <div style={{ fontSize: 10, color: "#475569", lineHeight: 1.4, minHeight: 32, marginBottom: 12 }}>
                  Rate limiting enabled, initial rules applied
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color: "#2563EB", borderTop: "1px solid #DBEAFE", paddingTop: 8 }}>
                  <Shield size={12} /> Traffic Impact: 18%
                </div>
              </div>
            </div>

            {/* Step 3: Peak Block */}
            <div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FEF2F2", border: "1px solid #FECACA", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
                  <Flame size={18} />
                </div>
              </div>
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, background: "#EF4444", color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>Peak Block</span>
                </div>
                <div style={{ fontSize: 9, color: "#94A3B8", background: "#FEE2E2", display: "inline-block", padding: "1px 6px", borderRadius: 4, marginBottom: 10, fontWeight: 600 }}>
                  21m – 43m
                </div>
                <div style={{ fontSize: 10, color: "#475569", lineHeight: 1.4, minHeight: 32, marginBottom: 12 }}>
                  Max traffic blocked, malicious IPs filtered
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color: "#DC2626", borderTop: "1px solid #FEE2E2", paddingTop: 8 }}>
                  <Ban size={12} /> Max Blocked: 51%
                </div>
              </div>
            </div>

            {/* Step 4: Attack Subsiding */}
            <div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F3FF", border: "1px solid #DDD6FE", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B5CF6" }}>
                  <Globe size={18} />
                </div>
              </div>
              <div style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 10, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, background: "#8B5CF6", color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>4</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>Attack Subsiding</span>
                </div>
                <div style={{ fontSize: 9, color: "#94A3B8", background: "#EDE9FE", display: "inline-block", padding: "1px 6px", borderRadius: 4, marginBottom: 10, fontWeight: 600 }}>
                  43m – 64m
                </div>
                <div style={{ fontSize: 10, color: "#475569", lineHeight: 1.4, minHeight: 32, marginBottom: 12 }}>
                  Botnets rotating, IPs shifting
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color: "#7C3AED", borderTop: "1px solid #EDE9FE", paddingTop: 8 }}>
                  <Globe size={12} /> Traffic Impact: 32%
                </div>
              </div>
            </div>

            {/* Step 5: Full Recovery */}
            <div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ECFDF5", border: "1px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                  <CheckCircle size={18} />
                </div>
              </div>
              <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, background: "#10B981", color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>5</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>Full Recovery</span>
                </div>
                <div style={{ fontSize: 9, color: "#94A3B8", background: "#D1FAE5", display: "inline-block", padding: "1px 6px", borderRadius: 4, marginBottom: 10, fontWeight: 600 }}>
                  64m – 75m
                </div>
                <div style={{ fontSize: 10, color: "#475569", lineHeight: 1.4, minHeight: 32, marginBottom: 12 }}>
                  Normal traffic restored, rules refined
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color: "#059669", borderTop: "1px solid #D1FAE5", paddingTop: 8 }}>
                  <CheckCircle size={12} /> Recovery: In Progress
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── Bottom Banner: Recovery Progress Summary Strip ─── */}
        <div style={{
          padding: "16px 20px", borderRadius: 10, border: "1px solid #F1F5F9",
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1.5fr", gap: 16, alignItems: "center"
        }}>

          {/* Recovery Progress */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ padding: 10, borderRadius: 8, background: "#EFF6FF", color: "#2563EB", flexShrink: 0 }}>
              <Shield size={20} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>Recovery Progress</div>
              <div style={{ fontSize: 10, color: "#64748B", marginTop: 2, lineHeight: 1.3 }}>
                The system is actively mitigating the attack and traffic is returning to normal.
              </div>
            </div>
          </div>

          {/* Peak Traffic */}
          <div>
            <div style={{ fontSize: 10, color: "#64748B", fontWeight: 500 }}>Peak Traffic</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#DC2626", marginTop: 2 }}>8,225</div>
            <div style={{ fontSize: 9, color: "#94A3B8" }}>Requests / sec</div>
          </div>

          {/* Blocked Traffic */}
          <div>
            <div style={{ fontSize: 10, color: "#64748B", fontWeight: 500 }}>Blocked Traffic</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#DC2626", marginTop: 2 }}>51%</div>
            <div style={{ fontSize: 9, color: "#94A3B8" }}>At Peak</div>
          </div>

          {/* Mitigations Applied */}
          <div>
            <div style={{ fontSize: 10, color: "#64748B", fontWeight: 500 }}>Mitigations Applied</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>12</div>
            <div style={{ fontSize: 9, color: "#94A3B8" }}>Active Rules</div>
          </div>

          {/* IPs Blocked */}
          <div>
            <div style={{ fontSize: 10, color: "#64748B", fontWeight: 500 }}>IPs Blocked</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>18,742</div>
            <div style={{ fontSize: 9, color: "#94A3B8" }}>Malicious IPs</div>
          </div>

          {/* System Status */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "10px 12px", borderRadius: 8 }}>
            <div style={{ padding: 6, borderRadius: 6, background: "#D1FAE5", color: "#059669", flexShrink: 0 }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#047857", fontWeight: 500 }}>System Status</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#059669" }}>Recovering</div>
              <div style={{ fontSize: 9, color: "#047857" }}>Performance stabilizing</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
