import { and, asc, desc, eq, ilike } from 'drizzle-orm/pg-core/expressions'
import { db } from '../../db/client.ts'
import { schema } from '../../db/schemas/index.ts'
import type { Task } from '../../entities/Task.ts'
import { CannotUpdateDeletedTaskError } from '../../utils/errors/CannotUpdateDeletedTaskError.ts'
import type { SearchTasksQuery, TaskRepository } from '../TaskRepository.ts'
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

  async search({
    title,
    status,
    sort = 'createdAt',
    order = 'asc',
    page = 1,
    limit = 10,
  }: SearchTasksQuery): Promise<Task[]> {
    const filters = []

    if (title) {
      filters.push(ilike(schema.tasks.title, `%${title}%`))
    }

    if (status) {
      filters.push(eq(schema.tasks.status, status))
    }

    const orderColumn = sort === 'createdAt' ? schema.tasks.createdAt : schema.tasks.dueDate

    const tasksDB = await db
      .select()
      .from(schema.tasks)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(order === 'asc' ? asc(orderColumn) : desc(orderColumn))
      .limit(limit)
      .offset((page - 1) * limit)

    return tasksDB.map(taskMapper)
  }

  async update(task: Task): Promise<void> {
    if (task.deletedAt) {
      throw new CannotUpdateDeletedTaskError()
    }

    await db
      .update(schema.tasks)
      .set({
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
      .where(eq(schema.tasks.id, task.id.value))
  }

  async delete(task: Task): Promise<void> {
    if (task.deletedAt) {
      return
    }

    await db
      .update(schema.tasks)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(schema.tasks.id, task.id.value))
  }
}
