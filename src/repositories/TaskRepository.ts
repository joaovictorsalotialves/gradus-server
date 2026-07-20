import type { Task } from '../entities/Task.ts'

export interface TaskRepository {
  create(task: Task): Promise<void>
  findById(id: string): Promise<Task | null>
  update(task: Task): Promise<void>
  delete(id: string): Promise<void>
}
