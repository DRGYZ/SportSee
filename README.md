# SportSee

SportSee is a profile dashboard project with:
- a backend micro API (Express) on port `3000`
- a frontend dashboard (React + Recharts) on port `5173`

The frontend currently targets desktop layout only (`>= 1024x780`).

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn

## Backend setup (repo root)

From `SportSee/`:

```bash
npm install
npm run dev
```

Backend runs on: `http://localhost:3000`

## Frontend setup (`frontend/`)

From `SportSee/frontend`:

```bash
npm install
npm run dev
```

Frontend runs on: `http://127.0.0.1:5173`

## Frontend environment variables

Defined in `frontend/.env`:

- `VITE_DATA_SOURCE=mock|api` (default: `mock`)
- `VITE_API_BASE_URL=http://localhost:3000`
- `VITE_DEBUG=true|false` (default: `false`)

If you set `VITE_DATA_SOURCE=api`, make sure backend is running on port `3000`.

## Test users

Only two mocked users are available:
- `/user/12`
- `/user/18`

In frontend routes:
- `http://127.0.0.1:5173/user/12`
- `http://127.0.0.1:5173/user/18`

In backend endpoints:
- `http://localhost:3000/user/12`
- `http://localhost:3000/user/18`
