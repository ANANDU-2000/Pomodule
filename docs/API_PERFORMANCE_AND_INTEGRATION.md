# PO Module — Backend, Frontend, API & Performance Guide

This document explains how the **frontend**, **backend API**, and **Oracle database** fit together for the Purchase Order listing module. It covers validation when Oracle goes live, how **loaders**, **latency (ms)**, and **response size** behave, and what happens if you try to work with **1,000,000 orders**.

For component layout and keyboard shortcuts, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 1. Three Layers — Who Does What

```
┌──────────────────────────────────────────────────────────────────────────┐
│  FRONTEND (Browser — React + Vite)                                       │
│  PurchaseOrderListPage → usePurchaseOrders → purchaseOrderService        │
│  Renders UI, shows loader, sends page/search/filter/sort params          │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │  HTTP (JSON)
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  BACKEND API (Node / Java / .NET — not in this repo yet)               │
│  GET /api/purchase-orders?page=1&pageSize=10&search=...                │
│  Validates request, calls Oracle, returns one page + total count       │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │  JDBC / ODP.NET / oracledb
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  ORACLE DATABASE                                                         │
│  Tables + indexes + stored procedures for list / count / detail        │
│  Filter, search, sort, pagination happen HERE — not in the browser       │
└──────────────────────────────────────────────────────────────────────────┘
```

| Layer | Location in project | Responsibility |
|-------|---------------------|----------------|
| **Frontend** | `src/pages`, `src/components`, `src/hooks` | UI, user input, loading state, display **one page** of rows |
| **Service (API client)** | `src/services/purchaseOrderService.ts` | Build query params (`toApiParams`), call API, return `POListResult` |
| **Backend API** | *Future server* | Auth, validation, Oracle calls, JSON response |
| **Oracle DB** | *ERP database* | Source of truth, indexed queries, stored procedures |

### Current state (development)

Today the app is **frontend-only**. `purchaseOrderService.ts` reads mock JSON (`src/data/purchaseOrders.json`, **20 records**) and runs filter, search, sort, and slice **in the browser**. That is acceptable only for demos.

When Oracle is ready, **only** `purchaseOrderService.ts` switches from mock logic to `fetch('/api/purchase-orders?...')`. Hooks and components stay unchanged.

---

## 2. API Contract (Listing)

### Request

```
GET /api/purchase-orders
  ?page=1
  &pageSize=10
  &search=abc
  &filter=this_month
  &sortBy=documentDate
  &sortOrder=desc
  &fromDate=2026-06-01
  &toDate=2026-06-10
```

Built by `toApiParams()` in `purchaseOrderService.ts`:

| Frontend (`POListParams`) | API query key | Notes |
|---------------------------|---------------|-------|
| `page` | `page` | 1-based page number |
| `pageSize` | `pageSize` | Allowed: 10, 25, 50, 100 (`PAGE_SIZE_OPTIONS`) |
| `search` | `search` | Free text; debounced 300 ms in `SearchBar` |
| `filter` | `filter` | Period: `today`, `this_month`, `all`, `none`, etc. |
| `sortBy` | `sortBy` | Column key, e.g. `documentDate` |
| `sortDirection` | `sortOrder` | Mapped from internal `sortDirection` |
| *(derived)* | `fromDate`, `toDate` | From `resolveFilterDates()` in `dateFilter.ts` |

### Response (`POListResult`)

```json
{
  "data": [ /* PurchaseOrder[] — ONLY current page */ ],
  "total": 150,
  "page": 1,
  "pageSize": 10,
  "totalPages": 15
}
```

Each `PurchaseOrder` row has 10 fields (`orderNo`, `documentDate`, `supplierCode`, `supplierName`, `location`, `orderValue`, `status`, `deliveryDate`, `remarks`, `userId`).

**Critical rule:** `data` must never contain all rows in the database. It contains **at most `pageSize` rows** (max 100 in this UI).

---

## 3. Loader, Latency, and Response Size

### 3.1 Loader (frontend)

