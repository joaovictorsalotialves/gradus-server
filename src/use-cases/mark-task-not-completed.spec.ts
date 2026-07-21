import { Task } from '../entities/Task.ts'
import { InMemoryUsersRepository } from '../repositories/in-memory/inMemoryUsersRepository.ts'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError.ts'
import { MarkTaskNotCompletedUseCase } from './mark-task-not-completed.ts'

let sut: MarkTaskNotCompletedUseCase
let inMemoryTaskRepository: InMemoryUsersRepository

const makeTask = () => {
  return Task.create({
    title: 'Test Task',
    describe: 'This is a test task',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day in the future
  })
}

describe('Mark Task Not Completed Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryUsersRepository()
    sut = new MarkTaskNotCompletedUseCase(inMemoryTaskRepository)
  })

  it('should mark the task as not completed when given a valid ID', async () => {
    inMemoryTaskRepository.create(makeTask())
    inMemoryTaskRepository.items[0].completedAt = new Date() // Mark the task as completed first

    await expect(sut.execute({ id: inMemoryTaskRepository.items[0].id.value })).resolves.not.toThrow()
    expect(inMemoryTaskRepository.items[0].completedAt).toBeUndefined()
  })

  it('should not throw an error when the task has already been not completed', async () => {
    inMemoryTaskRepository.create(makeTask())
    await sut.execute({ id: inMemoryTaskRepository.items[0].id.value })

    await expect(sut.execute({ id: inMemoryTaskRepository.items[0].id.value })).resolves.not.toThrow()
  })

  it('should throw an error if the task is not found', async () => {
    await expect(sut.execute({ id: 'non-existent-id' })).rejects.toBeInstanceOf(TaskNotFoundError)
  })
})
