import * as migration_20260831_173554_initial_cms from './20260831_173554_initial_cms';
import * as migration_20260901_021645_cms_content_modules from './20260901_021645_cms_content_modules';
import * as migration_20260901_042625_cms_detail_content from './20260901_042625_cms_detail_content';
import * as migration_20260903_042115_content_workflow from './20260903_042115_content_workflow';
import * as migration_20260909_085711_consultation_content from './20260909_085711_consultation_content';
import * as migration_20260919_000001_landing_page_content from './20260919_000001_landing_page_content';

export const migrations = [
  {
    up: migration_20260831_173554_initial_cms.up,
    down: migration_20260831_173554_initial_cms.down,
    name: '20260831_173554_initial_cms',
  },
  {
    up: migration_20260901_021645_cms_content_modules.up,
    down: migration_20260901_021645_cms_content_modules.down,
    name: '20260901_021645_cms_content_modules',
  },
  {
    up: migration_20260901_042625_cms_detail_content.up,
    down: migration_20260901_042625_cms_detail_content.down,
    name: '20260901_042625_cms_detail_content',
  },
  {
    up: migration_20260903_042115_content_workflow.up,
    down: migration_20260903_042115_content_workflow.down,
    name: '20260903_042115_content_workflow',
  },
  {
    up: migration_20260909_085711_consultation_content.up,
    down: migration_20260909_085711_consultation_content.down,
    name: '20260909_085711_consultation_content'
  },
  {
    up: migration_20260919_000001_landing_page_content.up,
    down: migration_20260919_000001_landing_page_content.down,
    name: '20260919_000001_landing_page_content'
  },
];
