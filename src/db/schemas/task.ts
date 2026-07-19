import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const taskStatusEnum = pgEnum('task_status', ['pending', 'completed', 'overdue'])

export const tasks = pgTable('tasks', {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  describe: text(),
  status: taskStatusEnum().default('pending').notNull(),
  slug: text().unique(),
  dueDate: timestamp('due_date').notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at'),
})
