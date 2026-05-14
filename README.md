# TappyPay Client Portal

Standalone Next.js app for the **client transaction analytics** dashboard (mock data). It mirrors the UI built in `pp-fe` and uses the **same core frontend versions** as `pp-fe` (see `package.json`: Next 15.3.8, React 19, Chart.js 4.5, etc.).

## Routes

- `/` — Analytics dashboard  
- `/login` — Sign-in shell (placeholders until auth is implemented)

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
