import { Task } from '../entities/Task'
import { InMemoryUsersRepository } from '../repositories/in-memory/inMemoryUsersRepository'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError'
import { MarkTaskCompletedUseCase } from './mark-task-completed'

let sut: MarkTaskCompletedUseCase
let inMemoryTaskRepository: InMemoryUsersRepository

const makeTask = () => {
  return Task.create({
    title: 'Test Task',
    describe: 'This is a test task',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
  })
}

describe('Mark Task Completed Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryUsersRepository()
    sut = new MarkTaskCompletedUseCase(inMemoryTaskRepository)
  })

  it('should mark a completed task', async () => {
    const task = makeTask()
    await inMemoryTaskRepository.create(task)

    const result = await sut.execute({ id: task.id.value })

    expect(result.completedAt).toBeTruthy()
    expect(result.status).toBe('completed')
  })

  it('should persist the changes in the repository', async () => {
    const task = makeTask()
    await inMemoryTaskRepository.create(task)

    await sut.execute({ id: task.id.value })

    const updated = await inMemoryTaskRepository.findById(task.id.value)

    expect(updated).not.toBeNull()
    expect(updated?.completedAt).toBeTruthy()
    expect(updated?.status).toBe('completed')
  })

  it('should not throw when the task is already completed', async () => {
    const task = makeTask()
    await inMemoryTaskRepository.create(task)

    await sut.execute({ id: task.id.value })

    const result = await sut.execute({ id: task.id.value })

    expect(result.completedAt).toBeTruthy()
    expect(result.status).toBe('completed')
  })

  it('should throw an error if the task is not found', async () => {
    await expect(sut.execute({ id: 'non-existent-id' })).rejects.toBeInstanceOf(TaskNotFoundError)
  })
})
