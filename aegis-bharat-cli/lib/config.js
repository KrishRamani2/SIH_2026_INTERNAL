'use strict';

const ora = require('ora');
const Table = require('cli-table3');
const chalk = require('chalk');
const { CONFIG_STATE_FILE, writeJson, readJson, nowIso, sleep } = require('./utils');
const { printSectionHeader } = require('./banner');
const theme = require('./theme');

/**
 * The "current" state as if this node had some legacy/partial protection
 * already in place before Aegis-Bharat was applied — makes the diff
 * meaningful instead of an empty-to-full jump.
 */
function baselineCurrentState() {
  return {
    pulledAt: nowIso(),
    xdp: { attached: false, program: null },
    ja4Fingerprinting: { enabled: false },
    entropyAnalyzer: { enabled: false },
    eastWestMesh: { enabled: false, policies: 0 },
    honeypots: { enabled: false, endpoints: 0 },
    gracefulDegradation: { enabled: false },
    certInReporting: { enabled: false },
    legacyRules: [
      { id: 'iptables-rl-01', desc: 'iptables rate-limit 500 pps per source IP', active: true },
      { id: 'waf-basic-01', desc: 'Basic layer-7 WAF ruleset (OWASP CRS subset)', active: true },
      { id: 'geo-block-legacy', desc: 'Static geo-block list (last updated 214 days ago)', active: true },
    ],
  };
}

/**
 * The Tier S + Tier A feature set from the solution doc — this is what
 * "aegis run" converges the node's configuration towards.
 */
function targetProfile() {
  return {
    xdp: { attached: true, program: 'xdp_drop_v2.o (BPF_MAP_TYPE_LRU/LPM_TRIE)' },
    ja4Fingerprinting: { enabled: true },
    entropyAnalyzer: { enabled: true, model: 'Poisson inter-arrival entropy' },
    eastWestMesh: { enabled: true, policies: 12 },
    honeypots: { enabled: true, endpoints: 3 },
    gracefulDegradation: { enabled: true },
    certInReporting: { enabled: true },
    retireLegacy: ['geo-block-legacy'], // superseded by JA4 + entropy classifier
  };
}

function loadOrPullCurrentState() {
  const existing = readJson(CONFIG_STATE_FILE);
  if (existing) return existing;
  return baselineCurrentState();
}

async function pullCurrentConfiguration() {
  printSectionHeader('Pulling Current Configuration', theme.comply);
  const spinner = ora('Pulling current configuration from node...').start();
  await sleep(800);
  const state = loadOrPullCurrentState();
  spinner.succeed('Current configuration retrieved');

  const table = new Table({ head: [chalk.gray('Component'), chalk.gray('Status')], colWidths: [24, 48] });
  table.push(
    ['XDP program', state.xdp.attached ? theme.ok('attached') : theme.warn('not attached')],
    ['JA4 fingerprinting', state.ja4Fingerprinting.enabled ? theme.ok('enabled') : theme.warn('disabled')],
    ['Entropy analyzer', state.entropyAnalyzer.enabled ? theme.ok('enabled') : theme.warn('disabled')],
    ['East-West mesh', state.eastWestMesh.enabled ? theme.ok(`enabled (${state.eastWestMesh.policies})`) : theme.warn('disabled')],
    ['Honeypots', state.honeypots.enabled ? theme.ok(`${state.honeypots.endpoints} active`) : theme.warn('none deployed')],
    ['Graceful degradation', state.gracefulDegradation.enabled ? theme.ok('enabled') : theme.warn('disabled')],
    ['CERT-In auto-report', state.certInReporting.enabled ? theme.ok('enabled') : theme.warn('disabled')],
    ['Existing/legacy rules', state.legacyRules.map((r) => `• ${r.desc}`).join('\n')]
  );
  console.log(table.toString());
  console.log();
  return state;
}

/**
 * Computes a terraform-plan-style diff between current and target.
 * Returns an array of { type: 'add'|'change'|'remove', desc, apply: fn }
 */
