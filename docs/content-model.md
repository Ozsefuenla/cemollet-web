# Content model

Status: Phase 2 done (contracts, schemas and data layer). Seed content only; real content arrives in Phase 3.

## Storage layout
Astro 4 requires every collection to live in its own subdirectory.

| Collection | Location | Entry id | Shape |
|---|---|---|---|
| news | `src/content/news/*.json` | file name | one `ContentBase` per file |
| stages | `src/content/stages/*.json` | file name | one `ContentBase` per file |
| services | `src/content/services/*.json` | file name | one `ContentBase` per file |
| activities | `src/content/activities/*.json` | file name | one `ContentBase` per file |
| events | `src/content/events/*.json` | file name | one `ContentBase` per file (folder not created yet, returns `[]`) |
| pages | `src/content/pages/*.json` | file name | one `ContentBase` per file: `escola`, `nota-legal` (free-text pages) |
| gallery | `src/content/gallery/gallery.json` | `gallery` | `{ images: [{ id, imageUrl, alt }] }` |
| links | `src/content/links/links.json` | `links` | `{ items: [{ id, label, url }] }` |
| documents | `src/content/documents/documents.json` | `documents` | `{ items: [{ id, title, url }] }` |

## DTO contract (`src/lib/types.ts`)
`ContentBase` mirrors the future .NET API:
- `id`: string
- `slug`: string
- `title`: string
- `summary`: string
- `body`: string
- `imageUrl`: string (remote URL)
- `publishedAt`: `YYYY-MM-DD`

`NewsDto`, `StageDto`, `ServiceDto`, `ActivityDto` and `EventDto` are aliases of `ContentBase`. `GalleryImage`, `LinkDto` and `DocumentDto` are the single-file item shapes.

## Validation (`src/content/config.ts`)
Zod schemas (Zod 3 via `astro:content`). A malformed file fails the build. `publishedAt` must match `YYYY-MM-DD`, and `imageUrl` and link URLs must be valid URLs.

## Read API (`src/lib/data/index.ts`)
`getNews()`, `getNewsBySlug(slug)`, `getStages()`, `getServices()`, `getActivities()`, `getEvents()`, `getPage(slug)`, `getGallery()`, `getLinks()`, `getDocuments()`. Lists are sorted by `publishedAt` descending. Only this file imports `astro:content`.
