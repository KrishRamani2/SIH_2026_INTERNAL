"use client";

import { useState } from "react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea, BarChart, Bar,
} from "recharts";
import {
  LineChart as LineChartIcon, Info, RefreshCw, ChevronDown, Activity,
  TrendingUp, Clock, AlertTriangle, ShieldCheck, Globe, Shield, Lightbulb, Target, Zap
} from "lucide-react";

// ─── Data Definitions ─────────────────────────────────────────

const trajectoryData = [
  { time: "19:30", actual: 4600, predicted: 5100 },
  { time: "19:31", actual: 5200, predicted: 5100 },
  { time: "19:32", actual: 5100, predicted: 4900 },
  { time: "19:33", actual: 4800, predicted: 4400 },
  { time: "19:34", actual: 4300, predicted: 4400 },
  { time: "19:35", actual: 5200, predicted: 4800 },
  { time: "19:36", actual: 5400, predicted: 4700 },
  { time: "19:37", actual: 5100, predicted: 4500 },
  { time: "19:38", actual: 4300, predicted: 4500 },
  { time: "19:39", actual: 4500, predicted: 4900 },
  { time: "19:40", actual: 5200, predicted: 5100 },
  { time: "19:41", actual: 5200, predicted: 5000 },
  { time: "19:42", actual: 4900, predicted: 4800 },
  { time: "19:43", actual: 4600, predicted: 4800 },
  { time: "19:44", actual: 4600, predicted: 5000 },
  { time: "19:45", actual: 5400, predicted: 4900 },
  { time: "19:46", actual: 5300, predicted: 4800 },
  { time: "19:47", actual: 4400, predicted: 4900 },
  { time: "19:48", actual: 4200, predicted: 4800 },
  { time: "19:49", actual: 4800, predicted: 4700 },
  { time: "19:50", actual: 4900, predicted: 4500 },
  { time: "19:51", actual: 5300, predicted: 4300 },
  { time: "19:52", actual: 4400, predicted: 4300 },
  { time: "19:53", actual: 4800, predicted: 4300 },
  { time: "19:54", actual: 5600, predicted: 4600 },
  { time: "19:55", actual: null, predicted: 5100 },
  { time: "19:56", actual: null, predicted: 5500 },
  { time: "19:57", actual: null, predicted: 5700 },
  { time: "19:58", actual: null, predicted: 6200 },
  { time: "19:59", actual: null, predicted: 6500 },
  { time: "20:00", actual: null, predicted: 7100 },
  { time: "20:01", actual: null, predicted: 7200 },
  { time: "20:02", actual: null, predicted: 7500 },
  { time: "20:03", actual: null, predicted: 8300 },
  { time: "20:04", actual: null, predicted: 8700 },
  { time: "20:05", actual: null, predicted: 9100 },
];

const mapeData = [
  { date: "May 10", mape: 2.7 },
  { date: "May 11", mape: 3.0 },
  { date: "May 12", mape: 4.0 },
  { date: "May 13", mape: 2.1 },
  { date: "May 14", mape: 2.6 },
  { date: "May 15", mape: 2.4 },
  { date: "May 16", mape: 2.0 },
];

// Circular semi-gauge for header
function ModelConfidenceMeter({ value = 97 }: { value?: number }) {
  const r = 26, cx = 32, cy = 32, sw = 5;
  const circ = 2 * Math.PI * r;
  const pct = value / 100;
  const dash = circ * pct;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <svg width={64} height={64} viewBox="0 0 64 64">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#C4C1B8" strokeWidth={sw} />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#8E8B82" strokeWidth={sw}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`} />
          <text x={cx} y={cy + 4} textAnchor="middle" fill="#161616" fontSize={14} fontWeight="700">{value}%</text>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#161616", textTransform: "uppercase", letterSpacing: "0.05em" }}>ACCURACY</div>
        <div style={{ fontSize: 10, color: "#C4C1B8" }}>Model Confidence</div>
      </div>
    </div>
  );
}

