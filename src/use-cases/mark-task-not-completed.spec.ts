import { Task } from '../entities/Task'
import { InMemoryUsersRepository } from '../repositories/in-memory/inMemoryUsersRepository'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError'
import { MarkTaskNotCompletedUseCase } from './mark-task-not-completed'

let sut: MarkTaskNotCompletedUseCase
let inMemoryTaskRepository: InMemoryUsersRepository

const makeTask = () => {
  return Task.create({
    title: 'Test Task',
    describe: 'This is a test task',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    completedAt: new Date(),
  })
}

describe('Mark Task Not Completed Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryUsersRepository()
    sut = new MarkTaskNotCompletedUseCase(inMemoryTaskRepository)
  })

  it('should mark a not completed task', async () => {
    const task = makeTask()
    await inMemoryTaskRepository.create(task)

    const result = await sut.execute({ id: task.id.value })

    expect(result.completedAt).toBeUndefined()
    expect(result.status).toBe('pending')
  })

  it('should persist the changes in the repository', async () => {
    const task = makeTask()
    await inMemoryTaskRepository.create(task)

    await sut.execute({ id: task.id.value })

    const updated = await inMemoryTaskRepository.findById(task.id.value)

    expect(updated).not.toBeNull()
    expect(updated?.completedAt).toBeUndefined()
    expect(updated?.status).toBe('pending')
  })

  it('should not throw when the task is already not completed', async () => {
    const task = makeTask()
    await inMemoryTaskRepository.create(task)

    await sut.execute({ id: task.id.value })

    const result = await sut.execute({ id: task.id.value })

    expect(result.completedAt).toBeUndefined()
    expect(result.status).toBe('pending')
  })

  it('should throw an error if the task is not found', async () => {
    await expect(sut.execute({ id: 'non-existent-id' })).rejects.toBeInstanceOf(TaskNotFoundError)
  })
})
