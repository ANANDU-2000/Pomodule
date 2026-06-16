/*
 * YSG PO MODULE - ORACLE VIEW + SP CONTRACT
 * Feature    : Item Lookup + Item Validate
 * Env keys   : ORACLE_ITEM_VIEW, ORACLE_ITEM_VALIDATE_SP
 * Status     : PENDING - DB team to deliver view name and SP name
 *
 * LOOKUP QUERY (search dropdown in line items grid):
 *   SELECT ITEM_CODE, ITEM_NAME, UOM
 *   FROM   OM_ITEM
 *   WHERE  NVL(ITEM_FRZ_FLAG_NUM, 2) = 2
 *   AND    (UPPER(ITEM_CODE) LIKE :search OR UPPER(ITEM_NAME) LIKE :search)
 *   AND    ROWNUM <= 30
 *
 * Required columns (env overrides available for each):
 *   ITEM_CODE  VARCHAR2   - env: ORACLE_ITEM_CODE_COL
 *   ITEM_NAME  VARCHAR2   - env: ORACLE_ITEM_NAME_COL
 *   UOM        VARCHAR2   - env: ORACLE_ITEM_UOM_COL
 *
 * VALIDATE SP signature (o_dval_item_11j):
 *   p_item_code       IN  VARCHAR2
 *   p_lang_code       IN  VARCHAR2    ('EN' or 'TH')
 *   p_txn_code        IN  VARCHAR2    ('PO')
 *   p_comp_code       IN  VARCHAR2    ('YSG')
 *   p_user_id         IN  VARCHAR2
 *   p_err_war_flag    OUT VARCHAR2
 *   p_tax_para_code   OUT VARCHAR2
 *   p_locn_code       IN  VARCHAR2
 *   p_stk_yn_num      OUT NUMBER
 *   p_batch_yn_num    OUT NUMBER
 *   p_sno_yn_num      OUT NUMBER
 *   p_dim_reqd_yn_num OUT NUMBER
 *   p_uom             OUT VARCHAR2    <- auto-fills UOM in line item
 *   p_max_loose       OUT NUMBER
 *   p_gc_1            OUT VARCHAR2
 *   p_gc_2            OUT VARCHAR2
 *   p_tax_para_value  OUT VARCHAR2
 *   p_free_stk        OUT NUMBER
 *   p_avbl_stk        OUT NUMBER      <- available stock shown in UI
 *   p_gc1_req_yn      OUT NUMBER
 *   p_gc2_req_yn      OUT NUMBER
 *   p_item_name       OUT VARCHAR2    <- auto-fills item name in line item
 *
 * Activation:
 *   ORACLE_ITEM_VIEW=<view_name>
 *   ORACLE_ITEM_VALIDATE_SP=o_dval_item_11j
 */
export const ITEM_LOOKUP_VIEW_DOC = 'ITEM_LOOKUP - see comments above';
