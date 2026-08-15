'use strict';

const chalk = require('chalk');

/**
 * Color coding mirrors the tier colours used in the Aegis-Bharat
 * architecture diagram, so the CLI visually echoes the pitch deck.
 */
const theme = {
  origin: chalk.hex('#C9504F'),      // traffic origins (users / botnet)
  edge: chalk.hex('#4A90C4'),        // edge / perimeter
  scrub: chalk.hex('#3FAE79'),       // eBPF/XDP scrubbing tier
  brain: chalk.hex('#9B7FD4'),       // ML / SOAR brain
  comply: chalk.hex('#D4A24C'),      // compliance / governance
  protected: chalk.hex('#4CA6C7'),   // protected private cloud
  recovery: chalk.hex('#5FAE5F'),    // autonomous recovery
  upstream: chalk.hex('#C15F9E'),    // upstream escalation

  // semantic helpers
  ok: chalk.green,
  warn: chalk.yellow,
  danger: chalk.red,
  info: chalk.cyan,
  muted: chalk.gray,
  bold: chalk.bold,
  dim: chalk.dim,
  add: chalk.green,
  change: chalk.yellow,
  remove: chalk.red,
};

module.exports = theme;
