import type { Task } from '../entities/Task.ts'
import type { TaskRepository } from '../repositories/TaskRepository.ts'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError.ts'

type MarkTaskCompletedRequest = {
  id: string
}

export class MarkTaskCompletedUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(request: MarkTaskCompletedRequest): Promise<Task> {
    const { id } = request

    const task = await this.taskRepository.findById(id)

    if (!task) {
      throw new TaskNotFoundError()
    }

    if (task.completedAt) {
      return task
    }

    task.completedAt = new Date()
    await this.taskRepository.update(task)

    return task
  }
}
