# Gogo Front – React Admin Starter

Admin UI starter kit. React 19, Vite, Ant Design, Zustand, i18next, Playwright POM, and `node:test` unit tests.

## Prerequisites

- Node.js 20+
- `TEST_DATABASE_URL` for E2E (same DB as gogo tests)

## Quick start

```bash
cp .env.example .env
# Point VITE_API_BASE_URL at gogo (default http://localhost:8181)
# Set TEST_DATABASE_URL to gogo_test

npm install
# Start gogo API separately (user-run): make -C ../gogo run
npm run dev   # http://localhost:5173
```

## Features

- Email/password login against gogo `/api/v1/auth/*`
- App shell: sidebar, language switcher (en/uk), logout
- **Examples** CRUD with pagination (`/api/v1/examples`)
- Unsaved-changes guard on the editor
- Unit tests (`node:test`) + Playwright E2E

## Scripts / Make

```bash
make help
make install
make lint
make test-unit      # node:test
make test           # Playwright E2E (starts gogo --test-db + Vite)
make test-e2e-headed
make playwright-browsers
```

## Env

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | gogo API origin (e.g. `http://localhost:8181`) |
| `TEST_FRONTEND_PORT` | E2E Vite port (default `5174`) |
| `TEST_BACKEND_PORT` | E2E gogo port (default `8183`) |
| `TEST_DATABASE_URL` | Postgres test DB for E2E seeding |

## Project structure

```
src/
  App.jsx                 # Shell, routes, AuthSessionGate
  components/             # LoginPage, ProtectedRoute, LanguageSwitcher
  pages/                  # Dashboard, Examples, ExampleEditor
  stores/authStore.js     # Zustand + persist (gogo-auth)
  utils/apiClient.js      # fetch + refresh-on-401
  lib/unsavedChanges/     # Dirty form navigation guard
  locales/{en,uk}/
tests/e2e/                # Playwright specs + POM + db-helper
```

## Auth contract (gogo)

Login/refresh responses use `{ data: { access_token, refresh_token, user } }`.  
`/auth/me` returns `{ data: { id, email, name } }`.

## Test locators

Add `data-testid` to every interactive control. E2E uses `page.getByTestId(...)` and Page Object Model under `tests/e2e/pages/`.

## Pairing with gogo

| Service | Dev URL |
|---------|---------|
| E2E front | http://localhost:5174 |
