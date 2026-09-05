/* scs-auth-repair-v1 */
import { cmsAuthOrigin, websiteOrigin } from './cms/auth-origin';
/* scs-content-workflow-v1 */
import { withContentWorkflow, withSiteWorkflow } from './cms/content-workflow';
import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { id } from "@payloadcms/translations/languages/id";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Media } from "./cms/collections/Media";
import { Insights } from "./cms/collections/Insights";
import { Partners } from "./cms/collections/Partners";
import { Projects } from "./cms/collections/Projects";
import { Solutions } from "./cms/collections/Solutions";
import { Users } from "./cms/collections/Users";
import { SiteSettings } from "./cms/globals/SiteSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const configuredPayloadSecret =
  process.env.PAYLOAD_SECRET?.trim();

if (
  process.env.NODE_ENV === "production" &&
  !configuredPayloadSecret
) {
  throw new Error(
    "PAYLOAD_SECRET is required in production.",
  );
}

const usePostgres =
  process.env.PAYLOAD_DB_PROVIDER === "postgres";

const db = usePostgres
  ? postgresAdapter({
      migrationDir: path.resolve(
        dirname,
        "cms/migrations/postgres",
      ),
      pool: {
        connectionString:
          process.env.DATABASE_URL ??
          "postgresql://scs:scs@localhost:5432/scs_cms",
      },
      push:
        process.env.PAYLOAD_DB_PUSH === "true",
    })
  : sqliteAdapter({
      client: {
        url:
          process.env.PAYLOAD_SQLITE_URL ??
          "file:./.data/payload.db",
      },
      migrationDir: path.resolve(
        dirname,
        "cms/migrations/sqlite",
      ),
      push:
        process.env.PAYLOAD_DB_PUSH === "true",
    });

const smtpHost = process.env.SMTP_HOST?.trim();

export default buildConfig({
  csrf: [cmsAuthOrigin()],
  cors: [websiteOrigin()],
  ...(smtpHost ? { email: nodemailerAdapter({
    defaultFromAddress:
      process.env.SMTP_FROM ??
      "noreply@sigmacore.id",

    defaultFromName:
      process.env.SMTP_FROM_NAME ??
      "Sigma Core",

    transportOptions: {
      host: smtpHost,

      port: Number(
        process.env.SMTP_PORT ?? 587,
      ),

      secure:
        process.env.SMTP_SECURE === "true",

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
  }) } : {}),

  admin: {
    user: Users.slug,

    components: {
      /* scs-cms-ui-v1 */
      beforeNavLinks: ["/cms/components/AdminLogo", "/cms/components/ConsultationNavLink"],
      graphics: {
        Icon: "/cms/components/AdminIcon",
        Logo: "/cms/components/AdminLogo",
      },

      views: {
        logout: { Component: "/cms/components/CMSLogout" },
        dashboard: {
          Component:
            "/cms/components/AdminDashboard",
        },

        consultations: {
          Component: "/cms/components/ConsultationsView",
          path: "/consultations",
        },

        createFirstUser: {
          Component:
            "/cms/components/BrandedCreateFirstUser",
        },
      },
    },

    meta: {
      titleSuffix: "— Sigma Core CMS",
      icons: {
        icon: [{ url: "/assets/scs-icon.png?v=cms-ui-1", type: "image/png" }],
        shortcut: ["/assets/scs-icon.png?v=cms-ui-1"],
        apple: [{ url: "/assets/scs-icon.png?v=cms-ui-1", type: "image/png" }],
      },
    },
  },

  collections: [
    Users,
    Media,
    withContentWorkflow(Solutions),
    withContentWorkflow(Partners),
    withContentWorkflow(Projects),
    withContentWorkflow(Insights),
  ],

  globals: [
    withSiteWorkflow(SiteSettings),
  ],

  db,

  editor: lexicalEditor(),

  i18n: {
    fallbackLanguage: "id",

    supportedLanguages: {
      id,
    },
  },

  secret:
    configuredPayloadSecret ??
    "local-development-only-change-before-deploying",

  serverURL: cmsAuthOrigin(),

  sharp,

  typescript: {
    outputFile:
      path.resolve(
        dirname,
        "payload-types.ts",
      ),
  },
});
