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
  ORACLE_COMP_CODE: z.string().default('YSG'),
  ORACLE_TXN_CODE: z.string().default('PO'),
});

type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment configuration:', result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export const env = parseEnv();

export function buildConnectString(): string {
  return `//${env.ORACLE_HOST}:${env.ORACLE_PORT}/${env.ORACLE_SERVICE}`;
}
