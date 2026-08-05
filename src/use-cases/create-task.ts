import { Task } from '../entities/Task'
import type { TaskRepository } from '../repositories/TaskRepository'
import { dueDateTaskValidator } from '../utils/validators/dueDateTaskValidator'
import { titleTaskValidator } from '../utils/validators/titleTaskValidator'

type CreateTaskRequest = {
  title: string
  describe?: string
  dueDate: Date
}

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(request: CreateTaskRequest): Promise<Task> {
    const { title, describe, dueDate } = request

    titleTaskValidator(title)
    dueDateTaskValidator(dueDate)

    const task = Task.create({ title, describe, dueDate })
    await this.taskRepository.create(task)

    return task
  }
}
