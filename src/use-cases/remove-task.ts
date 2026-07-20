import type { TaskRepository } from '../repositories/TaskRepository.ts'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError.ts'

type RemoveTaskRequest = {
  id: string
}

export class RemoveTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(request: RemoveTaskRequest): Promise<void> {
    const { id } = request

    const task = await this.taskRepository.findById(id)

    if (!task) {
      throw new TaskNotFoundError()
    }

    await this.taskRepository.delete(task)
  }
}
