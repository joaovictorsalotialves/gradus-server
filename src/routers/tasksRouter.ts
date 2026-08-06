import { Express } from 'express'
import { CreateTaskController } from '../controllers/create-task-controller'
import { DetailTaskController } from '../controllers/detail-task-controller'

const createTaskController = new CreateTaskController()
const detailTaskController = new DetailTaskController()

export const taskRouter = (app: Express) => {
  app.post('/task', createTaskController.execute)
  app.get('/task/:id', detailTaskController.execute)
}
