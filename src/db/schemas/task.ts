import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const tasks = pgTable('tasks', {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  describe: text(),
  status: text().notNull(),
  slug: text().unique(),
  dueDate: timestamp('due_date').notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at'),
})
