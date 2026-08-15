'use strict';

const path = require('path');
const boxen = require('boxen');
const { REPORTS_DIR, writeJson, nowIso, nowNtp, randomHash } = require('./utils');
const { logEvent } = require('./logger');
const theme = require('./theme');

/**
 * Builds and writes a CERT-In / CSITe "Annexure A" style incident report.
 * This mirrors Tier-S feature #5 in the solution doc: the system should
 * auto-extract IOCs and produce the reporting payload within the 6-hour
 * window once an attack has been mitigated.
 */
function generateIncidentReport(attack) {
  const reportId = `INC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomHash(6)}`;
  const report = {
    reportId,
    generatedAt: nowNtp(),
    reportingDeadline: '6 hours from first detection (CERT-In mandate)',
    incident: {
      classification: attack.classification,
      detectionMethod: attack.detectionMethod,
      firstDetectedAt: attack.detectedAt,
      mitigatedAt: nowIso(),
      targetedAsset: attack.targetedAsset,
      peakVolumePps: attack.peakPps,
      sourceIndicators: attack.sourceIndicators,
      ja4Signatures: attack.ja4Signatures,
      mitigationActions: attack.mitigationActions,
    },
    compliance: {
      framework: ['CERT-In Cybersecurity Directions 2022', 'IT Act 2000 (Sec 70B)'],
      logRetentionDays: 180,
      logStore: 'WORM log store (India-local)',
    },
  };

  const filePath = path.join(REPORTS_DIR, `incident-${reportId}.json`);
  writeJson(filePath, report);

  logEvent({
    level: 'CRITICAL',
    tier: 'comply',
    message: `CERT-In incident report generated: ${reportId}`,
    meta: { filePath },
  });

  console.log(
    boxen(
      `${theme.comply('CERT-In Compliance Report Generated')}\n\n` +
        `${theme.muted('Report ID:')}   ${reportId}\n` +
        `${theme.muted('Classification:')} ${attack.classification}\n` +
        `${theme.muted('Target:')}      ${attack.targetedAsset}\n` +
        `${theme.muted('Saved to:')}    .aegis/reports/incident-${reportId}.json`,
      { padding: 1, borderColor: 'yellow', borderStyle: 'round' }
    )
  );

  return report;
}

module.exports = { generateIncidentReport };
