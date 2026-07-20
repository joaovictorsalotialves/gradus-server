import { Task } from '../entities/Task.ts'
import type { TaskRepository } from '../repositories/TaskRepository.ts'
import { InvalidValueError } from '../utils/errors/InvalidValueError.ts'
import { RequiredFieldError } from '../utils/errors/RequiredFieldError.ts'

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
      throw new RequiredFieldError('Title')
    }

    if (!dueDate) {
      throw new RequiredFieldError('Due date')
    }

    if (dueDate < new Date()) {
      throw new InvalidValueError('Due date', 'date prior to the current day')
    }

    const task = Task.create({ title, describe, dueDate })
    await this.taskRepository.create(task)

    return task
  }
}
