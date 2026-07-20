import type { Task } from '../entities/Task.ts'
import type { TaskRepository } from '../repositories/TaskRepository.ts'
import { InvalidValueError } from '../utils/errors/InvalidValueError.ts'
import { RequiredFieldError } from '../utils/errors/RequiredFieldError.ts'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError.ts'

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
      throw new TaskNotFoundError()
    }

    if (!title || title.trim() === '') {
      throw new RequiredFieldError('Title')
    }

    if (!dueDate) {
      throw new RequiredFieldError('Due date')
    }

    if (dueDate < new Date()) {
      throw new InvalidValueError('Due date', 'cannot be in the past')
    }

    task.title = title ?? task.title
    task.describe = (describe as string) ?? task.describe
    task.dueDate = dueDate ?? task.dueDate

    await this.taskRepository.update(task)

    return task
  }
}
