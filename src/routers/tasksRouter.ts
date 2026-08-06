import { Express } from 'express'
import { CreateTaskController } from '../controllers/create-task-controller'
import { DetailTaskController } from '../controllers/detail-task-controller'
import { EditTaskController } from '../controllers/edit-task-controller'
import { MarkTaskCompletedTaskController } from '../controllers/mark-task-completed-controller'

const createTaskController = new CreateTaskController()
const editTaskController = new EditTaskController()
const detailTaskController = new DetailTaskController()
const markTaskCompletedController = new MarkTaskCompletedTaskController()

export const taskRouter = (app: Express) => {
  app.post('/task', createTaskController.execute)
  app.put('/task/:id', editTaskController.execute)
  app.patch('/task/:id/completed', markTaskCompletedController.execute)
  app.get('/task/:id', detailTaskController.execute)
}
