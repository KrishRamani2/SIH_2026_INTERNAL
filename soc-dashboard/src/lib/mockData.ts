// ─── Mock Data Generator for SOC Dashboard ───────────────────────────────────

export interface TrafficPoint {
  time: string;
  total: number;
  blocked: number;
  legitimate: number;
  predicted: number;
}

export interface GeoAttack {
  country: string;
  code: string;
  attacks: number;
  lat: number;
  lng: number;
}

export interface TopTalker {
  ip: string;
  requests: number;
  blocked: number;
  country: string;
  os: string;
}

export interface ProtocolBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface OSFingerprint {
  name: string;
  value: number;
  color: string;
}

export interface AttackEvent {
  time: string;
  message: string;
  severity: "info" | "warning" | "critical" | "success";
  icon: string;
}

export interface ForecastPoint {
  time: string;
  actual: number | null;
  predicted: number;
  threshold: number;
}

export interface BehaviorPoint {
  ip: string;
  requestRate: number;
  entropy: number;
  os: string;
  volume: number;
}

export interface RecoveryEvent {
  label: string;
  start: number;
  duration: number;
  color: string;
  description: string;
}

export interface KPISparkline {
  value: number;
  timestamp: number;
}

// ── Time label helpers ────────────────────────────────────────────────────────
const now = Date.now();
const mins = (n: number) => new Date(now - n * 60_000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

// ── Real-time traffic (last 30 min) ──────────────────────────────────────────
export function generateTrafficData(count = 30): TrafficPoint[] {
  return Array.from({ length: count }, (_, i) => {
    const baseTotal = 4200 + Math.sin(i * 0.4) * 800 + Math.random() * 600;
    const blocked = baseTotal * (0.45 + Math.random() * 0.15);
    const legitimate = baseTotal - blocked;
    const predicted = baseTotal * (1.08 + Math.random() * 0.06);
    return {
      time: mins(count - i),
      total: Math.round(baseTotal),
      blocked: Math.round(blocked),
      legitimate: Math.round(legitimate),
      predicted: Math.round(predicted),
    };
  });
}

// ── Forecast data (next 20 min) ───────────────────────────────────────────────
export function generateForecastData(): ForecastPoint[] {
  const history = Array.from({ length: 20 }, (_, i) => ({
    time: mins(20 - i),
    actual: Math.round(3800 + Math.random() * 1200),
    predicted: Math.round(3900 + Math.random() * 1100),
    threshold: 6500,
  }));
  const future = Array.from({ length: 10 }, (_, i) => ({
    time: mins(-i - 1),
    actual: null,
    predicted: Math.round(4200 + i * 380 + Math.random() * 300),
    threshold: 6500,
  }));
  return [...history, ...future];
}

// ── Geographic attack sources ─────────────────────────────────────────────────
export const geoAttacks: GeoAttack[] = [
  { country: "China", code: "CN", attacks: 18420, lat: 35.86, lng: 104.19 },
  { country: "Russia", code: "RU", attacks: 12340, lat: 61.52, lng: 105.31 },
  { country: "USA", code: "US", attacks: 8901, lat: 37.09, lng: -95.71 },
  { country: "Brazil", code: "BR", attacks: 6540, lat: -14.23, lng: -51.92 },
  { country: "India", code: "IN", attacks: 5210, lat: 20.59, lng: 78.96 },
  { country: "Germany", code: "DE", attacks: 4100, lat: 51.16, lng: 10.45 },
  { country: "Netherlands", code: "NL", attacks: 3870, lat: 52.13, lng: 5.29 },
  { country: "Ukraine", code: "UA", attacks: 3200, lat: 48.37, lng: 31.16 },
  { country: "Iran", code: "IR", attacks: 2900, lat: 32.42, lng: 53.68 },
  { country: "Nigeria", code: "NG", attacks: 1850, lat: 9.08, lng: 8.67 },
];

// ── Top talkers ───────────────────────────────────────────────────────────────
export const topTalkers: TopTalker[] = [
  { ip: "192.168.43.0/24", requests: 14230, blocked: 14100, country: "CN", os: "Linux-Mirai" },
  { ip: "10.220.18.0/24", requests: 9820, blocked: 9700, country: "RU", os: "Windows" },
  { ip: "172.16.55.0/24", requests: 7640, blocked: 7200, country: "US", os: "Unknown" },
  { ip: "45.88.193.0/24", requests: 6130, blocked: 5900, country: "BR", os: "Linux-Mirai" },
  { ip: "194.165.16.0/24", requests: 5480, blocked: 5100, country: "NL", os: "IoT" },
  { ip: "91.108.4.0/24", requests: 4270, blocked: 4000, country: "RU", os: "Windows" },
  { ip: "103.21.244.0/24", requests: 3850, blocked: 3600, country: "IN", os: "Mobile" },
  { ip: "185.220.101.0/24", requests: 3120, blocked: 3000, country: "DE", os: "Linux-Mirai" },
];

// ── Protocol breakdown ────────────────────────────────────────────────────────
export const protocolData: ProtocolBreakdown[] = [
  { name: "HTTP/1.1", value: 38, color: "#06b6d4" },
  { name: "HTTP/2", value: 25, color: "#8b5cf6" },
  { name: "UDP Flood", value: 18, color: "#f59e0b" },
  { name: "SYN Flood", value: 12, color: "#ef4444" },
  { name: "HTTPS", value: 7, color: "#10b981" },
];

// ── OS Fingerprint ────────────────────────────────────────────────────────────
export const osFingerprintData: OSFingerprint[] = [
  { name: "Linux-Mirai", value: 42, color: "#ef4444" },
  { name: "Windows", value: 28, color: "#06b6d4" },
  { name: "Unknown", value: 15, color: "#6b7280" },
  { name: "IoT", value: 9, color: "#f59e0b" },
  { name: "Mobile", value: 4, color: "#8b5cf6" },
  { name: "macOS", value: 2, color: "#10b981" },
];

// ── Attack confidence over time ───────────────────────────────────────────────
export function generateConfidenceData(count = 30) {
  return Array.from({ length: count }, (_, i) => ({
    time: mins(count - i),
    confidence: Math.min(99, 72 + Math.sin(i * 0.3) * 8 + Math.random() * 10),
    threshold: 80,
  }));
}

// ── Behavioral scatter ────────────────────────────────────────────────────────
export const behaviorData: BehaviorPoint[] = Array.from({ length: 120 }, (_, i) => {
  const os = ["Linux-Mirai", "Windows", "Unknown", "IoT", "Mobile"][Math.floor(Math.random() * 5)];
  return {
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.x.x`,
    requestRate: Math.random() * 1200,
    entropy: Math.random() * 8,
    os,
    volume: Math.random() * 10000,
  };
});

// ── Attack narrative ──────────────────────────────────────────────────────────
export const attackNarrative: AttackEvent[] = [
  { time: "16:49:06", message: "⚡ Anomaly detected: Traffic spike 340% above baseline on /api/login", severity: "critical", icon: "🔴" },
  { time: "16:48:51", message: "🛡️ WAF Rule #4421 activated — SYN flood pattern matched (confidence: 94%)", severity: "warning", icon: "🟡" },
  { time: "16:48:38", message: "📍 New attack wave from AS4134 (China Telecom) — 4,200 unique IPs", severity: "critical", icon: "🔴" },
  { time: "16:48:22", message: "🤖 ML Model: Linux-Mirai botnet signature confirmed (JA3: a8d3...)", severity: "warning", icon: "🟡" },
  { time: "16:48:09", message: "🚫 Rate limiting enforced: 14,100 IPs blocked across /24 subnets", severity: "info", icon: "🔵" },
  { time: "16:47:55", message: "📊 OS fingerprint cluster: 42% Linux-Mirai, TTL=64, Window=65535", severity: "info", icon: "🔵" },
  { time: "16:47:41", message: "✅ Legitimate traffic preserved: 99.2% of clean requests served", severity: "success", icon: "🟢" },
  { time: "16:47:28", message: "⚠️ HTTP/2 multiplexing abuse detected on endpoints /ws and /stream", severity: "warning", icon: "🟡" },
  { time: "16:47:14", message: "🌍 Geo-blocking applied: CN, RU, IR traffic rate-capped to 10 RPS", severity: "info", icon: "🔵" },
  { time: "16:47:00", message: "📡 Predictive model forecasts peak attack in ~4 minutes — pre-staging rules", severity: "warning", icon: "🟡" },
  { time: "16:46:45", message: "🔒 CERT-In notification triggered: Incident #INC-2026-0815-001 filed", severity: "info", icon: "🔵" },
  { time: "16:46:30", message: "📈 RPS now at 4,847 — blocking 51% of all incoming traffic", severity: "critical", icon: "🔴" },
];

// ── Recovery timeline ─────────────────────────────────────────────────────────
export const recoveryTimeline: RecoveryEvent[] = [
  { label: "Detection", start: 0, duration: 12, color: "#f59e0b", description: "ML model triggered, anomaly confirmed" },
  { label: "First Mitigation", start: 12, duration: 8, color: "#06b6d4", description: "WAF rules pushed, geo-blocking active" },
  { label: "Peak Block", start: 20, duration: 25, color: "#ef4444", description: "Max traffic — 51% blocked" },
  { label: "Attack Subsiding", start: 45, duration: 18, color: "#8b5cf6", description: "Bot nets rotating, IPs shifting" },
  { label: "Full Recovery", start: 63, duration: 12, color: "#10b981", description: "Normal traffic restored, rules relaxed" },
];

// ── RTO history ───────────────────────────────────────────────────────────────
export const rtoHistory = [
  { date: "Aug 10", rto: 78, avg: 72 },
  { date: "Aug 11", rto: 65, avg: 72 },
  { date: "Aug 12", rto: 91, avg: 72 },
  { date: "Aug 13", rto: 55, avg: 72 },
  { date: "Aug 14", rto: 82, avg: 72 },
  { date: "Aug 15", rto: 75, avg: 72 },
];

// ── ASN Treemap data ──────────────────────────────────────────────────────────
export const asnData = [
  { name: "AS4134 China Telecom", size: 18420, fill: "#ef4444" },
  { name: "AS8075 Microsoft", size: 12340, fill: "#06b6d4" },
  { name: "AS16509 Amazon AWS", size: 8901, fill: "#f59e0b" },
  { name: "AS13335 Cloudflare", size: 6540, fill: "#8b5cf6" },
  { name: "AS4837 China Unicom", size: 5210, fill: "#ef4444" },
  { name: "AS3320 Deutsche Telekom", size: 4100, fill: "#10b981" },
  { name: "AS1299 Telia", size: 3870, fill: "#06b6d4" },
  { name: "AS6939 Hurricane Electric", size: 3200, fill: "#6b7280" },
];

// ── Sparkline helper ──────────────────────────────────────────────────────────
export function generateSparkline(base: number, variance: number, count = 12): KPISparkline[] {
  return Array.from({ length: count }, (_, i) => ({
    value: Math.max(0, base + (Math.random() - 0.5) * variance * 2),
    timestamp: now - (count - i) * 60_000,
  }));
}

// ── Fingerprint radar ─────────────────────────────────────────────────────────
export const fingerprintRadar = [
  { feature: "TTL Score", mirai: 85, windows: 40, unknown: 55 },
  { feature: "Window Size", mirai: 90, windows: 65, unknown: 45 },
  { feature: "JA3 Match", mirai: 78, windows: 72, unknown: 30 },
  { feature: "Header Order", mirai: 92, windows: 58, unknown: 25 },
  { feature: "TCP Options", mirai: 88, windows: 44, unknown: 60 },
  { feature: "Req Rate", mirai: 95, windows: 50, unknown: 70 },
];

// ── TTL histogram ─────────────────────────────────────────────────────────────
export const ttlHistogram = [
  { ttl: "32", count: 1200 },
  { ttl: "48", count: 850 },
  { ttl: "64", count: 18400 },
  { ttl: "128", count: 9200 },
  { ttl: "255", count: 2100 },
];

// ── Anomaly score heatmap (6 hours × 12 five-min slots) ───────────────────────
export function generateAnomalyHeatmap() {
  return Array.from({ length: 6 }, (_, h) =>
    Array.from({ length: 12 }, (_, m) => ({
      hour: h,
      slot: m,
      score: Math.random() * 100,
    }))
  ).flat();
}

// ── Resource utilisation ──────────────────────────────────────────────────────
export function generateResourceData(count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    time: mins(count - i),
    cpu: Math.round(25 + Math.sin(i * 0.5) * 20 + Math.random() * 15),
    network: Math.round(40 + Math.sin(i * 0.3) * 30 + Math.random() * 20),
    wafRules: Math.round(120 + i * 8 + Math.random() * 10),
  }));
}
