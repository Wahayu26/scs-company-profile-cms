import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pg from "pg";

const databaseURL = process.env.CORE_DATABASE_URL?.trim();
if (!databaseURL || new URL(databaseURL).pathname !== "/scs_core") {
  throw new Error("CORE_DATABASE_URL must target scs_core.");
}

const sqlPath = fileURLToPath(new URL("../cms/migrations/core/20260905_inquiry_status_audit.sql", import.meta.url));
const sql = await readFile(sqlPath, "utf8");
const pool = new pg.Pool({ connectionString: databaseURL, max: 1 });

try {
  await pool.query(sql);
  const result = await pool.query("SELECT COUNT(*)::int AS total FROM inquiry_status_history");
  console.log(JSON.stringify({ status: "CORE_INQUIRY_MIGRATION_OK", historyRows: result.rows[0].total }));
} finally {
  await pool.end();
}
