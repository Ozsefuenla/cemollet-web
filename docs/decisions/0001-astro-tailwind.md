# 0001. Use Astro and Tailwind CSS

Status: accepted

## Context
The site is a mostly static, content-driven website for a school. It must be cheap to host, fast, and later fed by a .NET API.

## Decision
Use Astro 4+ with static output, Tailwind CSS and TypeScript. Use minimal JS islands (Alpine.js or vanilla) for interactivity. No React unless strictly required.

## Consequences
- Static output deploys to GitHub Pages.
- Content Collections with Zod give typed content, matching the future API contracts.
- Interactive features must stay small; complex widgets require a new ADR.
