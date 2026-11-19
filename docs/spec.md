# Mockup: nueva web del Centre d'Estudis Mollet (CEM)

## Objetivo
Rediseñar https://www.cemollet.eu/ con un aspecto moderno, colorido y cercano. Es un mockup para enseñárselo a la escuela y debe poder evolucionar hasta convertirse en la web definitiva.

## Stack y despliegue
- **Astro 4+** (salida estática) + **Tailwind CSS** + TypeScript.
- Interactividad mínima (menú móvil, carrusel, lightbox) con islands de JS ligero (Alpine.js o vanilla). No uses React salvo que sea imprescindible.
- Despliegue en **GitHub Pages** con GitHub Actions (`withastro/action`). Configura `site` y `base` en `astro.config.mjs`.
- Idioma único: **catalán** (`<html lang="ca">`).

## Arquitectura preparada para el backend futuro
Más adelante habrá una **API .NET + backoffice** para gestionar noticias y apartados. Por eso:
- Todo el contenido vive en `src/content/` (Astro Content Collections, JSON/MD) con esquemas Zod tipados.
- Toda la lectura pasa por una capa de datos `src/lib/data/` (`getNews()`, `getStages()`, `getEvents()`, etc.). Los componentes NUNCA leen los archivos directamente.
- Los contratos de tipos están en `src/lib/types.ts` y deben reflejar los DTOs que expondrá la API (`id`, `slug`, `title`, `summary`, `body`, `imageUrl`, `publishedAt`).
- Para cambiar a la API solo habrá que modificar la capa de datos (fetch en build + rebuild por webhook).

## Estructura
```
src/
  components/   (Header, Footer, Hero, Card, NewsCard, StageCard, Gallery, CTA, Calendar...)
  layouts/BaseLayout.astro
  pages/        index, escola, etapes, serveis, activitats, noticies/[slug], noticies/index, contacte
  content/      news/, stages/, services/, activities/, gallery.json, links.json, documents.json
  lib/data/, lib/types.ts
public/         logo, favicon
```

## Diseño visual
- Estilo **colorido y cercano**, pensado para familias: esquinas muy redondeadas (`rounded-3xl`), formas orgánicas o blobs de fondo, sombras suaves y microanimaciones al hacer hover o scroll.
- Paleta: extrae el color principal del logo actual y combínalo con acentos vivos (amarillo, coral, verde, azul cielo). Defínela como tokens en `tailwind.config`.
- Tipografía: **Baloo 2** o **Fredoka** para títulos y **Nunito** para el texto.
- Mobile-first, WCAG AA (contraste, `alt`, foco visible) y Lighthouse >= 90.

## Páginas y contenido
Reutiliza los textos y las imágenes reales de la web actual (scrapea cada sección). Las imágenes cuelgan de `https://cemollet.clickedu.eu/private/...` y se enlazan en remoto.

### Home
1. Top bar: TEL 935 932 198 · cemollet@cemollet.eu · redes sociales.
2. Header sticky con el logo y la navegación: Inici, Escola, Etapes, Serveis, Activitats, Notícies, Contacte y un botón destacado de **"Portes obertes"**. Agrupa AMPA, Perfil de l'alumne, Estratègia digital, Consell Escolar y Código Escuela 4.0 en un desplegable **"Més"**.
3. Hero: claim "Una escola per ser, aprendre i créixer", subtítulo (escola concertada d'una línia, d'I3 a 4t d'ESO, Mollet del Vallès), CTAs "Descobreix l'escola" y "Contacta", e imagen o carrusel con las imágenes de cabecera actuales.
4. Tres pilares en cards: "Cada alumne compta", "Aprendre fent i compartint", "Al costat de les famílies".
5. Etapas: Infantil, Primària y ESO con enlace a cada una.
6. Bloque "Descobreix el CEM amb la Cloe" con un vídeo destacado.
7. Últimas 6 noticias (grid) y enlace a todas.
8. Próximos eventos (lista simple con estado vacío: "No hi ha propers esdeveniments").
9. Galería "Un volt per l'escola" (14 fotos de instalaciones) con lightbox.
10. Proyectos destacados (antiguos banners): L'Edat del pavo (ràdio), Audiovisuals y "Més que una escola".
11. Documentos de interés (PDFs): Projecte Educatiu, Convivència, Lingüístic, NOFC, CAD, PGA, Memòries, Trencaclosques.
12. Footer: datos de contacto, dirección (Av. Calderó, 19, 08100 Mollet del Vallès), mapa embebido, redes, enlace al acceso a **Clickedu** (externo, sustituye el login actual), enlace a la compra de chándales y Nota legal.

### Resto de páginas
- **Escola, Etapes, Serveis, Activitats**: contenido de `/escola_c/`, `/etapes_c/`, `/serveis_c/` y `/activitats_c/`, con un layout de secciones con imagen y cards.
- **Notícies**: listado paginado y página de detalle `[slug]`. Importa al menos las 6 últimas.
- **Contacte**: datos, mapa y formulario visual (sin envío real, con un aviso de mockup), más el checkbox de consentimiento RGPD.
- **Nota legal**: página propia con el texto actual.

## Fuera de alcance
Backend, login, envío de formularios, multilingüe, calendario interactivo completo y las páginas secundarias (AMPA, Consell Escolar, etc.), que solo se enlazan a la web actual.

## Criterios de aceptación
- `npm run build` sin errores y despliegue correcto en GitHub Pages.
- Navegación completa y responsive (360px, 768px, 1280px).
- Ningún componente accede al contenido sin pasar por `lib/data`.
- Corrige la codificación de caracteres de los textos (la web original muestra `�`).
- README con instrucciones de ejecución, despliegue y cómo migrar a la API .NET.