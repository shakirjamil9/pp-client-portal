# TappyPay Client Portal

Standalone Next.js app for the **client transaction analytics** dashboard (mock data). It mirrors the UI built in `pp-fe` and uses the **same core frontend versions** as `pp-fe` (see `package.json`: Next 15.3.8, React 19, Chart.js 4.5, etc.).

## Routes

- `/` — Analytics dashboard (requires sign-in; JWT in `localStorage`)  
- `/login` — Sign in (`clientId`, `userId`, `password`)

## Backend / env

Create `.env.local` from `.env.example`:

- **`NEXT_PUBLIC_API_URL`** — Base URL of **pp-be** (e.g. `http://localhost:8080`). Uses `POST /api/client-portal/auth/login` and `GET /api/client-portal/auth/me`.

## How portal accounts work

Portal users are **not** self-registered in this app. **pp-be** creates a `ClientPortalUser` row (status `pending`, no password) whenever a **`TransactionRequest`** is saved with that `clientId` and `userId`. You then **set a bcrypt password** on that document (e.g. admin/support process). Until a password exists, login returns a clear error. For existing Mongo data, run **`node scripts/backfill-client-portal-users.js`** once from **pp-be** (see that repo).

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Repository

This directory is its own git repository (`git init` at creation). Add a remote when you are ready to publish:

```bash
git remote add origin <your-url>
git push -u origin main
```

## Relation to `pp-fe`

You can keep developing the portal here and later embed or merge into `pp-fe`, or deploy this app separately (e.g. `portal.yourdomain.com`).
