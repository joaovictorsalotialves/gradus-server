import fastify from 'fastify'
import { env } from './env.ts'

const app = fastify()

app.get('/health', () => {
  return 'Ok'
})

app.listen({ port: env.SERVER_PORT, host: '0.0.0.0' }, () => {
  console.log('🚀 Server Running!')
})
