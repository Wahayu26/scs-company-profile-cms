import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "site_settings"
      ADD COLUMN IF NOT EXISTS "consultation_eyebrow" varchar NOT NULL DEFAULT 'Let''s build what''s next',
      ADD COLUMN IF NOT EXISTS "consultation_headline" varchar NOT NULL DEFAULT 'Siap membangun fondasi teknologi berikutnya?',
      ADD COLUMN IF NOT EXISTS "consultation_description" varchar NOT NULL DEFAULT 'Ceritakan kebutuhan infrastruktur dan sistem Anda. Tim kami siap membantu menyusun solusi yang tepat.';

    ALTER TABLE IF EXISTS "_site_settings_v"
      ADD COLUMN IF NOT EXISTS "version_consultation_eyebrow" varchar DEFAULT 'Let''s build what''s next',
      ADD COLUMN IF NOT EXISTS "version_consultation_headline" varchar DEFAULT 'Siap membangun fondasi teknologi berikutnya?',
      ADD COLUMN IF NOT EXISTS "version_consultation_description" varchar DEFAULT 'Ceritakan kebutuhan infrastruktur dan sistem Anda. Tim kami siap membantu menyusun solusi yang tepat.';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "site_settings"
      DROP COLUMN IF EXISTS "consultation_eyebrow",
      DROP COLUMN IF EXISTS "consultation_headline",
      DROP COLUMN IF EXISTS "consultation_description";

    ALTER TABLE IF EXISTS "_site_settings_v"
      DROP COLUMN IF EXISTS "version_consultation_eyebrow",
      DROP COLUMN IF EXISTS "version_consultation_headline",
      DROP COLUMN IF EXISTS "version_consultation_description";
  `)
}
