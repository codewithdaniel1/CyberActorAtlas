import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const { GROUPS, TYPE_META, getDisplayName } = await import(path.join(repoRoot, 'src/data/groups.js'));

const outputDir = path.join(repoRoot, 'public/data');

const csvColumns = [
  'id',
  'name',
  'type',
  'typeLabel',
  'country',
  'city',
  'lat',
  'lng',
  'originPrecision',
  'firstSeen',
  'scope',
  'tags',
  'knownFor',
  'attribution',
  'sourceLabel',
];

function normalizeGroup(group) {
  return {
    id: group.id,
    name: getDisplayName(group),
    type: group.type,
    typeLabel: TYPE_META[group.type]?.label ?? group.type,
    country: group.country,
    city: group.city,
    lat: group.lat,
    lng: group.lng,
    originPrecision: group.originPrecision,
    firstSeen: group.firstSeen,
    scope: group.scope,
    tags: group.tags.join('; '),
    knownFor: group.knownFor,
    attribution: group.attribution,
    sourceLabel: group.sourceLabel,
  };
}

function escapeCsv(value) {
  const stringValue = value == null ? '' : String(value);
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

function toCsv(rows) {
  const header = csvColumns.map(escapeCsv).join(',');
  const body = rows
    .map((row) => csvColumns.map((column) => escapeCsv(row[column])).join(','))
    .join('\n');

  return `${header}\n${body}\n`;
}

const rows = GROUPS.map(normalizeGroup).sort((a, b) => a.name.localeCompare(b.name));

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'cyber-actor-atlas.json'), `${JSON.stringify(rows, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, 'cyber-actor-atlas.csv'), toCsv(rows));

console.log(`Exported ${rows.length} records to public/data`);
