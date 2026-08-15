'use strict';

const chalk = require('chalk');
const Table = require('cli-table3');
const {
  randomInt,
  randomFloat,
  randomIp,
  randomJA4,
  nowIso,
} = require('./utils');
const { logEvent } = require('./logger');
const { generateIncidentReport } = require('./report');
const theme = require('./theme');

const TICK_MS = 600;
const ATTACK_CHANCE_PER_TICK = 0.045; // roughly one attack every ~35s of demo time
const MITIGATION_TICKS = 3;
const COOLDOWN_TICKS = 10; // stand-in for the doc's 300s cooldown window

const STATUS = {
  CLEAN: { label: 'CLEAN', color: theme.ok },
  DETECTING: { label: 'ANOMALY DETECTED', color: theme.warn },
  MITIGATING: { label: 'UNDER ATTACK — MITIGATING', color: theme.danger },
  COOLDOWN: { label: 'RECOVERING (cooldown)', color: theme.warn },
};

const ENDPOINTS = ['/', '/api/v1/login', '/api/v1/results', '/checkout', '/api/v1/search'];

function fmtUptime(startedAt) {
  const secs = Math.floor((Date.now() - startedAt) / 1000);
  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function startMonitoring({ nodeName }) {
  const state = {
    startedAt: Date.now(),
    status: 'CLEAN',
    totalPackets: 0,
    cleanPackets: 0,
    suspiciousPackets: 0,
    blockedPackets: 0,
    attacksHandled: 0,
    feed: [],
    mitigationTicksLeft: 0,
    cooldownTicksLeft: 0,
    currentAttack: null,
  };

  logEvent({ level: 'INFO', message: `Monitoring started on node ${nodeName}` });
  pushFeed(state, 'INFO', 'Monitoring loop started. Baseline traffic nominal.');

  console.log(theme.muted('\nLive monitoring started. Press Ctrl+C to stop.\n'));

  const interval = setInterval(() => tick(state, nodeName), TICK_MS);
  render(state, nodeName);

  const stop = () => {
    clearInterval(interval);
    render(state, nodeName, true);
    printSummary(state);
    logEvent({ level: 'INFO', message: 'Monitoring session ended.' });
    process.exit(0);
  };

  process.on('SIGINT', stop);
  return stop;
}

function tick(state, nodeName) {
  const baseRate = randomInt(800, 2200);
  state.totalPackets += baseRate;

  if (state.status === 'CLEAN') {
    state.cleanPackets += baseRate;
    if (Math.random() < ATTACK_CHANCE_PER_TICK) {
      triggerAttack(state);
    }
  } else if (state.status === 'DETECTING') {
    state.suspiciousPackets += baseRate;
    advanceDetection(state);
  } else if (state.status === 'MITIGATING') {
    const blocked = Math.floor(baseRate * randomFloat(0.7, 0.95));
    state.blockedPackets += blocked;
    state.cleanPackets += baseRate - blocked;
    state.mitigationTicksLeft -= 1;
    if (state.mitigationTicksLeft <= 0) {
      completeMitigation(state);
    }
  } else if (state.status === 'COOLDOWN') {
    state.cleanPackets += baseRate;
    state.cooldownTicksLeft -= 1;
    if (state.cooldownTicksLeft <= 0) {
      state.status = 'CLEAN';
      pushFeed(state, 'OK', 'Cooldown complete. Clients reconnecting via exponential backoff + jitter.');
      logEvent({ level: 'OK', tier: 'recovery', message: 'Cooldown complete, node returned to CLEAN baseline.' });
    }
  }

  render(state, nodeName);
}

function triggerAttack(state) {
  const attackTypes = [
    { type: 'Volumetric', desc: 'Single-IP/range volumetric flood', endpoint: '/' },
    { type: 'Botnet', desc: 'Shared behavioural-profile flood (botnet cluster)', endpoint: '/api/v1/login' },
    { type: 'Internal', desc: 'East-West Internal Flood (Compromised Node)', endpoint: 'Internal Microservice' },
    { type: 'Massive', desc: 'Upstream Volumetric Overflow', endpoint: 'Anycast Edge' }
  ];
  const selected = randomChoiceLocal(attackTypes);
  
  const attack = {
    type: selected.type,
    classification: selected.desc,
    targetedAsset: selected.endpoint,
    detectedAt: nowIso(),
    peakPps: randomInt(50000, 400000),
    sourceIndicators: Array.from({ length: randomInt(3, 6) }, () => randomIp()),
    ja4Signatures: Array.from({ length: randomInt(1, 3) }, () => randomJA4()),
    mitigationActions: [],
    detectionStage: 0,
  };
  state.currentAttack = attack;
  state.status = 'DETECTING';
  pushFeed(state, 'WARN', `Anomaly flagged on ${attack.targetedAsset}: ${attack.classification}`);
  logEvent({
    level: 'WARN',
    tier: 'brain',
    message: `Anomaly detected: ${attack.classification} targeting ${attack.targetedAsset}`,
    meta: { peakPps: attack.peakPps, sourceIndicators: attack.sourceIndicators },
  });
}

function advanceDetection(state) {
  const attack = state.currentAttack;
  attack.detectionStage += 1;

  if (attack.type === 'Internal') {
    const stages = [
      () => pushFeed(state, 'WARN', `Anomalous internal traffic detected crossing Cilium eBPF mesh boundaries`),
      () => pushFeed(state, 'ALERT', `Source touched Honey-API trap (/api/v1/internal-admin). 100% malicious confidence.`),
      () => {
        pushFeed(state, 'ALERT', `Quarantining compromised pod/VM in place via Zero-Trust policy.`);
        state.status = 'MITIGATING';
        state.mitigationTicksLeft = MITIGATION_TICKS;
      }
    ];
    if (stages[attack.detectionStage - 1]) stages[attack.detectionStage - 1]();
  } else if (attack.type === 'Massive') {
     const stages = [
      () => pushFeed(state, 'WARN', `Upstream pipe saturation imminent. Host-level mitigation insufficient.`),
      () => {
        pushFeed(state, 'ALERT', `Auto-signalling BGP Flowspec (RFC 5575) to upstream ISP edge switch.`);
        pushFeed(state, 'WARN', `Activating Graceful Degradation: Pausing heavy DB queries, serving static fallback.`);
      },
      () => {
        pushFeed(state, 'ALERT', `BGP rules propagated. Volumetric flood dropped at ISP level.`);
        state.status = 'MITIGATING';
        state.mitigationTicksLeft = MITIGATION_TICKS;
      }
    ];
    if (stages[attack.detectionStage - 1]) stages[attack.detectionStage - 1]();
  } else {
    const stages = [
      () => pushFeed(state, 'WARN', `JA4 TLS fingerprinting flagged signature ${attack.ja4Signatures[0]} across CGNAT IPs`),
      () => pushFeed(state, 'WARN', `Poisson entropy score ${randomFloat(0.01, 0.08, 2)} confirms scripted low-entropy burst. Serving Invisible Proof-of-Work challenge.`),
      () => {
        pushFeed(state, 'ALERT', `Challenges failed. Pushing XDP_DROP rule to kernel-level eBPF map (<5ms).`);
        state.status = 'MITIGATING';
        state.mitigationTicksLeft = MITIGATION_TICKS;
      }
    ];
    if (stages[attack.detectionStage - 1]) stages[attack.detectionStage - 1]();
  }
}

function completeMitigation(state) {
  const attack = state.currentAttack;
  state.attacksHandled += 1;
  pushFeed(state, 'OK', `Attack mitigated. Entering cooldown. Auto-generating CERT-In/CSITe Compliance Report (Annexure A).`);
  logEvent({
    level: 'OK',
    tier: 'recovery',
    message: 'Attack mitigated, entering cooldown before rule revert.',
  });

  // Fire-and-forget style report generation, matches Tier-S feature #5
  try {
    generateIncidentReport(attack);
  } catch (err) {
    pushFeed(state, 'WARN', `Report generation failed: ${err.message}`);
  }

  state.status = 'COOLDOWN';
  state.cooldownTicksLeft = COOLDOWN_TICKS;
  state.currentAttack = null;
}

function pushFeed(state, level, message) {
  state.feed.push({ level, message, ts: new Date().toLocaleTimeString() });
  if (state.feed.length > 8) state.feed.shift();
}

function randomChoiceLocal(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function render(state, nodeName, isFinal = false) {
  console.clear();
  const st = STATUS[state.status];

  console.log(theme.bold(`AEGIS-BHARAT — Live Monitor  `) + theme.muted(`node: ${nodeName}`));
  console.log(theme.muted(`uptime ${fmtUptime(state.startedAt)}   ${isFinal ? '(stopped)' : 'press Ctrl+C to stop'}`));
  console.log('─'.repeat(66));
  console.log(`status: ${st.color.bold(st.label)}\n`);

  const table = new Table({ colWidths: [24, 20], style: { head: [] } });
  table.push(
    [theme.muted('Total packets'), state.totalPackets.toLocaleString()],
    [theme.ok('Clean'), state.cleanPackets.toLocaleString()],
    [theme.warn('Suspicious'), state.suspiciousPackets.toLocaleString()],
    [theme.danger('Blocked'), state.blockedPackets.toLocaleString()],
    [theme.muted('Attacks handled'), String(state.attacksHandled)]
  );
  console.log(table.toString());

  console.log('\n' + theme.bold('Recent events'));
  if (state.feed.length === 0) {
    console.log(theme.muted('  (none yet)'));
  } else {
    state.feed.forEach((f) => {
      const color = f.level === 'OK' ? theme.ok : f.level === 'ALERT' ? theme.danger : theme.warn;
      console.log(`  ${theme.dim(f.ts)} ${color(f.level.padEnd(6))} ${f.message}`);
    });
  }
  console.log(theme.muted('\nAll events additionally streamed to .aegis/aegis-events.log'));
}

function printSummary(state) {
  console.log('\n' + theme.bold('Session summary'));
  console.log(`  Duration:        ${fmtUptime(state.startedAt)}`);
  console.log(`  Total packets:   ${state.totalPackets.toLocaleString()}`);
  console.log(`  Blocked packets: ${state.blockedPackets.toLocaleString()}`);
  console.log(`  Attacks handled: ${state.attacksHandled}`);
  console.log(theme.muted('\nSession ended.\n'));
}

module.exports = { startMonitoring };
