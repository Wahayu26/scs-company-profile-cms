import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  checkedFilename,
  cleanSiteSettings,
  contentCollections,
  fillMissing,
  mapContentDocument,
  sha256File,
  sourceID,
} from './content-bundle.mjs';

class SafeError extends Error {}

const bundleDir = process.env.CMS_IMPORT_BUNDLE;
const mode = process.env.CMS_IMPORT_MODE || 'dry-run';
const apply = mode === 'apply';
let payload;
let exitCode = 0;

try {
  if (!bundleDir || !isAbsolute(bundleDir)) throw new SafeError('CMS_IMPORT_BUNDLE wajib berupa path absolut.');
  if (!['dry-run', 'apply'].includes(mode)) throw new SafeError('CMS_IMPORT_MODE hanya dry-run atau apply.');
  if (apply && process.env.CMS_IMPORT_BACKUP_CONFIRMED !== 'verified-backup') {
    throw new SafeError('Apply ditolak: backup database dan media belum dikonfirmasi.');
  }
  if (process.env.PAYLOAD_DB_PROVIDER !== 'postgres' || process.env.PAYLOAD_DB_PUSH !== 'false') {
    throw new SafeError('Import production wajib PostgreSQL dengan PAYLOAD_DB_PUSH=false.');
  }
  let database;
  try { database = new URL(process.env.DATABASE_URL); } catch { throw new SafeError('DATABASE_URL tidak valid.'); }
  if (!['postgres:', 'postgresql:'].includes(database.protocol) || database.pathname !== '/scs_cms') {
    throw new SafeError('Database tujuan harus PostgreSQL scs_cms.');
  }

  const manifestPath = resolve(bundleDir, 'manifest.json');
  if (!existsSync(manifestPath)) throw new SafeError('manifest.json tidak ditemukan.');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.schemaVersion !== 1 || !manifest.collections || !Array.isArray(manifest.media)) {
    throw new SafeError('Format bundle tidak didukung.');
  }
  for (const collection of contentCollections) {
    if (!Array.isArray(manifest.collections[collection])) throw new SafeError(`Data ${collection} tidak valid.`);
  }

  const mediaFiles = new Map();
  for (const item of manifest.media) {
    const filename = checkedFilename(item.filename);
    const file = resolve(bundleDir, 'media', filename);
    if (!existsSync(file) || sha256File(file) !== item.sha256) {
      throw new SafeError(`Hash media tidak valid: ${filename}.`);
    }
    mediaFiles.set(String(item.sourceId), { ...item, file });
  }

  process.env.NODE_ENV = 'production';
  process.env.PAYLOAD_DROP_DATABASE = 'false';
  process.env.PAYLOAD_TELEMETRY_DISABLED = '1';
  const { getPayload } = await import('payload');
  const configModule = await import(pathToFileURL(resolve('payload.config.ts')).href);
  const config = await configModule.default;
  payload = await getPayload({ config });

  const existing = {};
  for (const collection of ['media', ...contentCollections]) {
    const result = await payload.find({ collection, pagination: false, depth: 0, draft: true, overrideAccess: true });
    existing[collection] = result.docs;
  }

  const mediaMap = new Map();
  const mediaPlan = [];
  const existingMediaByName = new Map(existing.media.map((doc) => [doc.filename, doc]));
  for (const [source, item] of mediaFiles) {
    const found = existingMediaByName.get(item.filename);
    if (found) {
      const targetFile = resolve('public/media', checkedFilename(found.filename));
      if (!existsSync(targetFile) || sha256File(targetFile) !== item.sha256) {
        throw new SafeError(`Media production bentrok dengan bundle: ${item.filename}.`);
      }
      mediaMap.set(source, found.id);
    } else {
      mediaPlan.push({ source, item });
    }
  }

  const report = {
    mode,
    media: { existing: mediaMap.size, create: mediaPlan.length },
    collections: {},
    settings: 'preserve-existing',
  };

  if (apply) {
    for (const { source, item } of mediaPlan) {
      const created = await payload.create({
        collection: 'media',
        data: { alt: item.alt, caption: item.caption || null },
        filePath: item.file,
        overwriteExistingFiles: false,
        depth: 0,
        overrideAccess: true,
        context: { skipContentRevalidation: true },
      });
      mediaMap.set(source, created.id);
    }
  } else {
    for (const { source } of mediaPlan) mediaMap.set(source, `planned-media:${source}`);
  }

  const maps = { media: mediaMap, partners: new Map(), solutions: new Map() };
  const identity = {
    partners: (doc) => String(doc.name).trim().toLowerCase().replace(/\s+/g, ' '),
    solutions: (doc) => doc.slug,
    projects: (doc) => doc.slug,
    insights: (doc) => doc.slug,
  };

  for (const collection of contentCollections) {
    const currentByKey = new Map(existing[collection].map((doc) => [identity[collection](doc), doc]));
    const plan = [];
    let preserved = 0;
    for (const sourceDoc of manifest.collections[collection]) {
      const key = identity[collection](sourceDoc);
      if (!key) throw new SafeError(`Record ${collection} tanpa identitas stabil.`);
      const found = currentByKey.get(key);
      if (found) {
        preserved += 1;
        if (maps[collection]) maps[collection].set(String(sourceDoc.id), found.id);
        continue;
      }
      plan.push(sourceDoc);
    }
    report.collections[collection] = { existing: preserved, create: plan.length };

    for (const sourceDoc of plan) {
      const data = mapContentDocument(collection, sourceDoc, maps);
      if (apply) {
        const created = await payload.create({
          collection,
          data,
          depth: 0,
          overrideAccess: true,
          context: { skipContentRevalidation: true },
        });
        if (maps[collection]) maps[collection].set(String(sourceDoc.id), created.id);
      } else if (maps[collection]) {
        maps[collection].set(String(sourceDoc.id), `planned-${collection}:${sourceID(sourceDoc.id)}`);
      }
    }
  }

  const currentSettings = await payload.findGlobal({ slug: 'site-settings', depth: 0, draft: true, overrideAccess: true });
  const incomingSettings = cleanSiteSettings(manifest.settings || {});
  const mergedSettings = fillMissing(currentSettings || {}, incomingSettings);
  const changed = JSON.stringify(cleanSiteSettings(currentSettings || {})) !== JSON.stringify(cleanSiteSettings(mergedSettings));
  if (changed) {
    report.settings = 'fill-missing-and-publish';
    if (apply) await payload.updateGlobal({
      slug: 'site-settings',
      data: { ...mergedSettings, _status: 'published' },
      depth: 0,
      overrideAccess: true,
      context: { skipContentRevalidation: true },
    });
  }

  console.log(JSON.stringify({ status: apply ? 'IMPORT_OK' : 'DRY_RUN_OK', ...report }, null, 2));
} catch (error) {
  exitCode = 1;
  console.error(error instanceof SafeError ? error.message : 'Import gagal. Tidak ada record existing yang dihapus atau ditimpa.');
} finally {
  if (payload) {
    try { await payload.destroy(); } catch { exitCode = 1; }
  }
}

process.exit(exitCode);
