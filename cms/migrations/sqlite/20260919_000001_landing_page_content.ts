import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-sqlite'

const siteColumns = [
  ['header_about_label', 'Tentang'], ['header_solutions_label', 'Solusi'], ['header_workflow_label', 'Cara Kerja'],
  ['header_projects_label', 'Proyek'], ['header_insights_label', 'Insight'], ['header_ecosystem_label', 'Ekosistem'], ['header_consultation_label', 'Konsultasi'],
  ['header_menu_eyebrow', 'End-to-end capabilities'], ['header_menu_title', 'Satu ekosistem untuk kebutuhan teknologi bisnis.'],
  ['header_menu_link_label', 'Lihat seluruh solusi'], ['header_mobile_detail_label', 'Detail solusi'],
  ['hero_image_alt', 'Kota digital yang saling terhubung'], ['hero_primary_button_label', 'Diskusikan kebutuhan'],
  ['hero_secondary_button_label', 'Jelajahi solusi'], ['hero_proof_one', 'Reliable'], ['hero_proof_two', 'Secure'],
  ['hero_proof_three', 'Scalable'], ['hero_proof_four', 'Customer-focused'],
  ['solutions_section_eyebrow', 'What we do'], ['solutions_section_title', 'Solusi menyeluruh untuk setiap lapisan teknologi.'],
  ['solutions_section_description', 'Dari infrastruktur hingga keamanan, dari cloud hingga managed services—semua dirancang untuk bekerja bersama.'],
  ['solutions_section_card_link_label', 'Lihat detail solusi'],
  ['solutions_section_empty_message', 'Informasi solusi sedang diperbarui. Tim kami tetap siap membantu kebutuhan teknologi Anda.'],
  ['solutions_section_empty_button_label', 'Hubungi tim SCS'], ['projects_section_eyebrow', 'Selected projects'],
  ['projects_section_title', 'Implementasi yang memberi dampak nyata.'],
  ['projects_section_description', 'Beberapa solusi yang kami rancang untuk menjawab kebutuhan operasional dan pertumbuhan bisnis.'],
  ['projects_section_link_label', 'Lihat seluruh proyek'], ['projects_section_confidential_label', 'Confidential client'],
  ['ecosystem_section_eyebrow', 'Technology ecosystem'], ['ecosystem_section_title', 'Bekerja dengan teknologi terdepan.'],
  ['ecosystem_section_description', 'Kami merancang solusi menggunakan ekosistem teknologi enterprise yang sudah teruji.'],
  ['insights_section_eyebrow', 'Latest insight'], ['insights_section_title', 'Perspektif untuk keputusan teknologi yang lebih baik.'],
  ['insights_section_description', 'Insight terbaru dari tim SCS seputar infrastruktur, keamanan, cloud, dan transformasi digital.'],
  ['insights_section_link_label', 'Baca seluruh insight'], ['workflow_image_alt', 'Infrastruktur data center modern'],
  ['workflow_badge', 'End-to-end system integration'], ['contact_form_submit_label', 'Kirim konsultasi'],
  ['contact_form_privacy_text', 'Data Anda hanya digunakan untuk menindaklanjuti kebutuhan konsultasi.'],
  ['contact_form_unknown_solution_label', 'Belum menentukan solusi'], ['whatsapp_eyebrow', 'Butuh bantuan?'],
  ['whatsapp_label', 'Hubungi Kami'],
  ['whatsapp_message', 'Halo PT Sigma Core Solusindo, saya ingin berkonsultasi mengenai solusi IT untuk perusahaan kami.'],
  ['footer_tagline', 'Partner teknologi untuk bisnis yang terus bertumbuh. Terintegrasi, aman, dan siap melaju.'],
  ['footer_cta_label', 'Hubungi Kami'], ['footer_navigation_title', 'Jelajahi'], ['footer_contact_title', 'Kontak & lokasi'],
  ['footer_back_to_top_label', 'Kembali ke atas'], ['footer_copyright', 'PT Sigma Core Solusindo. All rights reserved.'],
] as const

const quote = (value: string) => value.replaceAll("'", "''")

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`hero_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`workflow_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_hero_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_workflow_image_id\` integer REFERENCES media(id);`)
  for (const [column, value] of siteColumns) {
    await db.run(sql.raw(`ALTER TABLE \`site_settings\` ADD \`${column}\` text NOT NULL DEFAULT '${quote(value)}';`))
    await db.run(sql.raw(`ALTER TABLE \`_site_settings_v\` ADD \`version_${column}\` text DEFAULT '${quote(value)}';`))
  }
  await db.run(sql`CREATE INDEX \`site_settings_hero_image_idx\` ON \`site_settings\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_workflow_image_idx\` ON \`site_settings\` (\`workflow_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_hero_image_idx\` ON \`_site_settings_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_workflow_image_idx\` ON \`_site_settings_v\` (\`version_workflow_image_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`site_settings_hero_image_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`site_settings_workflow_image_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`_site_settings_v_version_hero_image_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`_site_settings_v_version_workflow_image_idx\`;`)
  for (const [column] of [...siteColumns].reverse()) {
    await db.run(sql.raw(`ALTER TABLE \`site_settings\` DROP COLUMN \`${column}\`;`))
    await db.run(sql.raw(`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_${column}\`;`))
  }
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`hero_image_id\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`workflow_image_id\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_hero_image_id\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_workflow_image_id\`;`)
}
