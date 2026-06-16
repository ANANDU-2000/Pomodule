/**
 * Creates backend/.env from .env.example ONLY if .env does not exist.
 * Never overwrites an existing .env (so credentials are not wiped).
 */
import fs from 'fs';
import path from 'path';

const backendRoot = path.join(__dirname, '..');
const envPath = path.join(backendRoot, '.env');
const examplePath = path.join(backendRoot, '.env.example');

if (fs.existsSync(envPath)) {
  console.log('backend/.env already exists — not overwriting (your credentials are kept).');
  console.log('To verify: npm run check:env');
  process.exit(0);
}

if (!fs.existsSync(examplePath)) {
  console.error('Missing backend/.env.example');
  process.exit(1);
}

fs.copyFileSync(examplePath, envPath);
console.log('Created backend/.env from .env.example');
console.log('');
console.log('Next: open backend/.env and set:');
console.log('  ORACLE_HOST=10.44.0.102');
console.log('  ORACLE_SERVICE=uatpdb.ysg.com');
console.log('  ORACLE_USER=UAT_11JLIVE');
console.log('  ORACLE_PASSWORD=your_password');
console.log('');
console.log('Then: npm run check:env && npm run dev');
