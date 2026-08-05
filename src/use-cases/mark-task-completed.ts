import type { Task } from '../entities/Task'
import type { TaskRepository } from '../repositories/TaskRepository'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError'

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
    await this.taskRepository.save(task)

    return task
  }
}
