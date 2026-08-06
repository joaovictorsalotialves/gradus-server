import type { Response, Request } from 'express'
import z from 'zod'
import { TaskPostgresRepository } from '../repositories/drizzle/TaskPostgresRepository'
import { RemoveTaskUseCase } from '../use-cases/remove-task'

const removeTaskParamSchema = z.object({
  id: z.string(),
})

const taskPostgresRepository = new TaskPostgresRepository()
const removeTaskUseCase = new RemoveTaskUseCase(taskPostgresRepository)

export class RemoveTaskController {
  async execute(req: Request, res: Response) {
    try {
      const params = removeTaskParamSchema.parse(req.params)

      await removeTaskUseCase.execute({ ...params })

      return res.status(200).send()
    } catch (err) {
      return res.status(500).send(err)
    }
  }
}
