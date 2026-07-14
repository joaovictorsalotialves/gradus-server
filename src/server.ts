import fastify from "fastify"

const app = fastify()

app.get('/health', () => {
  return 'OK'
})

app.listen({ port: 3000, host: '0.0.0.0' }, () => {
  console.log('🚀 Server Running!')
})
