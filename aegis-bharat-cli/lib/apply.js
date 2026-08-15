'use strict';

const ora = require('ora');
const { sleep, randomInt } = require('./utils');
const { printSectionHeader } = require('./banner');
const { logEvent } = require('./logger');
const { applyDiffToState } = require('./config');
const theme = require('./theme');

async function applyChanges(current, target, diff) {
  printSectionHeader('Applying Changes', theme.recovery);

  for (const d of diff) {
    const spinner = ora(d.desc).start();
    await sleep(randomInt(400, 1100));
    const ms = randomInt(2, 40);
    spinner.succeed(`${d.desc} ${theme.muted(`(${ms}ms)`)}`);
    logEvent({
      level: 'OK',
      tier: tierForKey(d.key),
      message: `Applied: ${d.desc}`,
      meta: { type: d.type, key: d.key, latencyMs: ms },
    });
  }

  const next = applyDiffToState(current, target, diff);
  console.log(theme.ok(`\n✔ All ${diff.length} change(s) applied and saved to .aegis/config-state.json\n`));
  logEvent({ level: 'INFO', message: `Apply complete: ${diff.length} change(s) applied.` });
  return next;
}

function tierForKey(key) {
  const map = {
    xdp: 'scrub',
    ja4Fingerprinting: 'scrub',
    entropyAnalyzer: 'brain',
    eastWestMesh: 'protected',
    honeypots: 'protected',
    gracefulDegradation: 'protected',
    certInReporting: 'comply',
  };
  return map[key] || 'edge';
}

module.exports = { applyChanges, tierForKey };
