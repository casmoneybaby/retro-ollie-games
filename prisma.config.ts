import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Load both standard and Next.js-style env files (Neon writes to .env.local)
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
