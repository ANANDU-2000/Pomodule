# Oracle Integration Guide

## Simple stack (no mock data)

```
Controller → purchaseOrder.service → oracleViewQuery (reusable) → Oracle view
```

| Layer | File |
|-------|------|
| Env (all config) | `backend/src/config/env.ts` |
| Connection pool | `backend/src/config/oracle.ts` |
| PO field map | `backend/src/modules/po/po.config.ts` |
| Reusable SQL builder | `backend/src/utils/oracleViewQuery.ts` |
| PO service | `backend/src/services/purchaseOrder.service.ts` |
| Health | `backend/src/config/oracleHealth.ts` |

**APIs (minimal):** `GET /health`, `GET /api/purchase-orders`, `GET /api/purchase-orders/:id`, `PUT`, `POST approve`

## Env setup (nothing hardcoded in code)

```env
ORACLE_HOST=
ORACLE_PORT=1521
ORACLE_SERVICE=
ORACLE_USER=
ORACLE_PASSWORD=
ORACLE_VIEW_NAME=OV_PO_SEARCH_VIEW_YSG
ORACLE_COMP_CODE=YSG
ORACLE_TXN_CODE=PO
ORACLE_APPLY_COMP_TXN_FILTER=false
ORACLE_POOL_MIN=4
ORACLE_POOL_MAX=50
ORACLE_POOL_INCREMENT=4
ORACLE_ID_COLUMN=DOC_NO
ORACLE_DATE_COLUMN=DOC_DT
```

Set `ORACLE_APPLY_COMP_TXN_FILTER=true` once DB confirms comp/txn data.

## Scale (100k+ concurrent users)

- SQL-side pagination, search, filter, sort — never loads full view into Node
- Connection pool sized via env (`ORACLE_POOL_MAX=50` per instance)
- Run **multiple backend instances** behind a load balancer
- `stmtCacheSize` + pool queue enabled in `oracle.ts`

## Column mapping (Oracle → API → UI)

Source: `modules/po/po.config.ts` + `frontend/src/data/poColumns.ts`

| Oracle | API | UI label |
|--------|-----|----------|
| DOC_NO | orderNo | Order No |
| DOC_DT | documentDate | Document Date |
| SUPP_CODE | supplierCode | Supplier Code |
| SUPP_NAME | supplierName | Supplier Name |
| LOCN_NAME | location | Location |
| H_DEL_DT | deliveryDate | Deliver Date |
| GROSS_AMNT | orderValue | Order Value |
| DOC_STATUS | status | Status |
| REFERENCE_NO | remarks | Remarks |
| H_CR_UID | userId | User Id |

## Next module pattern

Copy `modules/po/po.config.ts` → `modules/gr/gr.config.ts`, add field map, wire a new service using `oracleViewQuery.ts`. Same env pool, same list/detail API shape.

## Blockers

| Feature | Status |
|---------|--------|
| List / View | Ready |
| Edit / Approve / Create | Needs Oracle write procedures |
