"use client";

import { useState, useEffect } from "react";
import {
  Shield, Monitor, Brain, BarChart2, FileCheck,
  RefreshCw, Maximize2, Bell, Settings, AlertTriangle,
  Activity, ChevronDown, Circle,
} from "lucide-react";
import dynamic from "next/dynamic";

const CommandCenter = dynamic(() => import("@/components/tabs/CommandCenter"), { ssr: false, loading: () => <LoadingTab /> });
const AttackIntelligence = dynamic(() => import("@/components/tabs/AttackIntelligence"), { ssr: false, loading: () => <LoadingTab /> });
const PredictiveTab = dynamic(() => import("@/components/tabs/PredictiveTab"), { ssr: false, loading: () => <LoadingTab /> });
const OSAnalyticsTab = dynamic(() => import("@/components/tabs/OSAnalyticsTab"), { ssr: false, loading: () => <LoadingTab /> });
const ComplianceTab = dynamic(() => import("@/components/tabs/ComplianceTab"), { ssr: false, loading: () => <LoadingTab /> });

function LoadingTab() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 280, color: "#94A3B8", fontSize: 13 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 28, height: 28, border: "2px solid #2563EB", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        Loading analytics...
      </div>
    </div>
  );
}

const tabs = [
  { id: "command",      label: "Command Center", icon: Monitor   },
  { id: "intelligence", label: "Intel",          icon: Brain     },
  { id: "predictive",   label: "Forecast",       icon: Activity  },
  { id: "os",           label: "OS Analytics",   icon: BarChart2 },
  { id: "compliance",   label: "Compliance",     icon: FileCheck },
];

export default function Dashboard() {
  const [activeTab, setActiveTab]         = useState("command");
  const [time, setTime]                   = useState("");
  const [alertCount]                      = useState(7);
  const [demoMode, setDemoMode]           = useState(false);
  const status                            = "attack"; // "healthy" | "attack" | "recovering"

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

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

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
              flexShrink: 0,
            }}>
              <Shield size={18} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em" }}>ShieldSense</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", background: "var(--bg-subtle)", padding: "1px 6px", borderRadius: 4, border: "1px solid var(--border)" }}>SOC v2.1</span>
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", marginTop: 1 }}>
                Intelligent DDoS Detection &amp; Response Platform
              </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

            {/* Time controls */}
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 10px", borderRadius: 6,
              border: "1px solid var(--border)",
              background: "white",
              fontSize: 11, fontWeight: 500, color: "var(--text-secondary)",
              cursor: "pointer",
            }}>
              Last 30 Minutes <ChevronDown size={12} />
            </button>

            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 10px", borderRadius: 6,
              border: "1px solid var(--blue)",
              background: "var(--blue-light)",
              fontSize: 11, fontWeight: 600, color: "var(--blue)",
              cursor: "pointer",
            }}>
              Auto-refresh: 2s
            </button>

            {/* Icon buttons */}
            {[
              { icon: Bell, badge: alertCount > 0 },
              { icon: Settings, badge: false },
            ].map(({ icon: Icon, badge }, i) => (
              <button key={i} style={{
                position: "relative",
                padding: 7, borderRadius: 7,
                border: "1px solid var(--border)",
                background: "white",
                color: "var(--text-secondary)",
                cursor: "pointer", display: "flex",
              }}>
                <Icon size={15} />
                {badge && (
                  <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: "#DC2626", border: "2px solid white" }} />
                )}
              </button>
            ))}

            <button
              onClick={() => setDemoMode(d => !d)}
              style={{
                padding: "5px 12px", borderRadius: 6,
                border: `1px solid ${demoMode ? "#2563EB" : "var(--border)"}`,
                background: demoMode ? "#EFF6FF" : "white",
                color: demoMode ? "#2563EB" : "var(--text-secondary)",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}
            >
              {demoMode ? "Exit Demo" : "Demo Mode"}
            </button>
          </div>
        </div>

        {/* Live indicator row */}
        <div style={{ padding: "4px 24px 0", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid var(--border)", height: 32 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--success)" }}>
            <span className="dot-pulse" style={{ background: "#059669", width: 6, height: 6 }} />
            Live
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Last updated: <span className="mono" style={{ color: "var(--text-secondary)" }}>{time}</span></span>
          <button style={{ display: "flex", alignItems: "center", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
            <RefreshCw size={11} />
          </button>
        </div>
      </header>

      {/* ─── Main ───────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "20px 24px", overflowX: "hidden" }}>
        {activeTab === "command"      && <CommandCenter />}
        {activeTab === "intelligence" && <AttackIntelligence />}
        {activeTab === "predictive"   && <PredictiveTab />}
        {activeTab === "os"           && <OSAnalyticsTab />}
        {activeTab === "compliance"   && <ComplianceTab />}
      </main>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer style={{
        padding: "8px 24px",
        borderTop: "1px solid var(--border)",
        background: "#FFFFFF",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 11,
        color: "var(--text-muted)",
      }}>
        <span>ShieldSense SOC Platform · SIH 2026 · Team Quantum Defenders</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#059669" }}>
          <Circle size={7} fill="#059669" strokeWidth={0} /> All systems operational
        </span>
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
