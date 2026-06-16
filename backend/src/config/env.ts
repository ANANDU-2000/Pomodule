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
  ORACLE_CONNECT_TIMEOUT: z.coerce.number().int().min(5).max(120).default(30),
  ORACLE_ID_COLUMN: z.string().min(1).default('DOC_NO'),
  ORACLE_DATE_COLUMN: z.string().min(1).default('DOC_DT'),
  ORACLE_DEFAULT_CURRENCY: z.string().min(1).default('THB'),
  ORACLE_SEARCH_LIMIT: z.coerce.number().int().min(1).max(100).default(20),
  ORACLE_ITEM_SEARCH_LIMIT: z.coerce.number().int().min(1).max(100).default(30),
  ORACLE_MIN_SEARCH_CHARS: z.coerce.number().int().min(1).max(10).default(2),
  ORACLE_LOOKUP_DEBOUNCE_MS: z.coerce.number().int().min(0).max(2000).default(300),
  ORACLE_FORM_CONFIG_VIEW: z.string().default(''),
  ORACLE_SUPPLIER_VIEW: z.string().default(''),
  ORACLE_ITEM_VIEW: z.string().default(''),
  ORACLE_ITEM_VALIDATE_SP: z.string().default(''),
  ORACLE_LOCATION_VIEW: z.string().default(''),
  ORACLE_PAYMENT_TERM_VIEW: z.string().default(''),
  ORACLE_PO_LINE_VIEW: z.string().default(''),
  ORACLE_PO_CREATE_SP: z.string().default(''),
  ORACLE_PO_UPDATE_SP: z.string().default(''),
  ORACLE_PO_APPROVE_SP: z.string().default(''),
  ORACLE_PO_DUPLICATE_SP: z.string().default(''),
  ORACLE_PO_LINE_DOC_COL: z.string().min(1).default('DOC_NO'),
  ORACLE_SUPPLIER_CODE_COL: z.string().min(1).default('SUPP_CODE'),
  ORACLE_SUPPLIER_NAME_COL: z.string().min(1).default('SUPP_NAME'),
  ORACLE_SUPPLIER_ADDR_COL: z.string().min(1).default('SUPP_ADDR'),
  ORACLE_SUPPLIER_SHIP_MODE_COL: z.string().min(1).default('SHIP_MODE'),
  ORACLE_SUPPLIER_PAY_TERM_COL: z.string().min(1).default('PAY_TERM'),
  ORACLE_SUPPLIER_DOC_LOCN_COL: z.string().min(1).default('DOC_LOCN'),
  ORACLE_ITEM_CODE_COL: z.string().min(1).default('ITEM_CODE'),
  ORACLE_ITEM_NAME_COL: z.string().min(1).default('ITEM_NAME'),
  ORACLE_ITEM_UOM_COL: z.string().min(1).default('UOM'),
  ORACLE_LOCATION_CODE_COL: z.string().min(1).default('LOCN_CODE'),
  ORACLE_LOCATION_NAME_COL: z.string().min(1).default('LOCN_NAME'),
  ORACLE_PAYMENT_TERM_CODE_COL: z.string().min(1).default('TERM_CODE'),
  ORACLE_PAYMENT_TERM_NAME_COL: z.string().min(1).default('TERM_NAME'),
  ORACLE_PAYMENT_TERM_SUPP_COL: z.string().min(1).default('SUPP_CODE'),
});

type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    console.error('Invalid environment configuration:', fieldErrors);
    const oracleKeys = ['ORACLE_HOST', 'ORACLE_SERVICE', 'ORACLE_USER', 'ORACLE_PASSWORD'] as const;
    const missingOracle = oracleKeys.filter((key) => fieldErrors[key]);
    if (missingOracle.length > 0) {
      console.error(
        '\nOracle connection is not configured. Edit backend/.env (copy from .env.example if needed):\n' +
          '  ORACLE_HOST=10.44.0.102          # IP only — port is ORACLE_PORT\n' +
          '  ORACLE_PORT=1521\n' +
          '  ORACLE_SERVICE=uatpdb.ysg.com    # service / PDB name\n' +
          '  ORACLE_USER=your_user\n' +
          '  ORACLE_PASSWORD=your_password\n' +
          '\nDo not run "cp .env.example .env" after filling .env — it resets credentials to blank.\n',
      );
    }
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
