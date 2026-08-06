import type { Request, Response } from 'express'
import z from 'zod'
import { TaskPostgresRepository } from '../repositories/drizzle/TaskPostgresRepository'
import { MarkTaskCompletedUseCase } from '../use-cases/mark-task-completed'

const markTaskCompletedParamSchema = z.object({
  id: z.string(),
})

const taskPostgresRepository = new TaskPostgresRepository()
const markTaskCompletedUseCase = new MarkTaskCompletedUseCase(taskPostgresRepository)

export class MarkTaskCompletedTaskController {
  async execute(req: Request, res: Response) {
    try {
      const params = markTaskCompletedParamSchema.parse(req.params)

      const task = await markTaskCompletedUseCase.execute({ ...params })

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
      return res.status(500).send(err)
    }
  }
}
