import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serializeCsv, serializeJson } from './dataset-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const { GROUPS } = await import(path.join(repoRoot, 'src/data/groups.js'));

const outputDir = path.join(repoRoot, 'public/data');

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'cyber-actor-atlas.json'), serializeJson(GROUPS));
fs.writeFileSync(path.join(outputDir, 'cyber-actor-atlas.csv'), serializeCsv(GROUPS));

console.log(`Exported ${GROUPS.length} records to public/data`);
