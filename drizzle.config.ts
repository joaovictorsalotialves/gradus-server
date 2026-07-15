import { defineConfig } from 'drizzle-kit'
import { env } from './src/env.ts'

console.log(env.DATABASE_URL)

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schemas/**.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
