-- YSG PO Module — Oracle reference (comment-only, NOT executed by the app)
-- Set view/SP names in backend/.env — see backend/src/modules/oracle/integration.registry.ts

-- =============================================================================
-- PO LIST + DETAIL (LIVE) — env: ORACLE_VIEW_NAME
-- =============================================================================
-- SELECT DOC_NO, DOC_DT, SUPP_CODE, SUPP_NAME, H_LOCN_CODE, LOCN_NAME, H_DEL_DT,
--        TOT_QTY, CURR_CODE, GROSS_AMNT, ITEM_COUNT, TERM_NAME, DOC_STATUS,
--        REFERENCE_NO, H_CR_UID, H_CR_UNAME, H_ROW_ID
-- FROM   OV_PO_SEARCH_VIEW_YSG
-- WHERE  COMP_CODE = 'YSG'
-- AND    TXN_CODE  = 'PO';

-- =============================================================================
-- ITEM LOOKUP (PENDING) — env: ORACLE_ITEM_VIEW
-- =============================================================================
-- SELECT ITEM_CODE, ITEM_NAME
-- FROM   OM_ITEM
-- WHERE  NVL(ITEM_FRZ_FLAG_NUM, 2) = 2;

-- Item validation SP (PENDING) — env: ORACLE_ITEM_VALIDATE_SP
-- o_dval_item_11j(
--   p_item_code       IN,
--   p_lang_code       IN,
--   p_txn_code        IN,
--   p_comp_code       IN,
--   p_user_id         IN,
--   p_err_war_flag    OUT,
--   p_tax_para_code   OUT,
--   p_locn_code       IN,
--   p_stk_yn_num      OUT,
--   p_batch_yn_num    OUT,
--   p_sno_yn_num      OUT,
--   p_dim_reqd_yn_num OUT,
--   p_uom             OUT,
--   p_max_loose       OUT,
--   p_gc_1            OUT,
--   p_gc_2            OUT,
--   p_tax_para_value  OUT,
--   p_free_stk        OUT,
--   p_avbl_stk        OUT,
--   p_gc1_req_yn      OUT,
--   p_gc2_req_yn      OUT,
--   p_item_name       OUT
-- );

-- =============================================================================
-- PO CREATE (PENDING) — env: ORACLE_PO_CREATE_SP
-- =============================================================================
-- Head table: OT_PO_HEAD (team building)
-- Line table: OT_PO_ITEM (team building)
-- App bind map: backend/src/modules/po/poProcedure.binds.ts
--   p_comp_code, p_txn_code, p_user_id, p_supp_code, p_supp_name,
--   p_doc_dt, p_del_dt, p_curr_code, p_locn_code, p_remarks, p_items_json (OT_PO_ITEM lines)

-- =============================================================================
-- PO UPDATE (PENDING) — env: ORACLE_PO_UPDATE_SP
-- =============================================================================
-- Same tables: OT_PO_HEAD + OT_PO_ITEM

-- =============================================================================
-- PO APPROVE (PENDING) — env: ORACLE_PO_APPROVE_SP
-- =============================================================================

-- =============================================================================
-- PO LINE ITEMS (PENDING) — env: ORACLE_PO_LINE_VIEW
-- =============================================================================
-- SELECT ... FROM <ORACLE_PO_LINE_VIEW> WHERE DOC_NO = :orderNo

-- =============================================================================
-- SUPPLIER LOOKUP (PENDING) — env: ORACLE_SUPPLIER_VIEW
-- =============================================================================
-- SUPP_CODE, SUPP_NAME, SUPP_ADDR, SHIP_MODE, PAY_TERM, DOC_LOCN
