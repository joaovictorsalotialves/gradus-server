import { Express } from 'express'
import { CreateTaskController } from '../controllers/create-task-controller'

const createTaskController = new CreateTaskController()

export const taskRouter = (app: Express) => {
  app.post('/task', createTaskController.execute)
}
