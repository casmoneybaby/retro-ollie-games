import { neon } from "@neondatabase/serverless";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const rows = await sql`SELECT relname, n_live_tup FROM pg_stat_user_tables ORDER BY relname`;
for (const r of rows) {
  console.log(`${r.relname}: ${r.n_live_tup}`);
}
