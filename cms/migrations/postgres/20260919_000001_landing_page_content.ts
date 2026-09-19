import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN "header_about_label" varchar NOT NULL DEFAULT 'Tentang',
      ADD COLUMN "header_solutions_label" varchar NOT NULL DEFAULT 'Solusi',
      ADD COLUMN "header_workflow_label" varchar NOT NULL DEFAULT 'Cara Kerja',
      ADD COLUMN "header_projects_label" varchar NOT NULL DEFAULT 'Proyek',
      ADD COLUMN "header_insights_label" varchar NOT NULL DEFAULT 'Insight',
      ADD COLUMN "header_ecosystem_label" varchar NOT NULL DEFAULT 'Ekosistem',
      ADD COLUMN "header_consultation_label" varchar NOT NULL DEFAULT 'Konsultasi',
      ADD COLUMN "header_menu_eyebrow" varchar NOT NULL DEFAULT 'End-to-end capabilities',
      ADD COLUMN "header_menu_title" varchar NOT NULL DEFAULT 'Satu ekosistem untuk kebutuhan teknologi bisnis.',
      ADD COLUMN "header_menu_link_label" varchar NOT NULL DEFAULT 'Lihat seluruh solusi',
      ADD COLUMN "header_mobile_detail_label" varchar NOT NULL DEFAULT 'Detail solusi',
      ADD COLUMN "hero_image_id" integer,
      ADD COLUMN "hero_image_alt" varchar NOT NULL DEFAULT 'Kota digital yang saling terhubung',
      ADD COLUMN "hero_primary_button_label" varchar NOT NULL DEFAULT 'Diskusikan kebutuhan',
      ADD COLUMN "hero_secondary_button_label" varchar NOT NULL DEFAULT 'Jelajahi solusi',
      ADD COLUMN "hero_proof_one" varchar NOT NULL DEFAULT 'Reliable',
      ADD COLUMN "hero_proof_two" varchar NOT NULL DEFAULT 'Secure',
      ADD COLUMN "hero_proof_three" varchar NOT NULL DEFAULT 'Scalable',
      ADD COLUMN "hero_proof_four" varchar NOT NULL DEFAULT 'Customer-focused',
      ADD COLUMN "solutions_section_eyebrow" varchar NOT NULL DEFAULT 'What we do',
      ADD COLUMN "solutions_section_title" varchar NOT NULL DEFAULT 'Solusi menyeluruh untuk setiap lapisan teknologi.',
      ADD COLUMN "solutions_section_description" varchar NOT NULL DEFAULT 'Dari infrastruktur hingga keamanan, dari cloud hingga managed services—semua dirancang untuk bekerja bersama.',
      ADD COLUMN "solutions_section_card_link_label" varchar NOT NULL DEFAULT 'Lihat detail solusi',
      ADD COLUMN "solutions_section_empty_message" varchar NOT NULL DEFAULT 'Informasi solusi sedang diperbarui. Tim kami tetap siap membantu kebutuhan teknologi Anda.',
      ADD COLUMN "solutions_section_empty_button_label" varchar NOT NULL DEFAULT 'Hubungi tim SCS',
      ADD COLUMN "projects_section_eyebrow" varchar NOT NULL DEFAULT 'Selected projects',
      ADD COLUMN "projects_section_title" varchar NOT NULL DEFAULT 'Implementasi yang memberi dampak nyata.',
      ADD COLUMN "projects_section_description" varchar NOT NULL DEFAULT 'Beberapa solusi yang kami rancang untuk menjawab kebutuhan operasional dan pertumbuhan bisnis.',
      ADD COLUMN "projects_section_link_label" varchar NOT NULL DEFAULT 'Lihat seluruh proyek',
      ADD COLUMN "projects_section_confidential_label" varchar NOT NULL DEFAULT 'Confidential client',
      ADD COLUMN "ecosystem_section_eyebrow" varchar NOT NULL DEFAULT 'Technology ecosystem',
      ADD COLUMN "ecosystem_section_title" varchar NOT NULL DEFAULT 'Bekerja dengan teknologi terdepan.',
      ADD COLUMN "ecosystem_section_description" varchar NOT NULL DEFAULT 'Kami merancang solusi menggunakan ekosistem teknologi enterprise yang sudah teruji.',
      ADD COLUMN "insights_section_eyebrow" varchar NOT NULL DEFAULT 'Latest insight',
      ADD COLUMN "insights_section_title" varchar NOT NULL DEFAULT 'Perspektif untuk keputusan teknologi yang lebih baik.',
      ADD COLUMN "insights_section_description" varchar NOT NULL DEFAULT 'Insight terbaru dari tim SCS seputar infrastruktur, keamanan, cloud, dan transformasi digital.',
      ADD COLUMN "insights_section_link_label" varchar NOT NULL DEFAULT 'Baca seluruh insight',
      ADD COLUMN "workflow_image_id" integer,
      ADD COLUMN "workflow_image_alt" varchar NOT NULL DEFAULT 'Infrastruktur data center modern',
      ADD COLUMN "workflow_badge" varchar NOT NULL DEFAULT 'End-to-end system integration',
      ADD COLUMN "contact_form_submit_label" varchar NOT NULL DEFAULT 'Kirim konsultasi',
      ADD COLUMN "contact_form_privacy_text" varchar NOT NULL DEFAULT 'Data Anda hanya digunakan untuk menindaklanjuti kebutuhan konsultasi.',
      ADD COLUMN "contact_form_unknown_solution_label" varchar NOT NULL DEFAULT 'Belum menentukan solusi',
      ADD COLUMN "whatsapp_eyebrow" varchar NOT NULL DEFAULT 'Butuh bantuan?',
      ADD COLUMN "whatsapp_label" varchar NOT NULL DEFAULT 'Hubungi Kami',
      ADD COLUMN "whatsapp_message" varchar NOT NULL DEFAULT 'Halo PT Sigma Core Solusindo, saya ingin berkonsultasi mengenai solusi IT untuk perusahaan kami.',
      ADD COLUMN "footer_tagline" varchar NOT NULL DEFAULT 'Partner teknologi untuk bisnis yang terus bertumbuh. Terintegrasi, aman, dan siap melaju.',
      ADD COLUMN "footer_cta_label" varchar NOT NULL DEFAULT 'Hubungi Kami',
      ADD COLUMN "footer_navigation_title" varchar NOT NULL DEFAULT 'Jelajahi',
      ADD COLUMN "footer_contact_title" varchar NOT NULL DEFAULT 'Kontak & lokasi',
      ADD COLUMN "footer_back_to_top_label" varchar NOT NULL DEFAULT 'Kembali ke atas',
      ADD COLUMN "footer_copyright" varchar NOT NULL DEFAULT 'PT Sigma Core Solusindo. All rights reserved.';

    ALTER TABLE "_site_settings_v"
      ADD COLUMN "version_header_about_label" varchar DEFAULT 'Tentang',
      ADD COLUMN "version_header_solutions_label" varchar DEFAULT 'Solusi',
      ADD COLUMN "version_header_workflow_label" varchar DEFAULT 'Cara Kerja',
      ADD COLUMN "version_header_projects_label" varchar DEFAULT 'Proyek',
      ADD COLUMN "version_header_insights_label" varchar DEFAULT 'Insight',
      ADD COLUMN "version_header_ecosystem_label" varchar DEFAULT 'Ekosistem',
      ADD COLUMN "version_header_consultation_label" varchar DEFAULT 'Konsultasi',
      ADD COLUMN "version_header_menu_eyebrow" varchar DEFAULT 'End-to-end capabilities',
      ADD COLUMN "version_header_menu_title" varchar DEFAULT 'Satu ekosistem untuk kebutuhan teknologi bisnis.',
      ADD COLUMN "version_header_menu_link_label" varchar DEFAULT 'Lihat seluruh solusi',
      ADD COLUMN "version_header_mobile_detail_label" varchar DEFAULT 'Detail solusi',
      ADD COLUMN "version_hero_image_id" integer,
      ADD COLUMN "version_hero_image_alt" varchar DEFAULT 'Kota digital yang saling terhubung',
      ADD COLUMN "version_hero_primary_button_label" varchar DEFAULT 'Diskusikan kebutuhan',
      ADD COLUMN "version_hero_secondary_button_label" varchar DEFAULT 'Jelajahi solusi',
      ADD COLUMN "version_hero_proof_one" varchar DEFAULT 'Reliable',
      ADD COLUMN "version_hero_proof_two" varchar DEFAULT 'Secure',
      ADD COLUMN "version_hero_proof_three" varchar DEFAULT 'Scalable',
      ADD COLUMN "version_hero_proof_four" varchar DEFAULT 'Customer-focused',
      ADD COLUMN "version_solutions_section_eyebrow" varchar DEFAULT 'What we do',
      ADD COLUMN "version_solutions_section_title" varchar DEFAULT 'Solusi menyeluruh untuk setiap lapisan teknologi.',
      ADD COLUMN "version_solutions_section_description" varchar DEFAULT 'Dari infrastruktur hingga keamanan, dari cloud hingga managed services—semua dirancang untuk bekerja bersama.',
      ADD COLUMN "version_solutions_section_card_link_label" varchar DEFAULT 'Lihat detail solusi',
      ADD COLUMN "version_solutions_section_empty_message" varchar DEFAULT 'Informasi solusi sedang diperbarui. Tim kami tetap siap membantu kebutuhan teknologi Anda.',
      ADD COLUMN "version_solutions_section_empty_button_label" varchar DEFAULT 'Hubungi tim SCS',
      ADD COLUMN "version_projects_section_eyebrow" varchar DEFAULT 'Selected projects',
      ADD COLUMN "version_projects_section_title" varchar DEFAULT 'Implementasi yang memberi dampak nyata.',
      ADD COLUMN "version_projects_section_description" varchar DEFAULT 'Beberapa solusi yang kami rancang untuk menjawab kebutuhan operasional dan pertumbuhan bisnis.',
      ADD COLUMN "version_projects_section_link_label" varchar DEFAULT 'Lihat seluruh proyek',
      ADD COLUMN "version_projects_section_confidential_label" varchar DEFAULT 'Confidential client',
      ADD COLUMN "version_ecosystem_section_eyebrow" varchar DEFAULT 'Technology ecosystem',
      ADD COLUMN "version_ecosystem_section_title" varchar DEFAULT 'Bekerja dengan teknologi terdepan.',
      ADD COLUMN "version_ecosystem_section_description" varchar DEFAULT 'Kami merancang solusi menggunakan ekosistem teknologi enterprise yang sudah teruji.',
      ADD COLUMN "version_insights_section_eyebrow" varchar DEFAULT 'Latest insight',
      ADD COLUMN "version_insights_section_title" varchar DEFAULT 'Perspektif untuk keputusan teknologi yang lebih baik.',
      ADD COLUMN "version_insights_section_description" varchar DEFAULT 'Insight terbaru dari tim SCS seputar infrastruktur, keamanan, cloud, dan transformasi digital.',
      ADD COLUMN "version_insights_section_link_label" varchar DEFAULT 'Baca seluruh insight',
      ADD COLUMN "version_workflow_image_id" integer,
      ADD COLUMN "version_workflow_image_alt" varchar DEFAULT 'Infrastruktur data center modern',
      ADD COLUMN "version_workflow_badge" varchar DEFAULT 'End-to-end system integration',
      ADD COLUMN "version_contact_form_submit_label" varchar DEFAULT 'Kirim konsultasi',
      ADD COLUMN "version_contact_form_privacy_text" varchar DEFAULT 'Data Anda hanya digunakan untuk menindaklanjuti kebutuhan konsultasi.',
      ADD COLUMN "version_contact_form_unknown_solution_label" varchar DEFAULT 'Belum menentukan solusi',
      ADD COLUMN "version_whatsapp_eyebrow" varchar DEFAULT 'Butuh bantuan?',
      ADD COLUMN "version_whatsapp_label" varchar DEFAULT 'Hubungi Kami',
      ADD COLUMN "version_whatsapp_message" varchar DEFAULT 'Halo PT Sigma Core Solusindo, saya ingin berkonsultasi mengenai solusi IT untuk perusahaan kami.',
      ADD COLUMN "version_footer_tagline" varchar DEFAULT 'Partner teknologi untuk bisnis yang terus bertumbuh. Terintegrasi, aman, dan siap melaju.',
      ADD COLUMN "version_footer_cta_label" varchar DEFAULT 'Hubungi Kami',
      ADD COLUMN "version_footer_navigation_title" varchar DEFAULT 'Jelajahi',
      ADD COLUMN "version_footer_contact_title" varchar DEFAULT 'Kontak & lokasi',
      ADD COLUMN "version_footer_back_to_top_label" varchar DEFAULT 'Kembali ke atas',
      ADD COLUMN "version_footer_copyright" varchar DEFAULT 'PT Sigma Core Solusindo. All rights reserved.';

    ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null;
    ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_workflow_image_id_media_id_fk" FOREIGN KEY ("workflow_image_id") REFERENCES "public"."media"("id") ON DELETE set null;
    ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null;
    ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_workflow_image_id_media_id_fk" FOREIGN KEY ("version_workflow_image_id") REFERENCES "public"."media"("id") ON DELETE set null;
    CREATE INDEX "site_settings_hero_image_idx" ON "site_settings" ("hero_image_id");
    CREATE INDEX "site_settings_workflow_image_idx" ON "site_settings" ("workflow_image_id");
    CREATE INDEX "_site_settings_v_version_hero_image_idx" ON "_site_settings_v" ("version_hero_image_id");
    CREATE INDEX "_site_settings_v_version_workflow_image_idx" ON "_site_settings_v" ("version_workflow_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_hero_image_id_media_id_fk";
    ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_workflow_image_id_media_id_fk";
    ALTER TABLE "_site_settings_v" DROP CONSTRAINT IF EXISTS "_site_settings_v_version_hero_image_id_media_id_fk";
    ALTER TABLE "_site_settings_v" DROP CONSTRAINT IF EXISTS "_site_settings_v_version_workflow_image_id_media_id_fk";
    DROP INDEX IF EXISTS "site_settings_hero_image_idx";
    DROP INDEX IF EXISTS "site_settings_workflow_image_idx";
    DROP INDEX IF EXISTS "_site_settings_v_version_hero_image_idx";
    DROP INDEX IF EXISTS "_site_settings_v_version_workflow_image_idx";
    ALTER TABLE "site_settings"
      DROP COLUMN "header_about_label", DROP COLUMN "header_solutions_label", DROP COLUMN "header_workflow_label",
      DROP COLUMN "header_projects_label", DROP COLUMN "header_insights_label", DROP COLUMN "header_ecosystem_label", DROP COLUMN "header_consultation_label",
      DROP COLUMN "header_menu_eyebrow", DROP COLUMN "header_menu_title", DROP COLUMN "header_menu_link_label",
      DROP COLUMN "header_mobile_detail_label", DROP COLUMN "hero_image_id", DROP COLUMN "hero_image_alt",
      DROP COLUMN "hero_primary_button_label", DROP COLUMN "hero_secondary_button_label", DROP COLUMN "hero_proof_one",
      DROP COLUMN "hero_proof_two", DROP COLUMN "hero_proof_three", DROP COLUMN "hero_proof_four",
      DROP COLUMN "solutions_section_eyebrow", DROP COLUMN "solutions_section_title", DROP COLUMN "solutions_section_description",
      DROP COLUMN "solutions_section_card_link_label", DROP COLUMN "solutions_section_empty_message", DROP COLUMN "solutions_section_empty_button_label",
      DROP COLUMN "projects_section_eyebrow", DROP COLUMN "projects_section_title", DROP COLUMN "projects_section_description",
      DROP COLUMN "projects_section_link_label", DROP COLUMN "projects_section_confidential_label",
      DROP COLUMN "ecosystem_section_eyebrow", DROP COLUMN "ecosystem_section_title", DROP COLUMN "ecosystem_section_description",
      DROP COLUMN "insights_section_eyebrow", DROP COLUMN "insights_section_title", DROP COLUMN "insights_section_description",
      DROP COLUMN "insights_section_link_label", DROP COLUMN "workflow_image_id", DROP COLUMN "workflow_image_alt", DROP COLUMN "workflow_badge",
      DROP COLUMN "contact_form_submit_label", DROP COLUMN "contact_form_privacy_text", DROP COLUMN "contact_form_unknown_solution_label",
      DROP COLUMN "whatsapp_eyebrow", DROP COLUMN "whatsapp_label", DROP COLUMN "whatsapp_message",
      DROP COLUMN "footer_tagline", DROP COLUMN "footer_cta_label", DROP COLUMN "footer_navigation_title",
      DROP COLUMN "footer_contact_title", DROP COLUMN "footer_back_to_top_label", DROP COLUMN "footer_copyright";
    ALTER TABLE "_site_settings_v"
      DROP COLUMN "version_header_about_label", DROP COLUMN "version_header_solutions_label", DROP COLUMN "version_header_workflow_label",
      DROP COLUMN "version_header_projects_label", DROP COLUMN "version_header_insights_label", DROP COLUMN "version_header_ecosystem_label", DROP COLUMN "version_header_consultation_label",
      DROP COLUMN "version_header_menu_eyebrow", DROP COLUMN "version_header_menu_title", DROP COLUMN "version_header_menu_link_label",
      DROP COLUMN "version_header_mobile_detail_label", DROP COLUMN "version_hero_image_id", DROP COLUMN "version_hero_image_alt",
      DROP COLUMN "version_hero_primary_button_label", DROP COLUMN "version_hero_secondary_button_label", DROP COLUMN "version_hero_proof_one",
      DROP COLUMN "version_hero_proof_two", DROP COLUMN "version_hero_proof_three", DROP COLUMN "version_hero_proof_four",
      DROP COLUMN "version_solutions_section_eyebrow", DROP COLUMN "version_solutions_section_title", DROP COLUMN "version_solutions_section_description",
      DROP COLUMN "version_solutions_section_card_link_label", DROP COLUMN "version_solutions_section_empty_message", DROP COLUMN "version_solutions_section_empty_button_label",
      DROP COLUMN "version_projects_section_eyebrow", DROP COLUMN "version_projects_section_title", DROP COLUMN "version_projects_section_description",
      DROP COLUMN "version_projects_section_link_label", DROP COLUMN "version_projects_section_confidential_label",
      DROP COLUMN "version_ecosystem_section_eyebrow", DROP COLUMN "version_ecosystem_section_title", DROP COLUMN "version_ecosystem_section_description",
      DROP COLUMN "version_insights_section_eyebrow", DROP COLUMN "version_insights_section_title", DROP COLUMN "version_insights_section_description",
      DROP COLUMN "version_insights_section_link_label", DROP COLUMN "version_workflow_image_id", DROP COLUMN "version_workflow_image_alt", DROP COLUMN "version_workflow_badge",
      DROP COLUMN "version_contact_form_submit_label", DROP COLUMN "version_contact_form_privacy_text", DROP COLUMN "version_contact_form_unknown_solution_label",
      DROP COLUMN "version_whatsapp_eyebrow", DROP COLUMN "version_whatsapp_label", DROP COLUMN "version_whatsapp_message",
      DROP COLUMN "version_footer_tagline", DROP COLUMN "version_footer_cta_label", DROP COLUMN "version_footer_navigation_title",
      DROP COLUMN "version_footer_contact_title", DROP COLUMN "version_footer_back_to_top_label", DROP COLUMN "version_footer_copyright";
  `)
}
