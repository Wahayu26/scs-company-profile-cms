# Sigma Core Company Profile CMS

Payload CMS and its editorial REST API for the Sigma Core company profile. This
repository intentionally contains no public landing-page routes and has sole
ownership of direct database access.

## Responsibilities

- Admin UI at `/admin`
- Public, read-only Payload REST endpoints at `/api`
- Solutions, partners, projects, insights, media and website settings
- Draft/publish workflow and preview links
- Authenticated webhook calls that invalidate the website cache
- Authenticated consultation inbox backed by `scs_core.inquiries`

The public website is a separate Next.js application. It reads published data
from this CMS over HTTP; it must never connect directly to PostgreSQL.

The admin-only **Konsultasi Masuk** view reads the existing Core API database
through the server-only `CORE_DATABASE_URL`. Credentials never reach the
browser, and an unavailable Core database does not prevent other CMS screens
from loading.

Before deploying a CMS release that includes the consultation workflow, back
up `scs_core` and run `pnpm core-inquiries:migrate`. Status changes are written
transactionally and retained in `inquiry_status_history` with the responsible
administrator and timestamp.

## Local development

Requirements: Node.js 22 and pnpm 10.

```powershell
Copy-Item .env.example .env.local
pnpm install
pnpm dev -- --port 3101
```

The default local database is SQLite at `.data/payload.db`. Open
`http://localhost:3101/admin`; the first account is promoted to administrator.
Neither local databases nor uploaded media are tracked by Git.

To use the local Docker/PostgreSQL stack instead:

```powershell
docker compose --env-file .env.local up --build
```

## Environment contract

| Variable | Purpose |
| --- | --- |
| `PAYLOAD_SERVER_URL` | Exact CMS origin, such as `https://cms.sigmacore.id` |
| `WEBSITE_URL` | Exact public website origin |
| `PAYLOAD_SECRET` | CMS signing secret; unique and at least 32 random characters |
| `DATABASE_URL` | PostgreSQL connection used only by this service |
| `WEBSITE_PREVIEW_SECRET` | Shared secret used by the website preview endpoint |
| `WEBSITE_REVALIDATE_URL` | Website webhook endpoint, normally `/api/revalidate` |
| `WEBSITE_REVALIDATE_SECRET` | Bearer secret for the revalidation webhook |

`WEBSITE_REVALIDATE_URL` and `WEBSITE_REVALIDATE_SECRET` must be configured
together. SMTP variables are optional locally and required if password-reset
email must be delivered.

## Checks

```powershell
pnpm test
pnpm typecheck
pnpm build
```

`GET /api/health` verifies that the application can query its database without
disclosing content or account details. Search engines are blocked through
`robots.txt`; the API still enforces Payload access control.

## Create an administrator from the server

The guarded bootstrap script refuses non-PostgreSQL databases, databases other
than `scs_cms`, duplicate email addresses and passwords shorter than 16
characters. Set `CMS_ADMIN_NAME`, `CMS_ADMIN_EMAIL` and `CMS_ADMIN_ROLE`, then
run `pnpm cms:create-admin` inside the CMS container. Send the password and its
confirmation through stdin separated by a NUL byte; never put a password in a
command argument, environment file or Git.

## Existing production data

Splitting the repository does not migrate or recreate production data. During
the first deployment, `compose.prod.yaml` reuses the existing backend Docker
network and `cms-media` volume. `DATABASE_URL` must point to the existing
`scs_cms` database. Back up PostgreSQL and the media volume before running any
migration or replacing the legacy CMS container.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the cutover sequence.

To move the published testing content into production without replacing users
or internal Payload tables, follow
[docs/CONTENT-MIGRATION.md](docs/CONTENT-MIGRATION.md).
