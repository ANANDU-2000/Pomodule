import { z } from 'zod';

const envSchema = z.object({
  DATA_SOURCE: z.enum(['mock', 'oracle']).default('mock'),
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5173'),
  ORACLE_USER: z.string().optional(),
  ORACLE_PASSWORD: z.string().optional(),
  ORACLE_CONNECT_STR: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.DATA_SOURCE === 'oracle') {
    if (!data.ORACLE_USER) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ORACLE_USER required when DATA_SOURCE=oracle', path: ['ORACLE_USER'] });
    }
    if (!data.ORACLE_PASSWORD) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ORACLE_PASSWORD required when DATA_SOURCE=oracle', path: ['ORACLE_PASSWORD'] });
    }
    if (!data.ORACLE_CONNECT_STR) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ORACLE_CONNECT_STR required when DATA_SOURCE=oracle', path: ['ORACLE_CONNECT_STR'] });
    }
  }
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment configuration:', result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export const env = parseEnv();
