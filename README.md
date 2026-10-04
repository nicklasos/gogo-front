# Gogo Front – React Admin Starter

Admin UI starter kit for the [gogo](../gogo) Go API. React 19, Vite, TypeScript, Ant Design, TanStack Query, i18next, Playwright and `node:test`.

## Prerequisites

- Node.js 22+
- The gogo API running, with at least one user (`make -C ../gogo cli-create-user EMAIL=... PASSWORD=...` creates a super admin)
- `TEST_DATABASE_URL` for E2E (the gogo test database)

## Quick start

```bash
cp .env.example .env
npm install
npm run dev   # http://localhost:5173
```

## Features

- Email/password login with automatic token refresh
- Roles: `super-admin`, `admin`, `user`, with route guards and role-filtered menus
- User management: super admins and admins from a right-side admin menu (super admins only), users from the main menu (admins and super admins)
- Profile: name, email, language and password
- **Examples** module: server-paginated list and an editor with an unsaved-changes guard
- Typed API client: `ApiError`, server validation errors mapped onto form fields, translated error keys
- Responsive shell: tables turn into cards and the primary action becomes a bottom bar on phones
- English and Ukrainian

## Make targets

```bash
make help
make typecheck
make lint            # typecheck + eslint
make test-unit       # node:test
make test-e2e        # Playwright (starts gogo --test-db + Vite on the E2E ports)
make test            # everything
make build
make playwright-browsers
```

## Env

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | gogo API origin, e.g. `http://localhost:8181` (the client appends `/api/v1`) |
| `PORT` | Dev server port (default `5173`) |
| `TEST_FRONTEND_PORT` | E2E Vite port (default `5175`) |
| `TEST_BACKEND_PORT` | E2E gogo port (default `8184`) |
| `VITE_E2E_API_BASE_URL` | API base used by E2E helpers (default `http://localhost:8184/api/v1`) |
| `TEST_DATABASE_URL` | gogo test database for E2E seeding; the name must end in `_test` |

The E2E ports are specific to this project so Playwright never attaches to another project's servers. Change them when you copy the skeleton.

## Project structure

```
src/
  app/        App, providers, queryClient, router, theme, i18n
  api/        client (fetch + refresh-on-401), ApiError, shared types, query keys
  auth/       authStore (persist key: gogo-auth), roles, guards, LoginPage
  layout/     AppShell, nav registry
  shared/     components, hooks, utils, lib/unsavedChanges
  features/   dashboard, examples, users, account
  locales/{en,uk}/
tests/e2e/    Playwright specs, page objects, helpers
```

## Adding a module

Create `src/features/<module>/{types,api,hooks}.ts` and `pages/`, add query keys, a route and a menu entry. `CLAUDE.md` has the step-by-step list and the conventions; `features/examples` is the reference.

## API contract (gogo)

- Success: `{ "data": ... }`; paginated lists: `{ "data": [...], "pagination": { total, current_page, last_page, per_page } }`
- Errors: `{ "error_key", "message", "status" }`; validation: `{ "error_key": "validation.failed", "errors": { "field": ["validation.field.rule"] } }`
- `/auth/login` returns `{ access_token, refresh_token, user }`; `user` is `{ id, email, name, roles }`

## Roadmap

See `ROADMAP.md`.
