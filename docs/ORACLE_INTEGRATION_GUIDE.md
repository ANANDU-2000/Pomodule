# Oracle Integration Guide

## Architecture (Oracle only — no mock data)

| Layer | File |
|-------|------|
| Env config | `backend/src/config/env.ts` |
| Connection pool | `backend/src/config/oracle.ts` |
| Oracle queries | `backend/src/services/oraclePurchaseOrder.service.ts` |
| API facade | `backend/src/services/purchaseOrder.service.ts` |
| Row mapping | `backend/src/mappers/purchaseOrder.mapper.ts` |
| Types | `backend/src/types/oracle.types.ts`, `purchaseOrder.types.ts` |
| List filter/sort/page | `backend/src/utils/applyListParams.ts` |

## Activate real data

1. Connect to VPN
2. Set `backend/.env`:

```
ORACLE_HOST=10.44.0.102
ORACLE_PORT=1521
ORACLE_SERVICE=uatpdb.ysg.com
ORACLE_USER=<provided>
ORACLE_PASSWORD=<provided>
ORACLE_COMP_CODE=YSG
ORACLE_TXN_CODE=PO
```

3. `cd backend && npm run dev`
4. `curl http://localhost:3001/health` → `oracleConnected: true`
5. `curl 'http://localhost:3001/api/purchase-orders?page=1&pageSize=10'`
6. Start frontend: `cd frontend && npm run dev`

## Column mapping

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
| `REFERENCE_NO` | `remarks` |
| `H_CR_UID` | `userId` |

Query: `OV_PO_SEARCH_VIEW_YSG` where `COMP_CODE='YSG'` and `TXN_CODE=:txnCode` (default `PO`).

## Blockers for full functionality

| Feature | Status | Blocker |
|---------|--------|---------|
| PO List | Ready | Credentials + VPN |
| PO View | Ready | Credentials + VPN |
| PO Edit (PUT) | Not ready | Oracle update procedure needed |
| PO Approve (POST) | Not ready | Oracle approve procedure needed |
| PO Create (POST) | Not ready | No backend route + insert procedure |
| Production scale | Future | SQL-side pagination in `oracleListQueryBuilder.ts` |

## Blockers checklist

- [ ] `ORACLE_USER` and `ORACLE_PASSWORD` set in `backend/.env`
- [ ] VPN connected to reach `10.44.0.102:1521`
- [ ] Oracle Instant Client installed (if required by `oracledb`)
- [ ] DB team provides write procedures for update/approve/create
