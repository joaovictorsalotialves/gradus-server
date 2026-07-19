import type { Task } from '../entities/Task.ts'
import type { TaskRepository } from '../repositories/TaskRepository.ts'

type EditTaskRequest = {
  id: string
  title?: string
  describe?: string
  dueDate?: Date
}

export class EditTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(request: EditTaskRequest): Promise<Task> {
    const { id, title, describe, dueDate } = request

    const task = await this.taskRepository.findById(id)

    if (!task) {
      throw new Error('Task not found')
    }

    if (!title || title.trim() === '') {
      throw new Error('Title is required')
    }

    if (!dueDate) {
      throw new Error('Due date is required')
    }

    if (dueDate < new Date()) {
      throw new Error('Due date cannot be in the past')
    }

    task.title = title ?? task.title
    task.describe = (describe as string) ?? task.describe
    task.dueDate = dueDate ?? task.dueDate

    await this.taskRepository.update(task)

    return task
  }
}
