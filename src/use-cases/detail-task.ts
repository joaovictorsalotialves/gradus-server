import type { Task } from '../entities/Task'
import type { TaskRepository } from '../repositories/TaskRepository'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError'

type DetailTaskRequest = {
  id: string
}

export class DetailTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(request: DetailTaskRequest): Promise<Task> {
    const { id } = request

    const task = await this.taskRepository.findById(id)

    if (!task || task.deletedAt) {
      throw new TaskNotFoundError()
    }

    return task
  }
}
