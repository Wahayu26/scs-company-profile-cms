import { MigrateUpArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`_solutions_v_version_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_solutions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_solutions_v_version_features_order_idx\` ON \`_solutions_v_version_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_version_features_parent_id_idx\` ON \`_solutions_v_version_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_solutions_v_version_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_solutions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_solutions_v_version_benefits_order_idx\` ON \`_solutions_v_version_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_version_benefits_parent_id_idx\` ON \`_solutions_v_version_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_solutions_v_version_use_cases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_solutions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_solutions_v_version_use_cases_order_idx\` ON \`_solutions_v_version_use_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_version_use_cases_parent_id_idx\` ON \`_solutions_v_version_use_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_solutions_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_summary\` text,
  	\`version_category\` text DEFAULT 'platform',
  	\`version_hero_image_id\` integer,
  	\`version_outcome\` text,
  	\`version_icon_key\` text,
  	\`version_content\` text,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_published\` integer DEFAULT true,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_solutions_v_parent_idx\` ON \`_solutions_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_version_version_slug_idx\` ON \`_solutions_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_version_version_hero_image_idx\` ON \`_solutions_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_version_version_order_idx\` ON \`_solutions_v\` (\`version_order\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_version_version_updated_at_idx\` ON \`_solutions_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_version_version_created_at_idx\` ON \`_solutions_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_version_version__status_idx\` ON \`_solutions_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_created_at_idx\` ON \`_solutions_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_updated_at_idx\` ON \`_solutions_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_latest_idx\` ON \`_solutions_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_solutions_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`partners_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_solutions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`partners_id\`) REFERENCES \`partners\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_solutions_v_rels_order_idx\` ON \`_solutions_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_rels_parent_idx\` ON \`_solutions_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_rels_path_idx\` ON \`_solutions_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_v_rels_partners_id_idx\` ON \`_solutions_v_rels\` (\`partners_id\`);`)
  await db.run(sql`CREATE TABLE \`_partners_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_name\` text,
  	\`version_logo_id\` integer,
  	\`version_website\` text,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_published\` integer DEFAULT true,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`partners\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_partners_v_parent_idx\` ON \`_partners_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_version_version_logo_idx\` ON \`_partners_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_version_version_order_idx\` ON \`_partners_v\` (\`version_order\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_version_version_updated_at_idx\` ON \`_partners_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_version_version_created_at_idx\` ON \`_partners_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_version_version__status_idx\` ON \`_partners_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_created_at_idx\` ON \`_partners_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_updated_at_idx\` ON \`_partners_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_latest_idx\` ON \`_partners_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_version_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_version_highlights_order_idx\` ON \`_projects_v_version_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_highlights_parent_id_idx\` ON \`_projects_v_version_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_version_technologies\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_version_technologies_order_idx\` ON \`_projects_v_version_technologies\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_technologies_parent_id_idx\` ON \`_projects_v_version_technologies\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_industry\` text,
  	\`version_client\` text,
  	\`version_summary\` text,
  	\`version_challenge\` text,
  	\`version_solution\` text,
  	\`version_result\` text,
  	\`version_cover_id\` integer,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_featured\` integer DEFAULT false,
  	\`version_published\` integer DEFAULT true,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_parent_idx\` ON \`_projects_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_slug_idx\` ON \`_projects_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_cover_idx\` ON \`_projects_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_order_idx\` ON \`_projects_v\` (\`version_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_updated_at_idx\` ON \`_projects_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_created_at_idx\` ON \`_projects_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version__status_idx\` ON \`_projects_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_created_at_idx\` ON \`_projects_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_updated_at_idx\` ON \`_projects_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_latest_idx\` ON \`_projects_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`solutions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`solutions_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_order_idx\` ON \`_projects_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_parent_idx\` ON \`_projects_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_path_idx\` ON \`_projects_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_solutions_id_idx\` ON \`_projects_v_rels\` (\`solutions_id\`);`)
  await db.run(sql`CREATE TABLE \`_insights_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_category\` text DEFAULT 'insight',
  	\`version_published_at\` text,
  	\`version_excerpt\` text,
  	\`version_cover_id\` integer,
  	\`version_content\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_featured\` integer DEFAULT false,
  	\`version_published\` integer DEFAULT true,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`insights\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_insights_v_parent_idx\` ON \`_insights_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_insights_v_version_version_slug_idx\` ON \`_insights_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_insights_v_version_version_cover_idx\` ON \`_insights_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_insights_v_version_version_updated_at_idx\` ON \`_insights_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_insights_v_version_version_created_at_idx\` ON \`_insights_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_insights_v_version_version__status_idx\` ON \`_insights_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_insights_v_created_at_idx\` ON \`_insights_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_insights_v_updated_at_idx\` ON \`_insights_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_insights_v_latest_idx\` ON \`_insights_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_insights_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`solutions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_insights_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`solutions_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_insights_v_rels_order_idx\` ON \`_insights_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_insights_v_rels_parent_idx\` ON \`_insights_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_insights_v_rels_path_idx\` ON \`_insights_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_insights_v_rels_solutions_id_idx\` ON \`_insights_v_rels\` (\`solutions_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_workflow_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`step\` text,
  	\`title\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_workflow_steps_order_idx\` ON \`site_settings_workflow_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_workflow_steps_parent_id_idx\` ON \`site_settings_workflow_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_strengths_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_strengths_items_order_idx\` ON \`site_settings_strengths_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_strengths_items_parent_id_idx\` ON \`site_settings_strengths_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_company_facts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_company_facts_order_idx\` ON \`_site_settings_v_version_company_facts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_company_facts_parent_id_idx\` ON \`_site_settings_v_version_company_facts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_workflow_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`step\` text,
  	\`title\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_workflow_steps_order_idx\` ON \`_site_settings_v_version_workflow_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_workflow_steps_parent_id_idx\` ON \`_site_settings_v_version_workflow_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_strengths_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_strengths_items_order_idx\` ON \`_site_settings_v_version_strengths_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_strengths_items_parent_id_idx\` ON \`_site_settings_v_version_strengths_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_highlight\` text,
  	\`version_hero_description\` text,
  	\`version_contact_email\` text,
  	\`version_contact_phone\` text,
  	\`version_contact_address\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_about_eyebrow\` text,
  	\`version_about_headline\` text,
  	\`version_about_highlight\` text,
  	\`version_about_description\` text,
  	\`version_workflow_eyebrow\` text,
  	\`version_workflow_title\` text,
  	\`version_workflow_description\` text,
  	\`version_strengths_eyebrow\` text,
  	\`version_strengths_title\` text,
  	\`version_strengths_description\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version__status_idx\` ON \`_site_settings_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_latest_idx\` ON \`_site_settings_v\` (\`latest\`);`)
  await db.run(sql`ALTER TABLE solutions ADD COLUMN _status text DEFAULT 'draft';`)
  await db.run(sql`UPDATE solutions SET _status = CASE WHEN published = 1 THEN 'published' ELSE 'draft' END;`)
  await db.run(sql`CREATE INDEX solutions__status_idx ON solutions (_status);`)
  await db.run(sql`ALTER TABLE partners ADD COLUMN _status text DEFAULT 'draft';`)
  await db.run(sql`UPDATE partners SET _status = CASE WHEN published = 1 THEN 'published' ELSE 'draft' END;`)
  await db.run(sql`CREATE INDEX partners__status_idx ON partners (_status);`)
  await db.run(sql`ALTER TABLE projects ADD COLUMN _status text DEFAULT 'draft';`)
  await db.run(sql`UPDATE projects SET _status = CASE WHEN published = 1 THEN 'published' ELSE 'draft' END;`)
  await db.run(sql`CREATE INDEX projects__status_idx ON projects (_status);`)
  await db.run(sql`ALTER TABLE insights ADD COLUMN _status text DEFAULT 'draft';`)
  await db.run(sql`UPDATE insights SET _status = CASE WHEN published = 1 THEN 'published' ELSE 'draft' END;`)
  await db.run(sql`CREATE INDEX insights__status_idx ON insights (_status);`)
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN about_eyebrow text;`)
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN about_headline text;`)
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN about_highlight text;`)
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN about_description text;`)
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN workflow_eyebrow text;`)
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN workflow_title text;`)
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN workflow_description text;`)
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN strengths_eyebrow text;`)
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN strengths_title text;`)
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN strengths_description text;`)
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN _status text DEFAULT 'draft';`)
  await db.run(sql`UPDATE site_settings SET _status = 'published';`)
  await db.run(sql`CREATE INDEX site_settings__status_idx ON site_settings (_status);`)
}

export async function down(): Promise<void> {
  throw new Error('Restore the pre-migration database backup; automatic rollback would discard editorial versions.');
}
