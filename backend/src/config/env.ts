import { z } from 'zod';

const envSchema = z.object({
  DATA_SOURCE: z.enum(['mock', 'oracle']).default('mock'),
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5173'),
  ORACLE_HOST: z.string().optional(),
  ORACLE_PORT: z.coerce.number().int().positive().default(1521),
  ORACLE_SERVICE: z.string().optional(),
  ORACLE_USER: z.string().optional(),
  ORACLE_PASSWORD: z.string().optional(),
  ORACLE_COMP_CODE: z.string().default('YSG'),
  ORACLE_TXN_CODE: z.string().default('PO'),
}).superRefine((data, ctx) => {
  if (data.DATA_SOURCE === 'oracle') {
    if (!data.ORACLE_HOST) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ORACLE_HOST required when DATA_SOURCE=oracle', path: ['ORACLE_HOST'] });
    }
    if (!data.ORACLE_SERVICE) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ORACLE_SERVICE required when DATA_SOURCE=oracle', path: ['ORACLE_SERVICE'] });
    }
    if (!data.ORACLE_USER) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ORACLE_USER required when DATA_SOURCE=oracle', path: ['ORACLE_USER'] });
    }
    if (!data.ORACLE_PASSWORD) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ORACLE_PASSWORD required when DATA_SOURCE=oracle', path: ['ORACLE_PASSWORD'] });
    }
  }
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
