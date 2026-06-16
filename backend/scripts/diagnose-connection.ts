/**
 * Step-by-step connection diagnostic for backend + Oracle.
 * Run: npm run diagnose
 */
import '../src/config/loadEnv';
import fs from 'fs';
import net from 'net';
import path from 'path';
import { ENV_FILE_PATH } from '../src/config/loadEnv';
import { env, buildConnectString } from '../src/config/env';
import { initPool, closePool } from '../src/config/oracle';
import { probeOracleHealth } from '../src/config/oracleHealth';

const KEYS = ['ORACLE_HOST', 'ORACLE_SERVICE', 'ORACLE_USER', 'ORACLE_PASSWORD'] as const;

function parseEnvFile(filePath: string): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(filePath)) return map;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    map.set(trimmed.slice(0, eq).trim(), trimmed.slice(eq + 1).trim());
  }
  return map;
}

function testTcp(host: string, port: number, timeoutMs: number): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;
    const finish = (result: { ok: boolean; error?: string }) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish({ ok: true }));
    socket.once('timeout', () => finish({ ok: false, error: `TCP timeout after ${timeoutMs}ms` }));
    socket.once('error', (err) => finish({ ok: false, error: err.message }));
    socket.connect(port, host);
  });
}

function hintForOracleError(message: string): string[] {
  const hints: string[] = [];
  const m = message.toUpperCase();
  if (m.includes('TIMEOUT') || m.includes('NJS-510') || m.includes('ORA-12170')) {
    hints.push('Connect to company VPN (Oracle server is on internal network 10.44.x.x).');
    hints.push('Test from PowerShell: Test-NetConnection 10.44.0.102 -Port 1521');
  }
  if (m.includes('ORA-01017') || m.includes('INVALID USERNAME') || m.includes('PASSWORD')) {
    hints.push('Wrong ORACLE_USER or ORACLE_PASSWORD in backend/.env');
  }
  if (m.includes('ORA-12514') || m.includes('SERVICE')) {
    hints.push('Check ORACLE_SERVICE=uatpdb.ysg.com in backend/.env');
  }
  if (m.includes('NJS-045') || m.includes('INSTANT CLIENT')) {
    hints.push('Install Oracle Instant Client or use oracledb thin mode (default in v6).');
  }
  if (hints.length === 0) {
    hints.push('Verify VPN, .env credentials, and that Oracle listener is up.');
  }
  return hints;
}

async function main(): Promise<void> {
  console.log('=== PO Module connection diagnostic ===\n');

  // Step 1: .env file on disk
  console.log('1) Env file');
  console.log(`   Path: ${ENV_FILE_PATH}`);
  console.log(`   Exists: ${fs.existsSync(ENV_FILE_PATH) ? 'yes' : 'NO'}`);

  const fileValues = parseEnvFile(ENV_FILE_PATH);
  let envOk = true;
  for (const key of KEYS) {
    const fromFile = fileValues.get(key) ?? '';
    const filled = fromFile.length > 0;
    if (!filled) envOk = false;
    const show =
      key === 'ORACLE_PASSWORD'
        ? filled
          ? `(set, ${fromFile.length} chars)`
          : '(EMPTY)'
        : filled
          ? fromFile
          : '(EMPTY)';
    console.log(`   ${key}=${show}`);
  }
  if (!envOk) {
    console.log('\n   FIX: Edit backend/.env — do NOT run "copy .env.example .env" (wipes password).');
    process.exit(1);
  }
  console.log('   OK\n');

  // Step 2: TCP to Oracle host
  console.log('2) Network (TCP to Oracle listener)');
  console.log(`   Target: ${env.ORACLE_HOST}:${env.ORACLE_PORT}`);
  const tcp = await testTcp(env.ORACLE_HOST, env.ORACLE_PORT, 8000);
  if (tcp.ok) {
    console.log('   OK — port 1521 is reachable\n');
  } else {
    console.log(`   FAILED — ${tcp.error ?? 'unknown'}`);
    console.log('   FIX: Connect to VPN, then run: Test-NetConnection 10.44.0.102 -Port 1521');
    console.log('   Backend cannot start until this step passes.\n');
    process.exit(1);
  }

  // Step 3: Oracle login + PO view
  console.log('3) Oracle database');
  console.log(`   Connect string: ${buildConnectString()}`);
  console.log(`   User: ${env.ORACLE_USER}`);
  console.log(`   View: ${env.ORACLE_VIEW_NAME}`);

  try {
    await initPool();
    const health = await probeOracleHealth();
    await closePool();

    if (health.connected && health.queryStatus === 'ok') {
      console.log(`   OK — connected, PO view rows: ${health.rowCount ?? 0}\n`);
      console.log('=== All checks passed ===');
      console.log('Run: npm run dev');
      console.log('Then open: http://localhost:5173');
      process.exit(0);
    }

    console.log(`   FAILED — ${health.error ?? 'probe failed'}`);
    for (const h of hintForOracleError(health.error ?? '')) console.log(`   • ${h}`);
    process.exit(1);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`   FAILED — ${msg}`);
    for (const h of hintForOracleError(msg)) console.log(`   • ${h}`);
    try {
      await closePool();
    } catch {
      /* ignore */
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
