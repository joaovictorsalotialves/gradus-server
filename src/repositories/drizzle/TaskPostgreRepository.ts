import { eq } from 'drizzle-orm/pg-core/expressions'
import { db } from '../../db/client.ts'
import { schema } from '../../db/schemas/index.ts'
import type { Task } from '../../entities/Task.ts'
import type { TaskRepository } from '../TaskRepository.ts'
import { taskMapper } from './mapper/taskMapper.ts'

export class TaskPostgreRepository implements TaskRepository {
  async create(task: Task) {
    await db.insert(schema.tasks).values({
      id: task.id.toString(),
      title: task.title,
      describe: task.describe,
      status: task.status,
      slug: task.slug,
      dueDate: task.dueDate,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      deletedAt: task.deletedAt,
    })
  }

  async findById(id: string): Promise<Task | null> {
    const [task] = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id))

    return taskMapper(task) ?? null
  }
}
