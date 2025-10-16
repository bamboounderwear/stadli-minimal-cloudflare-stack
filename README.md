# Stadli Minimal Cloudflare Stack

Empty-but-configured starter you can push to GitHub and deploy with **deploy.workers.cloudflare.com**.

## What you get

- **ESM Worker (TypeScript)** with custom file/folder routing
- **HTML-first UI** (no JS build, minimal CSS), server-rendered
- **Static assets** served from `public/` via **Workers Static Assets**
- **State & Data**: D1 (relational), KV (sessions/config), R2 (uploads/assets), Workers AI (AI), Analytics Engine (events)
- **Security**: CSP, CORS, secure cookies
- **Observability**: Analytics Engine write on each request
- **Zero/low config**: Just update the resource IDs once in `wrangler.jsonc` (or bind them in the dashboard)

---

## Quickstart

```bash
# 1) Install deps (types, prettier)
pnpm i || npm i

# 2) Run locally
npx wrangler dev

# 3) Deploy
npx wrangler deploy
```

> **Note**: Replace placeholder IDs in `wrangler.jsonc` for D1, KV, and R2 or create them via dashboard and commit changes.

---

## Bindings

- D1: `DB`
- KV: `SESSIONS`, `CONFIG`
- R2: `BUCKET`
- Workers AI: `AI`
- Analytics Engine: `LOGS`
- Static Assets: `ASSETS` (serves `/public`)

---

## D1 Migrations

```bash
npx wrangler d1 migrations apply DB --local --remote
```

---

## Endpoints (sample)

- `GET /home` UI
- `GET /web` UI
- `GET /crm` UI
- `GET /campaigns` UI
- `GET /analytics` UI
- `GET /commerce` UI
- `GET /settings` UI
- `GET /api/health` - health & bindings check
- `POST /api/ai/echo` - Workers AI demo `{ "prompt": "Hello" }`

### curl tests

```bash
curl -i https://<your-domain>/api/health

curl -s https://<your-domain>/home | head

curl -s -X POST https://<your-domain>/api/ai/echo \
  -H "content-type: application/json" \
  -d '{"prompt":"Summarize Stadli in one line."}'
```

---

## Security

- Strict **CSP**, **Referrer-Policy**, **X-Content-Type-Options**, **X-Frame-Options**
- **CORS** defaults to echo `Origin` on requests you make from your own sites
- KV-backed **secure session cookie**

---

## File layout

```
/src
  /routes
    pages.ts        # renders main admin sections
  /utils
    html.ts         # tiny HTML helpers (layout, cards, grid)
    security.ts     # CSP/CORS
    session.ts      # KV session helper
  index.ts          # worker entry + router
/public             # static assets (served by ASSETS)
/d1/migrations      # initial schema
/types/env.d.ts     # Env bindings
wrangler.jsonc
```

---

## Notes on UI Authoring

This boilerplate keeps templates in TypeScript using tiny helpers to avoid a build step. If you prefer **WebC/Eta/Nunjucks**, you can:
- Add the engine as a dependency
- Render strings in handlers (no FS needed)
- Keep components HTML-first

PRs welcome to swap renderers.
