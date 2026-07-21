import type { Task } from '../../entities/Task.ts'
import { CannotUpdateDeletedTaskError } from '../../utils/errors/CannotUpdateDeletedTaskError.ts'
import { TaskNotFoundError } from '../../utils/errors/TaskNotFoundError.ts'
import type { TaskRepository } from '../TaskRepository.ts'

export class InMemoryUsersRepository implements TaskRepository {
  public items: Task[] = []

  async create(task: Task): Promise<void> {
    this.items.push(task)
  }

  async findById(id: string): Promise<Task | null> {
    const [task] = this.items.filter(item => item.id.value === id)

    return task ?? null
  }

  async update(task: Task): Promise<void> {
    if (task.deletedAt) {
      throw new CannotUpdateDeletedTaskError()
    }

    const taskIndex = this.items.findIndex(item => item.id.value === task.id.value)

    if (taskIndex === -1) {
      throw new TaskNotFoundError()
    }

    this.items[taskIndex] = task
  }

  async delete(task: Task): Promise<void> {
    if (task.deletedAt) {
      return
    }

    const taskIndex = this.items.findIndex(item => item.id.value === task.id.value)

    if (taskIndex === -1) {
      throw new TaskNotFoundError()
    }

    this.items[taskIndex].deletedAt = new Date()
  }
}
