import type { Request, Response } from 'express';
import { env } from '../config/env';
import { probeOracleHealth } from '../config/oracleHealth';
import {
  ORACLE_INTEGRATION_REGISTRY,
  getEnvValueForKey,
} from '../modules/oracle/integration.registry';

type FeatureStatus = 'live' | 'pending';

interface FeatureEntry {
  status: FeatureStatus;
  note: string;
  sourceFile: string;
  dbReference: string;
  endpoint: string;
  method: string;
  envKey: string;
}

function buildFeatureEntry(featureId: string): FeatureEntry {
  const entry = ORACLE_INTEGRATION_REGISTRY.find((e) => e.featureId === featureId);
  if (!entry) {
    return {
      status: 'pending',
      note: 'Unknown feature',
      sourceFile: '',
      dbReference: '',
      endpoint: '',
      method: '',
      envKey: '',
    };
  }

  const envValue = getEnvValueForKey(entry.envKey);
  return {
    status: envValue.trim().length > 0 ? 'live' : 'pending',
    note: envValue.trim().length > 0 ? envValue : `Set ${entry.envKey}`,
    sourceFile: entry.sourceFile,
    dbReference: entry.dbReference,
    endpoint: entry.endpoint,
    method: entry.method,
    envKey: entry.envKey,
  };
}

export async function getStatus(_req: Request, res: Response): Promise<void> {
  const oracle = await probeOracleHealth();
  const connected = oracle.connected && oracle.queryStatus === 'ok';

  const featureIds = [
    'poList',
    'poDetail',
    'poLineItems',
    'poCreate',
    'poUpdate',
    'poApprove',
    'supplierLookup',
    'itemLookup',
    'itemValidate',
    'locationLookup',
    'paymentTermLookup',
    'formConfig',
  ] as const;

  const features = Object.fromEntries(
    featureIds.map((id) => [id, buildFeatureEntry(id)]),
  );

  res.json({
    oracle: {
      connected,
      host: env.ORACLE_HOST,
      service: env.ORACLE_SERVICE,
    },
    features,
    registry: ORACLE_INTEGRATION_REGISTRY.map((entry) => ({
      featureId: entry.featureId,
      envKey: entry.envKey,
      endpoint: entry.endpoint,
      method: entry.method,
      sourceFile: entry.sourceFile,
      dbObjectType: entry.dbObjectType,
      dbReference: entry.dbReference,
      status: getEnvValueForKey(entry.envKey).trim().length > 0 ? 'live' : 'pending',
    })),
  });
}
