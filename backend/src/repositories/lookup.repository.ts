import oracledb, { type Connection } from 'oracledb';
import { env } from '../config/env';
import { getLookupTypeConfig } from '../modules/lookup/lookup.config';
import type { LookupItem, LookupSearchParams } from '../types/lookup.types';
import { buildOracleSearchQuery } from '../utils/oracleSearchQuery';

function mapRowToLookupItem(
  row: Record<string, unknown>,
  codeColumn: string,
  nameColumn: string,
  extraColumns?: Record<string, string>,
): LookupItem {
  const item: LookupItem = {
    code: String(row[codeColumn] ?? ''),
    name: String(row[nameColumn] ?? ''),
  };
  if (extraColumns) {
    for (const [key, col] of Object.entries(extraColumns)) {
      const val = row[col];
      if (val !== null && val !== undefined) {
        if (key === 'address') item.address = String(val);
        else if (key === 'shipmentMode') item.shipmentMode = String(val);
        else if (key === 'paymentTerm') item.paymentTerm = String(val);
        else if (key === 'docLocation') item.docLocation = String(val);
        else if (key === 'uom') item.uom = String(val);
      }
    }
  }
  return item;
}

export async function searchLookup(
  params: LookupSearchParams,
  conn: Connection,
): Promise<LookupItem[]> {
  const config = getLookupTypeConfig(params.type);
  if (!config) {
    throw new Error(`Lookup type ${params.type} is not configured`);
  }

  const selectColumns = [config.codeColumn, config.nameColumn];
  if (config.extraColumns) {
    selectColumns.push(...Object.values(config.extraColumns));
  }

  const extraBinds: Record<string, string> = {};
  let extraWhere: string | undefined;

  if (config.requiresSupplierCode) {
    if (!params.supplierCode) return [];
    extraWhere = `${env.ORACLE_PAYMENT_TERM_SUPP_COL} = :supplierCode`;
    extraBinds.supplierCode = params.supplierCode;
  }

  const limit = params.limit ?? (
    params.type === 'item' ? env.ORACLE_ITEM_SEARCH_LIMIT : env.ORACLE_SEARCH_LIMIT
  );

  const { sql, binds } = buildOracleSearchQuery(
    {
      viewName: config.viewName,
      selectColumns,
      searchColumns: config.searchColumns,
      compCode: env.ORACLE_COMP_CODE,
      limit,
      extraWhere,
      extraBinds,
    },
    params.q,
  );

  const result = await conn.execute<Record<string, unknown>>(sql, binds, {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  });

  return (result.rows ?? []).map((row) =>
    mapRowToLookupItem(row, config.codeColumn, config.nameColumn, config.extraColumns),
  );
}
