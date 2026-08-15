'use strict';

const fs = require('fs');
const path = require('path');

const AEGIS_DIR = path.join(process.cwd(), '.aegis');
const CREDENTIALS_FILE = path.join(AEGIS_DIR, 'credentials.json');
const NETWORK_MAP_FILE = path.join(AEGIS_DIR, 'network-map.json');
const CONFIG_STATE_FILE = path.join(AEGIS_DIR, 'config-state.json');
const EVENTS_LOG_FILE = path.join(AEGIS_DIR, 'aegis-events.log');
const REPORTS_DIR = path.join(AEGIS_DIR, 'reports');

function ensureAegisDir() {
  if (!fs.existsSync(AEGIS_DIR)) fs.mkdirSync(AEGIS_DIR, { recursive: true });
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function randomChoice(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function randomIp() {
  return `${randomInt(1, 223)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`;
}

function randomMac() {
  const hex = () => randomInt(0, 255).toString(16).padStart(2, '0');
  return `${hex()}:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}`;
}

function randomHash(len = 12) {
  const chars = 'abcdef0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[randomInt(0, chars.length - 1)];
  return out;
}

function randomJA4() {
  // Loosely shaped like a real JA4 fingerprint token, not cryptographically meaningful
  return `t13d${randomInt(1000, 1900)}h2_${randomHash(12)}_${randomHash(12)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function nowNtp() {
  // NTP-synced label, per the doc's NIC/NPL sync requirement
  return `${nowIso()} (NTP-sync: samay1.nic.in)`;
}

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    return fallback;
  }
}

function writeJson(filePath, data) {
  ensureAegisDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function appendLine(filePath, line) {
  ensureAegisDir();
  fs.appendFileSync(filePath, line + '\n', 'utf-8');
}

function maskSecret(secret) {
  if (!secret || secret.length < 4) return '••••••••';
  return '•'.repeat(Math.max(4, secret.length - 4)) + secret.slice(-4);
}

module.exports = {
  AEGIS_DIR,
  CREDENTIALS_FILE,
  NETWORK_MAP_FILE,
  CONFIG_STATE_FILE,
  EVENTS_LOG_FILE,
  REPORTS_DIR,
  ensureAegisDir,
  sleep,
  randomInt,
  randomFloat,
  randomChoice,
  randomIp,
  randomMac,
  randomHash,
  randomJA4,
  nowIso,
  nowNtp,
  readJson,
  writeJson,
  appendLine,
  maskSecret,
};
