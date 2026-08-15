'use strict';

const inquirer = require('inquirer');
const boxen = require('boxen');
const chalk = require('chalk');
const { CREDENTIALS_FILE, writeJson, readJson, maskSecret, randomHash, nowIso } = require('./utils');
const { printBanner } = require('./banner');
const theme = require('./theme');

const REGIONS = [
  'ap-south-1 (Mumbai)',
  'ap-south-2 (Hyderabad)',
  'ap-southeast-1 (Singapore, DR)',
  'on-prem (NIC Data Centre)',
];

const ROLES = ['Admin', 'Security Operator', 'Compliance Auditor (read-only)'];
const CLOUD_PROVIDERS = ['AWS (Amazon Web Services)', 'GCP (Google Cloud Platform)', 'Azure (Microsoft Azure)'];

async function runInit() {
  printBanner();
  console.log(theme.bold('Node registration & credential setup\n'));

  const existing = readJson(CREDENTIALS_FILE);
  if (existing) {
    console.log(
      theme.warn(
        `⚠ A credential profile already exists for node "${existing.nodeName}". Continuing will overwrite it.\n`
      )
    );
  }

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'orgName',
      message: 'Organisation / Department name:',
      default: existing ? existing.orgName : 'Ministry of Electronics & IT (Demo Org)',
      validate: (v) => (v.trim().length > 0 ? true : 'Organisation name cannot be empty'),
    },
    {
      type: 'input',
      name: 'nodeName',
      message: 'Node identifier (this edge/cluster name):',
      default: existing ? existing.nodeName : 'mumbai-edge-01',
      validate: (v) => (/^[a-z0-9-]+$/.test(v) ? true : 'Use lowercase letters, numbers and hyphens only'),
    },
    {
      type: 'list',
      name: 'region',
      message: 'Deployment region:',
      choices: REGIONS,
    },
    {
      type: 'list',
      name: 'role',
      message: 'Access role for this session:',
      choices: ROLES,
    },
    {
      type: 'list',
      name: 'cloudProvider',
      message: 'Select Target Infrastructure:',
      choices: CLOUD_PROVIDERS,
    },
    {
      type: 'password',
      name: 'apiKey',
      message: 'API key / service credential:',
      mask: '*',
      validate: (v) => (v.trim().length >= 6 ? true : 'Enter at least 6 characters'),
    },
  ]);

  const record = {
    orgName: answers.orgName,
    nodeName: answers.nodeName,
    region: answers.region,
    role: answers.role,
    cloudProvider: answers.cloudProvider.split(' ')[0],
    apiKeyMasked: maskSecret(answers.apiKey),
    apiKeyFingerprint: randomHash(16), // stand-in for a stored credential hash
    createdAt: existing ? existing.createdAt : nowIso(),
    updatedAt: nowIso(),
  };

  writeJson(CREDENTIALS_FILE, record);

  console.log(
    '\n' +
      boxen(
        `${chalk.green('✔')} Credentials saved for node ${chalk.bold(record.nodeName)}\n` +
          `${chalk.gray('Org:')}    ${record.orgName}\n` +
          `${chalk.gray('Region:')} ${record.region}\n` +
          `${chalk.gray('Role:')}   ${record.role}\n` +
          `${chalk.gray('Key:')}    ${record.apiKeyMasked}`,
        { padding: 1, borderColor: 'green', borderStyle: 'round' }
      )
  );
  console.log(theme.muted(`\nSaved to .aegis/credentials.json — run "aegis run" next.\n`));
}

module.exports = { runInit };
