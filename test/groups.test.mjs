import assert from 'node:assert/strict';
import test from 'node:test';
import { GROUPS, isDecentralizedOrigin, isUnknownOrigin } from '../src/data/groups.js';
import { filterGroups } from '../src/hooks/useGroups.js';

test('decentralized and unknown origins are separate sets', () => {
  const decentralized = GROUPS.filter(isDecentralizedOrigin);
  const unknown = GROUPS.filter(isUnknownOrigin);

  assert.ok(decentralized.length > 0);
  assert.ok(unknown.length > 0);
  assert.equal(decentralized.some((group) => unknown.includes(group)), false);
  assert.equal(decentralized.every((group) => group.originPrecision.toLowerCase().includes('decentralized') || group.country === 'No fixed origin'), true);
});

test('search respects the active category and ignores viewport bounds', () => {
  const impossibleBounds = { north: 0, south: 0, east: 0, west: 0, zoom: 8 };
  const results = filterGroups(GROUPS, 'cybercrime', impossibleBounds, 'Scattered Spider');

  assert.deepEqual(results.map((group) => group.id), ['scattered-spider']);
});

test('corrected financially motivated actors are not state-linked', () => {
  for (const id of ['scattered-spider', 'unc5537']) {
    assert.equal(GROUPS.find((group) => group.id === id)?.type, 'cybercrime');
  }
});
