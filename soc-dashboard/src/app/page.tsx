"use client";

import { useState, useEffect } from "react";
import {
  Shield, Monitor, Brain, BarChart2, FileCheck,
  RefreshCw, Bell, Settings, Activity, ChevronDown, Circle,
  Download, ShieldAlert, FileText, CheckCircle2
} from "lucide-react";
import dynamic from "next/dynamic";
import { generatePdfReport } from "@/lib/pdfReportGenerator";

const CommandCenter = dynamic(() => import("@/components/tabs/CommandCenter"), { ssr: false, loading: () => <LoadingTab /> });
const AttackIntelligence = dynamic(() => import("@/components/tabs/AttackIntelligence"), { ssr: false, loading: () => <LoadingTab /> });
const PredictiveTab = dynamic(() => import("@/components/tabs/PredictiveTab"), { ssr: false, loading: () => <LoadingTab /> });
const OSAnalyticsTab = dynamic(() => import("@/components/tabs/OSAnalyticsTab"), { ssr: false, loading: () => <LoadingTab /> });
const ComplianceTab = dynamic(() => import("@/components/tabs/ComplianceTab"), { ssr: false, loading: () => <LoadingTab /> });
const AttackLogsTab = dynamic(() => import("@/components/tabs/AttackLogsTab"), { ssr: false, loading: () => <LoadingTab /> });

function LoadingTab() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 280, color: "#94A3B8", fontSize: 13 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 28, height: 28, border: "2px solid #2563EB", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        Loading Aegis-Bharat analytics...
      </div>
    </div>
  );
}

const tabs = [
  { id: "command",      label: "Command Center", icon: Monitor     },
  { id: "intelligence", label: "Intel",          icon: Brain       },
  { id: "predictive",   label: "Forecast",       icon: Activity    },
  { id: "os",           label: "OS Analytics",   icon: BarChart2   },
  { id: "compliance",   label: "Compliance & CERT", icon: FileCheck },
  { id: "logs",         label: "Attack Logs",    icon: ShieldAlert },
];

export default function Dashboard() {
  const [activeTab, setActiveTab]         = useState("command");
  const [time, setTime]                   = useState("");
  const [alertCount]                      = useState(7);
  const [demoMode, setDemoMode]           = useState(false);
  const [status]                          = useState<"healthy" | "attack" | "recovering">("attack");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const handleExportCurrentTabPdf = () => {
    generatePdfReport(activeTab);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", flexDirection: "column" }}>

      {/* ─── Header ─────────────────────────────────────────── */}
      <header style={{
        background: "#FFFFFF",
        borderBottom: "1px solid var(--border)",
        boxShadow: "var(--shadow-xs)",
        position: "sticky",
        top: 0,
        zIndex: 200,
      }}>

        {/* Top row */}
        <div style={{ padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>

          {/* Logo & Project Branding */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #0F172A, #2563EB)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 6px rgba(37,99,235,0.25)",
              flexShrink: 0,
            }}>
              <Shield size={18} color="#F59E0B" strokeWidth={2.2} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>Aegis-Bharat</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#2563EB", background: "#EFF6FF", padding: "1px 6px", borderRadius: 4, border: "1px solid #DBEAFE" }}>
                v2.1
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#059669", background: "#ECFDF5", padding: "1px 5px", borderRadius: 4, border: "1px solid #A7F3D0" }}>
                CERT-In
              </span>
            </div>
          </div>

          {/* Tab nav — center */}
          <nav style={{ display: "flex", alignItems: "flex-end", height: "100%", gap: 2 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Live Monitoring Pulse */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 6,
              background: "var(--bg-subtle)", border: "1px solid var(--border)"
            }}>
              <span className="dot-pulse" style={{ background: "#059669", width: 6, height: 6 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>Live</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 2 }}>{time}</span>
            </div>

            {/* Status pill */}
            {status === "attack" && (
              <span className="pill pill-red">
                <span className="dot-pulse" style={{ background: "#DC2626" }} />
                UNDER ATTACK
              </span>
            )}
            {status === "healthy" && (
              <span className="pill pill-green">
                <span className="dot-pulse" style={{ background: "#059669" }} />
                SYSTEMS NORMAL
              </span>
            )}

            {/* Export PDF Button */}
            <button
              onClick={handleExportCurrentTabPdf}
              title="Export CERT-In compliant PDF report for current tab"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: 7,
                background: "#0F172A",
                color: "#FFFFFF", border: "1px solid #1E293B",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 1px 3px rgba(15,23,42,0.12)",
                transition: "background 0.15s ease"
              }}
            >
              <Download size={13} color="#F59E0B" /> Export Report
            </button>

            {/* Icon buttons */}
            {[
              { icon: Bell, badge: alertCount > 0, title: "Notifications" },
              { icon: Settings, badge: false, title: "Settings" },
            ].map(({ icon: Icon, badge, title }, i) => (
              <button key={i} title={title} className="icon-btn" style={{ position: "relative" }}>
                <Icon size={15} />
                {badge && (
                  <span style={{ position: "absolute", top: 4, right: 4, width: 6, height: 6, borderRadius: "50%", background: "#DC2626", border: "1.5px solid white" }} />
                )}
              </button>
            ))}

            <button
              onClick={() => setDemoMode(d => !d)}
              style={{
                padding: "5px 10px", borderRadius: 6,
                border: `1px solid ${demoMode ? "#2563EB" : "var(--border)"}`,
                background: demoMode ? "#EFF6FF" : "white",
                color: demoMode ? "#2563EB" : "var(--text-secondary)",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}
            >
              {demoMode ? "Exit Demo" : "Demo"}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ───────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "20px 24px", overflowX: "hidden" }}>
        {activeTab === "command"      && <CommandCenter />}
        {activeTab === "intelligence" && <AttackIntelligence />}
        {activeTab === "predictive"   && <PredictiveTab />}
        {activeTab === "os"           && <OSAnalyticsTab />}
        {activeTab === "compliance"   && <ComplianceTab />}
        {activeTab === "logs"         && <AttackLogsTab />}
      </main>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer style={{
        padding: "10px 24px",
        borderTop: "1px solid var(--border)",
        background: "#FFFFFF",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 11,
        color: "var(--text-muted)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Shield size={14} color="#2563EB" />
          <span style={{ fontWeight: 600, color: "#0F172A" }}>Aegis-Bharat SOC Platform</span>
          <span>· SIH 2026 · Team Quantum Defenders</span>
        </div>
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#059669", fontWeight: 600 }}>
          <Circle size={7} fill="#059669" strokeWidth={0} /> All defense sub-systems operational &amp; CERT-In compliant
        </span>
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
