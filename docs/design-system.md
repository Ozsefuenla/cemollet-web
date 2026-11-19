# Design system

Status: Phases 1 and 4 done. Phase 6 planned.

## Style
Colorful and friendly, aimed at families: `rounded-3xl` corners, organic background blobs, soft shadows, micro-animations on hover and scroll.

## Colors
Brand color is the burgundy of the logo, sampled from `public/logo.jpg`:
- `brand` DEFAULT / 700: `#802828`. Contrast on white: 9.33:1 (WCAG AA).
- `brand` 50 `#fdf2f2`, 600 `#9a3232`, 800 `#5f1e1e`.
- Accents (from the spec, not from the logo): `accent.yellow` `#facc15`, `accent.coral` `#fb7185`, `accent.green` `#4ade80`, `accent.sky` `#38bdf8`.

Tokens are defined in `tailwind.config.mjs`.

## Typography
- Titles: Baloo 2 (`font-display`), fallback Fredoka.
- Body: Nunito (`font-body`).

## Accessibility and performance
- WCAG AA contrast, `alt` on all images, visible focus (`focus-visible` ring).
- Mobile-first. Breakpoints to check in Phase 6: 360px, 768px, 1280px.
- Lighthouse >= 90 (to be measured in Phase 6).
- Interactivity is vanilla JS: mobile menu toggle and gallery lightbox (`<dialog>`). The "Més" dropdown uses `<details>`, no JS.

## Components (`src/components/`)
| Component | Purpose |
|---|---|
| TopBar | Phone, email, social links |
| Header | Sticky header, main nav, "Més" dropdown, "Portes obertes" button, mobile menu |
| Footer | Contact, address, embedded map, Clickedu access, legal notice link |
| Hero | Title, text, CTAs, image |
| Card | Icon card for the three pillars |
| StageCard | Stage with badge and link |
| NewsCard | News teaser with date |
| Gallery | Grid with lightbox (keyboard arrows, prev/next/close) |
| CTA | Burgundy call-to-action banner |

Not yet implemented: Hero carousel and Calendar widget (see `CHANGELOG.md`).

## Layout and routing
`BaseLayout` renders TopBar, Header, `<main>` and Footer. Internal links go through `src/lib/url.ts`, which adds the Astro `base` (GitHub Pages sub-path).

## QA results (Phase 6, in progress)
Measured on the production build served locally, Chrome headless.

| Check | Result |
|---|---|
| Horizontal overflow, 10 routes x 360/768/1280 px | None |
| axe WCAG 2 A/AA, serious and critical, at 360 px | None |
| Lighthouse home (perf / a11y / best practices / SEO) | 80 / 94 / 96 / 100 |
| Lighthouse contacte | 100 / 96 / 96 / 100 |

Open: home performance is below the 90 target. The LCP element is the hero image (407 KB, hosted on the school server). Rules: `prefers-reduced-motion` is not yet handled for hover animations; add it in Phase 7 if needed.
