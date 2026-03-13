import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default defineConfig({
  // for simplicity, we use the SQLite database, as it's available pretty much everywhere
  dbName: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) ?? 5432,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,

  metadataProvider: TsMorphMetadataProvider,

  // explicitly list your entities - we'll create the User entity next
  entities: ['dist/**/*.entity.js'],
  // Glob patterns for TypeScript source files (used in development)
  entitiesTs: ['src/**/*.entity.ts'],
  // enable debug mode to log SQL queries and discovery information
  debug: true,
});