function computeDiff(current, target) {
  const diff = [];

  if (!current.xdp.attached) {
    diff.push({ type: 'add', desc: `Attach XDP_DROP program to eth0 → ${target.xdp.program}`, key: 'xdp' });
  }
  if (!current.ja4Fingerprinting.enabled) {
    diff.push({ type: 'add', desc: 'Start JA4 / JA4T TLS fingerprint engine', key: 'ja4Fingerprinting' });
  }
  if (!current.entropyAnalyzer.enabled) {
    diff.push({ type: 'add', desc: 'Initialize Poisson inter-arrival entropy analyzer', key: 'entropyAnalyzer' });
  }
  if (!current.eastWestMesh.enabled) {
    diff.push({
      type: 'add',
      desc: `Deploy Cilium East-West mesh policies (${target.eastWestMesh.policies} pods)`,
      key: 'eastWestMesh',
    });
  }
  if (!current.honeypots.enabled) {
    diff.push({
      type: 'add',
      desc: `Deploy Honey-API traps (${target.honeypots.endpoints} fake endpoints)`,
      key: 'honeypots',
    });
  }
  if (!current.gracefulDegradation.enabled) {
    diff.push({ type: 'add', desc: 'Enable graceful degradation / survival-mode fallback page', key: 'gracefulDegradation' });
  }
  if (!current.certInReporting.enabled) {
    diff.push({ type: 'add', desc: 'Enable autonomous CERT-In / CSITe compliance reporting engine', key: 'certInReporting' });
  }

  // change example: bump rate-limit rule to be JA4-aware instead of blunt per-IP
  const rateRule = current.legacyRules.find((r) => r.id === 'iptables-rl-01');
  if (rateRule && rateRule.active) {
    diff.push({
      type: 'change',
      desc: 'Replace blunt per-IP rate-limit (iptables-rl-01) with JA4-aware adaptive limiter',
      key: 'iptables-rl-01',
    });
  }

  // remove: stale geo-block list superseded by JA4 + entropy
  target.retireLegacy.forEach((ruleId) => {
    const rule = current.legacyRules.find((r) => r.id === ruleId);
    if (rule && rule.active) {
      diff.push({ type: 'remove', desc: `Retire stale rule: ${rule.desc}`, key: ruleId });
    }
  });

  return diff;
}

function printDiff(diff) {
  printSectionHeader('Proposed Changes', theme.brain);
  if (diff.length === 0) {
    console.log(theme.ok('✔ Node already matches the Aegis-Bharat target profile. Nothing to do.\n'));
    return;
  }
  const symbols = { add: theme.add('+'), change: theme.change('~'), remove: theme.remove('-') };
  diff.forEach((d) => {
    console.log(`  ${symbols[d.type]} ${d.desc}`);
  });
  const counts = diff.reduce(
    (acc, d) => ({ ...acc, [d.type]: (acc[d.type] || 0) + 1 }),
    {}
  );
  console.log(
    '\n' +
      theme.bold(
        `Plan: ${counts.add || 0} to add, ${counts.change || 0} to change, ${counts.remove || 0} to remove.\n`
      )
  );
}

/** Folds a diff into a new config-state object once applied. */
function applyDiffToState(current, target, diff) {
  const next = JSON.parse(JSON.stringify(current));
  diff.forEach((d) => {
    switch (d.key) {
      case 'xdp':
        next.xdp = { attached: true, program: target.xdp.program };
        break;
      case 'ja4Fingerprinting':
        next.ja4Fingerprinting = { enabled: true };
        break;
      case 'entropyAnalyzer':
        next.entropyAnalyzer = { enabled: true, model: target.entropyAnalyzer.model };
        break;
      case 'eastWestMesh':
        next.eastWestMesh = { enabled: true, policies: target.eastWestMesh.policies };
        break;
      case 'honeypots':
        next.honeypots = { enabled: true, endpoints: target.honeypots.endpoints };
        break;
      case 'gracefulDegradation':
        next.gracefulDegradation = { enabled: true };
        break;
      case 'certInReporting':
        next.certInReporting = { enabled: true };
        break;
      case 'iptables-rl-01': {
        const r = next.legacyRules.find((x) => x.id === 'iptables-rl-01');
        if (r) r.desc = 'JA4-aware adaptive rate limiter (supersedes iptables-rl-01)';
        break;
      }
      default: {
        const r = next.legacyRules.find((x) => x.id === d.key);
        if (r) r.active = false;
      }
    }
  });
  next.lastApplied = nowIso();
  writeJson(CONFIG_STATE_FILE, next);
  return next;
}

module.exports = {
  baselineCurrentState,
  targetProfile,
  loadOrPullCurrentState,
  pullCurrentConfiguration,
  computeDiff,
  printDiff,
  applyDiffToState,
};
