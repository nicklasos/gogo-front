# Gogo Front – Project Memory

## Rules
- No obvious or redundant comments.
- **Do not start the dev server** — the user runs it at http://localhost:5173.
- Every interactive element gets a `data-testid` (see Test locators).
- Finish with `make test` (typecheck, lint, unit, E2E) and fix what fails.

## Role
Admin UI starter for the **gogo** Go API (`../gogo`). A new project is a copy of this one plus feature folders.

## Stack
- React 19, Vite, TypeScript (strict), Ant Design 5
- TanStack Query for server state, zustand only for the auth session
- react-router-dom (declarative `<Routes>`), i18next (en, uk)
- Native `fetch` through `src/api/client.ts` (no axios)
- Unit: `node:test` through `tsx` | E2E: Playwright with page objects, in TypeScript

## Structure
```
src/
  main.tsx  index.css  vite-env.d.ts
  app/       App, providers, queryClient, router, theme, i18n
  api/       client, errors, types, queryKeys, url
  auth/      authStore, roles, guards, LoginPage, RoleTags
  layout/    AppShell, nav (menu registry), navMatch
  shared/    components/, hooks/, utils/, lib/unsavedChanges/
  features/  <module>/{types,api,hooks}.ts + pages/ (+ components/)
  locales/{en,uk}/translation.json
tests/e2e/   specs, pages/ (page objects), helpers/
```
Import with the `@/` alias. A feature imports from `api`, `auth`, `layout` and `shared`, never from another feature.

## Adding a module
1. `features/<module>/types.ts` — entity and request types, hand-written from the backend module's `types.go` (snake_case fields, as in the JSON).
2. `features/<module>/api.ts` — an `xApi` object of calls built on `api` from `@/api/client`.
3. `features/<module>/hooks.ts` — `useX` queries, `useSaveX({ id?, body })`, `useDeleteX`. Mutations invalidate a key prefix from `qk`.
4. Add the keys to `api/queryKeys.ts`.
5. `features/<module>/pages/*.tsx` — pages call hooks only, never `api` directly.
6. Add the route to `app/router.tsx` and the menu entry to `layout/nav.tsx`.
7. Add locale keys to both `en` and `uk`.

`features/examples` is the reference for a paginated list plus a full-page editor; `features/users` for a table with modal forms.

## API client
- `api.get/post/put/patch/del<T>()` return the response's `data` field.
- `api.getPage<T>()` returns `{ data, pagination }` for paginated lists.
- A non-2xx response throws `ApiError` (`status`, `errorKey`, `message`, `fieldErrors`).
- A 401 triggers one shared token refresh and one retry. `skipAuthRefresh` turns that off (used by the auth calls).
- `client.ts` never imports the auth store; the store registers itself with `bindAuth`.

## Errors
- Queries and mutations show a toast from the global handler in `app/queryClient.ts`. Pass `meta: { silent: true }` when the page shows the error itself.
- The backend sends `error_key`; `shared/utils/serverErrors.ts` translates it through `errors.<key>` in the locales. Add a locale entry for every new backend key.
- Validation errors arrive as `errors: { field: [keys] }`. Put them on the form with `splitFieldErrors(t, error, FIELDS)` + `form.setFields(...)`.

## Pagination
`usePageParams()` keeps `page` / `page_size` in the URL; `useTablePagination(paging, query.data)` turns the response into the `pagination` prop of `ResponsiveTable`. Without that prop `ResponsiveTable` pages in the browser.

## Roles
- `super-admin`, `admin`, `user` (`auth/roles.ts`). `hasAnyRole` lets a super admin through everything, the same as the backend.
- Routes: wrap in `<RequireRole roles={[...]}>` or `<RequireSuperAdmin>`; both render `<Forbidden />`.
- Menus: `MAIN_NAV` (left) and `ADMIN_NAV` (right, super admins only) in `layout/nav.tsx`, each item with `roles`.
- Guards only hide UI. The backend enforces access.
- User pages: `/admin/super-admins` and `/admin/admins` (super admins), `/users` (admins and super admins). All three use `features/users/components/UserManagement.tsx`.

## Styling
Use AntD components and tokens (`theme.useToken()`); no literal colours or ad-hoc CSS. Branding lives in `app/theme.ts`. Page skeleton: `PageStack` > `Card` > `PageHeader` + content.

## Test locators (required)
- Naming: `<entity>-<element>[-<id>]`, for example `add-user-button`, `user-email-input`, `edit-example-button-12`, `users-table`.
- AntD `Result` and `Modal` do not give the test id a visible box: wrap `Result` in a `div`, and assert on a control inside a modal.
- E2E: page objects in `tests/e2e/pages/`, `getByTestId` first. Table rows: `tr[data-row-key]`. Field errors: `aria-invalid="true"` on the input.
- No assertions on copy or on Ant Design class names.

## Commands
```bash
make typecheck
make lint         # typecheck + eslint
make test-unit    # node:test
make test-e2e     # Playwright: starts gogo --test-db on 8184 and Vite on 5175
make test         # all of the above
make build
```

## E2E notes
- `chromium` project: specs that share one signed-in plain user (`auth.setup.ts` writes `.auth/user.json`).
- `chromium-own-session` project: specs that sign in themselves with `loginAs(page, role)`.
- A new spec file must be added to a `testMatch` in `playwright.config.ts`.
- Users are seeded straight into the test database (`helpers/db-helper.ts`); emails start with `e2e-` so cleanup finds them. Use `uniqueEmail()` for users created through the UI.
- Requires `TEST_DATABASE_URL` (database name ending in `_test`) in `.env`.

## Don’t
- Don’t add project domain modules to this skeleton.
- Don’t call `fetch` or `api` from a page; go through `features/<module>/hooks.ts`.
- Don’t start `npm run dev` unless the user asks.
