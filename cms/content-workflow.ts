import type { Access, CollectionConfig, Field, GlobalConfig, PayloadRequest } from 'payload';

import { websiteOrigin } from './auth-origin';

const authenticated: Access = ({ req }) => Boolean(req.user);
const published: Access = ({ req }) => req.user ? true : {
  _status: { equals: 'published' }, published: { equals: true },
};

type RevalidationEvent = {
  collection: string;
  id?: number | string;
  operation: 'create' | 'delete' | 'update';
  slug?: string;
};

const collectionPaths: Record<string, string> = {
  insights: '/insight',
  partners: '/',
  projects: '/proyek',
  solutions: '/solusi',
};

function documentPath(collection: string, slug?: unknown) {
  const base = collectionPaths[collection] ?? '/';
  return typeof slug === 'string' && slug.length > 0 && base !== '/'
    ? `${base}/${encodeURIComponent(slug)}`
    : base;
}

function previewURL(collection: string, slug?: unknown) {
  const directPath = documentPath(collection, slug);
  const secret = process.env.WEBSITE_PREVIEW_SECRET?.trim();
  if (!secret) return new URL(directPath, websiteOrigin()).toString();

  const url = new URL('/api/preview', websiteOrigin());
  url.searchParams.set('secret', secret);
  url.searchParams.set('collection', collection);
  if (typeof slug === 'string' && slug.length > 0) url.searchParams.set('slug', slug);
  return url.toString();
}

async function refreshWebsite(req: PayloadRequest, event: RevalidationEvent) {
  // Only trusted offline scripts may set this internal context flag.
  if (req.context.skipContentRevalidation) return;

  const endpoint = process.env.WEBSITE_REVALIDATE_URL?.trim();
  const secret = process.env.WEBSITE_REVALIDATE_SECRET?.trim();
  if (!endpoint && !secret) return;
  if (!endpoint || !secret) {
    req.payload.logger.error('WEBSITE_REVALIDATE_URL and WEBSITE_REVALIDATE_SECRET must be configured together.');
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error(`Website revalidation returned HTTP ${response.status}.`);
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Unable to revalidate the public website.' });
  }
}

function visibilityFields(fields: Field[]): Field[] {
  return fields.map((field) => {
    if ('name' in field && field.name === 'published' && field.type === 'checkbox') {
      return { ...field, defaultValue: true, label: 'Tampilkan di website', admin: {
        ...field.admin, description: 'Hanya tampil setelah Dipublikasikan. Nonaktifkan untuk menyembunyikan item.',
      } };
    }
    if ('fields' in field) return { ...field, fields: visibilityFields(field.fields) };
    if (field.type === 'tabs') return { ...field, tabs: field.tabs.map((tab) => ({ ...tab, fields: visibilityFields(tab.fields) })) };
    return field;
  });
}

export function withContentWorkflow(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    versions: { drafts: { validate: true }, maxPerDoc: 30 },
    access: { ...collection.access, read: published, readVersions: authenticated },
    fields: visibilityFields(collection.fields),
    admin: { ...collection.admin,
      preview: (doc) => doc.id ? previewURL(collection.slug, doc.slug) : null,
      description: `${collection.admin?.description ?? ''} Simpan draft → Pratinjau → Publikasikan.`,
    },
    hooks: { ...collection.hooks,
      afterChange: [...(collection.hooks?.afterChange ?? []), async ({ doc, operation, req }) => {
        await refreshWebsite(req, { collection: collection.slug, id: doc.id, operation, slug: doc.slug });
        return doc;
      }],
      afterDelete: [...(collection.hooks?.afterDelete ?? []), async ({ doc, req }) => {
        await refreshWebsite(req, { collection: collection.slug, id: doc.id, operation: 'delete', slug: doc.slug });
        return doc;
      }],
    },
  };
}

const text = (name: string, label: string, defaultValue?: string): Field => ({
  name, label, type: 'text', required: true, ...(defaultValue ? { defaultValue } : {}),
});
const description: Field = { name: 'description', label: 'Deskripsi', type: 'textarea', required: true };
const heading: Field[] = [text('eyebrow', 'Label kecil'), text('title', 'Judul bagian'), description];

export function withSiteWorkflow(global: GlobalConfig): GlobalConfig {
  return { ...global,
    versions: { drafts: { validate: true }, max: 30 },
    admin: { ...global.admin,
      preview: () => previewURL('site-settings'),
      description: 'Simpan draft → Pratinjau → Publikasikan. Perubahan draft tidak mengubah website publik.',
    },
    access: { ...global.access,
      read: ({ req }) => req.user ? true : { _status: { equals: 'published' } },
      readVersions: authenticated,
    },
    hooks: { ...global.hooks,
      afterChange: [...(global.hooks?.afterChange ?? []), async ({ doc, req }) => {
        await refreshWebsite(req, { collection: global.slug, id: doc.id, operation: 'update' });
        return doc;
      }],
    },
    fields: [...global.fields,
      { name: 'about', label: 'Tentang perusahaan', type: 'group', fields: [
        text('eyebrow', 'Label kecil'), text('headline', 'Judul'), text('highlight', 'Judul aksen'), description,
      ] },
      { name: 'workflow', label: 'Cara kerja', type: 'group', fields: [...heading,
        { name: 'image', label: 'Gambar bagian', type: 'upload', relationTo: 'media' },
        text('imageAlt', 'Teks alternatif gambar', 'Infrastruktur data center modern'),
        text('badge', 'Label pada gambar', 'End-to-end system integration'),
        { name: 'steps', label: 'Tahapan', type: 'array', required: true, minRows: 1, maxRows: 12,
          fields: [text('step', 'Nomor'), text('title', 'Nama tahap'), { name: 'text', label: 'Penjelasan', type: 'textarea', required: true }] },
      ] },
      { name: 'strengths', label: 'Keunggulan', type: 'group', fields: [...heading,
        { name: 'items', label: 'Daftar keunggulan', type: 'array', required: true, minRows: 1, maxRows: 8,
          fields: [text('title', 'Judul'), { name: 'text', label: 'Penjelasan', type: 'textarea', required: true }] },
      ] },
    ],
  };
}
