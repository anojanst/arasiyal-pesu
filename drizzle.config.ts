import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.tsx',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_7CaJRium3tdx@ep-little-lab-a1hkseto-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
});
