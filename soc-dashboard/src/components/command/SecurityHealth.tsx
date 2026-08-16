"use client";

// Semi-circular gauge
function SemiGauge({ value, color, size = 100 }: { value: number; color: string; size?: number }) {
  const r = 38, cx = 50, cy = 52, sw = 10;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const arc = (deg: number) => ({
    x: cx + r * Math.cos(toRad(deg)),
    y: cy + r * Math.sin(toRad(deg)),
  });
  const start = arc(180), endBg = arc(0), endFg = arc(180 + value * 1.8);
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
      <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${endBg.x} ${endBg.y}`}
        fill="none" stroke="#EBEAE5" strokeWidth={sw} strokeLinecap="round" />
      <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${endFg.x} ${endFg.y}`}
        fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

interface MetricRowProps {
  label: string;
  value: string;
  pct: number;
  color: string;
  target: string;
  sub: string;
}

function MetricRow({ label, value, pct, color, target, sub }: MetricRowProps) {
  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid #EBEAE5" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#161616", letterSpacing: "-0.02em", lineHeight: 1 }}>
            {value}
          </div>
          <div style={{ fontSize: 11, color: "#8E8B82", marginTop: 3 }}>{label}</div>
          <div style={{ fontSize: 10, color: "#C4C1B8", marginTop: 1 }}>{sub}</div>
        </div>
        <SemiGauge value={pct} color={color} size={90} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 5, borderRadius: 99, background: "#EBEAE5", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: color, transition: "width 0.6s" }} />
        </div>
        <span style={{ fontSize: 10, color: "#C4C1B8", whiteSpace: "nowrap" }}>Target: {target}</span>
      </div>
    </div>
  );
}

export default function SecurityHealth() {
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#161616", marginBottom: 4 }}>Security Health</div>
      <MetricRow
        label="Attack Confidence"
        value="94%"
        pct={94}
        color="#F25C1F"
        target="80%"
        sub="High confidence malicious activity detected"
      />
      <MetricRow
        label="Mitigation Efficiency"
        value="50%"
        pct={50}
        color="#F25C1F"
        target="80%"
        sub="Traffic mitigation in progress"
      />
      <div style={{ padding: "14px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#161616", letterSpacing: "-0.02em", lineHeight: 1 }}>99.2%</div>
            <div style={{ fontSize: 11, color: "#8E8B82", marginTop: 3 }}>System Availability</div>
            <div style={{ fontSize: 10, color: "#C4C1B8", marginTop: 1 }}>All systems operational</div>
          </div>
          <SemiGauge value={99.2} color="#8E8B82" size={90} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 5, borderRadius: 99, background: "#EBEAE5", overflow: "hidden" }}>
            <div style={{ width: "99.2%", height: "100%", borderRadius: 99, background: "#8E8B82" }} />
          </div>
          <span style={{ fontSize: 10, color: "#C4C1B8", whiteSpace: "nowrap" }}>Target: 99%</span>
        </div>
      </div>
    </div>
  );
}