| Piece | File | Behavior |
|-------|------|----------|
| `loading` state | `usePurchaseOrders.ts` | `true` while `fetchPurchaseOrders` runs |
| Skeleton UI | `DataTable.tsx` | Shows `SkeletonRows` when `loading === true` |
| Search debounce | `SearchBar.tsx` | 300 ms delay before triggering a new fetch |
| Mock delay | `purchaseOrderService.ts` | Artificial `100 ms` `setTimeout` (remove with real API) |

**User-visible flow:**

1. User changes page, filter, search, or sort → `params` update.
2. `useEffect` runs → `setLoading(true)` → table shows skeleton rows.
3. API (or mock) returns → `setResult(data)` → `setLoading(false)` → table renders rows.

Total perceived wait ≈ **debounce (0–300 ms) + network + DB + render**.

### 3.2 Latency breakdown (typical targets)

All values are **round-trip** unless noted. Targets are for ERP list screens on a corporate network.

| Stage | Typical range | What affects it |
|-------|---------------|-----------------|
| Search debounce | 0–300 ms | Fixed in UI; avoids API call on every keystroke |
| Browser → API (network) | 5–50 ms LAN; 50–200 ms VPN/WAN | Distance, TLS, proxy |
| API auth + validation | 1–10 ms | JWT/session lookup |
| Oracle query (paginated, indexed) | 10–80 ms | Indexes on `document_date`, `order_no`, search columns |
| Oracle `COUNT(*)` for `total` | 20–200 ms | Can be slower than data query on huge tables; consider cached counts or approximate totals |
| JSON serialize (API) | 1–5 ms for 10–100 rows | Negligible at page size |
| Browser parse + React render | 5–30 ms for 10–100 rows | DOM nodes, `React.memo` on `DataTable` |

**Reasonable SLA for one list request (paginated, indexed):**

| Metric | Good | Acceptable | Poor |
|--------|------|------------|------|
| API p95 latency | &lt; 200 ms | 200–500 ms | &gt; 500 ms |
| Time to interactive (after click) | &lt; 300 ms | 300–800 ms | &gt; 1 s |
| Loader visible | &lt; 400 ms | 400 ms–1 s | &gt; 1 s (user notices delay) |

Measure with browser DevTools → **Network** tab → select the `purchase-orders` request → **Timing** (Waiting/TTFB = server + DB).

### 3.3 Response payload size

Estimated JSON size per purchase order row: **~280–350 bytes** (based on mock shape).

| Scenario | Rows in `data` | Approx. payload |
|----------|----------------|-----------------|
| Default page | 10 | **~3–4 KB** |
| Max UI page | 100 | **~30–35 KB** |
| Accidental full dump | 1,000,000 | **~280–350 MB** |

**Never return 1M rows in one API response.** Browsers and mobile networks cannot handle it; the tab may freeze or crash.

Compression (gzip/brotli on API) typically shrinks JSON by **60–80%**, but pagination is still mandatory.

---

## 4. What Happens With 1,000,000 Orders?

### 4.1 Wrong approach — fetch everything

| Step | What happens | Time / size (order of magnitude) |
|------|----------------|-------------------------------------|
| Oracle `SELECT *` no `WHERE`, no `ROWNUM`/`OFFSET` | Full table scan, 1M rows read | **30 s – several minutes** (depends on storage, indexes, network to app server) |
| API builds JSON array of 1M objects | High CPU, huge memory | **Seconds + hundreds of MB RAM** on server |
| HTTP response ~300 MB | Slow download | **10 s – minutes** on typical office network |
| Browser `JSON.parse` | Main thread blocked | **Seconds**; possible out-of-memory |
| React renders 1M `<tr>` | DOM explosion | **Browser freeze or crash** |

**Conclusion:** Listing 1M orders as a single fetch is **not viable** in frontend, API, or Oracle without batch export tooling (CSV job, report server), which is a different product feature.

### 4.2 Correct approach — server-side pagination (this module’s design)

The UI already requests **one page at a time**:

