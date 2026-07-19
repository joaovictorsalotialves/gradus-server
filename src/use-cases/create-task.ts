import { Task } from '../entities/Task.ts'
import type { TaskRepository } from '../repositories/TaskRepository.ts'

type CreateTaskRequest = {
  title: string
  describe?: string
  dueDate: Date
}

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(request: CreateTaskRequest): Promise<Task> {
    const { title, describe, dueDate } = request

    if (!title || title.trim() === '') {
      throw new Error('Title is required')
    }

    if (!dueDate) {
      throw new Error('Due date is required')
    }

    if (dueDate < new Date()) {
      throw new Error('Due date cannot be in the past')
    }

    const task = Task.create({ title, describe, dueDate })
    await this.taskRepository.create(task)

    return task
  }
}
