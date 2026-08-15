"use client";

import { useState, useEffect } from "react";
import {
  Shield, Monitor, Brain, BarChart2, FileCheck,
  Wifi, RefreshCw, Maximize2, Bell, Settings,
  AlertTriangle, Activity,
} from "lucide-react";
import dynamic from "next/dynamic";

// Lazy-load tabs (avoids SSR issues with recharts)
const CommandCenter = dynamic(() => import("@/components/tabs/CommandCenter"), { ssr: false, loading: () => <LoadingTab /> });
const AttackIntelligence = dynamic(() => import("@/components/tabs/AttackIntelligence"), { ssr: false, loading: () => <LoadingTab /> });
const PredictiveTab = dynamic(() => import("@/components/tabs/PredictiveTab"), { ssr: false, loading: () => <LoadingTab /> });
const OSAnalyticsTab = dynamic(() => import("@/components/tabs/OSAnalyticsTab"), { ssr: false, loading: () => <LoadingTab /> });
const ComplianceTab = dynamic(() => import("@/components/tabs/ComplianceTab"), { ssr: false, loading: () => <LoadingTab /> });

function LoadingTab() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#475569", fontSize: "0.8rem" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, border: "2px solid #06b6d4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        Initializing analytics engine...
      </div>
    </div>
  );
}

const tabs = [
  { id: "command", label: "Live Command Center", icon: Monitor, shortLabel: "Command" },
  { id: "intelligence", label: "Attack Intelligence", icon: Brain, shortLabel: "Intel" },
  { id: "predictive", label: "Predictive & Trajectory", icon: Activity, shortLabel: "Forecast" },
  { id: "os", label: "OS & Source Analytics", icon: BarChart2, shortLabel: "OS Analytics" },
  { id: "compliance", label: "Recovery & Compliance", icon: FileCheck, shortLabel: "Compliance" },
];

const STATUS_ATTACK = "attack";
const STATUS_HEALTHY = "healthy";
const STATUS_RECOVERING = "recovering";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("command");
  const [time, setTime] = useState("");
  const [alertCount, setAlertCount] = useState(7);
  const [status] = useState(STATUS_ATTACK);
  const [presentationMode, setPresentationMode] = useState(false);

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const statusConfig = {
    attack: { label: "🔴 UNDER ATTACK", color: "#ef4444", ribbonClass: "status-ribbon-attack", subtext: "DDoS Event Active — Mitigations Deployed — Confidence: 94%" },
    healthy: { label: "🟢 ALL SYSTEMS NORMAL", color: "#10b981", ribbonClass: "status-ribbon-healthy", subtext: "No active threats — Monitoring baseline traffic" },
    recovering: { label: "🟡 RECOVERING", color: "#f59e0b", ribbonClass: "status-ribbon-recovering", subtext: "Attack subsiding — Cleaning up rules — ETA: 28 min" },
  }[status] ?? { label: "", color: "#06b6d4", ribbonClass: "", subtext: "" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>

      {/* ── Global Status Ribbon ─────────────────────────────── */}
      <div className={statusConfig.ribbonClass} style={{ padding: "6px 20px", display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontWeight: 800, fontSize: "0.75rem", color: statusConfig.color, letterSpacing: "0.08em" }} className="text-glow-red">
            {statusConfig.label}
          </span>
          <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{statusConfig.subtext}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.65rem", color: "#475569" }}>
            <Wifi size={11} /> <span className="mono">{time}</span>
          </span>
          <span className="badge badge-red">
            <AlertTriangle size={9} /> {alertCount} Alerts
          </span>
        </div>
      </div>

      {/* ── Header ──────────────────────────────────────────── */}
      <header style={{
        padding: "12px 24px",
        borderBottom: "1px solid var(--border)",
        background: "rgba(6,15,30,0.95)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(6,182,212,0.4)",
          }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1 }}>
              <span className="shimmer-text">ShieldSense</span>
              <span style={{ fontSize: "0.6rem", fontWeight: 500, color: "#475569", marginLeft: 8, verticalAlign: "middle" }}>SOC v2.1</span>
            </div>
            <div style={{ fontSize: "0.58rem", color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>
              Intelligent DDoS Detection & Response Platform
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={12} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              {tab.shortLabel}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setPresentationMode(p => !p)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)",
              background: presentationMode ? "rgba(6,182,212,0.15)" : "transparent",
              color: presentationMode ? "#06b6d4" : "#94a3b8",
              fontSize: "0.65rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <Maximize2 size={11} />
            {presentationMode ? "EXIT DEMO" : "DEMO MODE"}
          </button>
          <button style={{ padding: 7, borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "#94a3b8", cursor: "pointer", display: "flex" }}>
            <RefreshCw size={14} />
          </button>
          <button style={{ padding: 7, borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "#94a3b8", cursor: "pointer", display: "flex", position: "relative" }}>
            <Bell size={14} />
            {alertCount > 0 && (
              <span style={{ position: "absolute", top: 3, right: 3, width: 7, height: 7, borderRadius: "50%", background: "#ef4444", border: "1.5px solid var(--bg-panel)" }} />
            )}
          </button>
          <button style={{ padding: 7, borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "#94a3b8", cursor: "pointer", display: "flex" }}>
            <Settings size={14} />
          </button>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────── */}
      <main style={{ flex: 1, padding: presentationMode ? "12px" : "20px 24px", overflowX: "hidden" }}>

        {/* Tab title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {(() => {
              const tab = tabs.find(t => t.id === activeTab);
              if (!tab) return null;
              return (
                <>
                  <tab.icon size={16} color="#06b6d4" />
                  <h1 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.01em" }}>{tab.label}</h1>
                  <span style={{ fontSize: "0.6rem", color: "#475569", padding: "2px 8px", background: "#0a1628", borderRadius: 99, border: "1px solid #1a2d4a" }}>
                    Auto-refresh: 2s
                  </span>
                </>
              );
            })()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.6rem", color: "#475569" }} className="mono">
              Last update: {time}
            </span>
            <span className="badge badge-green">
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", display: "inline-block" }} className="dot-blink" />
              LIVE
            </span>
          </div>
        </div>

        {/* Active tab */}
        {activeTab === "command" && <CommandCenter />}
        {activeTab === "intelligence" && <AttackIntelligence />}
        {activeTab === "predictive" && <PredictiveTab />}
        {activeTab === "os" && <OSAnalyticsTab />}
        {activeTab === "compliance" && <ComplianceTab />}
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{
        padding: "8px 24px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(6,15,30,0.8)",
        fontSize: "0.58rem",
        color: "#475569",
      }}>
        <span>ShieldSense SOC Platform · SIH 2026 · Team Quantum Defenders</span>
        <div style={{ display: "flex", gap: 16 }}>
          <span>Data Engine: LSTM-Transformer v3.1</span>
          <span>WAF: ModSecurity + Custom Rules</span>
          <span>Privacy: Differential Privacy ε=0.83</span>
          <span className="mono" style={{ color: "#10b981" }}>● All systems operational</span>
        </div>
      </footer>

      {/* Spin animation for loader */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
