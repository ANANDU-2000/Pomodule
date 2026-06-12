import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { initPool, closePool, pingPool } from './config/oracle';
import purchaseOrderRouter from './routes/purchaseOrder.routes';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

async function main(): Promise<void> {
  if (env.DATA_SOURCE === 'oracle') {
    try {
      await initPool();
    } catch (err) {
      logger.error('Failed to initialize Oracle connection pool', {
        message: err instanceof Error ? err.message : String(err),
      });
      process.exit(1);
    }
  } else {
    logger.info('Running with DATA_SOURCE=mock (no Oracle connection)');
  }

  const app = express();

  app.use(cors({ origin: env.FRONTEND_ORIGIN }));
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', async (_req, res) => {
    const payload: Record<string, unknown> = {
      status: 'ok',
      dataSource: env.DATA_SOURCE,
    };

    if (env.DATA_SOURCE === 'oracle') {
      payload.oracleConnected = await pingPool();
    }

    res.json(payload);
  });

  app.use('/api/purchase-orders', purchaseOrderRouter);

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
      if (env.DATA_SOURCE === 'oracle') {
        await closePool();
      }
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
