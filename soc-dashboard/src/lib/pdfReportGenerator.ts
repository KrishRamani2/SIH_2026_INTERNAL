import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  topTalkers, geoAttacks, protocolData, osFingerprintData, attackNarrative,
  recoveryTimeline, generateTrafficData, generateForecastData
} from "./mockData";

export interface AttackLogRecord {
  id: string;
  timestamp: string;
  severity: "CRITICAL" | "WARNING" | "INFO" | "CERT_ALERT";
  sourceIP: string;
  country: string;
  asn: string;
  attackType: string;
  endpoint: string;
  wafRule: string;
  action: "BLOCKED" | "CHALLENGED" | "RATE_LIMITED" | "FLAGGED";
  ja3: string;
  certFiled: boolean;
  details: string;
}

export const sampleAttackLogs: AttackLogRecord[] = [
  {
    id: "LOG-9842",
    timestamp: "2026-08-16 10:38:12",
    severity: "CRITICAL",
    sourceIP: "192.168.43.104",
    country: "China (CN)",
    asn: "AS4134 China Telecom",
    attackType: "SYN Flood / Mirai Botnet",
    endpoint: "/api/v1/auth/login",
    wafRule: "WAF-4421",
    action: "BLOCKED",
    ja3: "a8d3f1a0e294b...c81",
    certFiled: true,
    details: "Traffic volume exceeded 340% baseline threshold. 14,100 SYN packets/sec from single /24 subnet."
  },
  {
    id: "LOG-9841",
    timestamp: "2026-08-16 10:37:55",
    severity: "CRITICAL",
    sourceIP: "10.220.18.52",
    country: "Russia (RU)",
    asn: "AS8075 Microsoft Infra",
    attackType: "HTTP/2 Multiplex Amplification",
    endpoint: "/ws/stream/v2",
    wafRule: "WAF-8819",
    action: "BLOCKED",
    ja3: "c1b2d8f4e910a...7b2",
    certFiled: true,
    details: "Rapid stream reset flood detected. 9,820 requests/sec with anomalous header ordering."
  },
  {
    id: "LOG-9840",
    timestamp: "2026-08-16 10:36:44",
    severity: "CERT_ALERT",
    sourceIP: "172.16.55.19",
    country: "USA (US)",
    asn: "AS16509 Amazon AWS",
    attackType: "UDP Volumetric Reflection",
    endpoint: "/api/dns/query",
    wafRule: "WAF-1042",
    action: "RATE_LIMITED",
    ja3: "f3a9e2b318c4...9d0",
    certFiled: true,
    details: "DNS amplification vector targeting core resolver. Rate limited to 10 RPS per IP."
  },
  {
    id: "LOG-9839",
    timestamp: "2026-08-16 10:35:10",
    severity: "WARNING",
    sourceIP: "45.88.193.11",
    country: "Brazil (BR)",
    asn: "AS13335 Cloudflare Proxy",
    attackType: "Credential Stuffing Burst",
    endpoint: "/api/v1/user/reset-password",
    wafRule: "WAF-3301",
    action: "CHALLENGED",
    ja3: "98b17ce14f29...0a4",
    certFiled: false,
    details: "High entropy payload signatures with rotating User-Agent strings. JS challenge issued."
  },
  {
    id: "LOG-9838",
    timestamp: "2026-08-16 10:34:02",
    severity: "INFO",
    sourceIP: "103.21.244.88",
    country: "India (IN)",
    asn: "AS4837 Telecom India",
    attackType: "TLS Fingerprint Anomaly",
    endpoint: "/api/v1/telemetry",
    wafRule: "WAF-1002",
    action: "FLAGGED",
    ja3: "b23c7a6b89e1...1e2",
    certFiled: false,
    details: "Mismatched TCP window size and TTL score. Marked for deep packet inspection."
  },
  {
    id: "LOG-9837",
    timestamp: "2026-08-16 10:32:15",
    severity: "CRITICAL",
    sourceIP: "194.165.16.204",
    country: "Netherlands (NL)",
    asn: "AS1299 Telia Carrier",
    attackType: "IoT Mirai Botnet Cluster",
    endpoint: "/api/v1/pay/process",
    wafRule: "WAF-4421",
    action: "BLOCKED",
    ja3: "a8d3f1a0e294b...c81",
    certFiled: true,
    details: "Coordinated botnet cluster identified across 5,480 nodes. Subnet level block active."
  },
  {
    id: "LOG-9836",
    timestamp: "2026-08-16 10:30:50",
    severity: "WARNING",
    sourceIP: "91.108.4.17",
    country: "Russia (RU)",
    asn: "AS8075 Microsoft Infra",
    attackType: "Slowloris Exhaustion Attack",
    endpoint: "/api/v1/stream",
    wafRule: "WAF-5091",
    action: "BLOCKED",
    ja3: "d1e9ef2741b2...3f8",
    certFiled: false,
    details: "Partial HTTP requests held open to consume connection pool. Connection timeout enforced."
  },
  {
    id: "LOG-9835",
    timestamp: "2026-08-16 10:28:30",
    severity: "CERT_ALERT",
    sourceIP: "185.220.101.5",
    country: "Germany (DE)",
    asn: "AS3320 Deutsche Telekom",
    attackType: "BGP Route Hijack & Spoofing",
    endpoint: "Edge Gateway Node 04",
    wafRule: "WAF-9901",
    action: "BLOCKED",
    ja3: "e4f5a6b7c8d9...0e1",
    certFiled: true,
    details: "Spoofed source address range matched known Tor exit node list. CERT-In statutory filing generated."
  }
];

