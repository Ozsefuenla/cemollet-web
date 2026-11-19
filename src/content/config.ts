import { defineCollection, z } from 'astro:content';

// Schemas must stay consistent with the DTOs in src/lib/types.ts.
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

const contentEntry = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  body: z.string(),
  imageUrl: z.string().url(),
  publishedAt: isoDate,
});

const news = defineCollection({ type: 'data', schema: contentEntry });
const stages = defineCollection({ type: 'data', schema: contentEntry });
const services = defineCollection({ type: 'data', schema: contentEntry });
const activities = defineCollection({ type: 'data', schema: contentEntry });
const events = defineCollection({ type: 'data', schema: contentEntry });
const pages = defineCollection({ type: 'data', schema: contentEntry });

// Single-file collections: each JSON file is one entry (id = file name) holding a list.
const gallery = defineCollection({
  type: 'data',
  schema: z.object({
    images: z.array(
      z.object({ id: z.string(), imageUrl: z.string().url(), alt: z.string().min(1) }),
    ),
  }),
});

const links = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(z.object({ id: z.string(), label: z.string(), url: z.string().url() })),
  }),
});

const documents = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(z.object({ id: z.string(), title: z.string(), url: z.string().url() })),
  }),
});

export const collections = { news, stages, services, activities, events, pages, gallery, links, documents };
