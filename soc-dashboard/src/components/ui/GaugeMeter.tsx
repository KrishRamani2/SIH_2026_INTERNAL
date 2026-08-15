"use client";

interface GaugeProps {
  value: number; // 0–100
  max?: number;
  color?: string;
  label?: string;
  size?: number;
  thickness?: number;
}

export default function GaugeMeter({
  value,
  max = 100,
  color = "#06b6d4",
  label,
  size = 120,
  thickness = 12,
}: GaugeProps) {
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -220;
  const totalAngle = 260;
  const angle = startAngle + (value / max) * totalAngle;
  const deg2rad = (d: number) => (d * Math.PI) / 180;
  const arc = (deg: number) => ({
    x: cx + r * Math.cos(deg2rad(deg)),
    y: cy + r * Math.sin(deg2rad(deg)),
  });
  const startPt = arc(startAngle);
  const endPtBg = arc(startAngle + totalAngle);
  const endPtFg = arc(angle);

  const largeArcBg = totalAngle > 180 ? 1 : 0;
  const largeArcFg = (value / max) * totalAngle > 180 ? 1 : 0;

  const needleX = cx + (r - 6) * Math.cos(deg2rad(angle));
  const needleY = cy + (r - 6) * Math.sin(deg2rad(angle));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size * 0.8} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`gauge-grad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path
          d={`M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${largeArcBg} 1 ${endPtBg.x} ${endPtBg.y}`}
          fill="none"
          stroke="#1a2d4a"
          strokeWidth={thickness}
          strokeLinecap="round"
        />
        {/* Fill */}
        {value > 0 && (
          <path
            d={`M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${largeArcFg} 1 ${endPtFg.x} ${endPtFg.y}`}
            fill="none"
            stroke={`url(#gauge-grad-${label})`}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
        )}
        {/* Needle dot */}
        <circle cx={needleX} cy={needleY} r={4} fill={color} opacity={0.9} />
        {/* Center value */}
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          fill="#e2e8f0"
          fontSize={size * 0.18}
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {value.toFixed(0)}%
        </text>
      </svg>
      {label && (
        <span style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
          {label}
        </span>
      )}
    </div>
  );
}
