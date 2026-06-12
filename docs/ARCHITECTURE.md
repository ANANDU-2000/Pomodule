# PO Module — Architecture Documentation

## Repository Layout

```
po-module/
├── frontend/          # React + Vite SPA
│   └── src/
│       ├── i18n/      # en.json, th.json (bundled at build time)
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── ...
├── backend/           # Express + oracledb API layer
│   └── src/
│       ├── config/    # env validation, connection pool
│       ├── routes/
│       ├── controllers/
│       ├── services/  # Oracle procedure callers (PLACEHOLDER stubs)
│       └── middleware/
└── docs/
```

## Architecture Summary

The Purchase Order listing page follows a layered architecture with clear frontend/backend separation.

- **Frontend:** UI components are configuration-driven and i18n-ready via `TranslationMap` props. Business logic (filter, search, sort, pagination) lives in the service layer, orchestrated by `usePurchaseOrders`.
- **Backend:** Express HTTP layer validates requests, manages Oracle connection pool, and delegates to stored procedure callers in `purchaseOrder.service.ts`.

```
┌─────────────────────────────────────────────────────────┐
│  App Shell (SideMenu + Content Area + useLanguage)      │
├─────────────────────────────────────────────────────────┤
│  PurchaseOrderListPage                                  │
│    ├── PageHeader (Filter + Search + LanguageSwitcher)  │
│    ├── DataTable (full-height, compact rows)            │
│    └── Pagination (page size selector)                  │
├─────────────────────────────────────────────────────────┤
│  usePurchaseOrders (hook)                               │
├─────────────────────────────────────────────────────────┤
│  purchaseOrderService → GET /api/purchase-orders        │
│                      → backend mock repo or Oracle view │
└─────────────────────────────────────────────────────────┘
```

## i18n Layer

- `useLanguage` hook loads `en.json` / `th.json` as static modules
- Language preference persisted in `localStorage` key `erp.language`
- All user-visible strings flow through `t: TranslationMap` props
- See [I18N_GUIDE.md](./I18N_GUIDE.md) for adding strings or languages

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Focus search bar |
| `Ctrl+B` | Toggle sidebar (state persisted in `localStorage`) |
| `Alt+F` | Open filter dropdown |
| `Esc` | Close filter dropdown |

Defined in `frontend/src/constants/keyboardShortcuts.ts`, wired via `useKeyboardShortcuts`.

## Visual Design

- **Sidebar:** Light blue (`#DBEAFE`) to white palette; centered icons in collapsed (56px) and expanded (220px) states
- **Palette:** Blue-white theme in `frontend/src/styles/tokens.css`
- **Shared styles:** `frontend/src/styles/components.css` (single import via `index.css`)
- **Auto page size:** `useViewportPageSize` + ResizeObserver fills viewport with max rows (10–100)

## API Integration Contract

### Listing

```
GET /api/purchase-orders
  ?page=1&pageSize=10&search=abc&filter=this_month
  &sortBy=documentDate&sortOrder=desc
```

- Frontend sends `filter` enum only — no `fromDate` / `toDate` in the request.
- Backend `resolveFilterDates(filter)` in `backend/src/utils/dateFilter.ts` computes dates for mock filtering and Oracle `P_FROM_DATE` / `P_TO_DATE`.
- Frontend uses `sortDirection` internally; `toApiParams()` maps to `sortOrder` for the API.

Response shape (`POListResult`):

```json
{
  "data": [],
  "total": 150,
  "page": 1,
  "pageSize": 10,
  "totalPages": 15
}
```

### View / Edit (stubs)

```
GET /api/purchase-orders/:id
PUT /api/purchase-orders/:id
```

See [ORACLE_INTEGRATION_GUIDE.md](./ORACLE_INTEGRATION_GUIDE.md) for procedure adoption steps.

## Oracle Integration Plan

When Oracle stored procedures are ready:

1. Fill in PLACEHOLDER comments in `backend/src/utils/oracleParams.ts` and `backend/src/services/purchaseOrder.service.ts`
2. Set `DATA_SOURCE=oracle` in `backend/.env`
3. Frontend keeps calling `/api` — no service-layer changes needed for listing

No changes required to hooks, pages, or components for listing.

## Component Responsibility Matrix

| Component | Responsibility | Reuse Level |
|-----------|----------------|-------------|
| `SideMenu` | Light nav shell, collapse/expand, i18n labels | High |
| `LanguageSwitcher` | EN/TH toggle in page header | High |
| `useLanguage` | Translation state + localStorage persistence | High |
| `PageHeader` | Title + toolbar (filter, search, actions, language) | High |
| `DataTable` | Config-driven grid, i18n status labels, `React.memo` | High |
| `Pagination` | Page controls, i18n labels, page size dropdown | High |
| `usePurchaseOrders` | List state, AbortController fetch guard | Medium |
| `useSidebarState` | Persist sidebar collapse in `localStorage` | High |

## Performance Notes

| Issue | Mitigation |
|-------|------------|
| React StrictMode double effects (dev) | `AbortController` in `usePurchaseOrders` |
| Column/filter recreation on render | `useMemo(() => getPoColumns(t), [t])` in list page |
| Language switch jank on large tables | `startTransition` in `setLang` |
| Mock fetch cancellation | `fetchPurchaseOrders(params, signal)` respects `AbortSignal` |
| Client-side mock at scale | Replace with server-side Oracle pagination via API |

See also [API_PERFORMANCE_AND_INTEGRATION.md](./API_PERFORMANCE_AND_INTEGRATION.md).

## Future Scalability

- **React Router** can wire View/Edit to `GET/PUT` APIs (currently `window.open` stubs)
- **Virtual scrolling** can be added to DataTable if needed
- **Role permissions** gate action buttons via `getPoListPageActions(t)` filtered against `MOCK_USER_PERMISSIONS`
