import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GROUPS, GROUP_SCOPES, GROUP_TYPES, hasMapLocation } from '../src/data/groups.js';
import { serializeCsv, serializeJson } from './dataset-utils.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(repoRoot, 'public/data');
const errors = [];
const requiredStrings = [
  'id',
  'name',
  'type',
  'originPrecision',
  'scope',
  'knownFor',
  'attribution',
  'sourceLabel',
];

function addError(message) {
  errors.push(message);
}

function findDuplicates(values) {
  const seen = new Set();
  return [...new Set(values.filter((value) => {
    if (seen.has(value)) return true;
    seen.add(value);
    return false;
  }))];
}

for (const group of GROUPS) {
  for (const field of requiredStrings) {
    if (typeof group[field] !== 'string' || !group[field].trim()) {
      addError(`${group.id || '<missing id>'}: ${field} must be a non-empty string`);
    }
  }

  if (!GROUP_TYPES.includes(group.type)) addError(`${group.id}: unsupported type ${group.type}`);
  if (!GROUP_SCOPES.includes(group.scope)) addError(`${group.id}: unsupported scope ${group.scope}`);
  if (!Array.isArray(group.aliases)) addError(`${group.id}: aliases must be an array`);
  if (!Array.isArray(group.tags) || group.tags.length === 0) addError(`${group.id}: tags must be a non-empty array`);
  if (!Number.isInteger(group.firstSeen) || group.firstSeen < 1900 || group.firstSeen > new Date().getFullYear()) {
    addError(`${group.id}: firstSeen is outside the supported range`);
  }

  const hasLat = Number.isFinite(group.lat);
  const hasLng = Number.isFinite(group.lng);
  if (hasLat !== hasLng) addError(`${group.id}: latitude and longitude must be provided together`);
  if (hasMapLocation(group) && (group.lat < -90 || group.lat > 90 || group.lng < -180 || group.lng > 180)) {
    addError(`${group.id}: coordinates are outside valid ranges`);
  }

  if (group.sourceUrl) {
    try {
      const url = new URL(group.sourceUrl);
      if (url.protocol !== 'https:') addError(`${group.id}: sourceUrl must use HTTPS`);
    } catch {
      addError(`${group.id}: sourceUrl is invalid`);
    }
  }

  if (group.reviewStatus && !['reviewed', 'needs-review'].includes(group.reviewStatus)) {
    addError(`${group.id}: unsupported reviewStatus ${group.reviewStatus}`);
  }
  if (group.attributionConfidence && !['low', 'medium', 'high', 'unrated'].includes(group.attributionConfidence)) {
    addError(`${group.id}: unsupported attributionConfidence ${group.attributionConfidence}`);
  }
  if (group.reviewStatus === 'reviewed') {
    if (!group.sourceUrl) addError(`${group.id}: reviewed records require sourceUrl`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(group.lastReviewed ?? '')) {
      addError(`${group.id}: reviewed records require an ISO lastReviewed date`);
    }
  }
}

for (const id of findDuplicates(GROUPS.map((group) => group.id))) addError(`duplicate id: ${id}`);
for (const name of findDuplicates(GROUPS.map((group) => group.name.toLowerCase()))) addError(`duplicate name: ${name}`);

const expectedJson = serializeJson(GROUPS);
const expectedCsv = serializeCsv(GROUPS);
const actualJson = fs.readFileSync(path.join(dataDir, 'cyber-actor-atlas.json'), 'utf8');
const actualCsv = fs.readFileSync(path.join(dataDir, 'cyber-actor-atlas.csv'), 'utf8');

if (actualJson !== expectedJson) addError('public JSON export is stale; run npm run export:data');
if (actualCsv !== expectedCsv) addError('public CSV export is stale; run npm run export:data');

if (errors.length > 0) {
  console.error(`Dataset validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${GROUPS.length} unique actor records and synchronized exports.`);
}
