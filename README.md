# PO Module

Purchase Order listing module with separate frontend and backend packages.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run preview` — preview production build

Set `VITE_USE_MOCK=true` in `.env` for offline dev (no backend). Default: calls API via Vite proxy.

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

- `DATA_SOURCE=mock` — in-memory mock data (default)
- `DATA_SOURCE=oracle` — requires Oracle credentials and procedure implementation in `purchaseOrder.service.ts`

Health check: `GET /health`

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Oracle integration](docs/ORACLE_INTEGRATION_GUIDE.md)
- [API & performance](docs/API_PERFORMANCE_AND_INTEGRATION.md)
- [i18n](docs/I18N_GUIDE.md)

Mock JSON in `frontend/src/data` and `backend/src/data` should be kept in sync until a shared package exists.
