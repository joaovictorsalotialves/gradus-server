import { Task } from '../../../entities/Task.ts'
import { UniqueEntityID } from '../../../entities/value-objects/UniqueEntityID.ts'
import type { taskDB } from '../@types/taskDB.ts'

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
