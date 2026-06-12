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

Health check: `GET /health` (includes `oracleConnected`)

## Oracle setup

Set in `backend/.env`:

```
ORACLE_HOST=10.44.0.102
ORACLE_PORT=1521
ORACLE_SERVICE=uatpdb.ysg.com
ORACLE_USER=<your-user>
ORACLE_PASSWORD=<your-password>
ORACLE_COMP_CODE=YSG
ORACLE_TXN_CODE=PO
```

Connect to VPN before starting the backend.

## Documentation

- [Oracle integration](docs/ORACLE_INTEGRATION_GUIDE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API & performance](docs/API_PERFORMANCE_AND_INTEGRATION.md)
