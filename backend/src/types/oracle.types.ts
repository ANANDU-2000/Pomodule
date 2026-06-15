/** Row shape from OV_PO_SEARCH_VIEW_YSG (mapped columns only). */
export interface OraclePurchaseOrderRow {
  DOC_NO: string;
  DOC_DT: Date | string;
  SUPP_CODE: string;
  SUPP_NAME: string;
  LOCN_NAME: string;
  H_DEL_DT: Date | string;
  GROSS_AMNT: number;
  DOC_STATUS: string;
  REFERENCE_NO: string;
  H_CR_UID: string;
}
