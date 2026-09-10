import * as migration_20260901_045735_initial_postgres from './20260901_045735_initial_postgres';
import * as migration_20260910_000001_consultation_content from './20260910_000001_consultation_content';

export const migrations = [
  {
    up: migration_20260901_045735_initial_postgres.up,
    down: migration_20260901_045735_initial_postgres.down,
    name: '20260901_045735_initial_postgres'
  },
  {
    up: migration_20260910_000001_consultation_content.up,
    down: migration_20260910_000001_consultation_content.down,
    name: '20260910_000001_consultation_content'
  },
];
