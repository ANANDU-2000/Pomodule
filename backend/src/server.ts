import './config/loadEnv';
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { initPool, closePool } from './config/oracle';
import { probeOracleHealth } from './config/oracleHealth';
import purchaseOrderRouter from './routes/purchaseOrder.routes';
import lookupRouter from './routes/lookup.routes';
import formConfigRouter from './routes/formConfig.routes';
import statusRouter from './routes/status.routes';
import itemRouter from './routes/item.routes';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

async function main(): Promise<void> {
  try {
    await initPool();
  } catch (err) {
    logger.error('Failed to initialize Oracle connection pool', {
      message: err instanceof Error ? err.message : String(err),
    });
    process.exit(1);
  }

  const startupProbe = await probeOracleHealth();
  if (!startupProbe.connected || startupProbe.queryStatus !== 'ok') {
    logger.error('Oracle startup probe failed', {
      connected: startupProbe.connected,
      queryStatus: startupProbe.queryStatus,
      error: startupProbe.error,
    });
    console.error('\n--- Backend cannot start: Oracle not connected ---');
    console.error(`Host:    ${env.ORACLE_HOST}:${env.ORACLE_PORT}`);
    console.error(`Service: ${env.ORACLE_SERVICE}`);
    console.error(`Error:   ${startupProbe.error ?? 'unknown'}`);
    console.error('\nTry:');
    console.error('  1. Connect to company VPN');
    console.error('  2. cd backend && npm run diagnose');
    console.error('  3. PowerShell: Test-NetConnection 10.44.0.102 -Port 1521');
    console.error('  4. Confirm backend/.env has user/password (not .env.example)\n');
    process.exit(1);
  }

  logger.info('Oracle startup probe succeeded', {
    connected: startupProbe.connected,
    queryStatus: startupProbe.queryStatus,
    rowCount: startupProbe.rowCount,
    host: startupProbe.host,
    service: startupProbe.service,
    compCode: startupProbe.compCode,
    txnCode: startupProbe.txnCode,
  });

  const app = express();

  app.use(cors({ origin: env.FRONTEND_ORIGIN }));
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', async (_req, res) => {
    const oracle = await probeOracleHealth();
    const healthy = oracle.connected && oracle.queryStatus === 'ok';

    res.status(healthy ? 200 : 503).json({
      status: healthy ? 'ok' : 'degraded',
      dataSource: 'oracle',
      oracle: {
        connected: oracle.connected,
        host: oracle.host,
        service: oracle.service,
        viewName: oracle.viewName,
        compCode: oracle.compCode,
        txnCode: oracle.txnCode,
        queryStatus: oracle.queryStatus,
        error: oracle.error,
        sampleRowCount: oracle.rowCount,
        compTxnFilterApplied: oracle.compTxnFilterApplied,
      },
    });
  });

  app.use('/api/purchase-orders', purchaseOrderRouter);
  app.use('/api/lookups', lookupRouter);
  app.use('/api/po', formConfigRouter);
  app.use('/api/status', statusRouter);
  app.use('/api/items', itemRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use(errorHandler);

  const server = app.listen(env.PORT, () => {
    logger.info('PO module backend listening', { port: env.PORT });
  });

  const shutdown = async (signal: string) => {
    logger.info('Shutdown signal received', { signal });
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
  process.on('SIGINT', () => { void shutdown('SIGINT'); });
}

main().catch((err: unknown) => {
  logger.error('Failed to start server', {
    message: err instanceof Error ? err.message : String(err),
  });
  process.exit(1);
});
