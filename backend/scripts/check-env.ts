/**
 * Verifies backend/.env exists and required Oracle keys are filled.
 * Does not print passwords.
 */
import fs from 'fs';
import path from 'path';

const ENV_PATH = path.join(__dirname, '..', '.env');
const KEYS = ['ORACLE_HOST', 'ORACLE_SERVICE', 'ORACLE_USER', 'ORACLE_PASSWORD'] as const;

function parseEnvFile(filePath: string): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(filePath)) return map;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    map.set(key, value);
  }
  return map;
}

const values = parseEnvFile(ENV_PATH);

console.log(`Env file: ${ENV_PATH}`);
console.log(`Exists:   ${fs.existsSync(ENV_PATH) ? 'yes' : 'NO — run: npm run setup'}`);
console.log('');

let ok = true;
for (const key of KEYS) {
  const value = values.get(key) ?? '';
  const filled = value.length > 0;
  if (!filled) ok = false;
  const display =
    key === 'ORACLE_PASSWORD'
      ? filled
        ? `(set, ${value.length} chars)`
        : '(EMPTY)'
      : filled
        ? value
        : '(EMPTY)';
  console.log(`  ${key}=${display}`);
}

console.log('');
if (ok) {
  console.log('OK — all required Oracle variables are set in backend/.env');
  process.exit(0);
}

console.log('MISSING — edit backend/.env (not .env.example) and save the file.');
console.log('');
console.log('Common mistakes:');
console.log('  • Editing .env.example instead of .env');
console.log('  • NEVER run:  copy .env.example .env   or   cp .env.example .env');
console.log('    That command OVERWRITES .env and deletes your password every time.');
console.log('  • First time only:  npm run setup   (creates .env if missing, never overwrites)');
console.log('  • ORACLE_HOST must be IP only (10.44.0.102), not 10.44.0.102:1521');
console.log('  • OneDrive may revert .env — pause sync or keep a backup of .env');
process.exit(1);
