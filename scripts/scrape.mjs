// Scrapes cemollet.eu and writes Astro content files under src/content/.
// Run: npm run scrape   (Node 22+; behind a corporate proxy use NODE_OPTIONS=--use-system-ca)
// Source pages are ISO-8859-1; bytes are decoded as latin1 and HTML entities are resolved.
// See docs/scraping.md for the mapping and known gaps.
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'src', 'content');
const BASE = 'https://www.cemollet.eu';
const SCRAPE_DATE = '2026-11-19';

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ', middot: '·', ordf: 'ª',
  eacute: 'é', egrave: 'è', agrave: 'à', ograve: 'ò', oacute: 'ó', iacute: 'í',
  uacute: 'ú', ccedil: 'ç', ntilde: 'ñ', iuml: 'ï', uuml: 'ü', ldquo: '“',
  rdquo: '”', lsquo: '‘', rsquo: '’', ndash: '–', mdash: '—', hellip: '…',
  Eacute: 'É', Egrave: 'È', Agrave: 'À', Ograve: 'Ò', Iacute: 'Í', Oacute: 'Ó',
  Uacute: 'Ú', Ccedil: 'Ç', Ntilde: 'Ñ', Iuml: 'Ï', Uuml: 'Ü',
};

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-zA-Z]+);/g, (m, n) => NAMED[n] ?? m);

// Turns an HTML fragment into plain text paragraphs separated by blank lines.
function toText(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, '');
  return decode(text)
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

async function fetchLatin1(path) {
  const url = BASE + encodeURI(decodeURI(path.split('#')[0]));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer()).toString('latin1');
}

// Returns the HTML of the main content area of a page (section pages and news detail pages use different ids).
function mainContent(html) {
  const markers = ['id="contingut"', 'id="noticies"'].map((m) => html.indexOf(m)).filter((i) => i >= 0);
  const start = markers.length ? Math.min(...markers) : 0;
  const end = html.indexOf('id="footer', start);
  return html.slice(start, end > start ? end : undefined);
}

// Latest news links as shown on the home page (6 items).
function latestNewsLinks(homeHtml) {
  const links = [...homeHtml.matchAll(/href="(\/noticies_c\/[^"]+?-\d+\.html)"/g)].map((m) => m[1]);
  return [...new Set(links)].slice(0, 6);
}

// Parses a news detail page. Returns null when the upstream page is broken.
async function newsDetail(link) {
  try {
    const html = await fetchLatin1(link);
    const main = mainContent(html);
    const title = decode(main.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)[1]).trim();
    const [dd, mm, yyyy] = main.match(/class="data[^"]*">([^<]+)</)[1].trim().split('/').reverse();
    const imageUrl = main.match(/<img[^>]+src="([^"]+)"/)[1];
    const parts = main.match(/<div class="text c6">([\s\S]*?)<\/div>/g) ?? [];
    const body = toText(parts.at(-1) ?? '');
    return { title, publishedAt: `${yyyy}-${mm}-${dd}`, imageUrl, body };
  } catch {
    return null;
  }
}

function homeSection(html) {
  const main = mainContent(html);
  const gallery = [...html.matchAll(/class="fancyboxap[^"]*" href="([^"]+)" title="([^"]*)"/g)].map(
    (m) => ({ imageUrl: m[1], alt: decode(m[2]) }),
  );
  const docs = [...html.matchAll(/<a href="([^"]+\.pdf)" class="c3">[\s\S]*?alt="([^"]*)"/g)].map(
    (m) => ({ url: m[1], title: decode(m[2]) }),
  );
  const links = [...html.matchAll(/<a href="(https?:[^"]+)" class="c3" target="_blank">[\s\S]*?\s{2,}([^<]+?)\s*<\/span>/g)]
    .map((m) => ({ url: m[1], label: decode(m[2]).trim() }));
  return { main, gallery, docs, links };
}

async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function clearJsonDir(dir) {
  await mkdir(dir, { recursive: true });
  for (const f of await readdir(dir)) if (f.endsWith('.json')) await rm(join(dir, f));
}

