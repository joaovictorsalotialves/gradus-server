import type { Task, TaskStatus } from '../entities/Task.ts'

export type SearchTasksQuery = {
  title?: string
  status?: TaskStatus
  sort?: 'createdAt' | 'dueDate'
  order?: 'desc' | 'asc'
  page?: number
  limit?: number
}
export interface TaskRepository {
  create(task: Task): Promise<void>
  findById(id: string): Promise<Task | null>
  search(query: SearchTasksQuery): Promise<Task[]>
  update(task: Task): Promise<void>
  delete(task: Task): Promise<void>
}
