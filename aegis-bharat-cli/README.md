# Aegis-Bharat CLI (Simulation)

A terminal-based simulation of the Aegis-Bharat DDoS mitigation ops flow, built for the
SIH solution demo. **This tool does not touch any real network, kernel, or firewall
state** — every "discovery," "rule," and "attack" is generated locally and written to
JSON/log files under `.aegis/` so the whole lifecycle can be demoed convincingly without
needing real infrastructure.

## What it simulates

1. **Credential / node registration** (`aegis init`)
2. **Network discovery** — generates a fake but plausible topology (interfaces, AZs, app nodes, upstream ASN) → `.aegis/network-map.json`
3. **Pull current configuration** — loads (or seeds) a baseline "before Aegis-Bharat" state with some legacy rules already present → `.aegis/config-state.json`
4. **Plan** — computes a Terraform-style diff against the Aegis-Bharat target profile (XDP, JA4 fingerprinting, entropy analyzer, Cilium East-West mesh, honeypots, graceful degradation, CERT-In reporting)
5. **Confirm** — `y/N` prompt before anything is "applied"
6. **Apply** — applies each change with a spinner + simulated latency, logs every action
7. **Monitor** — a live, in-place redrawing dashboard: traffic counters, periodic simulated attack injection with JA4/entropy detection reasoning, auto-mitigation, cooldown/recovery — and on each mitigated attack, auto-generates a CERT-In "Annexure A" style incident report
8. **Logs** — every event is appended to `.aegis/aegis-events.log` (JSON-lines) and viewable/tailable via `aegis logs`

## Install

```bash
npm install
npm link      # optional: makes the `aegis` command global in this shell
```

Or just run directly with `node bin/aegis.js <command>`.

## Commands

```bash
aegis init                 # register node credentials (simulated)
aegis run                  # discover → pull config → plan → confirm → apply → monitor
aegis status                # snapshot of current node/network/protection state
aegis logs                  # print recent events
aegis logs --tail           # follow the event log live
aegis logs --limit 50       # show more/fewer lines
```

## Typical demo flow

```bash
node bin/aegis.js init
node bin/aegis.js run       # say "y" to apply, "y" to start monitoring
# ... watch the dashboard, let it detect + mitigate a simulated attack ...
# Ctrl+C to stop monitoring
node bin/aegis.js status
node bin/aegis.js logs
```

## Generated files (all under `.aegis/`, created on first run)

| File | Contents |
|---|---|
| `credentials.json` | Masked simulated credentials |
| `network-map.json` | Simulated discovered network topology |
| `config-state.json` | Current + applied protection configuration |
| `aegis-events.log` | Append-only JSON-lines event log |
| `reports/incident-*.json` | CERT-In style incident reports, one per mitigated attack |

`.aegis/` is safe to delete at any time to reset the demo to a clean slate.

## Notes

- Requires Node.js 16+.
- Everything is simulated for demonstration: no real packets are inspected, no real
  eBPF/XDP programs are loaded, no real cloud APIs are called.
