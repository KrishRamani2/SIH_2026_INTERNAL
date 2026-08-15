'use strict';

const figlet = require('figlet');
const boxen = require('boxen');
const chalk = require('chalk');

function printBanner() {
  const text = figlet.textSync('AEGIS-BHARAT', { font: 'Standard' });
  console.log(chalk.hex('#3FAE79')(text));
  console.log(
    boxen(
      chalk.white.bold('Sovereign eBPF/XDP-Accelerated Cloud DDoS Mitigation\n') +
        chalk.gray('Aegis-Bharat Operations Console — Active Protection Mode'),
      {
        padding: 1,
        margin: { top: 0, bottom: 1, left: 0, right: 0 },
        borderColor: 'green',
        borderStyle: 'round',
      }
    )
  );
}

function printSectionHeader(title, colorFn) {
  const line = '─'.repeat(Math.max(4, 60 - title.length));
  console.log('\n' + (colorFn || chalk.cyan).bold(`▸ ${title} `) + chalk.gray(line));
}

module.exports = { printBanner, printSectionHeader };
