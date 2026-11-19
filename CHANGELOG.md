# Changelog

All notable changes to this project are documented in this file.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org/).

Workflow: every change starts as a `[planned]` entry under `[Unreleased]` before any implementation. See `AGENTS.md`.

## [Unreleased]

### Changed
- [done] Brand color from logo: `brand` palette now uses the logo burgundy `#802828` (sampled from the logo), logo moved to `public/logo.jpg`. Docs: `docs/design-system.md`.
  - Acceptance met: `brand.700` = `#802828`, contrast on white 9.33:1 (AA); logo served from `public/`.

### Added
- [done] Phase 1: project base (Astro 4+, Tailwind CSS 3, TypeScript, design tokens, Baloo 2 / Nunito fonts, `<html lang="ca">`). Docs: `docs/architecture.md`, `docs/design-system.md`.
  - Acceptance: `npm run build` passes; `<html lang="ca">`; tokens in `tailwind.config.mjs`; `.gitignore` present. Brand color is a placeholder pending logo extraction.
- [done] Phase 2: contracts and data layer (`src/lib/types.ts`, Zod schemas in `src/content/config.ts`, `src/lib/data/index.ts`). Docs: `docs/content-model.md`, `docs/architecture.md`.
  - Acceptance met: DTOs mirror the API fields; Zod validation at build time; read API implemented; seed entry per collection; `npm run build` and `tsc --noEmit` pass; no component reads `src/content` directly.
  - Note: Astro 4 requires each collection in its own subfolder (gallery, links and documents are in `src/content/<name>/`).
- [done] Phase 3: scrape content from cemollet.eu, fix character encoding (`�`), store as JSON in `src/content/`. Docs: `docs/scraping.md`.
  - Result: `scripts/scrape.mjs` (`npm run scrape`) generates 6 news, 1 stage (Infantil), 1 service (Secretaria), 1 activity (Mostra Audiovisuals), 14 gallery images, 12 links, 11 documents. Source is ISO-8859-1, decoded as latin1 with HTML entities resolved. Build passes.
  - Open gaps (not in acceptance): Primària and ESO stages, services other than Secretaria, escola page text and legal notice text (no content collection for them yet, see Phase 5), two news items with broken upstream links ("Visitem l'univers del Xesco Boix" and "Els Trencanous") use the listing teaser (one has an empty body).
- [done] Phase 4: components (TopBar, Header with "Més" dropdown and mobile menu, Footer with map, Hero, Card, NewsCard, StageCard, Gallery with lightbox, CTA). Docs: `docs/design-system.md`.
  - Result: all components in `src/components/`, consumed by `BaseLayout` and the home page with real data from `lib/data`. Build and `tsc --noEmit` pass.
  - Deferred (not in this phase): Hero carousel (needs the 7 header images from the current site), Calendar widget (out of scope in spec), Cloe video block and events block (Phase 5 home sections).
- [planned] Phase 4 follow-up: Hero carousel with the 7 header images and the Calendar widget decision. Docs: `docs/design-system.md`.
- [done] Phase 5: pages (escola, etapes and `etapes/[slug]`, serveis, activitats, noticies index and `[slug]`, contacte with mock form and RGPD checkbox, nota-legal). Adds a `pages` content collection (escola, nota-legal) filled by the scraper. Fixes base-path links in Hero and home. Header "Portes obertes" points to `/contacte` until a dedicated page is specified. Docs: `docs/spec.md`, `docs/content-model.md`, `docs/scraping.md`.
  - Result: 10 static routes build (`npm run build`, `tsc --noEmit` pass). Contacte form blocks submit on invalid input and shows a mockup notice; RGPD checkbox required.
  - Known gaps: noticies listing is not paginated (only 6 items exist); Primària and ESO stage pages depend on a source not yet available; Portes obertes page not specified.
- [planned] Phase 6: QA (responsive 360/768/1280, WCAG AA, Lighthouse >= 90, clean `npm run build`). Docs: `docs/design-system.md`.
  - Acceptance: no horizontal overflow at 360, 768 and 1280 px on all 10 routes; axe reports no serious violations; Lighthouse performance, accessibility, best practices and SEO >= 90 on home and contacte; `npm run build` clean.
  - Progress: met: no overflow on 10 routes x 3 widths; axe serious/critical clean at 360 px (fixed: CTA heading contrast, unnamed news links, long URL overflow in activity text); build clean. Contacte Lighthouse 100/96/96/100. Not met: home Lighthouse performance 80 (target 90). Cause: LCP hero image is a 407 KB file on the school server (`s3.eu-west-1...web_escola_home`), which we do not control. Font CSS was made non-blocking (saved ~1.8 s render-blocking).
  - Remaining: reduce the hero image (smaller variant from the source or a mirrored resized copy) and re-measure. Accessibility home is 94, above target.
- [done] Phase 7: GitHub Pages deployment with `withastro/action@v3` workflow (`.github/workflows/deploy.yml`) and README with run/deploy/scrape/migration instructions. Docs: `docs/deployment.md`, `docs/api-migration.md`, `README.md`.
  - Result: build and deploy jobs on push to `main`. Placeholders for `site`/`base` remain until the repository is known. Build passes.
  - Not verified: the first real deployment (needs the repository, Pages enabled with GitHub Actions as source, and real `site`/`base`).
- [done] Replace placeholders `site` and `base` in `astro.config.mjs` with the real repository (`https://ozsefuenla.github.io` and `/cemollet-web`). Docs: `docs/deployment.md`.
  - Result: `site` and `base` set for `Ozsefuenla/cemollet-web`. Repository: https://github.com/Ozsefuenla/cemollet-web.

## [0.1.0] - 2026-11-19

### Added
- [done] Governance: `AGENTS.md` with the changelog-driven workflow, architecture rules and conventions.
- [done] `docs/` folder with index, spec, architecture, content model, design system, scraping, deployment, API migration and ADRs 0001 and 0002.
- [done] Moved the original spec from `MOCKUP_CEMOLLET.md` to `docs/spec.md` and removed the root file.
