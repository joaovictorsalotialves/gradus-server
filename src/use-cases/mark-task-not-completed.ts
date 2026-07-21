import type { Task } from '../entities/Task.ts'
import type { TaskRepository } from '../repositories/TaskRepository.ts'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError.ts'

type MarkTaskNotCompletedRequest = {
  id: string
}

export class MarkTaskNotCompletedUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(request: MarkTaskNotCompletedRequest): Promise<Task> {
    const { id } = request

    const task = await this.taskRepository.findById(id)

    if (!task) {
      throw new TaskNotFoundError()
    }

    task.completedAt = undefined
    await this.taskRepository.update(task)

    return task
  }
}
