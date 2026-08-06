import type { Request, Response } from 'express'
import z from 'zod'
import { TaskPostgresRepository } from '../repositories/drizzle/TaskPostgresRepository'
import { EditTaskUseCase } from '../use-cases/edit-task'

const editTaskParamSchema = z.object({
  id: z.string(),
})

const editTaskBodySchema = z.object({
  title: z.string(),
  describe: z.string().optional(),
  dueDate: z.coerce.date(),
})

const taskPostgresRepository = new TaskPostgresRepository()
const editTaskUseCase = new EditTaskUseCase(taskPostgresRepository)

export class EditTaskController {
  async execute(req: Request, res: Response) {
    try {
      const params = editTaskParamSchema.parse(req.params)
      const body = editTaskBodySchema.parse(req.body)

      const task = await editTaskUseCase.execute({ ...params, ...body })

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
