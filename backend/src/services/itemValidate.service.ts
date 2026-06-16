import type { Connection } from 'oracledb';
import oracledb from 'oracledb';
import { env } from '../config/env';
import { executeNamedProcedure } from '../utils/oracleProcedure';

export interface ItemValidateQuery {
  itemCode: string;
  langCode?: string;
  txnCode?: string;
  compCode?: string;
  userId?: string;
  locnCode?: string;
}

export interface ItemValidateResult {
  itemCode: string;
  itemName: string;
  uom: string;
  errWarFlag: string;
  taxParaCode: string;
  taxParaValue: number;
  stkYnNum: number;
  batchYnNum: number;
  snoYnNum: number;
  dimReqdYnNum: number;
  maxLoose: number;
  freeStk: number;
  avblStk: number;
  gc1ReqYn: string;
  gc2ReqYn: string;
}

function notConfiguredError(): Error & { statusCode: number; blocker: string } {
  const err = new Error('Item validation SP not configured') as Error & {
    statusCode: number;
    blocker: string;
  };
  err.statusCode = 501;
  err.blocker = 'ORACLE_ITEM_VALIDATE_SP';
  return err;
}

export async function validateItem(
  query: ItemValidateQuery,
  conn: Connection,
): Promise<ItemValidateResult> {
  if (!env.ORACLE_ITEM_VALIDATE_SP) {
    throw notConfiguredError();
  }

  const binds = {
    p_item_code: query.itemCode,
    p_lang_code: query.langCode ?? 'EN',
    p_txn_code: query.txnCode ?? env.ORACLE_TXN_CODE,
    p_comp_code: query.compCode ?? env.ORACLE_COMP_CODE,
    p_user_id: query.userId ?? env.ORACLE_USER,
    p_locn_code: query.locnCode ?? '',
    p_err_war_flag: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1 },
    p_tax_para_code: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 32 },
    p_stk_yn_num: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    p_batch_yn_num: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    p_sno_yn_num: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    p_dim_reqd_yn_num: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    p_uom: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 16 },
    p_max_loose: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    p_gc_1: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 64 },
    p_gc_2: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 64 },
    p_tax_para_value: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    p_free_stk: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    p_avbl_stk: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    p_gc1_req_yn: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1 },
    p_gc2_req_yn: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1 },
    p_item_name: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 240 },
  };

  await executeNamedProcedure(conn, env.ORACLE_ITEM_VALIDATE_SP, binds);

  return {
    itemCode: query.itemCode,
    itemName: String(binds.p_item_name ?? ''),
    uom: String(binds.p_uom ?? ''),
    errWarFlag: String(binds.p_err_war_flag ?? 'N'),
    taxParaCode: String(binds.p_tax_para_code ?? ''),
    taxParaValue: Number(binds.p_tax_para_value ?? 0),
    stkYnNum: Number(binds.p_stk_yn_num ?? 0),
    batchYnNum: Number(binds.p_batch_yn_num ?? 0),
    snoYnNum: Number(binds.p_sno_yn_num ?? 0),
    dimReqdYnNum: Number(binds.p_dim_reqd_yn_num ?? 0),
    maxLoose: Number(binds.p_max_loose ?? 0),
    freeStk: Number(binds.p_free_stk ?? 0),
    avblStk: Number(binds.p_avbl_stk ?? 0),
    gc1ReqYn: String(binds.p_gc1_req_yn ?? 'N'),
    gc2ReqYn: String(binds.p_gc2_req_yn ?? 'N'),
  };
}
