# CEM Mollet website

Website of the Centre d'Estudis Mollet (CEM). Astro static site, deployed to GitHub Pages.

## Requirements
- Node.js 20 or newer (tested with 24).
- npm.

## Run locally
```bash
npm install
npm run dev        # http://localhost:4321/<REPO_NAME>/
```

## Build and preview
```bash
npm run build      # outputs to dist/
npm run preview
```

## Update content from cemollet.eu
```bash
npm run scrape
```
Behind a corporate proxy with its own certificate, use `NODE_OPTIONS=--use-system-ca npm run scrape`.
Generated content lives in `src/content/`. Do not edit scraped files by hand unless you intend to keep the change.

## Deployment
Pushes to `main` build and deploy through `.github/workflows/deploy.yml` (`withastro/action`).
Before the first deploy, enable GitHub Pages with "GitHub Actions" as the source. `site` and `base` are set for `Ozsefuenla/cemollet-web` in `astro.config.mjs`. Details: `docs/deployment.md`.

## Documentation
Start at `docs/README.md`. Every change goes through `CHANGELOG.md` first; see `AGENTS.md`.

## Migrating to the .NET API
Only `src/lib/data/` changes. See `docs/api-migration.md`.
