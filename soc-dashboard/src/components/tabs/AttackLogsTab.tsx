"use client";

import { useState, useEffect } from "react";
import {
  Shield, Search, Download, FileText, CheckCircle2,
  AlertTriangle, AlertCircle, Info, Lock, Eye, ShieldAlert,
  RefreshCw, Copy, Check, Fingerprint, Activity, Layers, ArrowUpRight, Play, Pause
} from "lucide-react";
import { sampleAttackLogs, AttackLogRecord, generatePdfReport } from "@/lib/pdfReportGenerator";

export default function AttackLogsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [logs, setLogs] = useState<AttackLogRecord[]>(sampleAttackLogs);
  const [selectedLog, setSelectedLog] = useState<AttackLogRecord | null>(sampleAttackLogs[0]);
  const [copiedJa3, setCopiedJa3] = useState(false);
  const [copiedIp, setCopiedIp] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [newLogId, setNewLogId] = useState<string | null>(null);

  // ── Pagination State ──
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ── Continuous Live Stream Generator ──
  useEffect(() => {
    if (!isLiveStreaming) return;

    const attackVectors = [
      { type: "SYN Flood / Mirai Botnet", rule: "WAF-4421", endpoint: "/api/v1/auth/login", action: "BLOCKED" as const, sev: "CRITICAL" as const },
      { type: "HTTP/2 Multiplex Amplification", rule: "WAF-8819", endpoint: "/ws/stream/v2", action: "BLOCKED" as const, sev: "CRITICAL" as const },
      { type: "UDP Volumetric Reflection", rule: "WAF-1042", endpoint: "/api/dns/query", action: "RATE_LIMITED" as const, sev: "CERT_ALERT" as const },
      { type: "Credential Stuffing Burst", rule: "WAF-3301", endpoint: "/api/v1/user/reset-password", action: "CHALLENGED" as const, sev: "WARNING" as const },
      { type: "TLS Fingerprint Anomaly", rule: "WAF-1002", endpoint: "/api/v1/telemetry", action: "FLAGGED" as const, sev: "INFO" as const },
    ];

    const sources = [
      { ip: "192.168.43.104", country: "China (CN)", asn: "AS4134 China Telecom" },
      { ip: "10.220.18.52", country: "Russia (RU)", asn: "AS8075 Microsoft Infra" },
      { ip: "172.16.55.19", country: "USA (US)", asn: "AS16509 Amazon AWS" },
      { ip: "45.88.193.11", country: "Brazil (BR)", asn: "AS13335 Cloudflare Proxy" },
      { ip: "194.165.16.204", country: "Netherlands (NL)", asn: "AS1299 Telia Carrier" },
    ];

    const interval = setInterval(() => {
      const randomVec = attackVectors[Math.floor(Math.random() * attackVectors.length)];
      const randomSrc = sources[Math.floor(Math.random() * sources.length)];
      const nextIdNum = Math.floor(9843 + Math.random() * 1000);
      const generatedId = `LOG-${nextIdNum}`;

      const nowStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

      const newRecord: AttackLogRecord = {
        id: generatedId,
        timestamp: `2026-08-16 ${nowStr}`,
        severity: randomVec.sev,
        sourceIP: randomSrc.ip,
        country: randomSrc.country,
        asn: randomSrc.asn,
        attackType: randomVec.type,
        endpoint: randomVec.endpoint,
        wafRule: randomVec.rule,
        action: randomVec.action,
        ja3: `${Math.random().toString(36).substring(2, 12)}...${Math.random().toString(36).substring(2, 5)}`,
        certFiled: randomVec.sev === "CRITICAL" || randomVec.sev === "CERT_ALERT",
        details: `Continuous ingress telemetry stream: High packet rate (${Math.floor(10000 + Math.random() * 8000)} RPS) from ${randomSrc.country} targeting ${randomVec.endpoint}.`
      };

      setNewLogId(generatedId);
      // Push new log to top of list, accumulate up to 50 logs history
      setLogs(prev => [newRecord, ...prev.slice(0, 49)]);
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.sourceIP.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.asn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.attackType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.wafRule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === "ALL" || log.severity === severityFilter;
    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;

    return matchesSearch && matchesSeverity && matchesAction;
  });

  // Calculate Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedLogs = filteredLogs.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  // Calculate Stat Cards Metrics
  const criticalCount = logs.filter(l => l.severity === "CRITICAL").length;
  const blockedCount = logs.filter(l => l.action === "BLOCKED").length;
  const blockedPct = logs.length > 0 ? Math.round((blockedCount / logs.length) * 100) : 75;
  const uniqueSourcesCount = new Set(logs.map(l => l.sourceIP)).size;

  const handleExportPdf = () => {
    generatePdfReport("logs", filteredLogs);
  };

  const copyToClipboard = (text: string, type: "ip" | "ja3") => {
    navigator.clipboard.writeText(text);
    if (type === "ip") {
      setCopiedIp(true);
      setTimeout(() => setCopiedIp(false), 2000);
    } else {
      setCopiedJa3(true);
      setTimeout(() => setCopiedJa3(false), 2000);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ─── Streamlined Action & Status Header ─── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#FEF2F2", border: "1px solid #FECACA",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <ShieldAlert size={18} color="#DC2626" />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.01em" }}>
              Attack Logs &amp; Telemetry
            </h2>
            <p style={{ fontSize: 11, color: "#64748B" }}>
              Granular DDoS logbook, JA3 signatures, WAF action telemetry &amp; CERT-In reporting
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Live Stream Toggle Button */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 7,
              border: `1px solid ${isLiveStreaming ? "#BFDBFE" : "#E2E8F0"}`,
              background: isLiveStreaming ? "#EFF6FF" : "white",
              color: isLiveStreaming ? "#2563EB" : "#64748B",
              fontSize: 11, fontWeight: 600, cursor: "pointer"
            }}
          >
            {isLiveStreaming ? <Pause size={13} color="#2563EB" /> : <Play size={13} color="#64748B" />}
            {isLiveStreaming ? "Live Stream Active" : "Stream Paused"}
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => { setLogs([...sampleAttackLogs]); setCurrentPage(1); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 7,
              border: "1px solid var(--border)", background: "#FFFFFF",
              color: "#334155", fontSize: 11, fontWeight: 600, cursor: "pointer"
            }}
          >
            <RefreshCw size={13} color="#2563EB" /> Refresh
          </button>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPdf}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 7,
              background: "#0F172A",
              color: "#FFFFFF", fontSize: 11, fontWeight: 600,
              border: "1px solid #1E293B", cursor: "pointer",
              boxShadow: "0 1px 3px rgba(15,23,42,0.12)"
            }}
          >
            <Download size={13} color="#F59E0B" /> Export Report
          </button>
        </div>
      </div>

      {/* ─── Metric Stat Cards Row (6 Cards) ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>

        {/* Card 1: Critical Events */}
        <div className="card" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle size={17} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>Critical Events</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#DC2626", lineHeight: 1.1, marginTop: 1 }}>{criticalCount}</div>
            <div style={{ fontSize: 10, color: "#94A3B8" }}>High priority</div>
          </div>
        </div>

        {/* Card 2: Total Events */}
        <div className="card" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#FFFBEB", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={17} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>Total Events</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", lineHeight: 1.1, marginTop: 1 }}>{logs.length}</div>
            <div style={{ fontSize: 10, color: "#94A3B8" }}>Last 24 hours</div>
          </div>
        </div>

        {/* Card 3: Blocked Attacks */}
        <div className="card" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F5F3FF", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield size={17} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>Blocked Attacks</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", lineHeight: 1.1, marginTop: 1 }}>{blockedCount}</div>
            <div style={{ fontSize: 10, color: "#7C3AED", fontWeight: 600 }}>{blockedPct}% rate</div>
          </div>
        </div>

        {/* Card 4: Unique Sources */}
        <div className="card" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Fingerprint size={17} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>Unique Sources</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", lineHeight: 1.1, marginTop: 1 }}>{uniqueSourcesCount}</div>
            <div style={{ fontSize: 10, color: "#94A3B8" }}>Distinct IP/ASN</div>
          </div>
        </div>

        {/* Card 5: CERT-In Compliant */}
        <div className="card" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CheckCircle2 size={17} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>Compliance</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#059669", lineHeight: 1.1, marginTop: 1 }}>100%</div>
            <div style={{ fontSize: 10, color: "#047857" }}>All logs filed</div>
          </div>
        </div>

        {/* Card 6: Traffic Over Baseline */}
        <div className="card" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F0F9FF", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Activity size={17} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>Baseline Delta</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0284C7", lineHeight: 1.1, marginTop: 1 }}>+340%</div>
            <div style={{ fontSize: 10, color: "#94A3B8" }}>Current peak</div>
          </div>
        </div>

      </div>

      {/* ─── Search & Toolbar Row ─── */}
      <div className="card" style={{ padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
        {/* Search Input */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 280, background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "7px 12px", borderRadius: 8 }}>
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search by IP, ASN, Attack Type, Endpoint, WAF Rule or Log ID..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ border: "none", background: "transparent", outline: "none", fontSize: 12, width: "100%", color: "#0F172A" }}
          />
        </div>

        {/* Severity Select */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>Severity:</span>
          <select
            value={severityFilter}
            onChange={e => { setSeverityFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 11, background: "white", color: "#0F172A", fontWeight: 600 }}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="CERT_ALERT">CERT Alert</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
        </div>

        {/* WAF Action Select */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>WAF Action:</span>
          <select
            value={actionFilter}
            onChange={e => { setActionFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 11, background: "white", color: "#0F172A", fontWeight: 600 }}
          >
            <option value="ALL">All Actions</option>
            <option value="BLOCKED">Blocked</option>
            <option value="RATE_LIMITED">Rate Limited</option>
            <option value="CHALLENGED">Challenged</option>
            <option value="FLAGGED">Flagged</option>
          </select>
        </div>

        {/* Log Counter Pill */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", background: "#EFF6FF", padding: "5px 12px", borderRadius: 6, border: "1px solid #BFDBFE", display: "flex", alignItems: "center", gap: 6 }}>
          <Layers size={14} /> Showing {filteredLogs.length} of {logs.length} logs
        </div>
      </div>

      {/* ─── Main Grid: Table Left + Inspector Right (Stretching Equal Height) ─── */}
      <div style={{ display: "grid", gridTemplateColumns: selectedLog ? "1.65fr 1fr" : "1fr", gap: 16, alignItems: "stretch" }}>

        {/* Left Column: Attack Logs Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 520 }}>
          <div>
            {/* Table Header Strip */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFFFF" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={16} color="#2563EB" /> Real-Time Ingress Telemetry Logbook
                {isLiveStreaming && (
                  <span style={{ fontSize: 10, color: "#059669", background: "#ECFDF5", padding: "2px 8px", borderRadius: 99, border: "1px solid #A7F3D0", display: "flex", alignItems: "center", gap: 4 }}>
                    <span className="dot-pulse" style={{ background: "#059669", width: 5, height: 5 }} /> Live Ingress
                  </span>
                )}
              </div>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>Click any row to inspect deep packet details</span>
            </div>

            {/* Table Body */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#64748B" }}>ID &amp; TIME</th>
                    <th style={{ padding: "10px 14px", fontSize: 10, fontWeight: 700, color: "#64748B" }}>SEVERITY</th>
                    <th style={{ padding: "10px 14px", fontSize: 10, fontWeight: 700, color: "#64748B" }}>SOURCE IP &amp; ASN</th>
                    <th style={{ padding: "10px 14px", fontSize: 10, fontWeight: 700, color: "#64748B" }}>ATTACK VECTOR</th>
                    <th style={{ padding: "10px 14px", fontSize: 10, fontWeight: 700, color: "#64748B" }}>TARGET ENDPOINT</th>
                    <th style={{ padding: "10px 14px", fontSize: 10, fontWeight: 700, color: "#64748B" }}>WAF ACTION</th>
                    <th style={{ padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#64748B", textAlign: "center" }}>CERT-IN</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map(log => {
                    const isSelected = selectedLog?.id === log.id;
                    const isJustAdded = newLogId === log.id;

                    let borderStripColor = "#2563EB";
                    let sevBg = "#FEF2F2", sevText = "#DC2626", SevIcon = AlertTriangle;

                    if (log.severity === "CRITICAL") {
                      borderStripColor = "#DC2626";
                      sevBg = "#FEF2F2"; sevText = "#DC2626"; SevIcon = AlertTriangle;
                    } else if (log.severity === "CERT_ALERT" || log.severity === "WARNING") {
                      borderStripColor = "#D97706";
                      sevBg = "#FFFBEB"; sevText = "#D97706"; SevIcon = AlertCircle;
                    } else if (log.severity === "INFO") {
                      borderStripColor = "#2563EB";
                      sevBg = "#EFF6FF"; sevText = "#2563EB"; SevIcon = Info;
                    }

                    let actBg = "#FEF2F2", actText = "#DC2626";
                    if (log.action === "RATE_LIMITED") { actBg = "#FFFBEB"; actText = "#D97706"; }
                    else if (log.action === "CHALLENGED") { actBg = "#F5F3FF"; actText = "#7C3AED"; }
                    else if (log.action === "FLAGGED") { actBg = "#F0F9FF"; actText = "#0284C7"; }

                    return (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        style={{
                          borderBottom: "1px solid #F1F5F9",
                          cursor: "pointer",
                          background: isJustAdded ? "#EFF6FF" : isSelected ? "#F1F5F9" : "transparent",
                          transition: "background 0.3s ease",
                          position: "relative"
                        }}
                      >
                        {/* Left Colored Edge Bar */}
                        <td style={{ padding: "12px 16px", position: "relative" }}>
                          <div style={{
                            position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
                            background: borderStripColor, borderRadius: "2px 0 0 2px"
                          }} />
                          <div style={{ fontSize: 11, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{log.id}</div>
                          <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{log.timestamp.split(" ")[1]}</div>
                        </td>

                        {/* Severity Pill */}
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            fontSize: 9, fontWeight: 800, background: sevBg, color: sevText,
                            padding: "3px 9px", borderRadius: 6, border: `1px solid ${sevText}33`
                          }}>
                            <SevIcon size={12} /> {log.severity}
                          </span>
                        </td>

                        {/* Source IP & ASN */}
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#0F172A", fontFamily: "monospace" }}>{log.sourceIP}</div>
                          <div style={{ fontSize: 10, color: "#64748B", marginTop: 1 }}>
                            {log.country} · <span style={{ color: "#94A3B8" }}>{log.asn.split(" ")[0]}</span>
                          </div>
                        </td>

                        {/* Attack Vector & Rule */}
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#334155" }}>{log.attackType}</div>
                          <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "monospace", marginTop: 1 }}>
                            Rule: {log.wafRule}
                          </div>
                        </td>

                        {/* Target Endpoint */}
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ fontSize: 11, color: "#2563EB", fontFamily: "monospace", fontWeight: 600 }}>
                            {log.endpoint}
                          </span>
                        </td>

                        {/* WAF Action */}
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{
                            fontSize: 10, fontWeight: 800, background: actBg, color: actText,
                            padding: "3px 9px", borderRadius: 6, border: `1px solid ${actText}33`
                          }}>
                            {log.action}
                          </span>
                        </td>

                        {/* CERT-In Status */}
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          {log.certFiled ? (
                            <span style={{
                              fontSize: 10, fontWeight: 800, color: "#059669", background: "#ECFDF5",
                              padding: "3px 8px", borderRadius: 6, border: "1px solid #A7F3D0",
                              display: "inline-flex", alignItems: "center", gap: 3
                            }}>
                              ✓ FILED
                            </span>
                          ) : (
                            <span style={{ fontSize: 11, color: "#CBD5E1" }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Dynamic Interactive Pagination Footer Strip */}
          <div style={{ padding: "12px 20px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFC" }}>
            <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>
              Page {activePage} of {totalPages} · <strong style={{ color: "#0F172A" }}>{filteredLogs.length}</strong> total events
            </span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button
                disabled={activePage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{
                  padding: "5px 10px", borderRadius: 6, border: "1px solid #CBD5E1",
                  background: activePage === 1 ? "#F1F5F9" : "white",
                  fontSize: 11, color: activePage === 1 ? "#CBD5E1" : "#0F172A",
                  cursor: activePage === 1 ? "not-allowed" : "pointer", fontWeight: 600
                }}
              >
                &lt; Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    padding: "5px 10px", borderRadius: 6,
                    border: pageNum === activePage ? "1px solid #2563EB" : "1px solid #CBD5E1",
                    background: pageNum === activePage ? "#2563EB" : "white",
                    color: pageNum === activePage ? "white" : "#475569",
                    fontSize: 11, fontWeight: 700, cursor: "pointer"
                  }}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                style={{
                  padding: "5px 10px", borderRadius: 6, border: "1px solid #CBD5E1",
                  background: activePage === totalPages ? "#F1F5F9" : "white",
                  fontSize: 11, color: activePage === totalPages ? "#CBD5E1" : "#0F172A",
                  cursor: activePage === totalPages ? "not-allowed" : "pointer", fontWeight: 600
                }}
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Log Inspector (Equal Height Match) */}
        {selectedLog && (
          <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 520, boxSizing: "border-box" }}>
            <div>
              {/* Inspector Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Eye size={18} color="#2563EB" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
                    Log Inspector #{selectedLog.id}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  style={{ border: "none", background: "none", color: "#94A3B8", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                >
                  ✕ Close
                </button>
              </div>

              {/* Metadata Fields Grid */}
              <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 14, border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#64748B", fontWeight: 700 }}>TIMESTAMP</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>
                    {selectedLog.timestamp} IST
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#64748B", fontWeight: 700 }}>SOURCE IP</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#DC2626", fontFamily: "monospace" }}>
                      {selectedLog.sourceIP}
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedLog.sourceIP, "ip")}
                      style={{ background: "none", border: "none", color: copiedIp ? "#059669" : "#94A3B8", cursor: "pointer", padding: 2 }}
                      title="Copy IP"
                    >
                      {copiedIp ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#64748B", fontWeight: 700 }}>ORGANIZATION / ASN</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#0F172A" }}>{selectedLog.asn}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#64748B", fontWeight: 700 }}>COUNTRY OF ORIGIN</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#0F172A" }}>{selectedLog.country}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#64748B", fontWeight: 700 }}>WAF RULE TRIGGERED</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#2563EB", fontFamily: "monospace" }}>
                    {selectedLog.wafRule} ({selectedLog.attackType.split("/")[0].trim()} Rule)
                  </span>
                </div>
              </div>

              {/* JA3 TLS Fingerprint Hash Box */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: "#64748B", fontWeight: 800, textTransform: "uppercase" }}>
                    JA3 TLS FINGERPRINT HASH
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedLog.ja3, "ja3")}
                    style={{ background: "none", border: "none", color: copiedJa3 ? "#059669" : "#2563EB", fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}
                  >
                    {copiedJa3 ? <Check size={12} /> : <Copy size={12} />} {copiedJa3 ? "Copied!" : "Copy Hash"}
                  </button>
                </div>
                <div style={{
                  background: "#0F172A", color: "#38BDF8", padding: "10px 12px", borderRadius: 6,
                  fontFamily: "monospace", fontSize: 11, wordBreak: "break-all"
                }}>
                  {selectedLog.ja3}
                </div>
              </div>

              {/* Payload & Forensic Details Box */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: "#64748B", fontWeight: 800, textTransform: "uppercase", marginBottom: 6 }}>
                  FORENSIC DETAILS &amp; PAYLOAD ANALYSIS
                </div>
                <div style={{
                  fontSize: 11, color: "#7F1D1D", background: "#FEF2F2",
                  border: "1px solid #FCA5A5", padding: 12, borderRadius: 8,
                  display: "flex", gap: 10, alignItems: "flex-start"
                }}>
                  <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ lineHeight: 1.4, fontWeight: 500 }}>
                    {selectedLog.details}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions of Inspector */}
            <div>
              {/* CERT-In Filing Status Box */}
              <div style={{
                padding: "12px 14px", borderRadius: 8,
                background: selectedLog.certFiled ? "#ECFDF5" : "#FFFBEB",
                border: `1px solid ${selectedLog.certFiled ? "#A7F3D0" : "#FDE68A"}`,
                display: "flex", alignItems: "center", gap: 10, marginBottom: 12
              }}>
                <Lock size={18} color={selectedLog.certFiled ? "#059669" : "#D97706"} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: selectedLog.certFiled ? "#047857" : "#92400E" }}>
                    {selectedLog.certFiled ? "CERT-In Mandatory Filing Active" : "Pending Statutory Audit"}
                  </div>
                  <div style={{ fontSize: 10, color: selectedLog.certFiled ? "#065F46" : "#B45309", marginTop: 2 }}>
                    Ref: #INC-2026-0815-001 under Section 70B IT Act.
                  </div>
                </div>
              </div>

              {/* Download PDF Button */}
              <button
                onClick={handleExportPdf}
                style={{
                  width: "100%", padding: "11px 0", borderRadius: 8, border: "none",
                  background: "#2563EB", color: "white", fontSize: 12, fontWeight: 800,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 2px 8px rgba(37,99,235,0.25)"
                }}
              >
                <Download size={15} /> Export CERT-In PDF Log Report
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ─── Bottom Banner: CERT-In Statutory Compliance Card ─── */}
      <div className="card" style={{
        padding: "20px 24px",
        background: "linear-gradient(135deg, #F0F9FF, #E0F2FE)",
        border: "1px solid #BAE6FD",
        display: "grid",
        gridTemplateColumns: "2.2fr 1.2fr 1.2fr 1.2fr",
        gap: 20,
        alignItems: "center"
      }}>
        {/* Left Section with Shield Icon */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "#EFF6FF", border: "2px solid #93C5FD",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#2563EB", flexShrink: 0
          }}>
            <Shield size={26} color="#2563EB" />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              CERT-IN STATUTORY COMPLIANCE DIRECTIVE
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>
              Aegis-Bharat Automated Audit Report Available
            </div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
              Includes branded Aegis-Bharat cover page, executive threat summary, logs matrix, and CISO approval signature blocks.
            </div>
            <button
              onClick={handleExportPdf}
              style={{
                marginTop: 6, border: "none", background: "none", color: "#2563EB",
                fontSize: 11, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4
              }}
            >
              Preview Report <ArrowUpRight size={13} />
            </button>
          </div>
        </div>

        {/* Center Section 1: Incident Ref */}
        <div style={{ background: "white", padding: "12px 14px", borderRadius: 8, border: "1px solid #E0F2FE" }}>
          <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700 }}>Incident Filing Reference</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginTop: 2, fontFamily: "monospace" }}>#INC-2026-0815-001</div>
          <div style={{ fontSize: 10, color: "#059669", fontWeight: 600, marginTop: 2 }}>Filed under IT Act Sec 70B</div>
        </div>

        {/* Center Section 2: Compliance Status */}
        <div style={{ background: "white", padding: "12px 14px", borderRadius: 8, border: "1px solid #E0F2FE" }}>
          <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700 }}>Compliance Status</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#059669", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
            <CheckCircle2 size={16} color="#059669" /> 100% Verified
          </div>
          <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>Audited &amp; Encrypted</div>
        </div>

        {/* Right Section: Unlock PDF Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleExportPdf}
            style={{
              padding: "12px 20px", borderRadius: 8, border: "1px solid #E2E8F0",
              background: "#FFFFFF", color: "#0F172A", fontSize: 12, fontWeight: 800,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 2px 8px rgba(15,23,42,0.08)"
            }}
          >
            <Lock size={15} color="#D97706" /> Unlock CERT PDF
          </button>
        </div>
      </div>

    </div>
  );
}
