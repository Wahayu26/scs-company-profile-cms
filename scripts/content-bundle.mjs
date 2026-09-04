import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

export const bundleCollections = ['media', 'partners', 'solutions', 'projects', 'insights'];
export const contentCollections = ['partners', 'solutions', 'projects', 'insights'];

export function normalizeAPIBase(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('CMS_SOURCE_API must be an HTTP(S) URL without credentials, query or fragment.');
  }
  if (!['localhost', '127.0.0.1', '::1'].includes(url.hostname)) {
    throw new Error('Content export is restricted to a loopback CMS source.');
  }
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/`;
  return url;
}

export function checkedFilename(value) {
  if (typeof value !== 'string' || !value || basename(value) !== value || value.includes('..')) {
    throw new Error('Unsafe media filename in source data.');
  }
  return value;
}

export function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

export function sourceID(value) {
  if (typeof value === 'number' || typeof value === 'string') return String(value);
  if (value && typeof value === 'object' && ('id' in value)) return String(value.id);
  return null;
}

export function mappedRelation(value, map, label, optional = true) {
  const id = sourceID(value);
  if (id === null && optional) return null;
  const mapped = id === null ? undefined : map.get(id);
  if (mapped === undefined) throw new Error(`Missing ${label} mapping for source id ${id ?? '<empty>'}.`);
  return mapped;
}

function cleanRows(value, keys) {
  if (!Array.isArray(value)) return [];
  return value.map((row) => Object.fromEntries(keys
    .filter((key) => row && typeof row === 'object' && row[key] !== undefined)
    .map((key) => [key, row[key]])));
}

export function mapEmbeddedMedia(value, mediaMap) {
  if (Array.isArray(value)) return value.map((item) => mapEmbeddedMedia(item, mediaMap));
  if (!value || typeof value !== 'object') return value;
  const result = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === 'id') continue;
    result[key] = mapEmbeddedMedia(child, mediaMap);
  }
  if (value.relationTo === 'media' && 'value' in value) {
    result.value = mappedRelation(value.value, mediaMap, 'embedded media', false);
  }
  return result;
}

const commonVisibility = (doc) => ({
  order: Number.isFinite(Number(doc.order)) ? Number(doc.order) : 0,
  published: doc.published === true,
  _status: doc._status === 'published' ? 'published' : 'draft',
});

export function mapContentDocument(collection, doc, maps) {
  const media = maps.media;
  const partners = maps.partners;
  const solutions = maps.solutions;

  if (collection === 'partners') return {
    name: doc.name,
    logo: mappedRelation(doc.logo, media, 'partner logo', false),
    website: doc.website || null,
    ...commonVisibility(doc),
  };

  if (collection === 'solutions') return {
    title: doc.title,
    slug: doc.slug,
    summary: doc.summary,
    category: doc.category,
    heroImage: mappedRelation(doc.heroImage, media, 'solution hero image'),
    outcome: doc.outcome || null,
    features: cleanRows(doc.features, ['label']),
    iconKey: doc.iconKey,
    benefits: cleanRows(doc.benefits, ['title', 'description']),
    useCases: cleanRows(doc.useCases, ['label']),
    content: mapEmbeddedMedia(doc.content, media),
    relatedPartners: Array.isArray(doc.relatedPartners)
      ? doc.relatedPartners.map((value) => mappedRelation(value, partners, 'related partner', false))
      : [],
    ...commonVisibility(doc),
  };

  if (collection === 'projects') return {
    title: doc.title,
    slug: doc.slug,
    industry: doc.industry,
    client: doc.client || null,
    summary: doc.summary,
    highlights: cleanRows(doc.highlights, ['label']),
    challenge: mapEmbeddedMedia(doc.challenge, media),
    solution: mapEmbeddedMedia(doc.solution, media),
    result: mapEmbeddedMedia(doc.result, media),
    technologies: cleanRows(doc.technologies, ['label']),
    relatedSolutions: Array.isArray(doc.relatedSolutions)
      ? doc.relatedSolutions.map((value) => mappedRelation(value, solutions, 'related solution', false))
      : [],
    cover: mappedRelation(doc.cover, media, 'project cover'),
    featured: doc.featured === true,
    ...commonVisibility(doc),
  };

  if (collection === 'insights') return {
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    publishedAt: doc.publishedAt,
    excerpt: doc.excerpt,
    cover: mappedRelation(doc.cover, media, 'insight cover'),
    content: mapEmbeddedMedia(doc.content, media),
    relatedSolutions: Array.isArray(doc.relatedSolutions)
      ? doc.relatedSolutions.map((value) => mappedRelation(value, solutions, 'related solution', false))
      : [],
    seo: doc.seo ? { title: doc.seo.title || null, description: doc.seo.description || null } : {},
    featured: doc.featured === true,
    ...commonVisibility(doc),
  };

  throw new Error(`Unsupported collection ${collection}.`);
}

export function cleanSiteSettings(settings) {
  const group = (value, keys) => Object.fromEntries(keys
    .filter((key) => value && typeof value === 'object' && value[key] !== undefined)
    .map((key) => [key, value[key]]));
  return {
    hero: group(settings.hero, ['eyebrow', 'headline', 'highlight', 'description']),
    contact: group(settings.contact, ['email', 'phone', 'address']),
    companyFacts: cleanRows(settings.companyFacts, ['value', 'label']),
    seo: group(settings.seo, ['title', 'description']),
    about: group(settings.about, ['eyebrow', 'headline', 'highlight', 'description']),
    workflow: {
      ...group(settings.workflow, ['eyebrow', 'title', 'description']),
      steps: cleanRows(settings.workflow?.steps, ['step', 'title', 'text']),
    },
    strengths: {
      ...group(settings.strengths, ['eyebrow', 'title', 'description']),
      items: cleanRows(settings.strengths?.items, ['title', 'text']),
    },
    _status: settings._status === 'published' ? 'published' : 'draft',
  };
}

export function fillMissing(existing, incoming) {
  if (Array.isArray(incoming)) return Array.isArray(existing) && existing.length ? existing : incoming;
  if (incoming && typeof incoming === 'object') {
    return Object.fromEntries(Object.entries(incoming).map(([key, value]) => [
      key,
      fillMissing(existing && typeof existing === 'object' ? existing[key] : undefined, value),
    ]));
  }
  return existing === undefined || existing === null || existing === '' ? incoming : existing;
}
