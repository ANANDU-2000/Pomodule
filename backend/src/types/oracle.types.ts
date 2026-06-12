export interface OraclePurchaseOrderRow {
  DOC_NO: string;
  DOC_DT: Date | string;
  SUPP_CODE: string;
  SUPP_NAME: string;
  H_LOCN_CODE: string;
  LOCN_NAME: string;
  H_DEL_DT: Date | string;
  TOT_QTY: number;
  CURR_CODE: string;
  GROSS_AMNT: number;
  ITEM_COUNT: number;
  TERM_NAME: string;
  DOC_STATUS: string;
  REFERENCE_NO: string;
  H_CR_UID: string;
  H_CR_UNAME: string;
  H_ROW_ID: string;
}

/** @deprecated Use OraclePurchaseOrderRow */
export type OraclePORow = OraclePurchaseOrderRow;

export interface OracleListBinds {
  compCode: string;
  txnCode: string;
}

export interface OracleDetailBinds extends OracleListBinds {
  orderNo: string;
}
