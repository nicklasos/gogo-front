# Gogo Front – Project Memory

## Rules
- No obvious or redundant comments.
- **Do not start the dev server** — the user runs it at http://localhost:5173.
- Prefer `data-testid` / `id` for interactive elements (E2E and MCP).

## Role
Admin UI starter for the **gogo** Go API. React SPA with Ant Design, i18n, React Router, Zustand (`authStore`).

## Stack
- React 19, Vite, Ant Design, JavaScript (no TypeScript)
- react-router-dom, i18next, zustand
- Native `fetch` via `utils/apiClient.js` (no axios)
- Unit: Node `node:test` | E2E: Playwright POM

## Structure
```
src/
  App.jsx, main.jsx
  components/     # LoginPage, ProtectedRoute, LanguageSwitcher, TopProgressBar
  pages/          # DashboardPage, ExamplesPage, ExampleEditorPage
  stores/         # authStore (persist key: gogo-auth)
  utils/          # apiClient, serverErrors, formatters, customMessage
  lib/unsavedChanges/
  locales/{en,uk}/
tests/e2e/        # specs + pages/ (POM) + helpers/db-helper.js
```

## Auth (gogo API)
- Login: `POST /api/v1/auth/login` → `{ data: { access_token, refresh_token, user } }`
- Me: `GET /api/v1/auth/me` → `{ data: user }`
- Refresh: `POST /api/v1/auth/refresh` with `{ refresh_token }`
- Logout: `POST /api/v1/auth/logout` (revokes refresh tokens)
- No RBAC: `ProtectedRoute` is auth-only

## Examples module
- List: `GET /api/v1/examples?page=&page_size=` → `{ data, pagination }`
- CRUD: POST/GET/PUT/DELETE `/api/v1/examples/:id`
- Pagination meta: `current_page`, `per_page`, `total`, `last_page`

## Test locators (required)
- Every button, input, modal, form, table needs `data-testid`
- E2E: Page Object Model in `tests/e2e/pages/`; prefer `getByTestId`
- Avoid English copy and Ant Design class names (except rare form explain errors)

## Commands
```bash
npm run dev
npm run build
npm run lint
make test-unit
make test            # Playwright (gogo --test-db on 8183 + Vite on 5174)
```

## E2E notes
- Seeds users via `tests/e2e/helpers/db-helper.js` into gogo `users` table
- `auth.setup.js` writes `tests/e2e/.auth/user.json` (gitignored)
- Requires `TEST_DATABASE_URL` in `.env` and gogo migrations applied (`make db-test-setup`)

## Don’t
- Don’t add SmartCity domain modules (cities, news, maps, etc.)
- Don’t rely on text content for primary selectors
- Don’t start `npm run dev` unless the user asks
