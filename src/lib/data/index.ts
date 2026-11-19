import { getCollection, getEntry } from 'astro:content';
import type {
  ActivityDto,
  ContentBase,
  DocumentDto,
  EventDto,
  GalleryImage,
  LinkDto,
  NewsDto,
  ServiceDto,
  StageDto,
} from '../types';

// Single read API for the site. Components and pages MUST use these functions
// and never import from src/content directly (see AGENTS.md, section 3).
// Migrating to the .NET API only changes the implementations in this file.

type Entry<T> = { id: string; data: T };

function toContent(entry: Entry<Omit<ContentBase, 'id'>>): ContentBase {
  return { id: entry.id, ...entry.data };
}

function byDateDesc(a: ContentBase, b: ContentBase): number {
  return b.publishedAt.localeCompare(a.publishedAt);
}

async function listContent(name: 'news' | 'stages' | 'services' | 'activities' | 'events'): Promise<ContentBase[]> {
  const entries = await getCollection(name);
  return entries.map((e) => toContent(e as Entry<Omit<ContentBase, 'id'>>)).sort(byDateDesc);
}

export async function getNews(): Promise<NewsDto[]> {
  return listContent('news');
}

export async function getNewsBySlug(slug: string): Promise<NewsDto | undefined> {
  const news = await getNews();
  return news.find((n) => n.slug === slug);
}

export async function getStages(): Promise<StageDto[]> {
  return listContent('stages');
}

export async function getServices(): Promise<ServiceDto[]> {
  return listContent('services');
}

export async function getActivities(): Promise<ActivityDto[]> {
  return listContent('activities');
}

export async function getEvents(): Promise<EventDto[]> {
  return listContent('events');
}

export async function getPage(slug: string): Promise<ContentBase | undefined> {
  const entry = await getEntry('pages', slug);
  return entry ? toContent(entry as Entry<Omit<ContentBase, 'id'>>) : undefined;
}

export async function getGallery(): Promise<GalleryImage[]> {
  const entry = await getEntry('gallery', 'gallery');
  return entry?.data.images ?? [];
}

export async function getLinks(): Promise<LinkDto[]> {
  const entry = await getEntry('links', 'links');
  return entry?.data.items ?? [];
}

export async function getDocuments(): Promise<DocumentDto[]> {
  const entry = await getEntry('documents', 'documents');
  return entry?.data.items ?? [];
}
