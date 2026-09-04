import * as migration_20260901_045735_initial_postgres from './20260901_045735_initial_postgres';

export const migrations = [
  {
    up: migration_20260901_045735_initial_postgres.up,
    down: migration_20260901_045735_initial_postgres.down,
    name: '20260901_045735_initial_postgres'
  },
];
