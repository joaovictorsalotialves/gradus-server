import type { Response, Request } from 'express'
import z from 'zod'
import { TaskPostgresRepository } from '../repositories/drizzle/TaskPostgresRepository'
import { MarkTaskNotCompletedUseCase } from '../use-cases/mark-task-not-completed'

const markTaskNotCompletedParamSchema = z.object({
  id: z.string(),
})

const taskPostgresRepository = new TaskPostgresRepository()
const markTaskNotCompletedUseCase = new MarkTaskNotCompletedUseCase(taskPostgresRepository)

export class MarkTaskNotCompletedTaskController {
  async execute(req: Request, res: Response) {
    try {
      const params = markTaskNotCompletedParamSchema.parse(req.params)

      const task = await markTaskNotCompletedUseCase.execute({ ...params })

      return res.status(200).send({
        id: task.id.value,
        title: task.title,
        describe: task.describe,
        status: task.status,
        slug: task.slug,
        dueDate: task.dueDate,
        completedAt: task.completedAt,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        deletedAt: task.deletedAt,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).send(err)
    }
  }
}
