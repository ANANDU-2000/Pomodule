import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5173'),
  ORACLE_HOST: z.string().min(1),
  ORACLE_PORT: z.coerce.number().int().positive().default(1521),
  ORACLE_SERVICE: z.string().min(1),
  ORACLE_USER: z.string().min(1),
  ORACLE_PASSWORD: z.string().min(1),
  ORACLE_VIEW_NAME: z.string().min(1),
  ORACLE_COMP_CODE: z.string().default(''),
  ORACLE_TXN_CODE: z.string().default(''),
  ORACLE_APPLY_COMP_TXN_FILTER: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  ORACLE_POOL_MIN: z.coerce.number().int().min(1).default(4),
  ORACLE_POOL_MAX: z.coerce.number().int().min(1).default(50),
  ORACLE_POOL_INCREMENT: z.coerce.number().int().min(1).default(4),
  ORACLE_ID_COLUMN: z.string().min(1).default('DOC_NO'),
  ORACLE_DATE_COLUMN: z.string().min(1).default('DOC_DT'),
});

type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment configuration:', result.error.flatten().fieldErrors);
    process.exit(1);
  }

  const data = result.data;
  if (data.ORACLE_APPLY_COMP_TXN_FILTER && (!data.ORACLE_COMP_CODE || !data.ORACLE_TXN_CODE)) {
    console.error(
      'ORACLE_COMP_CODE and ORACLE_TXN_CODE are required when ORACLE_APPLY_COMP_TXN_FILTER=true',
    );
    process.exit(1);
  }

  if (data.ORACLE_POOL_MAX < data.ORACLE_POOL_MIN) {
    console.error('ORACLE_POOL_MAX must be >= ORACLE_POOL_MIN');
    process.exit(1);
  }

  return data;
}

export const env = parseEnv();

export function buildConnectString(): string {
  return `//${env.ORACLE_HOST}:${env.ORACLE_PORT}/${env.ORACLE_SERVICE}`;
}
