#!/usr/bin/env node
'use strict';

const { Command } = require('commander');
const { runInit } = require('../lib/credentials');
const { runMain } = require('../lib/run');
const { runStatus } = require('../lib/status');
const { runLogs } = require('../lib/logsCmd');

const program = new Command();

program
  .name('aegis')
  .description(
    'Aegis-Bharat DDoS Mitigation CLI operations tool. ' +
      'Manages credential setup, network discovery, config diff/apply, and live attack monitoring. ' +
      'No real network or firewall changes are made.'
  )
  .version('1.0.0');

program
  .command('init')
  .description('Register node credentials and settings')
  .action(async () => {
    await runInit();
  });

program
  .command('run')
  .description('Discover network, pull config, show plan, apply on confirmation, then monitor')
  .action(async () => {
    await runMain();
  });

program
  .command('status')
  .description('Show current node identity, network, and protection status')
  .action(() => {
    runStatus();
  });

program
  .command('logs')
  .description('View the event log')
  .option('-t, --tail', 'follow the log file for new events')
  .option('-n, --limit <number>', 'number of recent lines to show', '30')
  .action((opts) => {
    runLogs({ tail: !!opts.tail, limit: parseInt(opts.limit, 10) });
  });

program.parseAsync(process.argv);
