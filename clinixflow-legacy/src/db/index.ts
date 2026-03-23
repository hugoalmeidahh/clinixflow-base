import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 5,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 20000,
});

export const db = drizzle(pool, {
  schema,
});