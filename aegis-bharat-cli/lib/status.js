'use strict';

const Table = require('cli-table3');
const chalk = require('chalk');
const { readJson, CREDENTIALS_FILE, NETWORK_MAP_FILE, CONFIG_STATE_FILE } = require('./utils');
const { printBanner, printSectionHeader } = require('./banner');
const theme = require('./theme');

function runStatus() {
  printBanner();

  const creds = readJson(CREDENTIALS_FILE);
  const netMap = readJson(NETWORK_MAP_FILE);
  const config = readJson(CONFIG_STATE_FILE);

  if (!creds) {
    console.log(theme.warn('No credentials found. Run "aegis init" first.\n'));
    return;
  }

  printSectionHeader('Node Identity', theme.edge);
  console.log(`  Node:   ${theme.bold(creds.nodeName)}`);
  console.log(`  Org:    ${creds.orgName}`);
  console.log(`  Region: ${creds.region}`);

  if (!netMap) {
    console.log(theme.warn('\nNo network map found. Run "aegis run" to discover topology.\n'));
    return;
  }

  printSectionHeader('Network', theme.scrub);
  console.log(`  AZs:        ${netMap.availabilityZones.join(', ')}`);
  console.log(`  App nodes:  ${netMap.tiers.protected.appNodes.length}`);
  console.log(`  Discovered: ${netMap.generatedAt}`);

  if (!config) {
    console.log(theme.warn('\nNo configuration state found. Run "aegis run" to apply protections.\n'));
    return;
  }

  printSectionHeader('Protection Status', theme.brain);
  const table = new Table({ head: [chalk.gray('Component'), chalk.gray('Status')], colWidths: [24, 40] });
  table.push(
    ['XDP program', config.xdp.attached ? theme.ok(`attached (${config.xdp.program})`) : theme.warn('not attached')],
    ['JA4 fingerprinting', config.ja4Fingerprinting.enabled ? theme.ok('enabled') : theme.warn('disabled')],
    ['Entropy analyzer', config.entropyAnalyzer.enabled ? theme.ok('enabled') : theme.warn('disabled')],
    ['East-West mesh', config.eastWestMesh.enabled ? theme.ok(`${config.eastWestMesh.policies} policies`) : theme.warn('disabled')],
    ['Honeypots', config.honeypots.enabled ? theme.ok(`${config.honeypots.endpoints} active`) : theme.warn('none')],
    ['Graceful degradation', config.gracefulDegradation.enabled ? theme.ok('enabled') : theme.warn('disabled')],
    ['CERT-In auto-report', config.certInReporting.enabled ? theme.ok('enabled') : theme.warn('disabled')]
  );
  console.log(table.toString());
  console.log(theme.muted(`\nLast applied: ${config.lastApplied || 'never'}\n`));
}

module.exports = { runStatus };
