# Oracle Integration Guide

## Section 1: What the DB team must provide

For each Oracle stored procedure the team shares, we need:

1. Package name (e.g. PKG_PO)
2. Procedure name (e.g. GET_PO_LIST)
3. IN parameter names and types (e.g. P_PAGE NUMBER, P_SEARCH VARCHAR2)
4. OUT parameter / cursor name and column names returned
5. Whether procedure is in a package or standalone
6. Oracle user/schema that owns the procedure
7. For pagination: which param controls offset vs limit vs page number

## Section 2: How to adopt a new procedure (step-by-step)

**Step 1:** Open `backend/src/utils/oracleParams.ts`  
`P_FROM_DATE` / `P_TO_DATE` are already resolved from `filter` enum in `backend/src/utils/dateFilter.ts` — frontend never sends dates.  
Replace PLACEHOLDER param names with actual IN param names from the DB team.

**Step 2:** Open `backend/src/services/purchaseOrder.service.ts`  
Replace PLACEHOLDER procedure call:

```
conn.execute('BEGIN PKG_PO.GET_PO_LIST(:params...); END;', binds, options)
```

Set `outFormat: oracledb.OUT_FORMAT_OBJECT` for object rows

**Step 3:** Map cursor column names → POListItem fields  
Add mapping in service: `row.COLUMN_NAME` → `listItem.camelCaseName`  
WHY explicit mapping: Oracle returns UPPERCASE column names by default; frontend expects camelCase; never rename DB columns to match JS

**Step 4:** Run backend dev server: `cd backend && npm run dev`  
Test with curl: `curl 'http://localhost:3001/api/purchase-orders?page=1&pageSize=10'`

**Step 5:** Set `DATA_SOURCE=oracle` in `backend/.env` and Oracle credentials  
Frontend already calls `/api/purchase-orders` by default (`VITE_USE_MOCK=false`). Set `VITE_API_BASE_URL` only if backend is on a different host.

**Step 6:** Test with 1000 rows: add `P_PAGE_SIZE=1000` and verify response time < 2s

## Section 3: Performance at 1M+ rows

Server-side pagination: NEVER return all rows. Oracle procedure must accept P_PAGE and P_PAGE_SIZE.

If team's procedure does rownum-based pagination:
Use: `WHERE ROWNUM BETWEEN (page-1)*pageSize+1 AND page*pageSize`  
This is standard Oracle pagination — DB team likely already has this.

REF CURSOR: oracledb streams cursor rows. Do NOT fetch entire cursor into array.  
Use `resultSet.getRow()` loop or `resultSet.getRows(pageSize)` — never `getRows()` without limit.

Connection pool: Keep poolMin:2 so warm connections are always available.  
Latency test: cold connection = ~200ms, pooled connection = ~2ms.  
With 1M+ row queries, this 200ms difference is noise — but on high concurrency it stacks.

Index hint: If Oracle query is slow, ask DB team to confirm index exists on:
documentDate (most common filter column), supplierCode, status.  
Frontend cannot fix missing Oracle indexes — only DBA can.
