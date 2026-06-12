# Oracle Integration Guide

## Section 1: Data source architecture

Purchase orders are read from Oracle view `OV_PO_SEARCH_VIEW_YSG` via `backend/src/services/oraclePurchaseOrder.service.ts`.

| Layer | File |
|-------|------|
| Connection pool | `backend/src/config/oracle.ts` |
| Repository switch | `backend/src/services/purchaseOrder.service.ts` (`DATA_SOURCE=mock\|oracle`) |
| Oracle queries | `backend/src/services/oraclePurchaseOrder.service.ts` |
| Row mapping | `backend/src/mappers/purchaseOrder.mapper.ts` |
| List filter/sort/page | `backend/src/utils/applyListParams.ts` (in-memory phase 1) |
| SQL pagination stub | `backend/src/utils/oracleListQueryBuilder.ts` (future) |

Environment variables (see `backend/.env.example`):

```
DATA_SOURCE=oracle
ORACLE_HOST=
ORACLE_PORT=1521
ORACLE_SERVICE=
ORACLE_USER=
ORACLE_PASSWORD=
ORACLE_COMP_CODE=YSG
ORACLE_TXN_CODE=PO
```

Optional API override: `GET /api/purchase-orders?txnCode=PO`

## Section 2: Activating Oracle after credentials are received

1. Copy `backend/.env.example` to `backend/.env`
2. Set `DATA_SOURCE=oracle` and fill Oracle host/port/service/user/password
3. Connect to VPN if required
4. Start backend: `cd backend && npm run dev`
5. Verify health: `curl http://localhost:3001/health` (expect `oracleConnected: true`)
6. Verify list: `curl 'http://localhost:3001/api/purchase-orders?page=1&pageSize=10'`
7. Set frontend `VITE_USE_MOCK=false` and confirm the list page loads real data

## Section 3: Column mapping (view → API)

| Oracle column | API field |
|---------------|-----------|
| `DOC_NO` | `orderNo` |
| `DOC_DT` | `documentDate` |
| `SUPP_CODE` | `supplierCode` |
| `SUPP_NAME` | `supplierName` |
| `LOCN_NAME` | `location` |
| `H_DEL_DT` | `deliveryDate` |
| `GROSS_AMNT` | `orderValue` |
| `DOC_STATUS` | `status` |
| `H_CR_UID` | `userId` |
| *(not in view)* | `remarks` (defaults to `""`) |

## Section 4: Future stored procedures (update/approve)

Update and approve endpoints remain mock-only until DB team shares procedures. When available:

1. Add methods to `oraclePurchaseOrder.service.ts`
2. Wire `update` / `approve` in `oraclePurchaseOrder.repository.ts`
3. Map procedure OUT params in `purchaseOrder.mapper.ts`

## Section 5: Performance at scale

Phase 1 fetches all rows from the view and applies search/filter/sort/pagination in Node. This is acceptable for UAT volumes.

Before production with large row counts, implement SQL-side pagination in `oracleListQueryBuilder.ts` using `OFFSET/FETCH` or DB-team-approved approach. Never fetch unbounded result sets in production.

Connection pool: `poolMin: 2`, `poolMax: 10` in `oracle.ts`. Warm pooled connections avoid ~200ms cold-connect latency per request.
