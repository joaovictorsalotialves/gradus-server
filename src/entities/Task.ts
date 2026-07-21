import type { Optional } from '../utils/optional.ts'
import { Entity } from './Entity.ts'
import type { UniqueEntityID } from './value-objects/UniqueEntityID.ts'

export type TaskStatus = 'pending' | 'completed' | 'overdue'

export type TaskProps = {
  title: string
  describe?: string
  status: TaskStatus
  slug: string
  dueDate: Date
  completedAt?: Date
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class Task extends Entity<TaskProps> {
  get title() {
    return this.props.title
  }

  get describe(): string | undefined {
    return this.props.describe ?? undefined
  }

  get status() {
    return this.props.status
  }

  get slug() {
    return this.props.slug
  }

  get dueDate() {
    return this.props.dueDate
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt
  }

  set title(title: string) {
    if (this.props.completedAt) {
      throw new Error('Cannot change the title of a completed task.')
    }
    this.props.title = title
    this.props.slug = `${title.toLocaleLowerCase().replace(/\s+/g, '-')}-${this.id.value.substring(0, 8)}`
    this.props.updatedAt = new Date()
  }

  set describe(describe: string) {
    if (this.props.completedAt) {
      throw new Error('Cannot change the description of a completed task.')
    }
    this.props.describe = describe
    this.props.updatedAt = new Date()
  }

  set dueDate(dueDate: Date) {
    if (this.props.completedAt) {
      throw new Error('Cannot change the due date of a completed task.')
    }
    this.props.dueDate = dueDate
    this.props.status = dueDate > new Date() ? 'pending' : 'overdue'
    this.props.updatedAt = new Date()
  }

  set completedAt(completedAt: Date | undefined) {
    this.props.completedAt = completedAt
    // Toggle the status, marking tasks as completed and reverting unchecked tasks to pending.
    this.props.status = this.props.status === 'completed' ? 'pending' : 'completed'
  }

  set deletedAt(deletedAt: Date) {
    this.props.deletedAt = deletedAt
  }

  static create(props: Optional<TaskProps, 'createdAt' | 'slug' | 'status'>, id?: UniqueEntityID) {
    const task = new Task(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        slug: props.slug ?? '',
        status: props.completedAt ? 'completed' : props.dueDate > new Date() ? 'pending' : 'overdue',
      },
      id
    )

    if (!props.slug) {
      task.props.slug = `${task.title.toLocaleLowerCase().replace(/\s+/g, '-')}-${task.id.value.substring(0, 8)}`
    }

    return task
  }
}
