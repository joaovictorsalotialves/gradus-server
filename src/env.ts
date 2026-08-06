import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().default(3000),
  SERVER_HOST: z.ipv4().default('0.0.0.0'),
  DATABASE_URL: z.url()
})

export const env = envSchema.parse(process.env)
