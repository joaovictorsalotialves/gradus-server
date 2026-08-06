import express from 'express'
import { taskRouter } from './routers/tasksRouter'

const app = express()

app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).send('OK')
})

taskRouter(app)

export { app }
