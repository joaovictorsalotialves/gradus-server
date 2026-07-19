import type { Task } from '../entities/Task.ts'
import type { TaskRepository } from '../repositories/TaskRepository.ts'

type DetailTaskRequest = {
  id: string
}

export class DetailTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(request: DetailTaskRequest): Promise<Task> {
    const { id } = request

    const task = await this.taskRepository.findById(id)

    if (!task) {
      throw new Error('Task not found')
    }

    return task
  }
}
