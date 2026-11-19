# Scraping and content origin

Status: Phase 3 done. Generated content is committed under `src/content/`. Re-run with `npm run scrape`.

## Source
Current site: https://www.cemollet.eu/. The source pages are ISO-8859-1 encoded.

Images are hosted at `https://cemollet.clickedu.eu/private/...` and are linked remotely, not downloaded.

## How it works
`scripts/scrape.mjs`:
- Fetches the home, etapes, serveis and activitats pages, plus the news detail pages.
- Decodes bytes as `latin1` (the cause of the `�` characters) and resolves HTML entities (`&eacute;`, `&#8217;`, ...).
- Writes JSON files under `src/content/` (replacing the previous generated files of each collection).
- Behind a corporate proxy with its own certificate, run with `NODE_OPTIONS=--use-system-ca`.

## Mapping
| Collection | Source | Result |
|---|---|---|
| news | 6 links in the home "Últimes Notícies" block | 6 files. Two use the listing teaser because the upstream detail link is broken (`#8217` in the URL, and a corrupted quote character). One has an empty body. |
| stages | etapes page, Infantil block | 1 entry |
| services | serveis page | 1 entry (Servei de secretaria) |
| activities | activitats page | 1 entry (Mostra Audiovisuals) |
| gallery | home "Un volt per l'escola" links | 14 images |
| links | home "Vincles d'interès" and "Clickedu" | 12 links |
| documents | home "Arxius d'interès" | 11 PDFs |
| events | none | empty (`events/` folder with no files) |
| pages | escola page ("Petita història" to "Arrels que..."), home legal notice block | `escola.json`, `nota-legal.json` |

`publishedAt` for stages, services and activities is the scrape date, because the site shows no date for them.

## Known gaps
- Primària and ESO stages: not present in the etapes page text. Need a source.
- Services other than Secretaria (menjador, acollida, orientació, extraescolars): menu items with no body on the serveis page.
- Escola page text and the legal notice: now in the `pages` collection (Phase 5). The legal text still refers to the previous platform and needs legal review before publication.
- Images for stages, services and activities reuse images from the home page, not section-specific photos.
