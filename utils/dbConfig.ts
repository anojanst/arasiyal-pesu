import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);

export const db = drizzle(sql, { schema });
