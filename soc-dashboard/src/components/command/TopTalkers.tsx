"use client";
import { ArrowRight } from "lucide-react";

const sources = [
  { rank: 1, ip: "192.168.43.0/24", req: "2.4M", blocked: "84%", risk: 98, conf: "Critical" },
  { rank: 2, ip: "10.220.18.0/24",  req: "1.8M", blocked: "89%", risk: 91, conf: "Critical" },
  { rank: 3, ip: "172.36.55.0/24",  req: "1.2M", blocked: "85%", risk: 84, conf: "High" },
  { rank: 4, ip: "45.88.193.0/24",  req: "850K", blocked: "97%", risk: 77, conf: "High" },
  { rank: 5, ip: "194.165.16.0/24", req: "620K", blocked: "73%", risk: 72, conf: "High" },
  { rank: 6, ip: "91.108.4.0/24",   req: "510K", blocked: "81%", risk: 65, conf: "Medium" },
  { rank: 7, ip: "103.21.244.0/24", req: "430K", blocked: "78%", risk: 61, conf: "Medium" },
];

const confColor: Record<string, string> = { Critical: "#F25C1F", High: "#F25C1F", Medium: "#F25C1F" };
const riskBg: Record<string, string>   = { Critical: "#F25C1F33", High: "#F25C1F33", Medium: "#F25C1F33" };

export default function TopTalkers() {
  const top5 = sources.slice(0, 5);
  return (
    <div className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#161616", marginBottom: 14 }}>
          Top Attack Sources (Top Talkers)
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EBEAE5" }}>
              {["#", "Source IP / Subnet", "Requests", "Blocked %", "Risk Score"].map(h => (
                <th key={h} style={{ padding: "4px 8px 8px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#C4C1B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top5.map(s => (
              <tr key={s.rank} className="row-hover" style={{ borderBottom: "1px solid #F4F3EF" }}>
                <td style={{ padding: "7px 8px", color: "#C4C1B8", fontWeight: 600 }}>{s.rank}</td>
                <td style={{ padding: "7px 8px" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: "#161616", fontWeight: 600 }}>{s.ip}</span>
                </td>
                <td style={{ padding: "7px 8px", color: "#8E8B82", fontWeight: 500 }}>{s.req}</td>
                <td style={{ padding: "7px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 48, height: 4, borderRadius: 99, background: "#EBEAE5", overflow: "hidden" }}>
                      <div style={{ width: s.blocked, height: "100%", background: "#8E8B82", borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#8E8B82" }}>{s.blocked}</span>
                  </div>
                </td>
                <td style={{ padding: "7px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      display: "inline-block", padding: "1px 7px", borderRadius: 99,
                      background: riskBg[s.conf], color: confColor[s.conf],
                      fontSize: 11, fontWeight: 700,
                    }}>{s.risk}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button style={{ marginTop: 10, fontSize: 11, color: "#161616", background: "none", border: "none", cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
        View Full Report <ArrowRight size={11} />
      </button>
    </div>
  );
}
