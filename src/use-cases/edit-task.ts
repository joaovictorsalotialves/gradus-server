import type { Task } from '../entities/Task.ts'
import type { TaskRepository } from '../repositories/TaskRepository.ts'
import { CannotUpdateCompletedTaskError } from '../utils/errors/CannotUpdateCompletedTaskError.ts'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError.ts'
import { dueDateTaskValidator } from '../utils/validators/dueDateTaskValidator.ts'
import { titleTaskValidator } from '../utils/validators/titleTaskValidator.ts'

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

    if (task.completedAt) {
      throw new CannotUpdateCompletedTaskError()
    }

    titleTaskValidator(title ?? task.title)
    dueDateTaskValidator(dueDate ?? task.dueDate)

    task.title = title ?? task.title
    task.describe = (describe as string) ?? task.describe
    task.dueDate = dueDate ?? task.dueDate

    await this.taskRepository.update(task)

    return task
  }
}
