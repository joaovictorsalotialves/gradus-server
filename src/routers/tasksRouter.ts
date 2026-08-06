import { Express } from 'express'
import { CreateTaskController } from '../controllers/create-task-controller'
import { DetailTaskController } from '../controllers/detail-task-controller'
import { EditTaskController } from '../controllers/edit-task-controller'

const createTaskController = new CreateTaskController()
const editTaskController = new EditTaskController()
const detailTaskController = new DetailTaskController()

export const taskRouter = (app: Express) => {
  app.post('/task', createTaskController.execute)
  app.put('/task/:id', editTaskController.execute)
  app.get('/task/:id', detailTaskController.execute)
}