```typescript
// purchaseOrderService.ts (target production shape)
const res = await fetch(`/api/purchase-orders?${new URLSearchParams(toApiParams(params))}`);
return res.json();
```

With **1,000,000** total orders and **pageSize = 10**:

| Concept | Value |
|---------|--------|
| Rows returned per request | **10** (not 1,000,000) |
| Response size per request | **~3–4 KB** |
| Total pages | **100,000** |
| Rows user sees at once | **10–100** (max page size in UI) |

Each page turn is a **new API call** with a new `page` number. Oracle should use something equivalent to:

```sql
-- Conceptual pattern (exact syntax depends on your stored procedure)
SELECT ... FROM purchase_orders
WHERE document_date BETWEEN :fromDate AND :toDate
  AND (search conditions)
ORDER BY document_date DESC
OFFSET (:page - 1) * :pageSize ROWS
FETCH NEXT :pageSize ROWS ONLY;
```

Plus a separate **count** query (or window function) for `total`.

**Per-page latency** with proper indexes on filter/sort columns should stay in the **tens to low hundreds of ms** range even with 1M rows in the table, because Oracle only **materializes one page** of results.

### 4.3 Where 1M rows still hurt (even with pagination)

| Operation | Risk | Mitigation |
|-----------|------|------------|
| `COUNT(*)` on full table every request | Slow on huge tables | Index on filtered columns; count cache; “100,000+” approximate label |
| `search` with leading `%` wildcard | Full scan | Oracle Text / functional indexes; minimum search length |
| `sortBy` on unindexed column | Filesort | Index matching `ORDER BY` |
| Sort/filter entire set in browser (current mock) | O(n) per interaction, all 1M in memory | **Remove** when API is connected |
| Jump to page 99,999 | OFFSET cost grows | Keyset pagination for very deep pages (future optimization) |

### 4.4 Client-side mock vs 1M rows

Current mock path copies and sorts the **entire** array on every request:

```typescript
let result = [...allOrders];
result = filterByDatePeriod(result, params.filter);
result = searchPurchaseOrders(result, params.search);
result.sort(...);
const data = result.slice(start, start + params.pageSize);
```

If `allOrders` were 1,000,000 rows loaded from JSON at startup:

- Initial bundle or dynamic import: **hundreds of MB** — app would not load in browser.
- Each filter/search/sort: **CPU seconds** per interaction.
- Memory: **1 GB+** for JS objects.

**Action when going to production:** delete in-browser filter/sort/slice; Oracle + API own all of that.

---

## 5. Validation When Oracle Is Connected

Validation happens at **three levels**. All must pass before the user sees data.

### 5.1 Frontend (before request)

| Check | Where | Example |
|-------|-------|---------|
| Page size in allowed set | `Pagination` + `PAGE_SIZE_OPTIONS` | Only 10, 25, 50, 100 |
| Page ≥ 1 | `setPage` / API should clamp | Reject or fix `page=0` |
| Search debounced | `SearchBar` | Reduces invalid rapid-fire calls |
| Filter enum | `FilterPopup` + `FilterPeriod` type | Only known period keys |
| Sort column | `poColumns` keys | Ignore unknown `sortBy` server-side too |

Frontend validation is **UX only** — never trust it for security.

### 5.2 Backend API (required)

| Check | Action on failure |
|-------|-------------------|
| Auth / session | `401 Unauthorized` |
| `page` integer ≥ 1 | `400 Bad Request` |
| `pageSize` in whitelist (10, 25, 50, 100) | `400` or clamp to max 100 |
| `sortBy` in allowed column list | Ignore or `400` |
| `sortOrder` `asc` \| `desc` | Default `asc` |
| `filter` in allowed enum | `400` |
| `fromDate` / `toDate` ISO dates | `400` |
| Oracle timeout / error | `502` or `503` with safe message (no stack trace to client) |

**Response shape validation** (API should always return):

```typescript
interface POListResult {
  data: PurchaseOrder[];  // length <= pageSize
  total: number;          // >= 0, integer
  page: number;           // matches request or last page
  pageSize: number;       // matches request
  totalPages: number;     // ceil(total / pageSize)
}
```