async function main() {
  const home = await fetchLatin1('/');
  const etapes = await fetchLatin1('/etapes_c/index.html');
  const serveis = await fetchLatin1('/serveis_c/index.html');
  const activitats = await fetchLatin1('/activitats_c/index.html');

  // News: the 6 latest items linked from the home page. When an upstream detail page is broken,
  // the teaser from the news listing is used instead.
  const listing = await fetchLatin1('/noticies_c/index.html');
  const listingBlocks = listing.split('<div class="col-md-12 noticia">').slice(1);
  const news = [];
  const fallback = [];
  for (const link of latestNewsLinks(home)) {
    let d = await newsDetail(link);
    if (!d) {
      const block = listingBlocks.find((b) => b.includes(link.split('/').pop()));
      if (block) {
        const [dd, mm, yyyy] = block.match(/class="data[^"]*">([^<]+)</)[1].trim().split('-');
        d = {
          title: decode(block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)[1]).trim(),
          publishedAt: `${yyyy}-${mm}-${dd}`,
          imageUrl: block.match(/<img[^>]+src="([^"]+)"/)[1],
          body: toText(block.match(/<div class="text c6">([\s\S]*?)<\/div>/g)?.at(-1) ?? ''),
        };
        fallback.push(link);
      }
    }
    if (!d) continue;
    news.push({
      slug: slugify(d.title),
      title: d.title,
      summary: d.body.split('\n')[0].slice(0, 200),
      body: d.body,
      imageUrl: d.imageUrl,
      publishedAt: d.publishedAt,
    });
  }
  if (fallback.length) console.warn('News using listing teaser (broken upstream page):', fallback);

  await clearJsonDir(join(CONTENT, 'news'));
  for (const n of news) await writeJson(join(CONTENT, 'news', `${n.slug}.json`), n);

  // Stages: the Infantil block of the etapes page.
  const etapesText = toText(mainContent(etapes));
  const infantilStart = etapesText.indexOf('Educació Infantil');
  const infantilEnd = etapesText.indexOf('Informació pràctica');
  const infantilBody = etapesText.slice(infantilStart, infantilEnd > 0 ? infantilEnd : undefined);
  const infantil = {
    slug: 'infantil',
    title: 'Infantil',
    summary: infantilBody.split('\n')[0],
    body: infantilBody,
    imageUrl: home.match(/src="([^"]*portes_obertes_foto\.png)"/)[1],
    publishedAt: SCRAPE_DATE,
  };
  await clearJsonDir(join(CONTENT, 'stages'));
  await writeJson(join(CONTENT, 'stages', 'infantil.json'), infantil);

  // Services: secretaria block of the serveis page.
  const serveisText = toText(mainContent(serveis));
  const secretaria = {
    slug: 'secretaria',
    title: 'Servei de secretaria',
    summary: serveisText.split('\n')[0].slice(0, 200),
    body: serveisText,
    imageUrl: home.match(/src="([^"]*escola_edifici\.jpg)"/)?.[1] ?? infantil.imageUrl,
    publishedAt: SCRAPE_DATE,
  };
  await clearJsonDir(join(CONTENT, 'services'));
  await writeJson(join(CONTENT, 'services', 'secretaria.json'), secretaria);

  // Activities: Mostra Audiovisuals block of the activitats page.
  const activText = toText(mainContent(activitats));
  const mostra = {
    slug: 'mostra-audiovisuals',
    title: 'Mostra Audiovisuals',
    summary: activText.split('\n')[0].slice(0, 200),
    body: activText,
    imageUrl: secretaria.imageUrl,
    publishedAt: SCRAPE_DATE,
  };
  await clearJsonDir(join(CONTENT, 'activities'));
  await writeJson(join(CONTENT, 'activities', 'mostra-audiovisuals.json'), mostra);

  // Events: no source list on the site (shows "No hi ha propers esdeveniments").
  await clearJsonDir(join(CONTENT, 'events'));

  // Pages: free-text sections with no dedicated collection (escola, nota legal).
  const escolaLines = toText(mainContent(await fetchLatin1('/escola_c/index.html'))).split('\n');
  const from = escolaLines.findIndex((l) => l.startsWith('Petita'));
  const to = escolaLines.findIndex((l) => l.startsWith('Arrels que'));
  if (from < 0 || to < from) throw new Error('Escola page structure changed');
  const legalStart = home.lastIndexOf('<div', home.indexOf('id="nota-legal"'));
  const legalEnd = home.indexOf('<script', legalStart);
  const legalBody = toText(home.slice(legalStart, legalEnd))
    .split('\n')
    .filter((l) => l !== 'Nota Legal')
    .join('\n');
  await clearJsonDir(join(CONTENT, 'pages'));
  await writeJson(join(CONTENT, 'pages', 'escola.json'), {
    slug: 'escola',
    title: 'Escola',
    summary: escolaLines[from + 1] ?? '',
    body: escolaLines.slice(from, to + 1).join('\n'),
    imageUrl: infantil.imageUrl,
    publishedAt: SCRAPE_DATE,
  });
  await writeJson(join(CONTENT, 'pages', 'nota-legal.json'), {
    slug: 'nota-legal',
    title: 'Nota legal',
    summary: "Nota legal del lloc web del Centre d'Estudis Mollet.",
    body: legalBody,
    imageUrl: infantil.imageUrl,
    publishedAt: SCRAPE_DATE,
  });

  // Gallery, links and documents from the home page.
  const h = homeSection(home);
  await writeJson(join(CONTENT, 'gallery', 'gallery.json'), {
    images: h.gallery.map((g, i) => ({ id: `foto-${i + 1}`, imageUrl: g.imageUrl, alt: g.alt || 'Instal·lacions del centre' })),
  });
  await writeJson(join(CONTENT, 'links', 'links.json'), {
    items: h.links.map((l) => ({ id: slugify(l.label), label: l.label, url: l.url })),
  });
  await writeJson(join(CONTENT, 'documents', 'documents.json'), {
    items: h.docs.map((d) => ({ id: slugify(d.title), title: d.title, url: d.url })),
  });

  console.log(
    `news=${news.length} stages=1 services=1 activities=1 gallery=${h.gallery.length} links=${h.links.length} documents=${h.docs.length}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
