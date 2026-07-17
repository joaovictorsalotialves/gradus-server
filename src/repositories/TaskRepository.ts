import type { Task } from '../entities/Task.ts'

export interface TaskRepository {
  create(task: Task): Promise<void>
}
