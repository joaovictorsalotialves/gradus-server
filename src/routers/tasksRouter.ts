import { Express } from 'express'
import { CreateTaskController } from '../controllers/create-task-controller'
import { DetailTaskController } from '../controllers/detail-task-controller'
import { EditTaskController } from '../controllers/edit-task-controller'
import { MarkTaskCompletedTaskController } from '../controllers/mark-task-completed-controller'
import { MarkTaskNotCompletedTaskController } from '../controllers/mark-task-not-completed-controller'
import { RemoveTaskController } from '../controllers/remove-task-controller'

const createTaskController = new CreateTaskController()
const editTaskController = new EditTaskController()
const detailTaskController = new DetailTaskController()
const markTaskCompletedController = new MarkTaskCompletedTaskController()
const markTaskNotCompletedController = new MarkTaskNotCompletedTaskController()
const removeTaskController = new RemoveTaskController()

export const taskRouter = (app: Express) => {
  app.post('/task', createTaskController.execute)
  app.put('/task/:id', editTaskController.execute)
  app.patch('/task/:id/completed', markTaskCompletedController.execute)
  app.patch('/task/:id/not-completed', markTaskNotCompletedController.execute)
  app.get('/task/:id', detailTaskController.execute)
  app.delete('/task/:id', removeTaskController.execute)
}
