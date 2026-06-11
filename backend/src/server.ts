import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { initPool, closePool } from './config/db.config';
import purchaseOrderRouter from './routes/purchaseOrder.routes';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

async function main(): Promise<void> {
  if (env.DATA_SOURCE === 'oracle') {
    await initPool();
    console.log('Oracle connection pool initialized');
  } else {
    console.log('Running with DATA_SOURCE=mock (no Oracle connection)');
  }

  const app = express();

  app.use(cors({ origin: env.FRONTEND_ORIGIN }));
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', dataSource: env.DATA_SOURCE });
  });

  app.use('/api/purchase-orders', purchaseOrderRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use(errorHandler);

  const server = app.listen(env.PORT, () => {
    console.log(`PO module backend listening on port ${env.PORT}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received — closing server`);
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
  console.error('Failed to start server:', err);
  process.exit(1);
});