Optional: frontend runtime check after `res.json()`:

```typescript
if (!Array.isArray(body.data) || typeof body.total !== 'number') {
  throw new Error('Invalid API response shape');
}
```

### 5.3 Oracle / data layer

| Check | Purpose |
|-------|---------|
| Row types match contract | `orderValue` number, `status` in enum, dates ISO strings |
| `total` matches count query | Pagination footer shows correct “X of Y” |
| Null handling | `remarks` empty string vs null — pick one convention |
| Injection safety | Bind parameters in stored procedures — never concatenate `search` into SQL |
| Permissions | Procedure returns only rows the user may see (company, location, role) |

### 5.4 Performance validation (test checklist)

Run these after Oracle integration:

| Test | Pass criteria |
|------|----------------|
| Page 1, default filters | Response &lt; 500 ms p95; payload &lt; 10 KB |
| Page 1, `pageSize=100` | Payload &lt; 50 KB; render smooth |
| Search with 3+ characters | No full table scan in Oracle execution plan |
| `filter=this_month` | Uses date index |
| Rapid page clicks | Previous requests cancelled or ignored (`cancelled` flag in hook already handles stale responses) |
| `total` = 1,000,000 (staging data) | Still only 10–100 rows in `data`; latency stable |
| Load test 50 concurrent users | API p95 &lt; 1 s |

Tools: Oracle **AWR** / **SQL Monitor**, API logs with request duration, Chrome Network tab.

---

## 6. End-to-End Request Timeline (Example)

User opens Purchase Orders, page 1, 10 rows, 1M rows in Oracle (indexed):

```
0 ms     Page mount, usePurchaseOrders runs
0 ms     loading=true → DataTable skeleton visible
5 ms     fetch() sent to /api/purchase-orders?page=1&pageSize=10&...
45 ms    API receives request, validates params
120 ms   Oracle stored proc returns 10 rows + count
125 ms   API returns JSON (~3.5 KB)
130 ms   Browser receives response (TTFB ~125 ms)
135 ms   JSON parsed, setResult, loading=false
150 ms   Table shows 10 rows
```

User types in search (debounced):

```
0 ms     Keystroke
300 ms   Debounce fires → new fetch
300 ms   loading=true → skeleton again
550 ms   Response back (~250 ms server time)
560 ms   Table updated
```

---

## 7. Summary Table

| Question | Answer |
|----------|--------|
| Where is business logic today? | Browser mock in `purchaseOrderService.ts` |
| Where should it live with Oracle? | Oracle procedures + backend API |
| How many orders does one API call return? | **10–100** (page size), never 1,000,000 |
| Response size per call? | **~3–35 KB** typical |
| Target API latency? | **&lt; 200–500 ms** p95 for list |
| What shows while waiting? | `SkeletonRows` in `DataTable` (`loading` from `usePurchaseOrders`) |
| Can UI handle 1M total orders? | **Yes**, if every fetch is paginated server-side |
| Can UI fetch all 1M at once? | **No** — memory, network, and render will fail |
| What file to change for Oracle? | **`src/services/purchaseOrderService.ts`** only |
| How to validate integration? | Request/response contract + API auth + Oracle plans + latency tests (Section 5) |

---

## 8. Related Files

| File | Role |
|------|------|
| `src/services/purchaseOrderService.ts` | API client, `toApiParams`, `POListResult` |
| `src/hooks/usePurchaseOrders.ts` | Loading state, param orchestration |
| `src/components/DataTable.tsx` | Skeleton loader, renders one page |
| `src/components/SearchBar.tsx` | 300 ms debounce |
| `src/constants/pageSizeOptions.ts` | Max 100 rows per request |
| `src/types/PurchaseOrder.ts` | Row and param types |
| `docs/ARCHITECTURE.md` | UI architecture and component matrix |

---

*Last updated for PO module listing scope — production Oracle backend assumed but not yet implemented in this repository.*
