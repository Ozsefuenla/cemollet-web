# API migration

Status: planned for the future (out of current scope). Phase 7 documents the path only.

## Principle
Components and pages never read content directly. They import from `src/lib/data/index.ts`, and that file is the only place that knows where content comes from. Migrating to the .NET API replaces the implementations there.

## Steps
1. **Contracts**: keep `src/lib/types.ts` (`ContentBase`, `GalleryImage`, `LinkDto`, `DocumentDto`) identical to the API DTOs. Update `docs/content-model.md` if the contract changes.
2. **Data layer**: replace the `getCollection` / `getEntry` calls in `src/lib/data/index.ts` with `fetch` calls to the API, executed at build time (static output, so no runtime API calls).
3. **Schemas**: once the API is the source, the Zod schemas in `src/content/config.ts` and the scraper can be retired.
4. **Rebuild trigger**: the backoffice fires a webhook that starts `.github/workflows/deploy.yml` (add a `repository_dispatch` trigger) so the static site rebuilds when content changes.
5. **Images**: keep remote URLs. If the API serves images, `imageUrl` points to the API storage.

## What does not change
Pages, components, `url.ts`, the QA checks and the deployment workflow stay as they are.

## Open decisions (need an ADR when taken)
- Build-time fetch (current plan) versus client-side fetch for lists that change often.
- Authentication for the API read endpoints, if content is not public.
