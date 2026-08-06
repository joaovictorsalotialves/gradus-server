import { Task } from '../../../entities/Task'
import { UniqueEntityID } from '../../../entities/UniqueEntityID'
import type { taskDB } from '../@types/taskDB'

export const taskMapper = (task: taskDB): Task => {
  return Task.create(
    {
      title: task.title,
      describe: task.describe ?? undefined,
      status: task.status,
      dueDate: task.dueDate,
      slug: task.slug ?? undefined,
      completedAt: task.completedAt ?? undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt ?? undefined,
      deletedAt: task.deletedAt ?? undefined,
    },
    new UniqueEntityID(task.id)
  )
}
