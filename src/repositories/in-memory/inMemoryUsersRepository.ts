import type { Task } from '../../entities/Task.ts'
import { CannotUpdateDeletedTaskError } from '../../utils/errors/CannotUpdateDeletedTaskError.ts'
import { TaskNotFoundError } from '../../utils/errors/TaskNotFoundError.ts'
import type { SearchTasksQuery, TaskRepository } from '../TaskRepository.ts'

export class InMemoryUsersRepository implements TaskRepository {
  public items: Task[] = []

  async create(task: Task): Promise<void> {
    this.items.push(task)
  }

  async findById(id: string): Promise<Task | null> {
    const [task] = this.items.filter(item => item.id.value === id)

    return task ?? null
  }

  async search({
    title,
    status,
    sort = 'createdAt',
    order = 'asc',
    page = 1,
    limit = 10,
  }: SearchTasksQuery): Promise<Task[]> {
    let filteredTasks = this.items
    if (title) {
      filteredTasks = filteredTasks.filter(item => item.title.includes(title))
    }
    if (status) {
      filteredTasks = filteredTasks.filter(item => status.includes(item.status))
    }

    const comparators = {
      createdAt: (a: Task, b: Task) => a.createdAt.getTime() - b.createdAt.getTime(),
      dueDate: (a: Task, b: Task) => a.dueDate.getTime() - b.dueDate.getTime(),
    }

    filteredTasks.sort((a, b) => {
      const comparison = comparators[sort](a, b)
      return order === 'asc' ? comparison : -comparison
    })

    const start = (page - 1) * limit

    return filteredTasks.slice(start, start + limit)
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
