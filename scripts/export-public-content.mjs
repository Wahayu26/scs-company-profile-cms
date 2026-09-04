import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  bundleCollections,
  checkedFilename,
  contentCollections,
  normalizeAPIBase,
} from './content-bundle.mjs';

const source = normalizeAPIBase(process.env.CMS_SOURCE_API || 'http://localhost:3101/api');
const output = resolve(process.env.CMS_EXPORT_DIR || `content-exports/export-${Date.now()}`);

if (existsSync(output)) throw new Error(`Export target already exists: ${output}`);
mkdirSync(resolve(output, 'media'), { recursive: true, mode: 0o700 });

async function getJSON(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    redirect: 'error',
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Source CMS returned HTTP ${response.status} for ${url.pathname}.`);
  return response.json();
}

async function readCollection(collection) {
  const docs = [];
  let page = 1;
  while (page <= 100) {
    const url = new URL(collection, source);
    url.search = new URLSearchParams({ depth: '0', draft: 'false', limit: '100', page: String(page) }).toString();
    const payload = await getJSON(url);
    if (!Array.isArray(payload.docs) || typeof payload.hasNextPage !== 'boolean') {
      throw new Error(`Invalid ${collection} response from source CMS.`);
    }
    docs.push(...payload.docs);
    if (!payload.hasNextPage) return docs;
    if (payload.nextPage !== page + 1) throw new Error(`Invalid ${collection} pagination.`);
    page += 1;
  }
  throw new Error(`${collection} pagination exceeded the safety limit.`);
}

const data = {};
for (const collection of bundleCollections) data[collection] = await readCollection(collection);
data.settings = await getJSON(new URL('globals/site-settings?depth=0&draft=false', source));

const exportedMedia = [];
for (const media of data.media) {
  const filename = checkedFilename(media.filename);
  const mediaURL = new URL(media.url, source);
  if (mediaURL.origin !== source.origin) throw new Error(`Cross-origin media URL rejected: ${mediaURL}.`);
  const response = await fetch(mediaURL, { redirect: 'error', signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Unable to download ${filename}: HTTP ${response.status}.`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.length) throw new Error(`Downloaded media is empty: ${filename}.`);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  writeFileSync(resolve(output, 'media', filename), bytes, { flag: 'wx', mode: 0o600 });
  exportedMedia.push({
    sourceId: media.id,
    filename,
    sha256,
    size: bytes.length,
    mimeType: media.mimeType,
    alt: media.alt,
    caption: media.caption || null,
  });
}

const manifest = {
  schemaVersion: 1,
  exportedAt: new Date().toISOString(),
  source: source.origin,
  counts: Object.fromEntries(bundleCollections.map((key) => [key, data[key].length])),
  media: exportedMedia,
  collections: Object.fromEntries(contentCollections.map((key) => [key, data[key]])),
  settings: data.settings,
};

writeFileSync(resolve(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ status: 'EXPORT_OK', output, counts: manifest.counts }, null, 2));
