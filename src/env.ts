import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().default(3333),
  SERVER_HOST: z.ipv4(),
  DATABASE_URL: z.url().startsWith('postgresql://'),
})

export const env = envSchema.parse(process.env)
