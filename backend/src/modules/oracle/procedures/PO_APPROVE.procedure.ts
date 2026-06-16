/*
 * YSG PO MODULE - ORACLE STORED PROCEDURE CONTRACT
 * Feature    : PO Approve
 * Env key    : ORACLE_PO_APPROVE_SP
 * Table      : OT_PO_HEAD
 * Status     : PENDING - DB team to deliver SP name and signature
 *
 * UPDATE statement the SP must honour:
 *   UPDATE OT_PO_HEAD
 *   SET    DOC_STATUS = 'APPROVED'
 *   WHERE  H_ROW_ID  = :rowId
 *   AND    COMP_CODE = 'YSG';
 *
 * App bind parameter map:
 *   p_doc_no      -> DOC_NO (backend looks up H_ROW_ID from view first)
 *   p_comp_code   -> COMP_CODE
 *   p_txn_code    -> TXN_CODE
 *   p_user_id     -> approving user
 *
 * Activation: set ORACLE_PO_APPROVE_SP=<sp_name> in backend/.env
 * Note: 409 is returned if DOC_STATUS is not in approvable set (Pending/Draft)
 */
export const PO_APPROVE_PROCEDURE_DOC = 'PO_APPROVE - see comments above';
