# Architecture

Status: Phases 1 to 5 done, Phase 7 done. Phase 6 partially done (home performance open).

## Data layer (Phase 2)
- `src/lib/types.ts`: DTOs (API contract).
- `src/content/config.ts`: Zod schemas and collections.
- `src/lib/data/index.ts`: the only module that imports `astro:content`. Pages and components import from here.

## Base files
- `astro.config.mjs`: static output, Tailwind integration, `site`/`base` placeholders.
- `tailwind.config.mjs`: brand and accent color tokens, font families, `blob` radius.
- `src/styles/global.css`: Tailwind layers, focus-visible style, base typography.
- `src/layouts/BaseLayout.astro`: `<html lang="ca">`, skip link, `<main>`.
- `tsconfig.json`: Astro strict preset.

## Stack
- Astro 4+ (static output), Tailwind CSS, TypeScript.
- Minimal JS islands (Alpine.js or vanilla) for mobile menu, carousel and lightbox.
- Deployed to GitHub Pages via GitHub Actions.

## Layers
```
Pages / Layouts / Components   (presentation, never read content files)
        |
src/lib/data/                  (single read API: getNews(), getStages(), ...)
        |
src/content/                   (Content Collections: JSON/MD + Zod schemas)
```

Future: the `src/lib/data/` implementation switches to a .NET API fetch. Components do not change. See `api-migration.md`.

## Folder structure
```
src/
  components/   Header, Footer, Hero, Card, NewsCard, StageCard, Gallery, CTA, Calendar
  layouts/      BaseLayout.astro
  pages/        index, escola, etapes, serveis, activitats, noticies/[slug], noticies/index, contacte, nota-legal
  content/      news/, stages/, services/, activities/, gallery.json, links.json, documents.json
  lib/data/     data access layer
  lib/types.ts  DTO contracts
public/         logo, favicon
```
