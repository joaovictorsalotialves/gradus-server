import type { Request, Response } from 'express'
import z from 'zod'
import { TaskPostgresRepository } from '../repositories/drizzle/TaskPostgresRepository'
import { CreateTaskUseCase } from '../use-cases/create-task'

const createTaskBodySchema = z.object({
  title: z.string(),
  describe: z.string().optional(),
  dueDate: z.coerce.date(),
})

const taskPostgreRepository = new TaskPostgresRepository()
const createTaskUseCase = new CreateTaskUseCase(taskPostgreRepository)

export class CreateTaskController {
  async execute(req: Request, res: Response) {
    try {
      const body = createTaskBodySchema.parse(req.body)

      const task = await createTaskUseCase.execute(body)

      return res.status(201).send({
        id: task.id.value,
        title: task.title,
        describe: task.describe,
        dueDate: task.dueDate,
        slug: task.slug,
        status: task.status,
        createdAt: task.createdAt,
      })
    } catch (err) {
      return res.status(500).send(err)
    }
  }
}