export default function PredictiveTab() {
  const [intensity, setIntensity] = useState(68);

  // Dynamic calculations based on slider intensity
  const peakRps = Math.round(4000 + (intensity / 100) * 6213);
  const userImpact = (intensity * 0.412).toFixed(1);
  const estRto = Math.round(40 + intensity * 1.0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ─── Top Header Section ─── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "#EBEAE5", border: "1px solid #C4C1B8",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#161616"
          }}>
            <LineChartIcon size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#161616", letterSpacing: "-0.01em" }}>
              Traffic &amp; Prediction Analytics
            </h1>
            <p style={{ fontSize: 11, color: "#8E8B82", marginTop: 1 }}>
              AI-powered traffic forecasting and attack simulation insights
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 12px", borderRadius: 6,
            border: "1px solid #C4C1B8", background: "white",
            fontSize: 11, fontWeight: 500, color: "#8E8B82", cursor: "pointer",
          }}>
            Last 30 Minutes <ChevronDown size={12} />
          </button>

          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 12px", borderRadius: 6,
            border: "1px solid #161616", background: "#EBEAE5",
            fontSize: 11, fontWeight: 600, color: "#161616", cursor: "pointer",
          }}>
            Auto-refresh: 2s <RefreshCw size={11} />
          </button>

          <ModelConfidenceMeter value={97} />
        </div>
      </div>

      {/* ─── Card 1: Traffic Trajectory Forecast ─── */}
      <div className="card" style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#161616" }}>
              Traffic Trajectory Forecast <Info size={13} color="#C4C1B8" />
            </div>
            <div style={{ fontSize: 11, color: "#8E8B82", marginTop: 2 }}>
              Actual vs Predicted (last 30 minutes)
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: "#8E8B82" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 16, height: 2.5, background: "#161616", borderRadius: 1, display: "inline-block" }} />
              Actual Traffic
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 16, height: 2, borderTop: "2px dashed #F25C1F", display: "inline-block" }} />
              Predicted Traffic
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 14, height: 10, background: "#F25C1F33", border: "1px solid #F25C1F33", borderRadius: 2, display: "inline-block" }} />
              Threat Projection Window
            </span>
          </div>
        </div>

        {/* Forecast Chart */}
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={trajectoryData} margin={{ top: 15, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="0" stroke="#EBEAE5" />
            <XAxis dataKey="time" tick={{ fill: "#C4C1B8", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis domain={[0, 10000]} tick={{ fill: "#C4C1B8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v === 0 ? "0" : `${(v/1000).toFixed(0)}K`} width={32} />
            <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="chart-tooltip">
                  <div style={{ fontWeight: 600, color: "#161616", marginBottom: 4 }}>{label}</div>
                  {payload.map((p: any) => p.value != null && (
                    <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 14, fontSize: 11 }}>
                      <span style={{ color: "#8E8B82" }}>{p.name}:</span>
                      <span style={{ fontWeight: 700, color: p.color }}>{p.value.toLocaleString()} RPS</span>
                    </div>
                  ))}
                </div>
              );
            }} />

            {/* Threshold Reference Line */}
            <ReferenceLine y={7000} stroke="#F25C1F" strokeDasharray="3 3" strokeWidth={1}
              label={{ value: "Malicious Traffic Threshold (7K)", fill: "#F25C1F", fontSize: 9, position: "top", fontWeight: 600 }} />

            {/* Baseline Reference Line */}
            <ReferenceLine y={4500} stroke="#C4C1B8" strokeDasharray="2 2" strokeWidth={1}
              label={{ value: "Baseline (4.5K)", fill: "#C4C1B8", fontSize: 9, position: "bottom", fontWeight: 500 }} />

            {/* Threat Projection Shaded Area */}
            <ReferenceArea x1="19:50" x2="19:55" fill="#F25C1F33" fillOpacity={0.8} stroke="#F25C1F33" strokeWidth={0.5} />

            {/* Actual Traffic Line (Solid Blue) */}
            <Line type="monotone" dataKey="actual" stroke="#161616" strokeWidth={2.5} dot={false} name="Actual Traffic" connectNulls />

            {/* Predicted Traffic Line (Dashed Orange) */}
            <Line type="monotone" dataKey="predicted" stroke="#F25C1F" strokeWidth={2} strokeDasharray="4 3" dot={false} name="Predicted Traffic" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Middle Section (2 Columns) ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>

        {/* Card 2: Prediction Error History (MAPE %) */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#161616", marginBottom: 16 }}>
            Prediction Error History (MAPE %) <Info size={13} color="#C4C1B8" />
          </div>

          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={mapeData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#EBEAE5" />
              <XAxis dataKey="date" tick={{ fill: "#C4C1B8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fill: "#C4C1B8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="chart-tooltip">
                    <div style={{ fontWeight: 600, color: "#161616" }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#161616" }}>MAPE: <b>{payload[0].value}%</b></div>
                  </div>
                );
              }} />

              {/* High Variance Reference Line */}
              <ReferenceLine y={3.0} stroke="#F25C1F" strokeDasharray="3 3" strokeWidth={1}
                label={{ value: "High Variance", fill: "#F25C1F", fontSize: 9, position: "top", fontWeight: 500 }} />

              <Bar dataKey="mape" fill="#161616" radius={[4, 4, 0, 0]} barSize={26} />
            </BarChart>
          </ResponsiveContainer>

          {/* Model Banner */}
          <div style={{
            marginTop: 14, padding: "10px 14px", borderRadius: 8,
            background: "#EBEAE5", border: "1px solid #C4C1B8",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ padding: 6, borderRadius: 6, background: "#C4C1B8", color: "#161616" }}>
                <Activity size={16} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#4C1D95" }}>7-day avg MAPE</div>
                <div style={{ fontSize: 10, color: "#8E8B82" }}>Model</div>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#161616" }}>2.7%</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#8E8B82", background: "#EBEAE5", padding: "1px 6px", borderRadius: 99, border: "1px solid #C4C1B8" }}>LOW</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#8E8B82", marginTop: 2 }}>
                LSTM Transformer Hybrid
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: What If Attack Simulator */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#161616", marginBottom: 14 }}>
            What If Attack Simulator <Info size={13} color="#C4C1B8" />
          </div>

          {/* Intensity Slider Section */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#8E8B82" }}>Adjust Intensity</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#F25C1F" }}>{intensity}%</span>
            </div>

            {/* Custom Range Slider */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type="range"
                min={0}
                max={100}
                value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                style={{
                  width: "100%",
                  height: 6,
                  borderRadius: 99,
                  appearance: "none",
                  outline: "none",
                  background: "linear-gradient(to right, #8E8B82 0%, #F25C1F 40%, #F25C1F 75%, #7F1D1D 100%)",
                  cursor: "pointer",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#C4C1B8", marginTop: 6, fontWeight: 500 }}>
              <span>Low</span><span>Moderate</span><span>Severe</span><span>Critical</span>
            </div>
          </div>

          {/* 3 Metric Cards Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>

            {/* Metric 1: Peak RPS */}
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "#F25C1F33", border: "1px solid #F25C1F33", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ padding: 6, borderRadius: 6, background: "#F25C1F33", color: "#F25C1F" }}>
                <Activity size={16} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#F25C1F", lineHeight: 1.1 }}>{peakRps.toLocaleString()}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#F25C1F", marginTop: 2 }}>Peak RPS</div>
                <div style={{ fontSize: 9, color: "#F25C1F" }}>Simulated</div>
              </div>
            </div>

            {/* Metric 2: Users Impacted */}
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "#F25C1F33", border: "1px solid #F25C1F33", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ padding: 6, borderRadius: 6, background: "#F25C1F33", color: "#F25C1F" }}>
                <TrendingUp size={16} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#F25C1F", lineHeight: 1.1 }}>{userImpact}%</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#F25C1F", marginTop: 2 }}>Users Impacted</div>
                <div style={{ fontSize: 9, color: "#F25C1F" }}>Estimated</div>
              </div>
            </div>

            {/* Metric 3: Time to Disruption */}
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "#EBEAE5", border: "1px solid #C4C1B8", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ padding: 6, borderRadius: 6, background: "#C4C1B8", color: "#161616" }}>
                <Clock size={16} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#161616", lineHeight: 1.1 }}>{estRto}s</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#161616", marginTop: 2 }}>Time to Disruption</div>
                <div style={{ fontSize: 9, color: "#8E8B82" }}>Predicted (RTO)</div>
              </div>
            </div>

          </div>

          {/* Auto-Actions Triggered */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#8E8B82", marginBottom: 8 }}>
              Auto-Actions Triggered
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: 6, background: "#F4F3EF", border: "1px solid #EBEAE5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#8E8B82" }}>
                  <Shield size={13} color="#F25C1F" />
                  Rate limiting activated
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#8E8B82", background: "#EBEAE5", padding: "1px 6px", borderRadius: 4, border: "1px solid #C4C1B8" }}>✓ Active</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: 6, background: "#F4F3EF", border: "1px solid #EBEAE5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#8E8B82" }}>
                  <Globe size={13} color="#161616" />
                  Geo-blocking: CN, RU, IR
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#8E8B82", background: "#EBEAE5", padding: "1px 6px", borderRadius: 4, border: "1px solid #C4C1B8" }}>✓ Active</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: 6, background: "#F4F3EF", border: "1px solid #EBEAE5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#8E8B82" }}>
                  <AlertTriangle size={13} color="#F25C1F" />
                  WAF rule applied: Rule 33
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#F25C1F", background: "#F25C1F33", padding: "1px 6px", borderRadius: 4, border: "1px solid #F25C1F33" }}>Pending</span>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* ─── Card 4: Bottom Insights & Metrics Strip ─── */}
      <div className="card" style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1fr", gap: 14, alignItems: "center" }}>

        {/* Insights Box */}
        <div style={{ padding: "8px 12px", borderRadius: 8, background: "#EBEAE5", border: "1px solid #C4C1B8", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ padding: 4, borderRadius: 6, background: "#C4C1B8", color: "#161616", marginTop: 2 }}>
            <Lightbulb size={16} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#161616" }}>Insights</div>
            <div style={{ fontSize: 10, color: "#8E8B82", marginTop: 1, lineHeight: 1.3 }}>
              Traffic is currently within normal range. However, projection indicates potential surge in 10–15 minutes.
            </div>
          </div>
        </div>

        {/* Metric 1: Current RPS */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ padding: 8, borderRadius: 8, background: "#EBEAE5", color: "#161616" }}>
            <Activity size={17} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#161616", lineHeight: 1 }}>4,912</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#8E8B82", marginTop: 2 }}>Current RPS</div>
            <div style={{ fontSize: 9, color: "#8E8B82", fontWeight: 600 }}>↓ 3.2% vs 30m avg</div>
          </div>
        </div>

        {/* Metric 2: Predicted Growth */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ padding: 8, borderRadius: 8, background: "#F25C1F33", color: "#F25C1F" }}>
            <TrendingUp size={17} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#161616", lineHeight: 1 }}>+31.4%</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#8E8B82", marginTop: 2 }}>Predicted Growth</div>
            <div style={{ fontSize: 9, color: "#C4C1B8" }}>Next 15 minutes</div>
          </div>
        </div>

        {/* Metric 3: Threat Threshold */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ padding: 8, borderRadius: 8, background: "#EBEAE5", color: "#161616" }}>
            <Target size={17} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#161616", lineHeight: 1 }}>7,000</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#8E8B82", marginTop: 2 }}>Threat Threshold</div>
            <div style={{ fontSize: 9, color: "#C4C1B8" }}>RPS capacity</div>
          </div>
        </div>

        {/* Metric 4: Model Accuracy */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ padding: 8, borderRadius: 8, background: "#EBEAE5", color: "#8E8B82" }}>
            <ShieldCheck size={17} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#161616", lineHeight: 1 }}>97%</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#8E8B82", marginTop: 2 }}>Model Accuracy</div>
            <div style={{ fontSize: 9, color: "#8E8B82", fontWeight: 600 }}>High Confidence</div>
          </div>
        </div>

      </div>

    </div>
  );
}
