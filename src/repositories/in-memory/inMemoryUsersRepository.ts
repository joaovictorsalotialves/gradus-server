import type { Task } from '../../entities/Task.ts'
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
    const taskIndex = this.items.findIndex(item => item.id.value === task.id.value)

    if (taskIndex === -1) {
      throw new Error('Task not found')
    }

    this.items[taskIndex] = task
  }

  async delete(id: string): Promise<void> {
    const taskIndex = this.items.findIndex(item => item.id.value === id)

    if (taskIndex === -1) {
      throw new Error('Task not found')
    }

    this.items.splice(taskIndex, 1)
  }
}
