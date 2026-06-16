# PO Module

Purchase Order listing module with separate frontend and backend packages. **All PO data comes from Oracle** (`OV_PO_SEARCH_VIEW_YSG`).

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Requires the backend running on port 3001 (Vite dev proxy forwards `/api`).

## Backend (first time)

```powershell
cd backend
npm install
npm run setup
```

`npm run setup` creates `.env` from `.env.example` **only if `.env` does not exist**. It **never overwrites** an existing file.

Open **`backend/.env`** (not `.env.example`) and set:

| Variable | Example |
|----------|---------|
| `ORACLE_HOST` | `10.44.0.102` (IP only — no `:1521`) |
| `ORACLE_PORT` | `1521` |
| `ORACLE_SERVICE` | `uatpdb.ysg.com` |
| `ORACLE_USER` | `UAT_11JLIVE` |
| `ORACLE_PASSWORD` | your password |

```powershell
npm run check:env
npm run dev
```

## Every day (after `.env` is filled once)

```powershell
cd backend
npm run dev
```

**Do not run these again** — they **delete** your user/password from `.env`:

```powershell
# WRONG — wipes credentials every time:
copy .env.example .env
cp .env.example .env
```

### Why ID/password “disappear”

You are running **`copy .env.example .env`** (or `cp`) before `npm run dev`. That replaces your filled `.env` with the empty template. **`npm run dev` does not clear `.env`.**

Moving from OneDrive to `Desktop` is fine — just fill **`Desktop\Sail HIgh\po-module\backend\.env`** once and stop using `copy .env.example .env`.

Health check: `GET /health`

Validation: `npm run validate:oracle`

Open the app at http://localhost:5173 (not port 3001).

## Real DB vs mock mode

Default development uses the **real Oracle database** through the backend. Use mock mode only when you need UI work without VPN or backend.

| Mode | `frontend/.env` | `backend/.env` | Use case |
|------|-----------------|----------------|----------|
| **Real + hybrid (recommended now)** | `VITE_MOCK_MODE=false` + `VITE_MOCK_PENDING=true` | Oracle creds + `ORACLE_VIEW_NAME` for list | Real PO list; mock supplier/item/location search, line items, save until DB delivers views/SPs |
| **Real (full Oracle)** | `VITE_MOCK_MODE=false` + `VITE_MOCK_PENDING=false` | All `ORACLE_*` keys filled | Production-like — every feature hits Oracle |
| **Mock dev** | `VITE_MOCK_MODE=true` | Not required | Frontend-only dev; mock login users on login page in dev |

**Lookups use Oracle views, not stored procedures.** Procedures (`ORACLE_PO_CREATE_SP`, etc.) are only for create/update/approve. Until the DB team sets `ORACLE_SUPPLIER_VIEW` and `ORACLE_ITEM_VIEW`, use `VITE_MOCK_PENDING=true` or full mock mode.

Copy examples once, then edit the real files (never overwrite a filled `.env`):

```powershell
copy frontend\.env.example frontend\.env
copy backend\.env.example backend\.env
```

Restart both servers after changing env vars.

### Pending Oracle integrations

Live and pending features are listed at:

- **`GET http://localhost:3001/api/status`** — machine-readable registry (env keys, source files, DB references)
- **`docs/PENDING_API_STATUS.csv`** — standup tracking sheet for the DB team

Set these in `backend/.env` when the DB team delivers names (empty = endpoint returns 501/503):

| Env key | Feature |
|---------|---------|
| `ORACLE_VIEW_NAME` | PO list + detail (**live** — `OV_PO_SEARCH_VIEW_YSG`) |
| `ORACLE_SUPPLIER_VIEW` | Supplier lookup |
| `ORACLE_ITEM_VIEW` | Item lookup |
| `ORACLE_PO_LINE_VIEW` | PO line items |
| `ORACLE_PO_CREATE_SP` | Create PO |
| `ORACLE_PO_UPDATE_SP` | Update PO |
| `ORACLE_PO_APPROVE_SP` | Approve PO |
| `ORACLE_PO_DUPLICATE_SP` | Duplicate PO (future sprint) |

Reference SQL signatures (comment-only, not executed): `backend/reference/ORACLE_DB_REFERENCE.sql`
