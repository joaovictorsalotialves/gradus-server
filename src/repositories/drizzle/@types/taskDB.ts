import type { TaskStatus } from '../../../entities/Task.ts'

export type taskDB = {
  id: string
  title: string
  describe: string | null
  status: TaskStatus
  slug: string | null
  dueDate: Date
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}
