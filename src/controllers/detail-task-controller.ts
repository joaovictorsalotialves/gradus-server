import type { Response, Request } from 'express'
import z from 'zod'
import { TaskPostgresRepository } from '../repositories/drizzle/TaskPostgresRepository'
import { DetailTaskUseCase } from '../use-cases/detail-task'

const detailTaskParamSchema = z.object({
  id: z.string(),
})

const taskPostgresRepository = new TaskPostgresRepository()
const detailTaskUseCase = new DetailTaskUseCase(taskPostgresRepository)

export class DetailTaskController {
  async execute(req: Request, res: Response) {
    try {
      const params = detailTaskParamSchema.parse(req.params)

      const task = await detailTaskUseCase.execute(params)

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
