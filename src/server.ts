import { app } from './app'
import { env } from './env'

app.listen(env.SERVER_PORT, env.SERVER_HOST, () => {
  console.log('🚀 Server running')
})
