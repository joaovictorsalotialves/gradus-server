import { and, asc, desc, eq, ilike } from 'drizzle-orm/pg-core/expressions'
import { db } from '../../db/client'
import { schema } from '../../db/schemas/index'
import type { Task } from '../../entities/Task'
import { CannotUpdateDeletedTaskError } from '../../utils/errors/CannotUpdateDeletedTaskError'
import type { SearchTasksQuery, TaskRepository } from '../TaskRepository'
import { taskMapper } from './mapper/taskMapper'

export class TaskPostgresRepository implements TaskRepository {
  async create(task: Task) {
    await db.insert(schema.tasks).values({
      id: task.id.value,
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

  async save(task: Task): Promise<void> {
    if (task.deletedAt) {
      throw new CannotUpdateDeletedTaskError()
    }

    await db
      .update(schema.tasks)
      .set({
        title: task.title,
        describe: task.describe,
        status: task.status,
        slug: task.slug,
        dueDate: task.dueDate,
        completedAt: task.completedAt ?? null,
        updatedAt: task.updatedAt,
        deletedAt: task.deletedAt ?? null,
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
