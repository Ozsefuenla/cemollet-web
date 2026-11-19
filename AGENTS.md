# AGENTS.md

Instructions for any AI agent or developer working on the CEM Mollet website.

## 1. Changelog-driven workflow (mandatory)

Every change goes through `CHANGELOG.md`. No exceptions.

1. **Before touching code or docs**: add an entry under `## [Unreleased]` with the prefix `[planned]`, in the right category (`Added`, `Changed`, `Fixed`, `Removed`, `Docs`, `Security`), with a short description, acceptance criteria and the affected file(s) in `docs/`.
2. **Implementation**: implement only what is listed in `[Unreleased]`. New needs are added to the changelog first, then implemented.
3. **Close**: change the prefix from `[planned]` to `[done]`, update the affected docs in `docs/`. If a decision is relevant, create an ADR in `docs/decisions/`.
4. **Release**: move `[Unreleased]` items into `## [x.y.z] - YYYY-MM-DD` following SemVer (MAJOR breaking, MINOR feature, PATCH fix).

Forbidden: changes without a prior changelog entry, skipping the `[done]` update, leaving docs out of date.

## 2. Documentation (mandatory)

- All documentation lives in `docs/`. Index: `docs/README.md`.
- Each change updates the docs it affects in the same step as the `[done]` mark.
- Architecture decisions go to `docs/decisions/NNNN-title.md` (sequential numbering, never renumber).
- Do not create other top-level `.md` files except `README.md`, `CHANGELOG.md` and `AGENTS.md`.

## 3. Architecture rules

- Content lives in `src/content/` (Astro Content Collections, JSON/MD) with Zod schemas.
- All reads go through `src/lib/data/` (`getNews()`, `getStages()`, `getEvents()`, ...). Components NEVER read content files directly.
- Types live in `src/lib/types.ts` and must mirror the future .NET API DTOs: `id`, `slug`, `title`, `summary`, `body`, `imageUrl`, `publishedAt`.
- Images are linked remotely from `https://cemollet.clickedu.eu/private/...`.
- Interactivity: minimal JS islands (Alpine.js or vanilla). No React unless strictly required.

## 4. Conventions

- UI copy and content: Catalan (`<html lang="ca">`).
- Code, identifiers, comments, commit messages, docs: English. Persona or regional style never goes into artifacts.
- Commits: Conventional Commits only (`feat:`, `fix:`, `docs:`, `chore:`...). Never add "Co-Authored-By" or any AI attribution.
- Mobile-first, WCAG AA, visible focus, Lighthouse >= 90.
- `site` and `base` in `astro.config.mjs` are set to the real repository (`Ozsefuenla/cemollet-web`). Change them only through the changelog.

## 5. Source of truth

- Functional spec: `docs/spec.md`. If the spec and the code diverge, update the spec through the changelog.
