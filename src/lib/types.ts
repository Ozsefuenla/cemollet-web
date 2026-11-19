// DTO contracts. They mirror the future .NET API responses (see docs/api-migration.md).
// Do not rename fields without updating docs/content-model.md and the API contract.

export interface ContentBase {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  imageUrl: string;
  /** ISO 8601 date (YYYY-MM-DD). */
  publishedAt: string;
}

export type NewsDto = ContentBase;
export type StageDto = ContentBase;
export type ServiceDto = ContentBase;
export type ActivityDto = ContentBase;
export type EventDto = ContentBase;

export interface GalleryImage {
  id: string;
  imageUrl: string;
  alt: string;
}

export interface LinkDto {
  id: string;
  label: string;
  url: string;
}

export interface DocumentDto {
  id: string;
  title: string;
  url: string;
}
