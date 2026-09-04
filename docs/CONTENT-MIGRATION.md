# Testing content migration

This migration copies public editorial content from the local testing CMS into
the production PostgreSQL CMS. It never exports users, passwords, sessions,
Payload preferences or database-internal tables. Import is add-only: existing
collection records are preserved, and website settings only fill empty fields.

## 1. Export from local testing

Keep the testing CMS running on port 3101, then run from this repository:

```powershell
$env:CMS_SOURCE_API = "http://localhost:3101/api"
$env:CMS_EXPORT_DIR = "$(Resolve-Path .)\content-exports\testing-content"
pnpm content:export
```

The export source is intentionally restricted to loopback. The bundle contains
published solutions, partners, projects, insights, site settings, and media
files with SHA-256 hashes. It contains no account collection.

Archive the generated directory outside Git and calculate a SHA-256 checksum
before transferring it to the server.

## 2. Dry-run on production

Back up PostgreSQL and the CMS media volume first. Extract the bundle into a
root-readable server directory, set `CMS_IMPORT_BUNDLE_HOST` to that directory
in `.env.production`, and run the dedicated Compose tools service. The bundle
is mounted read-only and the live media volume is mounted at its normal path.

```bash
docker compose --env-file .env.production -f compose.prod.yaml \
  --profile tools run --rm import-content
```

Review all planned counts. The importer aborts before writes on an invalid
manifest, altered media hash, unsafe filename, wrong database, or conflicting
production media filename.

## 3. Apply and verify

Only after the dry-run and backups are verified:

```bash
CMS_IMPORT_BACKUP_CONFIRMED=verified-backup \
CMS_IMPORT_MODE=apply \
docker compose --env-file .env.production -f compose.prod.yaml \
  --profile tools run --rm import-content
```

Rerunning is safe: documents with an existing stable key (`slug`, or normalized
partner name) and byte-identical media are preserved. The importer never deletes
or overwrites existing business records. Verify counts through the public API
and admin UI before deploying the website integration.
