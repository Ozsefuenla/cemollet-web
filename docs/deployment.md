# Deployment

Status: Phase 7 done (workflow and docs). Real repository values pending.

## Target
GitHub Pages, built and deployed by GitHub Actions through `.github/workflows/deploy.yml`:
1. `withastro/action@v3` installs dependencies, runs `astro build` and uploads the `dist/` artifact.
2. `actions/deploy-pages@v4` publishes it. Runs only after a successful build.

Triggers: push to `main`, or manual `workflow_dispatch`.

## Repository
- Repository: https://github.com/Ozsefuenla/cemollet-web
- Site URL: https://ozsefuenla.github.io/cemollet-web/

## One-time repository setup
1. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. `site` and `base` in `astro.config.mjs` are already set to the values above.

## Verification
- Production: https://ozsefuenla.github.io/cemollet-web/ returns 200, and internal routes and assets resolve under `/cemollet-web/`.
- Troubleshooting: if `actions/deploy-pages` fails, check Settings → Pages → Source is **GitHub Actions**.
- Known QA gap: home Lighthouse performance is 80 (target 90), limited by the hero image hosted on the school server. See `docs/design-system.md`.
