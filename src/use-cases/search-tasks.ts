import type { Task, TaskStatus } from '../entities/Task.ts'
import type { TaskRepository } from '../repositories/TaskRepository.ts'

type SearchTasksRequest = {
  title?: string
  status?: TaskStatus
  sort?: 'createdAt' | 'dueDate'
  order?: 'desc' | 'asc'
  page?: number
  limit?: number
}

export class SearchTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}
  async execute(request: SearchTasksRequest): Promise<Task[]> {
    const tasks = await this.taskRepository.search({
      title: request.title,
      status: request.status,
      sort: request.sort,
      order: request.order,
      page: request.page,
      limit: request.limit,
    })

    return tasks
  }
}
