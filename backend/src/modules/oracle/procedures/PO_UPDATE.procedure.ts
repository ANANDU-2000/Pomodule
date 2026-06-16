/*
 * YSG PO MODULE - ORACLE STORED PROCEDURE CONTRACT
 * Feature    : PO Update
 * Env key    : ORACLE_PO_UPDATE_SP
 * Tables     : OT_PO_HEAD, OT_PO_ITEM
 * Status     : PENDING - DB team to deliver SP name and signature
 *
 * UPDATE statement the SP must honour (HEAD):
 *   UPDATE OT_PO_HEAD
 *   SET    DOC_STATUS   = :docStatus,
 *          H_DEL_DT     = TO_DATE(:hDelDt,'YYYY-MM-DD'),
 *          SUPP_CODE    = :suppCode,
 *          SUPP_NAME    = :suppName,
 *          ...
 *   WHERE  H_ROW_ID = :rowId
 *   AND    COMP_CODE = 'YSG';
 *
 * App bind parameter map:
 *   p_doc_no      -> DOC_NO  (PK for lookup after update)
 *   p_comp_code   -> COMP_CODE
 *   p_txn_code    -> TXN_CODE
 *   p_user_id     -> updated-by user
 *   p_supp_code   -> SUPP_CODE
 *   p_doc_dt      -> DOC_DT
 *   p_del_dt      -> H_DEL_DT
 *   p_items_json  -> OT_PO_ITEM lines (full replacement)
 *
 * Activation: set ORACLE_PO_UPDATE_SP=<sp_name> in backend/.env
 */
export const PO_UPDATE_PROCEDURE_DOC = 'PO_UPDATE - see comments above';
