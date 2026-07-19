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
}
