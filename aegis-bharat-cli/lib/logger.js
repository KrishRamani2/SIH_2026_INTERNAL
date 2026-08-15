'use strict';

const fs = require('fs');
const theme = require('./theme');
const { EVENTS_LOG_FILE, appendLine, nowIso, ensureAegisDir } = require('./utils');

const LEVEL_COLOR = {
  INFO: theme.info,
  OK: theme.ok,
  WARN: theme.warn,
  ALERT: theme.danger,
  CRITICAL: theme.danger.bold,
};

/**
 * Appends one structured event to the .aegis/aegis-events.log file.
 * Each line is a self-contained JSON object (JSON-Lines format) so the
 * log can be replayed / parsed later (e.g. by the CERT-In report engine),
 * while `aegis logs` renders it in a human-friendly colored form.
 */
function logEvent({ level = 'INFO', tier = null, message, meta = {} }) {
  ensureAegisDir();
  const entry = {
    ts: nowIso(),
    level,
    tier,
    message,
    meta,
  };
  appendLine(EVENTS_LOG_FILE, JSON.stringify(entry));
  return entry;
}

function formatEntry(entry) {
  const color = LEVEL_COLOR[entry.level] || theme.muted;
  const tierTag = entry.tier ? theme.muted(`[${entry.tier}]`) : '';
  const time = theme.dim(entry.ts.replace('T', ' ').replace('Z', ''));
  return `${time} ${color(`[${entry.level.padEnd(8)}]`)} ${tierTag} ${entry.message}`;
}

function readEvents(limit = null) {
  if (!fs.existsSync(EVENTS_LOG_FILE)) return [];
  const lines = fs
    .readFileSync(EVENTS_LOG_FILE, 'utf-8')
    .split('\n')
    .filter(Boolean);
  const events = lines
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  if (limit) return events.slice(-limit);
  return events;
}

module.exports = { logEvent, formatEntry, readEvents };
