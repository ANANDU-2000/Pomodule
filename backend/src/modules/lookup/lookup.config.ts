import { env } from '../../config/env';
import type { LookupType } from '../../types/lookup.types';

export interface LookupTypeConfig {
  viewName: string;
  codeColumn: string;
  nameColumn: string;
  searchColumns: string[];
  extraColumns?: Record<string, string>;
  requiresSupplierCode?: boolean;
  envKey: string;
}

function viewFromEnv(value: string, envKey: string): string {
  return value;
}

export function getLookupTypeConfig(type: LookupType): LookupTypeConfig | null {
  const registry: Record<LookupType, LookupTypeConfig | null> = {
    supplier: env.ORACLE_SUPPLIER_VIEW
      ? {
          viewName: env.ORACLE_SUPPLIER_VIEW,
          codeColumn: env.ORACLE_SUPPLIER_CODE_COL,
          nameColumn: env.ORACLE_SUPPLIER_NAME_COL,
          searchColumns: [env.ORACLE_SUPPLIER_CODE_COL, env.ORACLE_SUPPLIER_NAME_COL],
          extraColumns: {
            address: env.ORACLE_SUPPLIER_ADDR_COL,
            shipmentMode: env.ORACLE_SUPPLIER_SHIP_MODE_COL,
            paymentTerm: env.ORACLE_SUPPLIER_PAY_TERM_COL,
            docLocation: env.ORACLE_SUPPLIER_DOC_LOCN_COL,
          },
          envKey: 'ORACLE_SUPPLIER_VIEW',
        }
      : null,
    item: env.ORACLE_ITEM_VIEW
      ? {
          viewName: env.ORACLE_ITEM_VIEW,
          codeColumn: env.ORACLE_ITEM_CODE_COL,
          nameColumn: env.ORACLE_ITEM_NAME_COL,
          searchColumns: [env.ORACLE_ITEM_CODE_COL, env.ORACLE_ITEM_NAME_COL],
          extraColumns: { uom: env.ORACLE_ITEM_UOM_COL },
          envKey: 'ORACLE_ITEM_VIEW',
        }
      : null,
    location: env.ORACLE_LOCATION_VIEW
      ? {
          viewName: env.ORACLE_LOCATION_VIEW,
          codeColumn: env.ORACLE_LOCATION_CODE_COL,
          nameColumn: env.ORACLE_LOCATION_NAME_COL,
          searchColumns: [env.ORACLE_LOCATION_CODE_COL, env.ORACLE_LOCATION_NAME_COL],
          envKey: 'ORACLE_LOCATION_VIEW',
        }
      : null,
    paymentTerm: env.ORACLE_PAYMENT_TERM_VIEW
      ? {
          viewName: env.ORACLE_PAYMENT_TERM_VIEW,
          codeColumn: env.ORACLE_PAYMENT_TERM_CODE_COL,
          nameColumn: env.ORACLE_PAYMENT_TERM_NAME_COL,
          searchColumns: [env.ORACLE_PAYMENT_TERM_CODE_COL, env.ORACLE_PAYMENT_TERM_NAME_COL],
          requiresSupplierCode: true,
          envKey: 'ORACLE_PAYMENT_TERM_VIEW',
        }
      : null,
  };

  const config = registry[type];
  if (!config) return null;
  return { ...config, viewName: viewFromEnv(config.viewName, config.envKey) };
}

export function isValidLookupType(type: string): type is LookupType {
  return type === 'supplier' || type === 'item' || type === 'location' || type === 'paymentTerm';
}
