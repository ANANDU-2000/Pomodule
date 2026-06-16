import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

/** Always load backend/.env — not dependent on which folder you run `npm run dev` from. */
const backendRoot = path.resolve(__dirname, '..', '..');
export const ENV_FILE_PATH = path.join(backendRoot, '.env');

const result = config({ path: ENV_FILE_PATH });

if (!fs.existsSync(ENV_FILE_PATH)) {
  console.warn(
    `[env] File not found: ${ENV_FILE_PATH}\n` +
      '      Create it:  npm run setup   (from backend folder — safe, never overwrites)\n' +
      '      Then fill:  ORACLE_HOST, ORACLE_SERVICE, ORACLE_USER, ORACLE_PASSWORD',
  );
} else if (result.error) {
  console.warn(`[env] Could not read ${ENV_FILE_PATH}:`, result.error.message);
}
