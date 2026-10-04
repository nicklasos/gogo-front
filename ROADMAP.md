# Roadmap

What is worth adding to the skeleton next, in priority order. Each item names the project it can be ported from. Paths are relative to the directory that holds `gogo-front`.

## P1

| Item | Why | Port from |
|---|---|---|
| Error boundary + a real 404 page | A render error blanks the app; unknown URLs silently redirect home | `shared/components/PageState.tsx` already has the visuals |
| Lazy routes | One bundle of ~1 MB today; `React.lazy` per feature page in `app/router.tsx` | — |
| CI | Typecheck, lint, unit and Playwright on every push | — |
| Generated API types | Types are hand-copied from Go structs; generate them from gogo's OpenAPI output | — |
| Page-error collector in E2E | Fails a test on console errors and uncaught exceptions | `smartcity-backoffice-front/tests/e2e/helpers/pageErrors.js` |

## P2

| Item | Why | Port from |
|---|---|---|
| Image upload kit | Upload hook, upload component, optional crop modal; do it after the gogo uploads hardening | `smartcity-backoffice-front/src/hooks/useImageUpload.js`, `src/components/ImageUpload.jsx`, `ImageCropModal.jsx` |
| Debounced server-side search | `FilterBar` exists, but nothing feeds it into query params | `smartcity-backoffice-front/src/hooks/useDebouncedCallback.js` |
| Theme tokens + dark mode | `app/theme.ts` is the single place; add an algorithm switch | `sytno/frontend/src/app/theme.ts` for a full token set |
| Dockerfile + nginx | Deployable image with SPA fallback and an API proxy | `sytno/frontend/Dockerfile`, `nginx.conf` |
| Rate-limit UX on login | Show "try again in N seconds" from `Retry-After`; pairs with the gogo rate limiter | `smartcity-backoffice-front/src/stores/authStore.js` |
| Role editing | Roles are fixed when an account is created; needs the matching gogo endpoint | — |

## P3

| Item | Why | Port from |
|---|---|---|
| Client error reporting | Posts front-end errors to the API; pairs with the gogo client-errors endpoint | `smartcity-backoffice-front/src/utils/reportClientError.js` |
| Audit log modal | Who changed what; pairs with gogo audit logs | `smartcity-backoffice-front/src/components/AuditLogModal.jsx` |

## Left out on purpose

- **Component tests**: a second test stack (vitest + testing-library) for little gain over `node:test` plus Playwright.
- **Generic CRUD hook factory**: hooks are about ten lines per entity and a factory hides the query keys. Revisit after three identical modules.
- **Per-module permissions**: roles are enough for a skeleton.
