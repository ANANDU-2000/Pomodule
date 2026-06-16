/*
 * YSG PO MODULE - ORACLE STORED PROCEDURE CONTRACT
 * Feature    : PO Create
 * Env key    : ORACLE_PO_CREATE_SP
 * Table HEAD : OT_PO_HEAD
 * Table LINES: OT_PO_ITEM
 * Status     : PENDING - DB team to deliver SP name and signature
 *
 * INSERT statement the SP must honour (HEAD):
 *   INSERT INTO OT_PO_HEAD (
 *     COMP_CODE, TXN_CODE, DOC_NO, DOC_STATUS, DOC_DT, H_DEL_DT,
 *     SUPP_CODE, SUPP_NAME, H_LOCN_CODE, LOCN_NAME, CURR_CODE,
 *     GROSS_AMNT, TOT_QTY, ITEM_COUNT, TERM_NAME, REFERENCE_NO,
 *     H_CR_UID, H_CR_UNAME, H_ROW_ID
 *   ) VALUES (
 *     :compCode, :txnCode, :docNo, :docStatus,
 *     TO_DATE(:docDt,'YYYY-MM-DD'), TO_DATE(:hDelDt,'YYYY-MM-DD'),
 *     :suppCode, :suppName, :hLocnCode, :locnName,
 *     :currCode, :grossAmnt, :totQty, :itemCount,
 *     :termName, :referenceNo, :hCrUid, :hCrUname, SYS_GUID()
 *   );
 *
 * App bind parameter map (backend/src/modules/po/poProcedure.binds.ts):
 *   p_comp_code   -> COMP_CODE   (from env ORACLE_COMP_CODE, default 'YSG')
 *   p_txn_code    -> TXN_CODE    (from env ORACLE_TXN_CODE, default 'PO')
 *   p_user_id     -> H_CR_UID / H_CR_UNAME
 *   p_supp_code   -> SUPP_CODE
 *   p_supp_name   -> SUPP_NAME
 *   p_doc_dt      -> DOC_DT      (YYYY-MM-DD)
 *   p_del_dt      -> H_DEL_DT    (YYYY-MM-DD)
 *   p_curr_code   -> CURR_CODE
 *   p_locn_code   -> H_LOCN_CODE
 *   p_remarks     -> REFERENCE_NO
 *   p_items_json  -> OT_PO_ITEM  (JSON array of line items)
 *
 * OUT parameter the SP must return:
 *   p_doc_no      -> generated DOC_NO (VARCHAR2 64)
 *                    The backend reads this to fetch and return the created order.
 *
 * Activation: set ORACLE_PO_CREATE_SP=<sp_name> in backend/.env
 */
export const PO_CREATE_PROCEDURE_DOC = 'PO_CREATE - see comments above';
