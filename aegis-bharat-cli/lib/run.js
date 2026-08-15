'use strict';

const inquirer = require('inquirer');
const { readJson, CREDENTIALS_FILE } = require('./utils');
const { printBanner } = require('./banner');
const { discoverNetwork } = require('./discovery');
const { pullCurrentConfiguration, targetProfile, computeDiff, printDiff } = require('./config');
const { applyChanges } = require('./apply');
const { startMonitoring } = require('./monitor');
const { logEvent } = require('./logger');
const theme = require('./theme');

async function runMain() {
  printBanner();

  const creds = readJson(CREDENTIALS_FILE);
  if (!creds) {
    console.log(theme.warn('No credentials found. Run "aegis init" first.\n'));
    process.exitCode = 1;
    return;
  }

  console.log(theme.muted(`Authenticated as node "${creds.nodeName}" (${creds.role})\n`));
  logEvent({ level: 'INFO', message: `Session started for node ${creds.nodeName}` });

  await discoverNetwork(creds.nodeName, creds.cloudProvider || 'AWS');
  const current = await pullCurrentConfiguration();
  const target = targetProfile();
  const diff = computeDiff(current, target);
  printDiff(diff);

  if (diff.length === 0) {
    return;
  }

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Apply these changes?',
      default: false,
    },
  ]);

  if (!confirmed) {
    console.log(theme.muted('\nNo changes made. Exiting.\n'));
    logEvent({ level: 'INFO', message: 'User declined proposed changes. No action taken.' });
    return;
  }

  await applyChanges(current, target, diff);

  const { startMonitor } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'startMonitor',
      message: 'Rules applied. Start live monitoring now?',
      default: true,
    },
  ]);

  if (startMonitor) {
    startMonitoring({ nodeName: creds.nodeName });
  } else {
    console.log(theme.muted('\nYou can start monitoring anytime — run "aegis run" again or "aegis status" to check state.\n'));
  }
}

module.exports = { runMain };
