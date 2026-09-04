# CMS repository cutover

This repository is prepared to replace only the legacy CMS application. The
public website and reverse proxy remain separate deployments.

## Before the first cutover

1. Record the current CMS image, container, database container, Docker network
   and media-volume names.
2. Create a PostgreSQL backup and an archive of the CMS media volume.
3. Copy `.env.production.example` to `.env.production`, set mode `600`, and
   replace every placeholder. Never commit that file.
4. Confirm that `DATABASE_URL`, `CMS_BACKEND_NETWORK` and `CMS_MEDIA_VOLUME`
   resolve to the existing production resources.
5. Confirm that the website stack has created the shared `scs-edge` network and
   set `CMS_EDGE_NETWORK=scs-edge`.
6. Build and validate without stopping the old CMS.

```bash
docker compose --env-file .env.production -f compose.prod.yaml config --quiet
docker compose --env-file .env.production -f compose.prod.yaml build cms
```

Do not run database migrations during this repository-only split. The existing
database already serves the current CMS schema; migration reconciliation must
be performed separately against a restored backup first.

## Controlled replacement

Stop only the legacy CMS container and start the new CMS container. The website
proxy resolves the CMS service over the shared `scs-edge` network. Keep the old
image and backups until all checks pass.

```bash
docker compose --env-file .env.production -f compose.prod.yaml up -d --build cms
curl --max-time 20 -I http://127.0.0.1:3101/admin/login
curl --max-time 20 http://127.0.0.1:3101/api/health
curl --max-time 20 -I https://cms.sigmacore.id/admin/login
```

Verify login, logout, media rendering, one draft preview and one published edit.
The published edit must trigger the website revalidation endpoint. If any check
fails, stop the new container and restore the previous CMS container; do not
alter the database or media volume during rollback.
