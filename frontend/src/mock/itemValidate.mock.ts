// MOCK DATA — simulates o_dval_item_11j OUT parameters until DB team delivers SP
import { MOCK_ITEMS } from './items.mock';

export interface ItemValidateParams {
  itemCode: string;
  langCode?: string;
  txnCode?: string;
  compCode?: string;
  locnCode?: string;
}

/** Mirrors o_dval_item_11j OUT binds (subset used by PO form today). */
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
  suggestedRate: number;
}

function hashCode(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function mockValidateItem(params: ItemValidateParams): ItemValidateResult | null {
  const code = params.itemCode.trim().toUpperCase();
  if (!code) return null;

  const item =
    MOCK_ITEMS.find((row) => row.code.toUpperCase() === code) ??
    MOCK_ITEMS.find((row) => row.code.toUpperCase().startsWith(code)) ??
    MOCK_ITEMS.find((row) => row.name.toLowerCase().includes(params.itemCode.trim().toLowerCase()));
  if (!item) return null;

  const seed = hashCode(code);
  const avblStk = 50 + (seed % 450);
  const freeStk = Math.floor(avblStk * 0.85);

  return {
    itemCode: item.code,
    itemName: item.name,
    uom: item.uom ?? 'PCS',
    errWarFlag: 'N',
    taxParaCode: 'VAT7',
    taxParaValue: 7,
    stkYnNum: 1,
    batchYnNum: seed % 3 === 0 ? 1 : 0,
    snoYnNum: 0,
    dimReqdYnNum: 0,
    maxLoose: 0,
    freeStk,
    avblStk,
    gc1ReqYn: 'N',
    gc2ReqYn: 'N',
    suggestedRate: 80 + (seed % 920),
  };
}
