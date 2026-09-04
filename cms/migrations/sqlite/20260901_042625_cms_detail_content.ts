import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`solutions_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_benefits_order_idx\` ON \`solutions_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_benefits_parent_id_idx\` ON \`solutions_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`solutions_use_cases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_use_cases_order_idx\` ON \`solutions_use_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_use_cases_parent_id_idx\` ON \`solutions_use_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`solutions_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`partners_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`partners_id\`) REFERENCES \`partners\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_rels_order_idx\` ON \`solutions_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_rels_parent_idx\` ON \`solutions_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`solutions_rels_path_idx\` ON \`solutions_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`solutions_rels_partners_id_idx\` ON \`solutions_rels\` (\`partners_id\`);`)
  await db.run(sql`CREATE TABLE \`projects_technologies\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_technologies_order_idx\` ON \`projects_technologies\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_technologies_parent_id_idx\` ON \`projects_technologies\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`solutions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`solutions_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_rels_order_idx\` ON \`projects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_parent_idx\` ON \`projects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_path_idx\` ON \`projects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_solutions_id_idx\` ON \`projects_rels\` (\`solutions_id\`);`)
  await db.run(sql`CREATE TABLE \`insights_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`solutions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`insights\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`solutions_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`insights_rels_order_idx\` ON \`insights_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`insights_rels_parent_idx\` ON \`insights_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`insights_rels_path_idx\` ON \`insights_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`insights_rels_solutions_id_idx\` ON \`insights_rels\` (\`solutions_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_company_facts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_company_facts_order_idx\` ON \`site_settings_company_facts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_company_facts_parent_id_idx\` ON \`site_settings_company_facts\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`solutions\` ADD \`category\` text DEFAULT 'platform' NOT NULL;`)
  await db.run(sql`UPDATE \`solutions\` SET \`category\` = 'protection' WHERE \`slug\` IN ('network-telecommunication', 'cybersecurity');`)
  await db.run(sql`UPDATE \`solutions\` SET \`category\` = 'operations' WHERE \`slug\` IN ('managed-services', 'it-asset-procurement');`)
  await db.run(sql`ALTER TABLE \`solutions\` ADD \`hero_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`solutions\` ADD \`outcome\` text;`)
  await db.run(sql`ALTER TABLE \`solutions\` ADD \`content\` text;`)
  await db.run(sql`CREATE INDEX \`solutions_hero_image_idx\` ON \`solutions\` (\`hero_image_id\`);`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`challenge\` text;`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`solution\` text;`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`result\` text;`)
  await db.run(sql`ALTER TABLE \`insights\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`insights\` ADD \`seo_description\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`solutions_benefits\`;`)
  await db.run(sql`DROP TABLE \`solutions_use_cases\`;`)
  await db.run(sql`DROP TABLE \`solutions_rels\`;`)
  await db.run(sql`DROP TABLE \`projects_technologies\`;`)
  await db.run(sql`DROP TABLE \`projects_rels\`;`)
  await db.run(sql`DROP TABLE \`insights_rels\`;`)
  await db.run(sql`DROP TABLE \`site_settings_company_facts\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_solutions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`summary\` text NOT NULL,
  	\`icon_key\` text NOT NULL,
  	\`order\` numeric DEFAULT 0 NOT NULL,
  	\`published\` integer DEFAULT false NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_solutions\`("id", "title", "slug", "summary", "icon_key", "order", "published", "updated_at", "created_at") SELECT "id", "title", "slug", "summary", "icon_key", "order", "published", "updated_at", "created_at" FROM \`solutions\`;`)
  await db.run(sql`DROP TABLE \`solutions\`;`)
  await db.run(sql`ALTER TABLE \`__new_solutions\` RENAME TO \`solutions\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`solutions_slug_idx\` ON \`solutions\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`solutions_order_idx\` ON \`solutions\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_updated_at_idx\` ON \`solutions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`solutions_created_at_idx\` ON \`solutions\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`challenge\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`solution\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`result\`;`)
  await db.run(sql`ALTER TABLE \`insights\` DROP COLUMN \`seo_title\`;`)
  await db.run(sql`ALTER TABLE \`insights\` DROP COLUMN \`seo_description\`;`)
}
