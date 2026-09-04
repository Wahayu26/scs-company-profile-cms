import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`projects_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_highlights_order_idx\` ON \`projects_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_highlights_parent_id_idx\` ON \`projects_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`industry\` text NOT NULL,
  	\`client\` text,
  	\`summary\` text NOT NULL,
  	\`cover_id\` integer,
  	\`order\` numeric DEFAULT 0 NOT NULL,
  	\`featured\` integer DEFAULT false NOT NULL,
  	\`published\` integer DEFAULT false NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_slug_idx\` ON \`projects\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`projects_cover_idx\` ON \`projects\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_order_idx\` ON \`projects\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`projects_updated_at_idx\` ON \`projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`projects_created_at_idx\` ON \`projects\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`insights\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`category\` text DEFAULT 'insight' NOT NULL,
  	\`published_at\` text NOT NULL,
  	\`excerpt\` text NOT NULL,
  	\`cover_id\` integer,
  	\`content\` text NOT NULL,
  	\`featured\` integer DEFAULT false NOT NULL,
  	\`published\` integer DEFAULT false NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`insights_slug_idx\` ON \`insights\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`insights_cover_idx\` ON \`insights\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`insights_updated_at_idx\` ON \`insights\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`insights_created_at_idx\` ON \`insights\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`projects_id\` integer REFERENCES projects(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`insights_id\` integer REFERENCES insights(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_insights_id_idx\` ON \`payload_locked_documents_rels\` (\`insights_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Intentionally non-destructive. SQLite cannot remove the added relation columns
  // without rebuilding the lock table, so rollback is handled by a forward migration.
}