export function generatePdfReport(tabId: string = "command", attackLogsData: AttackLogRecord[] = sampleAttackLogs) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const reportDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Asia/Kolkata"
  });
  const reportId = `AB-CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    command: {
      title: "SOC COMMAND CENTER OPERATIONS REPORT",
      subtitle: "Real-time Telemetry, Security Health & Threat Matrix"
    },
    intelligence: {
      title: "ATTACK INTELLIGENCE & BOTNET ANALYSIS REPORT",
      subtitle: "OS Fingerprinting, ASN Treemaps & Behavioral Clusters"
    },
    predictive: {
      title: "PREDICTIVE THREAT & TRAFFIC FORECAST REPORT",
      subtitle: "LSTM ML Forecasting, What-If Simulations & MAPE Accuracy"
    },
    os: {
      title: "OS FINGERPRINTING & INFRASTRUCTURE AUDIT REPORT",
      subtitle: "TTL Distributions, JA3/JA4 Hashes & Device Breakdown"
    },
    compliance: {
      title: "CERT-In AUDIT & COMPLIANCE DISCLOSURE REPORT",
      subtitle: "Statutory Mitigation Directives, SLA & Attack Recovery Timeline"
    },
    logs: {
      title: "REAL-TIME ATTACK LOGS & INCIDENT TELEMETRY REPORT",
      subtitle: "Comprehensive Forensic Logbook & CERT-In Filed Events"
    }
  };

  const currentTabInfo = tabTitles[tabId] || tabTitles.command;

  // ───────────────────────────────────────────────────────────────────────────
  // COVER PAGE (PAGE 1)
  // ───────────────────────────────────────────────────────────────────────────

  // Top Dark Header Banner
  doc.setFillColor(15, 23, 42); // #161616 Deep Navy
  doc.rect(0, 0, pageWidth, 55, "F");

  // Accent line below top banner (Gold/Amber)
  doc.setFillColor(217, 119, 6); // #F25C1F
  doc.rect(0, 54, pageWidth, 2, "F");

  // Project Logo / Graphic Badge
  doc.setFillColor(37, 99, 235); // #161616 Royal Blue
  doc.roundedRect(16, 14, 26, 26, 3, 3, "F");
  
  // Draw Shield Icon inside badge
  doc.setLineWidth(1.2);
  doc.setDrawColor(255, 255, 255);
  doc.line(29, 20, 37, 24);
  doc.line(37, 24, 37, 32);
  doc.line(37, 32, 29, 36);
  doc.line(29, 36, 21, 32);
  doc.line(21, 32, 21, 24);
  doc.line(21, 24, 29, 20);

  // Header Title in Top Banner
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("TRISHUL", 48, 26);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // #C4C1B8
  doc.text("NATIONAL CYBER DEFENSE & SOC OPERATIONS PLATFORM", 48, 34);

  doc.setFontSize(8);
  doc.setTextColor(217, 119, 6);
  doc.setFont("helvetica", "bold");
  doc.text("CERT-In COMPLIANT // SIH 2026 OFFICIAL SECURITY TELEMETRY", 48, 42);

  // Cover Page Title & Subtitle Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(16, 68, pageWidth - 32, 34, 3, 3, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const wrappedTitle = doc.splitTextToSize(currentTabInfo.title, pageWidth - 44);
  doc.text(wrappedTitle, 22, 79);

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const wrappedSub = doc.splitTextToSize(currentTabInfo.subtitle, pageWidth - 44);
  doc.text(wrappedSub, 22, 90);

  // Metadata Card Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(16, 110, pageWidth - 32, 68, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text("DOCUMENT CONTROL & AUDIT METADATA", 22, 120);

  doc.setDrawColor(241, 245, 249);
  doc.line(22, 123, pageWidth - 22, 123);

  const metaData = [
    ["Project Name:", "Trishul SOC Platform", "Classification:", "CONFIDENTIAL // RESTRICTED"],
    ["Report ID:", reportId, "Target Scope:", "Sovereign Infrastructure Scope"],
    ["Generated On:", reportDate, "CERT-In Filing:", "INC-2026-0815-001 (Active)"],
    ["SOC Engine:", "Trishul ML Core v2.1", "Threat Level:", "CRITICAL (Under Mitigation)"],
  ];

  let metaY = 131;
  doc.setFontSize(8.5);
  metaData.forEach(row => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(row[0], 22, metaY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(row[1], 48, metaY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(row[2], 106, metaY);

    doc.setFont("helvetica", "normal");
    if (row[3].includes("CRITICAL")) {
      doc.setTextColor(220, 38, 38);
    } else {
      doc.setTextColor(15, 23, 42);
    }
    doc.text(row[3], 130, metaY);

    metaY += 10;
  });

  // Executive Summary Card Box
  doc.setFillColor(254, 242, 242); // #F25C1F33 Light Red background
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(16, 186, pageWidth - 32, 54, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(220, 38, 38); // Red
  doc.text("EXECUTIVE THREAT SUMMARY & AUDIT DISCLOSURE", 22, 196);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const summaryText = [
    "Trishul SOC Platform detected a major coordinated DDoS attack pattern initiating at 16:48 IST.",
    "Peak traffic volume reached 8,225 RPS (340% above historical baseline) driven by Linux-Mirai botnets.",
    "Autonomous WAF & rate-limiting rules blocked 51% of malicious ingress traffic while preserving 99.2% clean RPS.",
    "CERT-In statutory notification #INC-2026-0815-001 has been triggered in compliance with Indian IT Act directives."
  ];

  let sumY = 204;
  summaryText.forEach(line => {
    const wrapped = doc.splitTextToSize(`• ${line}`, pageWidth - 48);
    doc.text(wrapped, 22, sumY);
    sumY += wrapped.length * 6;
  });

  // Official Stamp / Watermark Graphic
  doc.setDrawColor(16, 185, 129); // Green
  doc.setLineWidth(0.8);
  doc.roundedRect(pageWidth - 68, 248, 52, 20, 2, 2, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(5, 150, 105);
  doc.text("CERT-In AUDITED", pageWidth - 64, 256);
  doc.setFontSize(7);
  doc.text("TRISHUL VERIFIED", pageWidth - 64, 262);

  // Footer on cover page
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Trishul Cyber Security Operations Center · Page 1 of 3", 16, pageHeight - 12);
  doc.text("CONFIDENTIAL & PROPRIETARY", pageWidth - 60, pageHeight - 12);

  // ───────────────────────────────────────────────────────────────────────────
  // PAGE 2: SYSTEMATIC TABLES & TAB SPECIFIC TELEMETRY
  // ───────────────────────────────────────────────────────────────────────────
  doc.addPage();

  // Page 2 Header Bar
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 18, "F");
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 17, pageWidth, 1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("TRISHUL SOC PLATFORM", 16, 12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`|  ${currentTabInfo.title}`, 68, 12);
  doc.text(`ID: ${reportId}`, pageWidth - 45, 12);

  let startY = 26;

  // ── Executive KPI Summary Table ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("1. Executive Key Performance Indicators (KPIs)", 16, startY);

  autoTable(doc, {
    startY: startY + 4,
    head: [["Metric Parameter", "Current Value", "Baseline / Target", "Threat Assessment", "Status"]],
    body: [
      ["Current Request Rate", "4,912 RPS", "4,500 RPS", "Normal Traffic Flow", "STABLE"],
      ["Peak Attack Volume", "8,225 RPS", "4,500 RPS Baseline", "+340% Traffic Surge", "CRITICAL"],
      ["Blocked Malicious Volume", "51.0% (4,195 RPS)", "< 1.0% Target", "Active WAF Filtering", "MITIGATED"],
      ["Blocked Malicious IPs", "18,742 IPs", "0 Baseline", "Linux-Mirai & Windows Cluster", "CONTAINED"],
      ["Active Mitigation Rules", "12 Active WAF Rules", "0 Rules", "Geo-block + Rate Limit", "ENFORCED"],
      ["Model Prediction Accuracy", "97.0% Confidence", "> 90% Target", "LSTM-Transformer Hybrid", "OPTIMAL"],
      ["CERT-In Incident Status", "Filed (#INC-2026-0815-001)", "Mandatory Filing", "Statutory Compliance", "COMPLIANT"],
    ],
    theme: "striped",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 16, right: 16 }
  });

  startY = (doc as any).lastAutoTable.finalY + 12;

  // ── Tab Specific Data Tables ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`2. Detailed Tab Telemetry & Logbook (${tabId.toUpperCase()})`, 16, startY);

  if (tabId === "command") {
    autoTable(doc, {
      startY: startY + 4,
      head: [["Subnet / IP Range", "Total Requests", "Blocked Req", "Country", "OS Fingerprint", "Threat Level"]],
      body: topTalkers.map(t => [t.ip, t.requests.toLocaleString(), t.blocked.toLocaleString(), t.country, t.os, t.blocked > 9000 ? "HIGH" : "MEDIUM"]),
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 16, right: 16 }
    });

    const nextY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Protocol Distribution Summary", 16, nextY);

    autoTable(doc, {
      startY: nextY + 4,
      head: [["Protocol Name", "Traffic Share (%)", "Risk Level", "Mitigation Strategy"]],
      body: protocolData.map(p => [p.name, `${p.value}%`, p.name.includes("Flood") ? "CRITICAL" : "NORMAL", p.name.includes("Flood") ? "SYN Cookie & Rate Limit" : "Standard WAF Pass"]),
      theme: "striped",
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 16, right: 16 }
    });

  } else if (tabId === "intelligence") {
    autoTable(doc, {
      startY: startY + 4,
      head: [["OS Signature", "Traffic Share (%)", "Est. Packets", "Risk Score", "Mitigation Action"]],
      body: osFingerprintData.map(o => [o.name, `${o.value}%`, Math.round(o.value * 1285.4).toLocaleString(), o.name.includes("Mirai") ? "CRITICAL (95/100)" : "LOW", o.name.includes("Mirai") ? "BGP Blackhole & Rate Limit" : "Inspected"]),
      theme: "grid",
      headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 16, right: 16 }
    });

    const nextY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Top Source ASN & Country Attack Matrix", 16, nextY);

    autoTable(doc, {
      startY: nextY + 4,
      head: [["Country", "Country Code", "Total Attack Packets", "Latitude", "Longitude"]],
      body: geoAttacks.map(g => [g.country, g.code, g.attacks.toLocaleString(), g.lat.toString(), g.lng.toString()]),
      theme: "striped",
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 16, right: 16 }
    });

  } else if (tabId === "predictive") {
    const forecastPoints = generateForecastData().slice(0, 12);
    autoTable(doc, {
      startY: startY + 4,
      head: [["Time Slot", "Actual Traffic (RPS)", "Predicted Traffic (RPS)", "Malicious Threshold", "Status / Variance"]],
      body: forecastPoints.map(f => [
        f.time,
        f.actual ? f.actual.toLocaleString() : "Projection",
        f.predicted.toLocaleString(),
        `${f.threshold} RPS`,
        f.predicted > f.threshold ? "THRESHOLD EXCEEDED" : "NORMAL RANGE"
      ]),
      theme: "grid",
      headStyles: { fillColor: [217, 119, 6], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 16, right: 16 }
    });

  } else if (tabId === "os") {
    autoTable(doc, {
      startY: startY + 4,
      head: [["JA3 / JA4 Fingerprint Hash", "Total Requests", "Share (%)", "Risk Level", "Classification"]],
      body: [
        ["a48d...1f3e1", "6,501", "9.21%", "High Risk", "Known Mirai C2 Client"],
        ["c1b2...d8f4", "5,142", "7.28%", "Medium Risk", "HTTP/2 Multiplexer"],
        ["f3a9...e2b3", "3,054", "4.33%", "Medium Risk", "Automated Python Script"],
        ["98b1...7ce1", "2,349", "3.33%", "Medium Risk", "Headless Chrome Crawler"],
        ["b23c...7a6b", "2,164", "3.07%", "Low Risk", "Clean Desktop Browser"],
        ["d1e9...ef27", "1,821", "2.58%", "Low Risk", "Mobile Native App"],
      ],
      theme: "grid",
      headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 16, right: 16 }
    });

  } else if (tabId === "compliance") {
    autoTable(doc, {
      startY: startY + 4,
      head: [["Timeline Phase", "Time Window", "Description", "Mitigation Action", "Recovery Status"]],
      body: recoveryTimeline.map((r, i) => [
        `Step ${i + 1}: ${r.label}`,
        `${r.start}m – ${r.start + r.duration}m`,
        r.description,
        i === 2 ? "51% Traffic Blocked" : "Rule Adaptive Tweak",
        i <= 3 ? "COMPLETED" : "IN PROGRESS"
      ]),
      theme: "striped",
      headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 16, right: 16 }
    });

  } else {
    // Attack Logs tab
    autoTable(doc, {
      startY: startY + 4,
      head: [["Log ID", "Timestamp", "Severity", "Source IP / ASN", "Attack Type", "Action", "CERT Filed"]],
      body: attackLogsData.map(l => [
        l.id,
        l.timestamp.split(" ")[1],
        l.severity,
        `${l.sourceIP}\n(${l.asn.split(" ")[0]})`,
        l.attackType,
        l.action,
        l.certFiled ? "YES" : "NO"
      ]),
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
      bodyStyles: { fontSize: 7.5 },
      margin: { left: 16, right: 16 }
    });
  }

  // Footer Page 2
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Trishul Cyber Security Operations Center · Page 2 of 3", 16, pageHeight - 12);
  doc.text("CONFIDENTIAL & PROPRIETARY", pageWidth - 60, pageHeight - 12);

  // ───────────────────────────────────────────────────────────────────────────
  // PAGE 3: CERT-In STATUTORY COMPLIANCE & INCIDENT DISCLOSURE LOGBOOK
  // ───────────────────────────────────────────────────────────────────────────
  doc.addPage();

  // Page 3 Header Bar
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 18, "F");
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 17, pageWidth, 1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("TRISHUL SOC PLATFORM", 16, 12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("|  CERT-In Statutory Incident Audit & Approval Log", 68, 12);
  doc.text(`ID: ${reportId}`, pageWidth - 45, 12);

  startY = 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("3. Real-Time Forensic Incident Narrative & CERT-In Logbook", 16, startY);

  autoTable(doc, {
    startY: startY + 4,
    head: [["Time (IST)", "Event Category", "Incident Narrative & Vector Description", "Confidence"]],
    body: attackNarrative.map(n => [
      n.time,
      n.severity.toUpperCase(),
      n.message.replace(/^[^\w]+/, ""), // Clean emoji
      n.message.includes("%") ? "High (90%+)" : "Verified"
    ]),
    theme: "striped",
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 16, right: 16 }
  });

  startY = (doc as any).lastAutoTable.finalY + 12;

  // CERT-In Directive Box
  doc.setFillColor(240, 253, 244); // #F0FDF4 Soft Green
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(16, startY, pageWidth - 32, 42, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(22, 101, 52);
  doc.text("CERT-In STATUTORY MANDATE COMPLIANCE STATEMENT", 22, startY + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text("This incident report has been generated automatically by Trishul in accordance with Section 70B", 22, startY + 17);
  doc.text("of the Information Technology Act, 2000 and CERT-In Cyber Security Directions 2026. All attack log", 22, startY + 23);
  doc.text("telemetry, IP fingerprints, and mitigation metrics are cryptographically hashed and archived.", 22, startY + 29);
  doc.text("Official Reference: CERT-In Mandatory Incident Filing #INC-2026-0815-001.", 22, startY + 35);

  // Signatures Box
  startY += 50;

  doc.setDrawColor(226, 232, 240);
  doc.line(16, startY, pageWidth - 16, startY);

  startY += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("AUTHORIZATION & APPROVAL SIGNATURES", 16, startY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  // Signature Left
  doc.line(16, startY + 18, 76, startY + 18);
  doc.text("Lead SOC Incident Analyst", 16, startY + 23);
  doc.text("Trishul Defense Operations", 16, startY + 28);

  // Signature Center
  doc.line(86, startY + 18, 146, startY + 18);
  doc.text("Chief Information Security Officer (CISO)", 86, startY + 23);
  doc.text("National SOC Taskforce", 86, startY + 28);

  // Signature Right
  doc.line(156, startY + 18, pageWidth - 16, startY + 18);
  doc.text("CERT-In Nodal Officer", 156, startY + 23);
  doc.text("Sovereign Cyber Security Cell", 156, startY + 28);

  // Footer Page 3
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Trishul Cyber Security Operations Center · Page 3 of 3", 16, pageHeight - 12);
  doc.text("CONFIDENTIAL & PROPRIETARY", pageWidth - 60, pageHeight - 12);

  // Save the generated PDF
  const cleanTabName = tabId.charAt(0).toUpperCase() + tabId.slice(1);
  doc.save(`Trishul_Report_${cleanTabName}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
