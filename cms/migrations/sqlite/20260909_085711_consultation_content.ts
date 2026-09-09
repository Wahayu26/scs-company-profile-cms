import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`consultation_eyebrow\` text DEFAULT 'Let''s build what''s next';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`consultation_headline\` text DEFAULT 'Siap membangun fondasi teknologi berikutnya?';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`consultation_description\` text DEFAULT 'Ceritakan kebutuhan infrastruktur dan sistem Anda. Tim kami siap membantu menyusun solusi yang tepat.';`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_consultation_eyebrow\` text DEFAULT 'Let''s build what''s next';`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_consultation_headline\` text DEFAULT 'Siap membangun fondasi teknologi berikutnya?';`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_consultation_description\` text DEFAULT 'Ceritakan kebutuhan infrastruktur dan sistem Anda. Tim kami siap membantu menyusun solusi yang tepat.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`consultation_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`consultation_headline\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`consultation_description\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_consultation_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_consultation_headline\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_consultation_description\`;`)
}
