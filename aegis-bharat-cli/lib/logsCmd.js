'use strict';

const fs = require('fs');
const { EVENTS_LOG_FILE } = require('./utils');
const { readEvents, formatEntry } = require('./logger');
const theme = require('./theme');

function runLogs({ tail = false, limit = 30 } = {}) {
  if (!fs.existsSync(EVENTS_LOG_FILE)) {
    console.log(theme.warn('No event log found yet. Run "aegis run" first.\n'));
    return;
  }

  const events = readEvents(limit);
  if (events.length === 0) {
    console.log(theme.muted('Log file is empty.\n'));
  } else {
    events.forEach((e) => console.log(formatEntry(e)));
  }

  if (!tail) return;

  console.log(theme.muted('\n--- following log (Ctrl+C to stop) ---\n'));
  let lastSize = fs.statSync(EVENTS_LOG_FILE).size;

  const interval = setInterval(() => {
    const stat = fs.statSync(EVENTS_LOG_FILE);
    if (stat.size > lastSize) {
      const stream = fs.createReadStream(EVENTS_LOG_FILE, { start: lastSize, end: stat.size });
      let buf = '';
      stream.on('data', (chunk) => (buf += chunk.toString()));
      stream.on('end', () => {
        buf
          .split('\n')
          .filter(Boolean)
          .forEach((line) => {
            try {
              console.log(formatEntry(JSON.parse(line)));
            } catch {
              /* ignore malformed line */
            }
          });
      });
      lastSize = stat.size;
    }
  }, 500);

  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log(theme.muted('\nStopped following log.\n'));
    process.exit(0);
  });
}

module.exports = { runLogs };
