import { Task } from '../entities/Task.ts'
import { InMemoryUsersRepository } from '../repositories/in-memory/inMemoryUsersRepository.ts'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError.ts'
import { MarkTaskCompletedUseCase } from './mark-task-completed.ts'

let sut: MarkTaskCompletedUseCase
let inMemoryTaskRepository: InMemoryUsersRepository

const makeTask = () => {
  return Task.create({
    title: 'Test Task',
    describe: 'This is a test task',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day in the future
  })
}

describe('Mark Task Completed Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryUsersRepository()
    sut = new MarkTaskCompletedUseCase(inMemoryTaskRepository)
  })

  it('should mark the task as completed when given a valid ID', async () => {
    inMemoryTaskRepository.create(makeTask())

    await expect(sut.execute({ id: inMemoryTaskRepository.items[0].id.value })).resolves.not.toThrow()
    expect(inMemoryTaskRepository.items[0].completedAt).toBeTruthy()
  })

  it('should not throw an error when the task has already been completed', async () => {
    inMemoryTaskRepository.create(makeTask())
    await sut.execute({ id: inMemoryTaskRepository.items[0].id.value })

    await expect(sut.execute({ id: inMemoryTaskRepository.items[0].id.value })).resolves.not.toThrow()
  })

  it('should throw an error if the task is not found', async () => {
    await expect(sut.execute({ id: 'non-existent-id' })).rejects.toBeInstanceOf(TaskNotFoundError)
  })
})
