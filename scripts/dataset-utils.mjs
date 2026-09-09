import { TYPE_META } from '../src/data/groups.js';

export const CSV_COLUMNS = [
  'id',
  'name',
  'aliases',
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
  'attributionConfidence',
  'reviewStatus',
  'lastReviewed',
  'sourceLabel',
  'sourceUrl',
];

export function normalizeGroup(group) {
  return {
    id: group.id,
    name: group.name,
    aliases: [...(group.aliases ?? [])],
    type: group.type,
    typeLabel: TYPE_META[group.type]?.label ?? group.type,
    country: group.country ?? '',
    city: group.city ?? '',
    lat: group.lat ?? null,
    lng: group.lng ?? null,
    originPrecision: group.originPrecision,
    firstSeen: group.firstSeen,
    scope: group.scope,
    tags: [...group.tags],
    knownFor: group.knownFor,
    attribution: group.attribution,
    attributionConfidence: group.attributionConfidence ?? 'unrated',
    reviewStatus: group.reviewStatus ?? 'needs-review',
    lastReviewed: group.lastReviewed ?? '',
    sourceLabel: group.sourceLabel,
    sourceUrl: group.sourceUrl ?? '',
  };
}

export function toCsvRow(group) {
  const row = normalizeGroup(group);
  return {
    ...row,
    aliases: row.aliases.join('; '),
    tags: row.tags.join('; '),
    lat: row.lat ?? '',
    lng: row.lng ?? '',
  };
}

function escapeCsv(value) {
  const stringValue = value == null ? '' : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export function serializeCsv(groups) {
  const rows = groups.map(toCsvRow).sort((a, b) => a.name.localeCompare(b.name));
  const header = CSV_COLUMNS.map(escapeCsv).join(',');
  const body = rows
    .map((row) => CSV_COLUMNS.map((column) => escapeCsv(row[column])).join(','))
    .join('\n');

  return `${header}\n${body}\n`;
}

export function serializeJson(groups) {
  const rows = groups.map(normalizeGroup).sort((a, b) => a.name.localeCompare(b.name));
  return `${JSON.stringify(rows, null, 2)}\n`;
}
