import type { Task } from '../entities/Task'
import type { TaskRepository } from '../repositories/TaskRepository'
import { CannotUpdateCompletedTaskError } from '../utils/errors/CannotUpdateCompletedTaskError'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError'
import { dueDateTaskValidator } from '../utils/validators/dueDateTaskValidator'
import { titleTaskValidator } from '../utils/validators/titleTaskValidator'

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

    await this.taskRepository.save(task)

    return task
  }
}
