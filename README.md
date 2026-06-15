# PO Module

Purchase Order listing module with separate frontend and backend packages. **All PO data comes from Oracle** (`OV_PO_SEARCH_VIEW_YSG`).

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Requires the backend running on port 3001 (Vite dev proxy forwards `/api`).

## Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill ORACLE_USER and ORACLE_PASSWORD in .env
npm run dev
```

Health check: `GET /health` (includes `oracle.connected`, `queryStatus`, `sampleRowCount`)

Validation: `npm run validate:oracle` (writes report to `backend/reports/`)

## Oracle setup

Set in `backend/.env` (see `.env.example` — all values from env, nothing hardcoded in source):

```
ORACLE_VIEW_NAME=OV_PO_SEARCH_VIEW_YSG
ORACLE_APPLY_COMP_TXN_FILTER=false
ORACLE_POOL_MAX=50
```

Connect to VPN before starting the backend.

## Documentation

- [Oracle integration](docs/ORACLE_INTEGRATION_GUIDE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API & performance](docs/API_PERFORMANCE_AND_INTEGRATION.md)
